"use client";

import {
  SummaryCardSkeleton,
  ExpenseListSkeleton,
  Skeleton
} from "@/components/ui/Skeleton";

/**
 * DashboardSkeleton — Replicates the 2-column layout for loading fallback.
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen max-w-[1440px] mx-auto bg-background animate-pulse">
      {/* LEFT PANEL: Branding + Add Expense */}
      <aside className="w-full lg:w-[40%] p-lg lg:p-xxl bg-background border-b lg:border-b-0 lg:border-r border-divider">
        <div className="flex items-center gap-3 mb-xl">
          <Skeleton width="40px" height="40px" radius="10px" />
          <Skeleton width="120px" height="24px" />
        </div>

        <div className="flex flex-col gap-xl">
          <SummaryCardSkeleton />

          <div className="card p-lg flex flex-col gap-md">
            <Skeleton width="140px" height="24px" className="mb-2" />
            <Skeleton height="50px" radius="10px" />
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton width="80px" height="12px" />
              <div className="flex gap-2">
                <Skeleton width="60px" height="32px" radius="20px" />
                <Skeleton width="60px" height="32px" radius="20px" />
                <Skeleton width="60px" height="32px" radius="20px" />
              </div>
            </div>
            <Skeleton height="50px" radius="10px" className="mt-4" />
          </div>
        </div>
      </aside>

      {/* RIGHT PANEL: Filters + List */}
      <main className="w-full lg:w-[60%] p-lg lg:p-xxl bg-panel min-h-screen">
        <div className="flex justify-between items-center mb-xl">
          <div className="flex gap-2">
            <Skeleton width="80px" height="36px" radius="8px" />
            <Skeleton width="80px" height="36px" radius="8px" />
          </div>
          <Skeleton width="100px" height="36px" radius="8px" />
        </div>

        <div className="mb-lg">
          <Skeleton width="150px" height="12px" className="mb-md opacity-40" />
          <ExpenseListSkeleton count={6} />
        </div>
      </main>
    </div>
  );
}
