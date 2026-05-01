"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui";

/**
 * AppHeader — Small, clean header for the dashboard.
 * Now includes user profile and sign out.
 */
export function AppHeader() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center mb-xl">
      <Link
        href="/dashboard"
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

      <div className="flex items-center gap-md">
        {session?.user && (
          <div className="flex items-center gap-sm pr-sm border-r border-outline-variant">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={24}
                height={24}
                className="rounded-full border border-outline-variant"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-navy border border-outline-variant uppercase">
                {session.user.name?.[0] || session.user.email?.[0] || "?"}
              </div>
            )}
            <span className="hidden sm:inline font-mono text-[11px] font-semibold text-on-surface-variant truncate max-w-[100px]">
              {session.user.name?.split(" ")[0]}
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-[10px] font-bold tracking-widest uppercase text-error hover:bg-error/5"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
