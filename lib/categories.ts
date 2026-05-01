import type { PresetCategory } from "@/types";

/**
 * Preset categories — fixed for v1.
 * Shared between frontend pill selector, API validation, and filter dropdown.
 */
export const PRESET_CATEGORIES: PresetCategory[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Other",
];

/**
 * Category badge colors — deterministic, 8 presets.
 * Maps category name → { bg, text } Tailwind-compatible hex values.
 */
export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  Food:          { bg: "#FEF3C7", text: "#92400E" },
  Transport:     { bg: "#DBEAFE", text: "#1E40AF" },
  Shopping:      { bg: "#EDE9FE", text: "#5B21B6" },
  Bills:         { bg: "#FCE7F3", text: "#9D174D" },
  Health:        { bg: "#D1FAE5", text: "#065F46" },
  Entertainment: { bg: "#FFE4E6", text: "#9F1239" },
  Education:     { bg: "#E0F2FE", text: "#0C4A6E" },
  Other:         { bg: "#F1F5F9", text: "#475569" },
};

/**
 * Returns the badge color for a given category.
 * Falls back to "Other" colors for custom/unknown categories.
 */
export function getCategoryColor(
  category: string
): { bg: string; text: string } {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Other"];
}

/**
 * Returns true if the given string is a preset category.
 */
export function isPresetCategory(value: string): value is PresetCategory {
  return PRESET_CATEGORIES.includes(value as PresetCategory);
}
