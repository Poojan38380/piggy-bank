import Link from "next/link";

/**
 * AppHeader — Small, clean header for the dashboard.
 * Features the "piggybank." wordmark and a link back to landing.
 */
export function AppHeader() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "var(--space-xl)",
      }}
    >
      <Link
        href="/"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--color-navy)",
          letterSpacing: "-0.02em",
          textTransform: "lowercase",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
        }}
      >
        <span style={{ color: "var(--color-teal)" }}>○</span>
        piggybank.
      </Link>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--color-on-surface-variant)",
          padding: "4px 8px",
          border: "1px solid var(--color-outline-variant)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        Personal v1.0
      </div>
    </header>
  );
}
