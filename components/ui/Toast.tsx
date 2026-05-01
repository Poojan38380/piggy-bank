"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

/**
 * Toaster — drop into the root layout once.
 * Styled to match the Fenmo design system.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      offset={16}
      gap={8}
      toastOptions={{
        style: {
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.01em",
          borderRadius: "var(--radius-input)",   // 10px
          border: "1px solid var(--color-outline-variant)",
          boxShadow: "var(--shadow-hover)",
          background: "var(--color-surface)",
          color: "var(--color-on-surface)",
          padding: "14px 18px",
        },
        classNames: {
          success:
            "!border-l-4 !border-l-[var(--color-teal)] !border-t-transparent !border-r-transparent !border-b-transparent",
          error:
            "!border-l-4 !border-l-[var(--color-error)] !border-t-transparent !border-r-transparent !border-b-transparent",
        },
      }}
    />
  );
}

/**
 * toast — pre-configured helpers that wrap Sonner's API.
 * Use these instead of calling sonnerToast directly.
 *
 * @example
 * toast.success("Expense added")
 * toast.error("Something went wrong")
 * toast.loading("Saving…")
 */
export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      description,
      duration: 3500,
    }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      description,
      duration: 5000,
    }),

  loading: (message: string) =>
    sonnerToast.loading(message, {
      duration: Infinity,
    }),

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),

  promise: sonnerToast.promise,
};
