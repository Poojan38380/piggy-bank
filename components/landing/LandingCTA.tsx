import Link from "next/link";

/**
 * LandingCTA — Final conversion strip before footer.
 * "Ready to track smarter?" gradient card + primary CTA.
 */
export function LandingCTA() {
  return (
    <section
      style={{
        maxWidth: "var(--container-max)",
        margin: "var(--space-xxl) auto",
        padding: "0 var(--space-xxl)",
      }}
    >
      <div
        style={{
          background: "var(--gradient-hero)",
          borderRadius: "var(--radius-hero)",
          padding: "var(--space-xxl) var(--space-xl)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "var(--space-lg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blob */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            background: "rgba(22, 22, 63, 0.06)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        />

        <h2
          className="text-h2"
          style={{ position: "relative", zIndex: 1 }}
        >
          Ready to track smarter?
        </h2>
        <p
          className="text-body-lg"
          style={{
            color: "var(--color-body)",
            maxWidth: 420,
            position: "relative",
            zIndex: 1,
          }}
        >
          Start for free. No signup required. Your first expense in under 10 seconds.
        </p>

        <Link
          href="/dashboard"
          className="btn btn-primary btn-lg"
          style={{ textDecoration: "none", position: "relative", zIndex: 1 }}
        >
          Get Started Now →
        </Link>
      </div>
    </section>
  );
}

/**
 * LandingFooter — Minimal footer with logo + tagline.
 */
export function LandingFooter() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(199, 197, 207, 0.2)",
        background: "var(--color-surface)",
        marginTop: "var(--space-xxl)",
      }}
    >
      <div
        style={{
          maxWidth: "var(--container-max)",
          margin: "0 auto",
          padding: "var(--space-xl) var(--space-xxl)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-md)",
        }}
        className="footer-row"
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--color-navy)",
            letterSpacing: "-0.02em",
            textTransform: "lowercase",
          }}
        >
          piggybank.
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(199, 197, 207, 0.15)",
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-md)",
          }}
        >
          <p
            className="text-label"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            © 2026 PiggyBank by Fenmo AI
          </p>
          <p
            className="text-label"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Built with the Fenmo AI design system
          </p>
        </div>
      </div>
    </footer>
  );
}
