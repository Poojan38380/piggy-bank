import * as React from "react";

// ── Skeleton variants ─────────────────────────────────────

interface SkeletonProps {
  /** Width — CSS value, e.g. "100%", "120px" */
  width?: string;
  /** Height — CSS value */
  height?: string;
  /** Border radius — CSS value. Defaults to --radius-sm (4px) */
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base skeleton — any dimensions, uses teal-soft shimmer from globals.css
 */
export function Skeleton({
  width = "100%",
  height = "16px",
  radius = "var(--radius-sm)",
  className = "",
  style,
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${className}`}
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

// ── Composed skeleton shapes ──────────────────────────────

/** Skeleton for an expense card row */
export function ExpenseCardSkeleton() {
  return (
    <div
      className="card-expense"
      aria-hidden="true"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-lg)",
      }}
    >
      {/* Category icon circle */}
      <Skeleton width="48px" height="48px" radius="50%" style={{ flexShrink: 0 }} />

      {/* Description + badge row */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton width="60%" height="14px" />
        <div style={{ display: "flex", gap: 8 }}>
          <Skeleton width="60px" height="20px" radius="var(--radius-sm)" />
          <Skeleton width="80px" height="12px" />
        </div>
      </div>

      {/* Amount */}
      <Skeleton width="80px" height="16px" style={{ flexShrink: 0 }} />
    </div>
  );
}

/** Skeleton for the summary card */
export function SummaryCardSkeleton() {
  return (
    <div
      className="card"
      aria-hidden="true"
      style={{
        padding: "var(--space-lg)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <Skeleton width="120px" height="12px" />
      <Skeleton width="180px" height="40px" radius="var(--radius-sm)" />
    </div>
  );
}

/** Multiple expense card skeletons for list loading state */
export function ExpenseListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading expenses…"
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ExpenseCardSkeleton key={i} />
      ))}
    </div>
  );
}
