"use client";

import * as React from "react";
import { Suspense } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { AppHeader } from "@/components/app/AppHeader";
import { SummaryCard } from "@/components/app/SummaryCard";
import { ExpenseForm } from "@/components/app/ExpenseForm";
import { ExpenseFilters } from "@/components/app/ExpenseFilters";
import { ExpenseList } from "@/components/app/ExpenseList";

/**
 * DashboardContent — Inner component to allow for Suspense boundary 
 * around search param usage.
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
    <div className="dashboard-layout">
      {/* LEFT PANEL: Branding + Add Expense */}
      <aside className="panel-left">
        <AppHeader />
        
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
          <SummaryCard 
            totalFormatted={meta?.visibleTotalFormatted}
            count={meta?.total}
            isLoading={isLoading}
            activeCategory={filters.category}
          />

          <div className="card" style={{ padding: "var(--space-lg)", background: "var(--color-surface)" }}>
            <ExpenseForm onSuccess={refetch} />
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Filters + List */}
      <main className="panel-right">
        <ExpenseFilters 
          activeCategory={filters.category}
          onCategoryChange={setCategory}
          isSortDesc={filters.sortDesc}
          onToggleSort={toggleSort}
        />

        <div style={{ marginBottom: "var(--space-lg)" }}>
          <h3 className="text-label" style={{ marginBottom: "var(--space-md)", opacity: 0.6 }}>
            {filters.category ? `Items in ${filters.category}` : "Recent Expenses"}
          </h3>
          <ExpenseList expenses={expenses} isLoading={isLoading} />
        </div>
      </main>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          max-width: 1440px;
          margin: 0 auto;
          background: var(--color-bg);
        }

        .panel-left {
          width: 40%;
          padding: var(--space-xxl);
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          border-right: 1px solid rgba(199, 197, 207, 0.2);
        }

        .panel-right {
          width: 60%;
          padding: var(--space-xxl);
          background: var(--color-bg-panel);
        }

        /* Mobile Layout */
        @media (max-width: 1024px) {
          .dashboard-layout {
            flex-direction: column;
          }
          .panel-left {
            width: 100%;
            height: auto;
            position: relative;
            padding: var(--space-lg);
            border-right: none;
            border-bottom: 1px solid rgba(199, 197, 207, 0.2);
          }
          .panel-right {
            width: 100%;
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Main Dashboard Entry Point
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-xxl">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
