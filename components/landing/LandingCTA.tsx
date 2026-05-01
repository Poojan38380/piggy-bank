import Link from "next/link";
import Image from "next/image";

/**
 * LandingCTA — Final conversion strip before footer.
 * "Ready to track smarter?" gradient card + primary CTA.
 */
export function LandingCTA() {
  return (
    <section className="max-w-container mx-auto my-xxl px-xxl">
      <div className="bg-gradient-hero rounded-hero p-xxl lg:px-xl flex flex-col items-center text-center gap-lg relative overflow-hidden">
        {/* Decorative blob */}
        <div
          aria-hidden="true"
          className="absolute -top-[60px] -right-[60px] w-[240px] h-[240px] bg-[rgba(22,22,63,0.06)] rounded-full blur-[40px]"
        />

        <h2 className="text-h2 font-display font-bold text-navy relative z-10 text-center">
          Ready to track smarter?
        </h2>
        <p className="text-body-lg text-body-text max-w-[420px] relative z-10 text-center">
          Start for free. No signup required. Your first expense in under 10 seconds.
        </p>

        <Link
          href="/dashboard"
          className="px-8 py-4 bg-charcoal text-white rounded-[10px] font-mono font-semibold no-underline hover:bg-[#3a3737] transition-all relative z-10"
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
    <footer className="border-t border-[rgba(199,197,207,0.2)] bg-surface mt-xxl">
      <div className="max-w-container mx-auto px-lg lg:px-xxl py-xl flex flex-col items-center gap-md footer-row">
        {/* Logo */}
        <div className="font-display text-[20px] font-bold text-navy tracking-tight lowercase flex items-center gap-sm">
          <Image
            src="/logos/logo.png"
            alt="PiggyBank Logo"
            width={24}
            height={24}
            className="object-contain"
          />
          piggybank.
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[rgba(199,197,207,0.15)]" />

        {/* Bottom row */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center flex-wrap gap-md">
          <p className="text-label text-on-surface-variant text-center md:text-left">
            © 2026 PiggyBank by Fenmo AI
          </p>
          <p className="text-label text-on-surface-variant text-center md:text-right">
            Built with the Fenmo AI design system
          </p>
        </div>
      </div>
    </footer>
  );
}
