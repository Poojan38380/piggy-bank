import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/expenses/categories
 * Returns all distinct categories used in the system.
 */
export async function GET() {
  try {
    const categories = await prisma.expense.findMany({
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json(categories.map((c) => c.category));
  } catch (error) {
    console.error("API_CATEGORIES_GET_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
