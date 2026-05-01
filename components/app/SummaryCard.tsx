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
    <div className="card-hero p-lg border-l-4 border-teal flex flex-col gap-xs">
      <p className="text-label text-navy opacity-70">
        {activeCategory ? `Spending in ${activeCategory}` : "Total Spending"}
      </p>

      <div className="flex flex-col">
        <h2 className="text-amount-hero m-0">
          {totalFormatted}
        </h2>
        <span className="text-body-sm text-navy opacity-60 tracking-wide">
          across {count} {count === 1 ? "item" : "items"}
        </span>
      </div>
    </div>
  );
}
