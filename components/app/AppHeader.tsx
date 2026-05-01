import Link from "next/link";

/**
 * AppHeader — Small, clean header for the dashboard.
 * Features the "piggybank." wordmark and a link back to landing.
 */
export function AppHeader() {
  return (
    <header className="flex justify-between items-center mb-xl">
      <Link
        href="/"
        className="font-display text-[20px] font-bold text-navy tracking-tight lowercase flex items-center gap-sm no-underline"
      >
        <span className="text-teal">○</span>
        piggybank.
      </Link>

      <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-on-surface-variant px-2 py-1 border border-outline-variant rounded-sm">
        Personal v1.0
      </div>
    </header>
  );
}
