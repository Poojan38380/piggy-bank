"use client";

import { SummaryCardSkeleton } from "@/components/ui";

interface SummaryCardProps {
  totalFormatted?: string;
  count?: number;
  isLoading?: boolean;
  activeCategory?: string | null;
}

/**
 * SummaryCard — Displays the total amount spent.
 * Context-aware: shows "Total Spending" or "Spending in [Category]"
 */
export function SummaryCard({
  totalFormatted = "₹0.00",
  count = 0,
  isLoading = false,
  activeCategory = null,
}: SummaryCardProps) {
  if (isLoading) return <SummaryCardSkeleton />;

  return (
    <div
      className="card"
      style={{
        padding: "var(--space-lg)",
        background: "var(--color-surface)",
        borderLeft: "4px solid var(--color-teal)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <p
        className="text-label"
        style={{ color: "var(--color-on-surface-variant)" }}
      >
        {activeCategory ? `Spending in ${activeCategory}` : "Total Spending"}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "40px",
            fontWeight: 700,
            color: "var(--color-navy)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {totalFormatted}
        </h2>
        <span
          className="text-body-sm"
          style={{ 
            color: "var(--color-on-surface-variant)",
            opacity: 0.8,
            letterSpacing: "0.01em"
          }}
        >
          across {count} {count === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}
