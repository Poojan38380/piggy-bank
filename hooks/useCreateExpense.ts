"use client";

import { ExpenseFormValues } from "@/lib/validations";
import { Expense, ApiResponse } from "@/types";
import { useState } from "react";

/**
 * useCreateExpense — Manages the lifecycle of expense creation.
 * 
 * Features:
 * - Robust Idempotency: Generates a UUID using lazy state initialization.
 * - Resilience: UUID is preserved on failure to allow safe retries.
 * - State: Regenerates key only after a successful creation.
 */
export function useCreateExpense() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Initialize idempotency key lazily to ensure it exists before first render/interaction
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => {
    if (typeof window !== "undefined") return crypto.randomUUID();
    return ""; // Placeholder for SSR
  });

  const create = async (values: ExpenseFormValues): Promise<Expense> => {
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

      // 2. Success! Generate a NEW key for the next potential expense
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
