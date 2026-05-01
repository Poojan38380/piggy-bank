import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

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

    const data = categories.map((c: { category: string }) => c.category);

    return NextResponse.json({
      success: true,
      data
    } as ApiResponse<string[]>);
  } catch (error) {
    console.error("API_CATEGORIES_GET_ERROR", error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal Server Error" 
    } as ApiResponse<never>, { status: 500 });
  }
}
