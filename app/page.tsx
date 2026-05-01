import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingCTA, LandingFooter } from "@/components/landing/LandingCTA";

/**
 * PiggyBank Landing Page
 * 
 * A high-fidelity, marketing-first landing page built as a Server Component.
 * Optimized for SEO and performance (Zero Client JS for initial render).
 */
export default function LandingPage() {
  return (
    <div 
      className="min-h-screen bg-bg" 
      style={{ 
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <LandingNav />
      
      <main style={{ flex: 1 }}>
        <Hero />
        
        {/* Subtle spacing between sections */}
        <div style={{ height: "var(--space-xxl)" }} />
        
        <Features />
        
        <HowItWorks />
        
        <LandingCTA />
      </main>
      
      <LandingFooter />

      {/* Global Landing-specific overrides (Responsive) */}
      <style>{`
        .hero-content-row {
          display: flex;
          align-items: center;
          gap: var(--space-xxl);
        }
        
        .hero-left { flex: 1.2; }
        .hero-right { flex: 1; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
        }

        .steps-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .steps-connector {
          display: block;
        }

        /* Mobile Adjustments */
        @media (max-width: 1024px) {
          .hero-content-row {
            flex-direction: column;
            text-align: center;
          }
          .hero-left {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-right {
            width: 100%;
            max-width: 500px;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .md-flex-pill {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .steps-container {
            flex-direction: column;
            gap: var(--space-xl);
          }
          .steps-connector {
            top: 0;
            bottom: 0;
            left: 32px;
            width: 1px;
            height: 100%;
          }
          .step-item {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
