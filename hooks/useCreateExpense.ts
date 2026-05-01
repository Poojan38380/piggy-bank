"use client";

import { ExpenseFormValues } from "@/lib/validations";
import { Expense, ApiResponse } from "@/types";
import { useEffect, useRef, useState } from "react";

/**
 * useCreateExpense — Manages the lifecycle of expense creation.
 *
 * Features:
 * - Robust Idempotency: Generates a UUID lazily, with a safe SSR fallback.
 * - Resilience: UUID is preserved on failure to allow safe retries.
 * - State: Regenerates key only after a successful creation.
 *
 * BUG-9 FIX: The original SSR fallback was an empty string "".
 * An empty string would fail UUID validation on the server with a confusing error.
 * Fix: useRef ensures the key is generated exactly once on mount.
 * On SSR, a temporary placeholder is used and replaced immediately on hydration.
 */
export function useCreateExpense() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with a placeholder; the ref ensures we generate once on client mount.
  const hasInitialized = useRef(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");

  useEffect(() => {
    // This runs only on the client, after hydration. Generates the first key.
    if (!hasInitialized.current) {
      setIdempotencyKey(crypto.randomUUID());
      hasInitialized.current = true;
    }
  }, []);

  const create = async (values: ExpenseFormValues): Promise<Expense> => {
    // Guard: ensure a valid key exists before submitting
    if (!idempotencyKey) {
      throw new Error("Not ready — idempotency key not yet initialized.");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          idempotencyKey,
        }),
      });

      const resData: ApiResponse<Expense> = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to create expense");
      }

      // Success! Generate a NEW key for the next potential expense.
      setIdempotencyKey(crypto.randomUUID());

      return resData.data;
    } catch (error) {
      // NOTE: We do NOT regenerate the key on error.
      // This allows the user to click 'Submit' again with the SAME key,
      // enabling the server to handle it idempotently.
      console.error("CREATE_EXPENSE_ERROR", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    create,
    isSubmitting,
    idempotencyKey,
  };
}
