import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createExpenseSchema } from "@/lib/validations";
import { toPaise, formatCurrency } from "@/lib/money";
import { Expense, ApiResponse, ExpenseListResponse } from "@/types";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";

// ── BUG-10 FIX: Simple in-memory rate limiter (per IP, 30 req/min) ────────
// NOTE: This is a single-instance in-memory store. In production with multiple
// serverless instances, replace with a Redis-based solution (e.g. Upstash).
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const max = 30;

  const entry = rateLimit.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + window });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/**
 * GET /api/expenses
 * Lists expenses for the current user with filtering and sorting.
 */
export async function GET(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests — slow down." } as ApiResponse<never>,
      { status: 429 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" } as ApiResponse<never>,
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "desc";

  try {
    const where: Prisma.ExpenseWhereInput = {
      userId: session.user.id,
      ...(category && category !== "all" ? { category } : {}),
    };

    // Fetch items and total sum in parallel for performance
    const [dbExpenses, aggregation] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { date: sort === "desc" ? "desc" : "asc" },
      }),
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    const items: Expense[] = dbExpenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      amountFormatted: formatCurrency(e.amount),
      category: e.category,
      description: e.description,
      date: e.date.toISOString().split("T")[0],
      createdAt: e.createdAt.toISOString(),
      idempotencyKey: e.idempotencyKey,
    }));

    const totalPaise = aggregation._sum.amount || 0;

    const data: ExpenseListResponse = {
      items,
      meta: {
        total: items.length,
        visibleTotal: totalPaise,
        visibleTotalFormatted: formatCurrency(totalPaise),
        filteredBy: !category || category === "all" ? null : category,
      },
    };

    return NextResponse.json({
      success: true,
      data,
    } as ApiResponse<ExpenseListResponse>);
  } catch (error) {
    console.error("API_EXPENSES_GET_ERROR", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}

/**
 * POST /api/expenses
 * Idempotent creation of a new expense for the current user.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests — slow down." } as ApiResponse<never>,
      { status: 429 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" } as ApiResponse<never>,
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // 1. Validation
    const result = createExpenseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: result.error.issues.map((e) => ({
            field: String(e.path[0]),
            message: e.message,
          })),
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    const { amount, category, description, date, idempotencyKey } = result.data;

    // BUG-2 FIX: toPaise() null is a client error (bad amount), not a server
    // error — return 400, not 500.
    const paise = toPaise(amount);
    if (paise === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: [{ field: "amount", message: "Enter a valid amount (e.g. 149.99)" }],
        } as ApiResponse<never>,
        { status: 400 }
      );
    }

    // 2. Optimized Atomic Idempotency
    // Attempt to create first. If it fails with P2002, the record already exists.
    // Faster than find-then-create and avoids race conditions.
    try {
      const created = await prisma.expense.create({
        data: {
          amount: paise,
          category,
          description,
          date: new Date(date),
          idempotencyKey,
          userId: session.user.id,
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            id: created.id,
            amount: created.amount,
            amountFormatted: formatCurrency(created.amount),
            category: created.category,
            description: created.description,
            date: created.date.toISOString().split("T")[0],
            createdAt: created.createdAt.toISOString(),
            idempotencyKey: created.idempotencyKey,
          },
        } as ApiResponse<Expense>,
        { status: 201 }
      );
    } catch (e) {
      // Unique constraint violation → idempotent duplicate
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const existing = await prisma.expense.findUnique({
          where: { idempotencyKey },
        });

        if (existing) {
          return NextResponse.json({
            success: true,
            data: {
              id: existing.id,
              amount: existing.amount,
              amountFormatted: formatCurrency(existing.amount),
              category: existing.category,
              description: existing.description,
              date: existing.date.toISOString().split("T")[0],
              createdAt: existing.createdAt.toISOString(),
              idempotencyKey: existing.idempotencyKey,
            },
            idempotent: true,
          } as ApiResponse<Expense>);
        }
      }
      throw e; // Re-throw if not a P2002 or record not found
    }
  } catch (error) {
    console.error("API_EXPENSES_POST_ERROR", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" } as ApiResponse<never>,
      { status: 500 }
    );
  }
}
