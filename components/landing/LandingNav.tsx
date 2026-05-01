import Link from "next/link";
import Image from "next/image";

/**
 * LandingNav — Top navigation bar for the landing page.
 */
export function LandingNav() {
  return (
    <header className="w-full flex justify-between items-center px-lg lg:px-xxl py-lg max-w-container mx-auto relative z-50">
      {/* Logo */}
      <div className="font-display text-[24px] font-bold text-navy tracking-tight lowercase flex items-center gap-sm">
        <Image 
          src="/logos/logo.png" 
          alt="PiggyBank Logo" 
          width={32} 
          height={32} 
          className="object-contain"
        />
        piggybank.
      </div>

      {/* "Powered by Fenmo AI" pill */}
      <div className="hidden md:flex items-center gap-xs px-md py-1.5 bg-surface-container-low rounded-full border border-[rgba(199,197,207,0.3)]">
        <span className="font-mono text-[11px] font-semibold tracking-widest uppercase text-teal">
          Powered by Fenmo AI
        </span>
        <ArrowUpRight />
      </div>

      {/* Dashboard link */}
      <Link
        href="/dashboard"
        className="font-mono text-[12px] font-semibold tracking-widest uppercase text-navy no-underline px-md py-2 rounded-input border-[1.5px] border-navy transition-all hover:bg-navy/5"
      >
        Open App →
      </Link>
    </header>
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
      className="text-teal"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
