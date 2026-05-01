/**
 * Features — "Designed for clarity" section.
 * 3-card grid from Stitch design.
 */

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: <BoltIcon />,
    title: "Frictionless Entry",
    description:
      "Log expenses in seconds. The system categorizes your inputs instantly, keeping your focus unbroken.",
  },
  {
    icon: <InsightsIcon />,
    title: "Quiet Insights",
    description:
      "No loud alerts or complex dashboards. Just subtle, meaningful totals that appear exactly when you need them.",
  },
  {
    icon: <ShieldIcon />,
    title: "Retry-safe by Design",
    description:
      "Every submission carries a unique idempotency key. Duplicate taps or flaky networks never create duplicate entries.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="max-w-container mx-auto mb-xl px-lg lg:px-xxl py-xxl bg-surface rounded-hero border border-[rgba(199,197,207,0.15)] shadow-card"
    >
      {/* Header */}
      <div className="text-center mb-xl">
        <h2 className="text-h2 font-display font-bold text-navy mb-sm text-center">
          Designed for clarity
        </h2>
        <p className="text-body-lg text-on-surface-variant max-w-[560px] mx-auto text-center">
          Financial tools shouldn't feel like spreadsheets. We built a system
          that feels natural, fast, and remarkably calm.
        </p>
      </div>

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="bg-[rgba(153,243,226,0.15)] rounded-card p-lg border border-[rgba(153,243,226,0.4)] transition-all hover:bg-[rgba(153,243,226,0.20)]">
      {/* Icon */}
      <div className="w-[48px] h-[48px] bg-surface rounded-input shadow-card flex items-center justify-center mb-md">
        {feature.icon}
      </div>

      <h3 className="text-h3 font-display font-semibold text-navy mb-sm">
        {feature.title}
      </h3>
      <p className="text-body-md text-on-surface-variant">
        {feature.description}
      </p>
    </div>
  );
}

// ── SVG Icons ─────────────────────────────────────────────

function BoltIcon() {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-teal"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function InsightsIcon() {
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
      className="text-teal"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ShieldIcon() {
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
      className="text-teal"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
