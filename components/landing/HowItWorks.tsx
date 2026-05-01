/**
 * HowItWorks — 3-step flow with connecting line.
 */

const STEPS = [
  {
    number: "01",
    title: "Add",
    description: "Type the amount and hit submit. Done in 3 seconds.",
  },
  {
    number: "02",
    title: "Categorize",
    description: "Pick a category or let the system suggest one.",
  },
  {
    number: "03",
    title: "See totals",
    description: "Filter by category, sort by date, see exactly where it went.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-container mx-auto px-lg lg:px-xxl py-xxl"
    >
      <h2 className="text-h2 font-display font-bold text-navy text-center mb-xl">
        The simplest flow
      </h2>

      {/* Steps row with connecting line */}
      <div className="relative flex flex-col md:flex-row gap-xl max-w-[800px] mx-auto steps-container">
        {/* Connecting line — desktop horizontal, mobile vertical */}
        <div
          aria-hidden="true"
          className="absolute hidden md:block top-8 left-[10%] right-[10%] h-px bg-[rgba(199,197,207,0.4)] z-0"
        />

        {/* Mobile vertical line */}
        <div
          aria-hidden="true"
          className="absolute block md:hidden top-8 bottom-8 left-8 w-[1px] bg-[rgba(199,197,207,0.4)] z-0"
        />

        {STEPS.map((step) => (
          <Step key={step.number} step={step} />
        ))}
      </div>
    </section>
  );
}

function Step({
  step,
}: {
  step: (typeof STEPS)[number];
}) {
  return (
    <div className="flex flex-row items-center gap-md relative bg-background step-item">
      {/* Number circle */}
      <div className="w-[64px] h-[64px] bg-surface-container-highest rounded-full border border-surface-dim shadow-card flex items-center justify-center shrink-0 z-10">
        <span className="font-mono text-[16px] font-semibold tracking-tight text-teal">
          {step.number}
        </span>
      </div>

      {/* Text */}
      <div>
        <h4 className="font-mono text-[16px] font-semibold tracking-tight text-navy mb-1">
          {step.title}
        </h4>
        <p className="text-body-sm text-on-surface-variant">
          {step.description}
        </p>
      </div>
    </div>
  );
}
