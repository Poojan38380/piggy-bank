"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Expense, ExpenseFilters, ExpenseListResponse } from "@/types";
import { getMockExpenses } from "@/lib/mock-data";

/**
 * useExpenses — Expense list state with filter/sort + URL param sync.
 *
 * - Reads `?category=` and `?sort=` from the URL on mount.
 * - Writes back to URL on filter change (shallow push, no page reload).
 * - Backed by mock data now; swap `fetchExpenses` for real fetch in Phase 8.
 * - Returns loading/error states for skeleton and toast rendering.
 */

// ── Internal fetcher (swap for real fetch in Phase 8) ─────

function fetchExpenses(filters: ExpenseFilters): Promise<ExpenseListResponse> {
  return new Promise((resolve) => {
    // Simulate a brief network delay for realistic skeleton UX
    setTimeout(() => {
      resolve(getMockExpenses(filters.category, filters.sortDesc));
    }, 400);
  });
}

// ── Hook ──────────────────────────────────────────────────

interface UseExpensesReturn {
  /** Filtered, sorted expense list */
  expenses: Expense[];
  /** Computed meta (total, visible total, formatted) */
  meta: ExpenseListResponse["meta"] | null;
  /** Active filter state */
  filters: ExpenseFilters;
  /** true while fetching */
  isLoading: boolean;
  /** true during URL param transitions */
  isPending: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Update the category filter — syncs to URL */
  setCategory: (category: string | null) => void;
  /** Toggle sort direction — syncs to URL */
  toggleSort: () => void;
  /** Manually refetch (call after a successful create) */
  refetch: () => void;
}

export function useExpenses(): UseExpensesReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ── Read initial filter state from URL ─────────────────
  const categoryParam = searchParams.get("category");
  const sortParam = searchParams.get("sort");

  const [filters, setFilters] = useState<ExpenseFilters>({
    category: categoryParam || null,
    sortDesc: sortParam !== "asc", // default: newest first
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [meta, setMeta] = useState<ExpenseListResponse["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  // ── Fetch whenever filters or refetchTick change ───────
  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchExpenses(filters)
      .then((result) => {
        if (cancelled) return;
        setExpenses(result.items);
        setMeta(result.meta);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load expenses"
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters, refetchTick]);

  // ── URL param sync helper ──────────────────────────────
  const syncURL = useCallback(
    (newFilters: ExpenseFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.category) {
        params.set("category", newFilters.category);
      } else {
        params.delete("category");
      }

      if (!newFilters.sortDesc) {
        params.set("sort", "asc");
      } else {
        params.delete("sort"); // default is desc — no param needed
      }

      const query = params.toString();
      const newURL = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(newURL, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  // ── Public actions ─────────────────────────────────────

  const setCategory = useCallback(
    (category: string | null) => {
      const newFilters: ExpenseFilters = { ...filters, category };
      setFilters(newFilters);
      syncURL(newFilters);
    },
    [filters, syncURL]
  );

  const toggleSort = useCallback(() => {
    const newFilters: ExpenseFilters = {
      ...filters,
      sortDesc: !filters.sortDesc,
    };
    setFilters(newFilters);
    syncURL(newFilters);
  }, [filters, syncURL]);

  const refetch = useCallback(() => {
    setRefetchTick((t) => t + 1);
  }, []);

  return {
    expenses,
    meta,
    filters,
    isLoading,
    isPending,
    error,
    setCategory,
    toggleSort,
    refetch,
  };
}
