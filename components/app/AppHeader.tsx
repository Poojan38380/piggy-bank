import Link from "next/link";
import Image from "next/image";

/**
 * AppHeader — Small, clean header for the dashboard.
 */
export function AppHeader() {
  return (
    <header className="flex justify-between items-center mb-xl">
      <Link
        href="/"
        className="font-display text-[20px] font-bold text-navy tracking-tight lowercase flex items-center gap-sm no-underline group"
      >
        <Image 
          src="/logos/logo.png" 
          alt="PiggyBank Logo" 
          width={28} 
          height={28} 
          className="object-contain transition-transform group-hover:scale-110"
        />
        piggybank.
      </Link>

      <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-on-surface-variant px-2 py-1 border border-outline-variant rounded-sm opacity-60">
        Personal v1.0
      </div>
    </header>
  );
}
