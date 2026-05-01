import { DashboardSkeleton } from "@/components/app/DashboardSkeleton";

/**
 * loading.tsx — Route-level loading UI for /dashboard.
 * BUG-8 FIX: This is the proper Next.js way to handle the initial shell.
 * It renders instantly while the page JS chunk is being loaded.
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
