"use client";

import * as React from "react";
import { PRESET_CATEGORIES } from "@/lib/categories";
import { ApiResponse } from "@/types";

/**
 * useCategories — Manages the list of available categories.
 */
export function useCategories() {
  const [categories, setCategories] = React.useState<string[]>(PRESET_CATEGORIES);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) return;
        
        const response: ApiResponse<string[]> = await res.json();
        if (!response.success) return;
        
        const dbCategories = response.data;
        
        // Merge presets with DB categories, ensuring uniqueness
        setCategories((prev) => {
          const combined = new Set([...prev, ...dbCategories]);
          return Array.from(combined);
        });
      } catch (err) {
        console.error("LOAD_CATEGORIES_ERROR", err);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return {
    categories,
    isLoading,
  };
}
