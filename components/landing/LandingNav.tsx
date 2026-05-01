import Link from "next/link";

/**
 * LandingNav — Top navigation bar for the landing page.
 * Server Component — no interactivity needed.
 */
export function LandingNav() {
  return (
    <header
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--space-lg) var(--space-xxl)",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "24px",
          fontWeight: 700,
          color: "var(--color-navy)",
          letterSpacing: "-0.02em",
          textTransform: "lowercase",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
        }}
      >
        <PiggyIcon />
        piggybank.
      </div>

      {/* "Powered by Fenmo AI" pill */}
      <div
        style={{
          display: "none", // hidden on mobile via media query below
          alignItems: "center",
          gap: "var(--space-xs)",
          padding: "6px var(--space-md)",
          background: "var(--color-surface-container-low)",
          borderRadius: "var(--radius-full)",
          border: "1px solid rgba(199, 197, 207, 0.3)",
        }}
        className="md-flex-pill"
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--color-teal)",
          }}
        >
          Powered by Fenmo AI
        </span>
        <ArrowUpRight />
      </div>

      {/* Dashboard link */}
      <Link
        href="/dashboard"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "var(--color-navy)",
          textDecoration: "none",
          padding: "8px var(--space-md)",
          borderRadius: "var(--radius-input)",
          border: "1.5px solid var(--color-navy)",
          transition: "background-color 0.15s ease",
        }}
        className="nav-dashboard-link"
      >
        Open App →
      </Link>
    </header>
  );
}

function PiggyIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-teal)" }}
    >
      <path d="M19 5c-1.5 0-2.8.4-3.9 1.1L12 4H7a5 5 0 0 0 0 10h1l1.5 3h3l.5-3H15a5 5 0 0 0 4-2" />
      <path d="M2 9a5 5 0 0 1 5-5" />
      <circle cx="19" cy="5" r="2" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--color-teal)" }}
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
