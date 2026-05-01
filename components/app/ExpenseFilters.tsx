"use client";

import { useCategories } from "@/hooks/useCategories";
import { Select, Button } from "@/components/ui";

interface ExpenseFiltersProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  isSortDesc: boolean;
  onToggleSort: () => void;
}

/**
 * ExpenseFilters — Row of controls to slice and dice the list.
 */
export function ExpenseFilters({
  activeCategory,
  onCategoryChange,
  isSortDesc,
  onToggleSort,
}: ExpenseFiltersProps) {
  const { categories } = useCategories();

  const options = [
    { value: "all", label: "All Categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="flex items-end gap-md mb-xl flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <Select
          label="Filter by Category"
          value={activeCategory || "all"}
          onChange={(e) =>
            onCategoryChange(e.target.value === "all" ? null : e.target.value)
          }
          options={options}
        />
      </div>

      <Button
        variant="ghost"
        onClick={onToggleSort}
        className="h-[46px]" // match select height
      >
        <span className="font-mono text-[12px] uppercase tracking-wider">
          Date {isSortDesc ? "↓" : "↑"}
        </span>
      </Button>
    </div>
  );
}
