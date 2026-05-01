"use client";

import { Expense } from "@/types";
import { CategoryBadge, ExpenseListSkeleton } from "@/components/ui";

interface ExpenseCardProps {
  expense: Expense;
}

/**
 * ExpenseCard — Individual transaction row.
 * Highlights the amount and description with clear visual hierarchy.
 */
export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <div className="card-expense flex items-center gap-lg hover:shadow-hover transition-all animate-fade-in-up">
      {/* Category Badge */}
      <div className="shrink-0">
        <CategoryBadge category={expense.category} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-body-md font-semibold text-navy truncate mb-0.5">
          {expense.description}
        </p>
        <span className="text-label text-on-surface-variant opacity-60">
          {expense.date}
        </span>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="text-amount text-lg font-bold text-navy">
          {expense.amountFormatted}
        </p>
      </div>
    </div>
  );
}

// ── ExpenseList ───────────────────────────────────────────

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
}

export function ExpenseList({ expenses, isLoading = false }: ExpenseListProps) {
  if (isLoading) return <ExpenseListSkeleton />;

  if (expenses.length === 0) {
    return (
      <div className="py-xxl px-lg text-center bg-surface-container-lowest rounded-card border border-dashed border-outline-variant animate-fade-in">
        <p className="text-body-lg text-on-surface-variant">
          No expenses found.
        </p>
        <p className="text-body-sm text-outline">
          Try clearing your filters or adding a new spend.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      {expenses.map((expense, idx) => (
        <div key={expense.id} className={`delay-${Math.min(idx + 1, 5)}`}>
          <ExpenseCard expense={expense} />
        </div>
      ))}
    </div>
  );
}
