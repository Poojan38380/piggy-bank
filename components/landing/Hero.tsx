import Link from "next/link";

export function Hero() {
  return (
    <section className="relative max-w-container mx-auto px-lg lg:px-xxl pt-xxl pb-20 overflow-hidden flex flex-col gap-xxl hero-section">
      {/* Gradient blob background */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] bg-[radial-gradient(ellipse_at_center,_rgba(153,243,226,0.35)_0%,_rgba(212,227,255,0.25)_60%,_transparent_100%)] rounded-full blur-[80px] z-0 pointer-events-none"
      />

      {/* Content row */}
      <div className="hero-content-row relative z-10 flex flex-col lg:flex-row items-center gap-xxl">
        {/* Left: copy */}
        <div className="hero-left flex-1 lg:flex-[1.2]">
          {/* Stat pills */}
          <div className="flex flex-wrap gap-sm mb-sm justify-center lg:justify-start">
            {STAT_PILLS.map((pill) => (
              <StatPill key={pill.label} icon={pill.icon} label={pill.label} />
            ))}
          </div>

          {/* Headline */}
          <h1 className="text-h1 font-display font-bold leading-[1.1] tracking-tight text-navy text-[clamp(40px,5vw,64px)] max-w-[560px] mb-lg mx-auto lg:mx-0 text-center lg:text-left">
            Your money,
            <br />
            clearly.
          </h1>

          {/* Subtext */}
          <p className="text-body-lg text-on-surface-variant max-w-[460px] mb-xl mx-auto lg:mx-0 text-center lg:text-left">
            Experience a sophisticated approach to personal finance. PiggyBank
            uses quiet intelligence to categorize, track, and align your
            spending without the noise.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-md items-center justify-center lg:justify-start">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-charcoal text-white rounded-[10px] font-mono font-semibold no-underline hover:bg-[#3a3737] transition-all"
            >
              Start Tracking →
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-transparent border-[1.5px] border-navy text-navy rounded-[10px] font-mono font-semibold no-underline hover:bg-navy/5 transition-all"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Right: app mockup visual */}
        <div className="hero-right flex-1 w-full max-w-[500px] lg:max-w-none" aria-hidden="true">
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
    <div className="inline-flex items-center gap-xs px-md py-1.5 bg-surface-container border border-[rgba(199,197,207,0.5)] rounded-full">
      <span className="font-mono text-[13px] text-teal leading-none">
        {icon}
      </span>
      <span className="text-label text-body-text">
        {label}
      </span>
    </div>
  );
}

// ── App mockup visual ─────────────────────────────────────

function AppMockup() {
  return (
    <div className="w-full aspect-4/3 bg-surface rounded-hero shadow-card border border-[rgba(199,197,207,0.2)] overflow-hidden flex flex-col">
      {/* Gradient header area */}
      <div className="h-[38%] bg-gradient-hero p-lg flex flex-col justify-end gap-sm">
        {/* Wallet icon circle */}
        <div className="w-[52px] h-[52px] bg-surface rounded-full shadow-card flex items-center justify-center mb-xs">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal"
          >
            <path d="M20 12V22H4V12" />
            <path d="M22 7H2v5h20V7z" />
            <path d="M12 22V7" />
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </svg>
        </div>
        {/* Balance skeleton lines */}
        <div className="w-[120px] h-[10px] bg-[rgba(22,22,63,0.12)] rounded-full" />
        <div className="w-[160px] h-[28px] bg-[rgba(22,22,63,0.18)] rounded-lg" />
      </div>

      {/* Expense rows area */}
      <div className="flex-1 p-lg flex flex-col gap-sm">
        {MOCK_ROWS.map((row, idx) => (
          <MockExpenseRow key={idx} accentColor={row.color} />
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
    <div className="w-full h-[44px] bg-surface rounded-card shadow-card flex items-center px-md gap-sm">
      <div
        className="w-[28px] h-[28px] rounded-full shrink-0"
        style={{ background: accentColor }}
      />
      <div className="flex-1 h-[10px] bg-[rgba(119,118,127,0.2)] rounded-full" />
      <div className="w-[50px] h-[10px] bg-[rgba(22,22,63,0.15)] rounded-full shrink-0" />
    </div>
  );
}
