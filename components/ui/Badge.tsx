import { getCategoryColor } from "@/lib/categories";

interface BadgeProps {
  /** The category name — drives the color */
  category: string;
  className?: string;
}

/**
 * CategoryBadge — renders a category chip with deterministic colors.
 * Uses IBM Plex Mono, uppercase, 4px radius, from DESIGN.md spec.
 */
export function CategoryBadge({ category, className = "" }: BadgeProps) {
  const { bg, text } = getCategoryColor(category);

  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: bg,
        color: text,
      }}
    >
      {category}
    </span>
  );
}

// ── Generic status badge ──────────────────────────────────

type StatusVariant = "success" | "error" | "warning" | "neutral";

interface StatusBadgeProps {
  variant?: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const STATUS_STYLES: Record<StatusVariant, { bg: string; text: string }> = {
  success: { bg: "#D1FAE5", text: "#065F46" },
  error: { bg: "#FEE2E2", text: "#991B1B" },
  warning: { bg: "#FEF3C7", text: "#92400E" },
  neutral: { bg: "#F1F5F9", text: "#475569" },
};

export function StatusBadge({
  variant = "neutral",
  children,
  className = "",
}: StatusBadgeProps) {
  const { bg, text } = STATUS_STYLES[variant];

  return (
    <span
      className={`badge ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {children}
    </span>
  );
}
