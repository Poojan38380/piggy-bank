"use client";

import { useState, useCallback, useRef } from "react";
import type { Expense, CreateExpensePayload } from "@/types";
import { parseAmountToPaise, formatCurrency } from "@/lib/money";
import { getMockExpenses } from "@/lib/mock-data";
import { MOCK_EXPENSES } from "@/lib/mock-data";

/**
 * useCreateExpense — Handles the POST /api/expenses flow.
 *
 * Features:
 *  - Generates idempotencyKey on mount (UUID v4 via crypto.randomUUID).
 *  - Preserves the same key on network error (retry-safe).
 *  - Regenerates key only after a successful create.
 *  - Returns loading/error/success states for the form.
 *
 * In Phase 8: replace the mock `submitExpense()` with a real fetch to
 * `POST /api/expenses`.
 */

// ── Internal submitter (swap for real fetch in Phase 8) ───

let _mockNextId = MOCK_EXPENSES.length + 1;

async function submitExpense(payload: CreateExpensePayload): Promise<Expense> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const paise = parseAmountToPaise(payload.amount);
  if (!paise) throw new Error("Invalid amount");

  // Simulate idempotency: return existing if key already used
  const existing = MOCK_EXPENSES.find(
    (e) => e.idempotencyKey === payload.idempotencyKey
  );
  if (existing) return existing;

  // Build and push new mock expense
  const newExpense: Expense = {
    id: `exp_${String(_mockNextId).padStart(2, "0")}`,
    amount: paise,
    amountFormatted: formatCurrency(paise),
    category: payload.category,
    description: payload.description,
    date: payload.date,
    createdAt: new Date().toISOString(),
    idempotencyKey: payload.idempotencyKey,
  };

  MOCK_EXPENSES.unshift(newExpense); // prepend so it appears at top
  _mockNextId++;

  return newExpense;
}

// ── Hook ──────────────────────────────────────────────────

interface UseCreateExpenseReturn {
  /** Submit a new expense — returns the created Expense or throws */
  create: (payload: Omit<CreateExpensePayload, "idempotencyKey">) => Promise<Expense>;
  /** true while the POST is in-flight */
  isSubmitting: boolean;
  /** Error message from the last failed submit, null otherwise */
  submitError: string | null;
  /** Clear the last error (call when user starts editing the form again) */
  clearError: () => void;
  /** The current idempotency key (UUID v4) — regenerated after each success */
  idempotencyKey: string;
}

export function useCreateExpense(): UseCreateExpenseReturn {
  // Generate initial idempotency key on hook mount
  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const create = useCallback(
    async (
      payload: Omit<CreateExpensePayload, "idempotencyKey">
    ): Promise<Expense> => {
      setIsSubmitting(true);
      setSubmitError(null);

      const fullPayload: CreateExpensePayload = {
        ...payload,
        idempotencyKey: idempotencyKeyRef.current,
      };

      try {
        const expense = await submitExpense(fullPayload);

        // Success → regenerate key so next submission is fresh
        idempotencyKeyRef.current = crypto.randomUUID();

        return expense;
      } catch (err: unknown) {
        // Network error → keep same key (retry-safe)
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setSubmitError(message);
        throw err; // re-throw so the form can react
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setSubmitError(null);
  }, []);

  return {
    create,
    isSubmitting,
    submitError,
    clearError,
    idempotencyKey: idempotencyKeyRef.current,
  };
}
