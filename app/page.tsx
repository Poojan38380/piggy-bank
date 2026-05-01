import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingCTA, LandingFooter } from "@/components/landing/LandingCTA";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * PiggyBank Landing Page
 * 
 * A high-fidelity, marketing-first landing page built as a Server Component.
 * Optimized for SEO and performance (Zero Client JS for initial render).
 */
export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNav />
      
      <main className="flex-1">
        <Hero />
        
        {/* Subtle spacing between sections */}
        <div className="h-xxl" />
        
        <Features />
        
        <HowItWorks />
        
        <LandingCTA />
      </main>
      
      <LandingFooter />
    </div>
  );
}
