import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createExpenseSchema } from "@/lib/validations";
import { toPaise, formatCurrency } from "@/lib/money";
import { Expense } from "@/types";

/**
 * GET /api/expenses
 * Lists expenses with filtering and sorting.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "desc";

  try {
    const where = category && category !== "all" ? { category } : {};
    
    const dbExpenses = await prisma.expense.findMany({
      where,
      orderBy: { date: sort === "desc" ? "desc" : "asc" },
    });

    // 1. Transform DB models to UI Types (adding formatted strings)
    const items: Expense[] = dbExpenses.map((e: any) => ({
      id: e.id,
      amount: e.amount,
      amountFormatted: formatCurrency(e.amount),
      category: e.category,
      description: e.description,
      date: e.date.toISOString().split("T")[0],
      createdAt: e.createdAt.toISOString(),
      idempotencyKey: e.idempotencyKey,
    }));

    // 2. Compute Meta
    const totalPaise = items.reduce((sum, item) => sum + item.amount, 0);

    return NextResponse.json({
      items,
      meta: {
        total: items.length,
        visibleTotal: totalPaise,
        visibleTotalFormatted: formatCurrency(totalPaise),
        filteredBy: category === "all" ? null : category,
      },
    });
  } catch (error) {
    console.error("API_EXPENSES_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST /api/expenses
 * Idempotent creation of a new expense.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Validation
    const result = createExpenseSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
    }

    const { amount, category, description, date, idempotencyKey } = result.data;

    // 2. Check for Idempotency
    const existing = await prisma.expense.findUnique({
      where: { idempotencyKey },
    });

    if (existing) {
      // Record already exists, return it to fulfill idempotency
      return NextResponse.json({
        id: existing.id,
        amount: existing.amount,
        amountFormatted: formatCurrency(existing.amount),
        category: existing.category,
        description: existing.description,
        date: existing.date.toISOString().split("T")[0],
        createdAt: existing.createdAt.toISOString(),
        idempotencyKey: existing.idempotencyKey,
      });
    }

    // 3. Create new record
    const paise = toPaise(amount);
    if (paise === null) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const created = await prisma.expense.create({
      data: {
        amount: paise,
        category,
        description,
        date: new Date(date),
        idempotencyKey,
      },
    });

    return NextResponse.json({
      id: created.id,
      amount: created.amount,
      amountFormatted: formatCurrency(created.amount),
      category: created.category,
      description: created.description,
      date: created.date.toISOString().split("T")[0],
      createdAt: created.createdAt.toISOString(),
      idempotencyKey: created.idempotencyKey,
    }, { status: 201 });

  } catch (error) {
    console.error("API_EXPENSES_POST_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
