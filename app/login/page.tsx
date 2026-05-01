import { signIn } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-lg relative overflow-hidden">
      {/* Decorative background gradient */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(153,243,226,0.15)_0%,rgba(212,227,255,0.1)_60%,transparent_100%)] rounded-full blur-[80px] z-0 pointer-events-none"
      />

      <div className="w-full max-w-[400px] flex flex-col items-center gap-xxl relative z-10 animate-fade-in">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center gap-md">
          <div className="w-[64px] h-[64px] bg-surface rounded-card shadow-card flex items-center justify-center border border-[rgba(199,197,207,0.3)]">
            <Image
              src="/logos/logo.png"
              alt="PiggyBank Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="text-center">
            <h1 className="font-display text-[32px] font-bold text-navy tracking-tight lowercase">
              piggybank.
            </h1>
            <p className="text-body-md text-on-surface-variant opacity-70">
              Your money, clearly.
            </p>
          </div>
        </div>

        {/* Login Action Card */}
        <div className="w-full bg-surface p-xl rounded-hero border border-[rgba(199,197,207,0.2)] shadow-card flex flex-col gap-xl">
          <div className="text-center">
            <h2 className="text-h3 font-display font-semibold text-navy mb-2">
              Welcome back
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Experience the quiet luxury of mindful spending.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <Button
              variant="primary"
              className="w-full h-[56px] flex items-center justify-center gap-md"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </form>

          <p className="text-[12px] text-on-surface-variant opacity-50 text-center px-lg">
            By continuing, you agree to PiggyBank&apos;s refined terms of service and privacy policy.
          </p>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center gap-md">
          <div className="flex items-center gap-xs px-md py-1.5 bg-surface-container-low rounded-full border border-[rgba(199,197,207,0.2)]">
            <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-teal">
              Secure · Private · Precise
            </span>
          </div>

          <div className="flex items-center gap-lg">
            <Link 
              href="https://github.com/Poojan38380/piggy-bank" 
              target="_blank"
              className="text-[12px] text-on-surface-variant hover:text-navy transition-colors font-mono underline underline-offset-4"
            >
              GitHub Repo
            </Link>
            <Link 
              href="https://www.linkedin.com/in/poojan-goyani-404224253" 
              target="_blank"
              className="text-[12px] text-on-surface-variant hover:text-navy transition-colors font-mono underline underline-offset-4"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
