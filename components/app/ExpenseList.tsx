"use client";

import { Expense } from "@/types";
import { CategoryBadge } from "@/components/ui";

interface ExpenseCardProps {
  expense: Expense;
}

/**
 * ExpenseCard — Individual transaction row.
 * Highlights the amount and description with clear visual hierarchy.
 */
export function ExpenseCard({ expense }: ExpenseCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: "var(--space-md) var(--space-lg)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-lg)",
        transition: "transform 0.1s ease",
      }}
    >
      {/* Category Icon Placeholder / Visual Accent */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--color-surface-container-low)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "20px", opacity: 0.6 }}>💸</span>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="text-body-md"
          style={{
            fontWeight: 600,
            color: "var(--color-navy)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            marginBottom: 2,
          }}
        >
          {expense.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CategoryBadge category={expense.category} />
          <span
            className="text-label"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {expense.date}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-navy)",
          }}
        >
          {expense.amountFormatted}
        </p>
      </div>
    </div>
  );
}

// ── ExpenseList ───────────────────────────────────────────

import { ExpenseListSkeleton } from "@/components/ui";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading?: boolean;
}

export function ExpenseList({ expenses, isLoading = false }: ExpenseListProps) {
  if (isLoading) return <ExpenseListSkeleton />;

  if (expenses.length === 0) {
    return (
      <div
        style={{
          padding: "var(--space-xxl) var(--space-lg)",
          textAlign: "center",
          background: "var(--color-surface-container-lowest)",
          borderRadius: "var(--radius-card)",
          border: "1px dashed var(--color-outline-variant)",
        }}
      >
        <p className="text-body-lg" style={{ color: "var(--color-on-surface-variant)" }}>
          No expenses found.
        </p>
        <p className="text-body-sm" style={{ color: "var(--color-outline)" }}>
          Try clearing your filters or adding a new spend.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
