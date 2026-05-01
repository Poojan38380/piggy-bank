"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Expense, ExpenseFilters, ExpenseListResponse, ApiResponse } from "@/types";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";

/**
 * useExpenses — The primary data hook for the PiggyBank dashboard.
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

  const response: ApiResponse<ExpenseListResponse> = await res.json();
  if (!response.success) throw new Error(response.error || "Failed to fetch expenses");

  return response.data;
}

// ── Hook ──────────────────────────────────────────────────

export function useExpenses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // State
  const [data, setData] = useState<ExpenseListResponse>({
    items: [],
    meta: {
      total: 0,
      visibleTotal: 0,
      visibleTotalFormatted: "₹0.00",
      filteredBy: null
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  // Derived Filters from URL — Normalize 'all' to null for UI consistency
  const filters: ExpenseFilters = useMemo(() => {
    const cat = searchParams.get("category");
    return {
      category: !cat || cat === "all" ? null : cat,
      sortDesc: searchParams.get("sort") !== "asc", // default to desc
    };
  }, [searchParams]);

  // Load Data
  const load = useCallback(async () => {
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

  useEffect(() => {
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
