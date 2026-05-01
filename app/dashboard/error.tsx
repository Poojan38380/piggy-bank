"use client";

import { Button } from "@/components/ui";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * error.tsx — Route-level error boundary for /dashboard.
 * BUG-8 FIX: Previously there was no error handling — a crash showed a white screen.
 * This boundary catches rendering errors and gives the user a recovery path.
 */
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-lg">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-lg">
        <div className="w-[64px] h-[64px] rounded-full bg-error/10 flex items-center justify-center">
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <div className="flex flex-col gap-sm">
          <h2 className="text-h3 text-navy">Something went wrong</h2>
          <p className="text-body-md text-on-surface-variant">
            The dashboard failed to load. This might be a temporary issue.
          </p>
          {error.digest && (
            <p className="text-label text-outline font-mono">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <Button variant="teal" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
