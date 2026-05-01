import Link from "next/link";

/**
 * Hero — Full landing page hero section.
 * Server Component. Matches Stitch landing-page.html design.
 *
 * Left: stat pills → H1 headline → sub-text → CTAs
 * Right: abstract app mockup visual
 */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-xxl) var(--space-xxl) 80px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-xxl)",
      }}
      className="hero-section"
    >
      {/* Gradient blob background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          width: 700,
          height: 700,
          background:
            "radial-gradient(ellipse at center, rgba(153, 243, 226, 0.35) 0%, rgba(212, 227, 255, 0.25) 60%, transparent 100%)",
          borderRadius: "50%",
          filter: "blur(80px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Content row */}
      <div className="hero-content-row" style={{ position: "relative", zIndex: 1 }}>
        {/* Left: copy */}
        <div className="hero-left">
          {/* Stat pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-sm)",
              marginBottom: "var(--space-sm)",
            }}
          >
            {STAT_PILLS.map((pill) => (
              <StatPill key={pill.label} icon={pill.icon} label={pill.label} />
            ))}
          </div>

          {/* Headline */}
          <h1
            className="text-h1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "var(--color-navy)",
              fontSize: "clamp(40px, 5vw, 64px)",
              maxWidth: "560px",
              margin: "0 0 var(--space-lg)",
            }}
          >
            Your money,
            <br />
            clearly.
          </h1>

          {/* Subtext */}
          <p
            className="text-body-lg"
            style={{
              color: "var(--color-on-surface-variant)",
              maxWidth: "460px",
              margin: "0 0 var(--space-xl)",
            }}
          >
            Experience a sophisticated approach to personal finance. PiggyBank
            uses quiet intelligence to categorize, track, and align your
            spending without the noise.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-md)",
              alignItems: "center",
            }}
          >
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ textDecoration: "none" }}
            >
              Start Tracking →
            </Link>
            <a
              href="#how-it-works"
              className="btn btn-ghost"
              style={{ textDecoration: "none" }}
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Right: app mockup visual */}
        <div className="hero-right" aria-hidden="true">
          <AppMockup />
        </div>
      </div>
    </section>
  );
}

// ── Stat pills ────────────────────────────────────────────

const STAT_PILLS = [
  { icon: "₹", label: "Zero float math" },
  { icon: "↺", label: "Retry-safe" },
  { icon: "⌥", label: "Instant filters" },
];

function StatPill({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-xs)",
        padding: "6px var(--space-md)",
        background: "var(--color-surface-container)",
        border: "1px solid rgba(199, 197, 207, 0.5)",
        borderRadius: "var(--radius-full)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          color: "var(--color-teal)",
          lineHeight: 1,
        }}
      >
        {icon}
      </span>
      <span className="text-label" style={{ color: "var(--color-body)" }}>
        {label}
      </span>
    </div>
  );
}

// ── App mockup visual ─────────────────────────────────────

function AppMockup() {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "4/3",
        background: "var(--color-surface)",
        borderRadius: "var(--radius-hero)",
        boxShadow: "var(--shadow-card)",
        border: "1px solid rgba(199, 197, 207, 0.2)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Gradient header area */}
      <div
        style={{
          height: "38%",
          background: "var(--gradient-hero)",
          padding: "var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: "var(--space-sm)",
        }}
      >
        {/* Wallet icon circle */}
        <div
          style={{
            width: 52,
            height: 52,
            background: "var(--color-surface)",
            borderRadius: "50%",
            boxShadow: "var(--shadow-card)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "var(--space-xs)",
          }}
        >
          <svg
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
            <path d="M20 12V22H4V12" />
            <path d="M22 7H2v5h20V7z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
        {/* Balance skeleton lines */}
        <div
          style={{
            width: 120,
            height: 10,
            background: "rgba(22, 22, 63, 0.12)",
            borderRadius: 6,
          }}
        />
        <div
          style={{
            width: 160,
            height: 28,
            background: "rgba(22, 22, 63, 0.18)",
            borderRadius: 8,
          }}
        />
      </div>

      {/* Expense rows area */}
      <div
        style={{
          flex: 1,
          padding: "var(--space-md) var(--space-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-sm)",
        }}
      >
        {MOCK_ROWS.map((row) => (
          <MockExpenseRow key={row.color} accentColor={row.color} />
        ))}
      </div>
    </div>
  );
}

const MOCK_ROWS = [
  { color: "var(--color-secondary-container)" },
  { color: "var(--color-surface-container)" },
  { color: "var(--color-surface-dim)" },
];

function MockExpenseRow({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: 44,
        background: "var(--color-surface)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-card)",
        display: "flex",
        alignItems: "center",
        padding: "0 var(--space-md)",
        gap: "var(--space-sm)",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: accentColor,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          height: 10,
          background: "rgba(119, 118, 127, 0.2)",
          borderRadius: 6,
        }}
      />
      <div
        style={{
          width: 50,
          height: 10,
          background: "rgba(22, 22, 63, 0.15)",
          borderRadius: 6,
          flexShrink: 0,
        }}
      />
    </div>
  );
}
