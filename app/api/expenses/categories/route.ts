import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";
import { auth } from "@/lib/auth";

/**
 * GET /api/expenses/categories
 * Returns distinct categories used by the current user.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" } as ApiResponse<never>,
      { status: 401 }
    );
  }

  try {
    const categories = await prisma.expense.findMany({
      where: { userId: session.user.id },
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
