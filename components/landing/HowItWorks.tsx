/**
 * HowItWorks — 3-step flow with connecting line.
 * Server Component. From Stitch landing-page.html "The simplest flow" section.
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
      style={{
        maxWidth: "var(--container-max)",
        margin: "0 auto",
        padding: "var(--space-xxl)",
      }}
    >
      <h2
        className="text-h2"
        style={{
          textAlign: "center",
          marginBottom: "var(--space-xl)",
        }}
      >
        The simplest flow
      </h2>

      {/* Steps row with connecting line */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xl)",
          maxWidth: 800,
          margin: "0 auto",
        }}
        className="steps-container"
      >
        {/* Connecting line — desktop horizontal, mobile vertical */}
        <div
          aria-hidden="true"
          className="steps-connector"
          style={{
            position: "absolute",
            top: 32,
            left: "10%",
            right: "10%",
            height: 1,
            background: "rgba(199, 197, 207, 0.4)",
            zIndex: 0,
          }}
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "var(--space-md)",
        position: "relative",
        background: "var(--color-bg)",
      }}
      className="step-item"
    >
      {/* Number circle */}
      <div
        style={{
          width: 64,
          height: 64,
          background: "var(--color-surface-container-highest)",
          borderRadius: "50%",
          border: "1px solid var(--color-surface-dim)",
          boxShadow: "var(--shadow-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "var(--color-teal)",
          }}
        >
          {step.number}
        </span>
      </div>

      {/* Text */}
      <div>
        <h4
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "var(--color-navy)",
            marginBottom: 4,
          }}
        >
          {step.title}
        </h4>
        <p className="text-body-sm" style={{ color: "var(--color-on-surface-variant)" }}>
          {step.description}
        </p>
      </div>
    </div>
  );
}
