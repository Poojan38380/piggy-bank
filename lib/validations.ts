import { z } from "zod";

/**
 * PiggyBank — Zod Validation Schemas
 * Shared between frontend (client-side validation) and API route handlers.
 * Import from here — never duplicate schema logic.
 *
 * NOTE: Uses Zod v4 API. The `required_error` option was removed in v4;
 * use `error` or rely on `.min(1, msg)` for empty-string checks.
 */

// ── Create Expense ─────────────────────────────────────────

/**
 * Schema for the POST /api/expenses request body.
 * - amount: decimal string "149.99" (converted to paise server-side)
 * - category: preset or custom (max 50 chars)
 * - description: required, max 200 chars
 * - date: ISO date string "YYYY-MM-DD"
 * - idempotencyKey: UUID v4 generated client-side
 */
export const createExpenseSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Enter a valid amount (e.g. 149.99)"
    )
    .refine(
      (val) => parseFloat(val) > 0,
      "Amount must be greater than ₹0"
    )
    .refine(
      (val) => parseFloat(val) <= 10_000_000,
      "Amount seems too large — please check"
    ),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category name too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description must be under 200 characters"),

  date: z
    .string()
    .min(1, "Date is required")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date must be in YYYY-MM-DD format"
    )
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime());
    }, "Date is not valid"),

  idempotencyKey: z
    .string()
    .uuid("idempotencyKey must be a valid UUID v4"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

// ── GET Expenses Query Params ──────────────────────────────

/**
 * Schema for GET /api/expenses query parameters.
 */
export const listExpensesSchema = z.object({
  category: z.string().trim().max(50).optional(),
  sortDesc: z
    .string()
    .optional()
    .transform((val) => val !== "false"), // default true
});

export type ListExpensesQuery = z.infer<typeof listExpensesSchema>;

// ── Client-side Form Validation ────────────────────────────

/**
 * Lightweight client-side form schema (no idempotencyKey — handled internally).
 * Used in ExpenseForm before calling the API.
 */
export const expenseFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount (e.g. 149.99)")
    .refine((val) => parseFloat(val) > 0, "Amount must be greater than ₹0"),

  category: z
    .string()
    .trim()
    .min(1, "Category is required")
    .max(50, "Category name too long"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(200, "Description must be under 200 characters"),

  date: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
