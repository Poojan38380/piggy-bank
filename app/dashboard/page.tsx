"use client";

import { Suspense } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { AppHeader } from "@/components/app/AppHeader";
import { SummaryCard } from "@/components/app/SummaryCard";
import { ExpenseForm } from "@/components/app/ExpenseForm";
import { ExpenseFilters } from "@/components/app/ExpenseFilters";
import { ExpenseList } from "@/components/app/ExpenseList";

/**
 * DashboardContent — Inner component to allow for Suspense boundary 
 */
function DashboardContent() {
  const {
    expenses,
    meta,
    filters,
    isLoading,
    setCategory,
    toggleSort,
    refetch,
  } = useExpenses();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen max-w-[1440px] mx-auto bg-background">
      {/* LEFT PANEL: Branding + Add Expense */}
      <aside className="w-full lg:w-[40%] p-lg lg:p-xxl lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto bg-background border-b lg:border-b-0 lg:border-r border-divider">
        <AppHeader />

        <div className="flex flex-col gap-xl">
          <SummaryCard
            totalFormatted={meta?.visibleTotalFormatted}
            count={meta?.total}
            isLoading={isLoading}
            activeCategory={filters.category}
          />

          <div className="card p-lg">
            <ExpenseForm onSuccess={refetch} />
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Filters + List */}
      <main className="w-full lg:w-[60%] p-lg lg:p-xxl bg-panel min-h-screen">
        <ExpenseFilters
          activeCategory={filters.category}
          onCategoryChange={setCategory}
          isSortDesc={filters.sortDesc}
          onToggleSort={toggleSort}
        />

        <div className="mb-lg">
          <h3 className="text-label mb-md opacity-60">
            {filters.category ? `Items in ${filters.category}` : "Recent Expenses"}
          </h3>
          <ExpenseList expenses={expenses} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

import { DashboardSkeleton } from "@/components/app/DashboardSkeleton";

/**
 * Main Dashboard Entry Point
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

