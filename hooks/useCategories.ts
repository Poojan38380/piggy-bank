"use client";

import { useState, useEffect, useCallback } from "react";
import { PRESET_CATEGORIES } from "@/lib/categories";
import { MOCK_CATEGORIES } from "@/lib/mock-data";

/**
 * useCategories — Returns merged, deduplicated category list.
 *
 * Strategy:
 *  - Starts immediately with PRESET_CATEGORIES (no loading flash).
 *  - Fetches distinct categories from the API (or mock) and merges with presets.
 *  - "Other" is always last; all remaining are alphabetically sorted.
 *
 * In Phase 8: replace `fetchCategories()` with a real fetch to
 * `GET /api/expenses/categories`.
 */

// ── Internal fetcher (swap for real fetch in Phase 8) ─────

function fetchCategories(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CATEGORIES);
    }, 200);
  });
}

// ── Merge + sort logic ────────────────────────────────────

function mergeCategories(fetched: string[]): string[] {
  const combined = new Set([...PRESET_CATEGORIES, ...fetched]);
  combined.delete("Other");

  const sorted = Array.from(combined).sort();
  sorted.push("Other"); // "Other" always last

  return sorted;
}

// ── Hook ──────────────────────────────────────────────────

interface UseCategoriesReturn {
  /** Merged, deduplicated, sorted category list */
  categories: string[];
  /** true only on initial load (presets are shown immediately) */
  isLoading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Refetch categories (call after a new custom category is created) */
  refetch: () => void;
}

export function useCategories(): UseCategoriesReturn {
  // Initialise with presets immediately — no loading flash on first render
  const [categories, setCategories] = useState<string[]>(() =>
    mergeCategories([])
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTick, setRefetchTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    fetchCategories()
      .then((fetched) => {
        if (cancelled) return;
        setCategories(mergeCategories(fetched));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // Non-fatal: keep presets, just note the error
        setError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refetchTick]);

  const refetch = useCallback(() => {
    setRefetchTick((t) => t + 1);
  }, []);

  return { categories, isLoading, error, refetch };
}
