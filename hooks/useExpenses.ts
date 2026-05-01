"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Expense, ExpenseFilters, ExpenseListResponse } from "@/types";

/**
 * useExpenses — The primary data hook for the PiggyBank dashboard.
 * 
 * Features:
 * - Syncs filter/sort state with URL search params.
 * - Manages 'useTransition' for smooth navigation-based loading.
 * - Returns loading/error states for skeleton and toast rendering.
 */

// ── Internal fetcher ──────────────────────────────────────

async function fetchExpenses(filters: ExpenseFilters): Promise<ExpenseListResponse> {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "all") {
    params.set("category", filters.category);
  }
  params.set("sort", filters.sortDesc ? "desc" : "asc");

  const res = await fetch(`/api/expenses?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

// ── Hook ──────────────────────────────────────────────────

export function useExpenses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // State
  const [data, setData] = React.useState<ExpenseListResponse>({
    items: [],
    meta: { total: 0, visibleTotal: 0, visibleTotalFormatted: "₹0.00" },
  });
  const [isLoading, setIsLoading] = React.useState(true);

  // Derived Filters from URL
  const filters: ExpenseFilters = React.useMemo(() => ({
    category: searchParams.get("category"),
    sortDesc: searchParams.get("sort") !== "asc", // default to desc
  }), [searchParams]);

  // Load Data
  const load = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchExpenses(filters);
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    load();
  }, [load]);

  // Handlers
  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (category) params.set("category", category);
    else params.delete("category");
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const toggleSort = () => {
    const params = new URLSearchParams(searchParams);
    const isCurrentlyDesc = params.get("sort") !== "asc";
    params.set("sort", isCurrentlyDesc ? "asc" : "desc");
    
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return {
    expenses: data.items,
    meta: data.meta,
    filters,
    isLoading: isLoading || isPending,
    setCategory,
    toggleSort,
    refetch: load,
  };
}
