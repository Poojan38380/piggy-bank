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
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "var(--space-md)",
        marginBottom: "var(--space-xl)",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: "200px" }}>
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
        style={{ height: "46px" }} // match select height
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>
          Date {isSortDesc ? "↓" : "↑"}
        </span>
      </Button>
    </div>
  );
}
