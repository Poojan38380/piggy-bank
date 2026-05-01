"use client";

import * as React from "react";
import { ExpenseFormValues } from "@/lib/validations";
import { Expense } from "@/types";

/**
 * useCreateExpense — Manages the lifecycle of expense creation.
 * 
 * Features:
 * - Robust Idempotency: Generates a UUID on mount.
 * - Resilience: UUID is preserved on failure to allow safe retries.
 * - State: Regenerates key only after a successful creation.
 */
export function useCreateExpense() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [idempotencyKey, setIdempotencyKey] = React.useState<string>("");

  // 1. Initialize idempotency key on mount
  React.useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

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

      if (!response.ok) {
        throw new Error("Failed to create expense");
      }

      const createdExpense = await response.json();

      // 2. Success! Generate a NEW key for the next potential expense
      setIdempotencyKey(crypto.randomUUID());
      
      return createdExpense;
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
