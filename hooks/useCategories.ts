"use client";

import * as React from "react";
import { PRESET_CATEGORIES } from "@/lib/categories";

/**
 * useCategories — Manages the list of available categories.
 * 
 * Strategy:
 * 1. Immediate: Load PRESET_CATEGORIES (Food, Travel, etc.) so UI isn't empty.
 * 2. Background: Fetch any custom categories from the DB and merge them.
 */
export function useCategories() {
  const [categories, setCategories] = React.useState<string[]>(PRESET_CATEGORIES);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/expenses/categories");
        if (!res.ok) return;
        
        const dbCategories: string[] = await res.json();
        
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
