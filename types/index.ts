/**
 * PiggyBank — Shared TypeScript Types
 * Used across frontend hooks, components, and API route handlers.
 */

// ── Expense ────────────────────────────────────────────────

export interface Expense {
  id: string;
  /** Amount in integer paise (e.g. 14999 = ₹149.99). Never a float. */
  amount: number;
  /** Pre-formatted display string, e.g. "₹149.99" — computed server-side */
  amountFormatted: string;
  category: string;
  description: string;
  /** ISO date string "YYYY-MM-DD" — user-entered transaction date */
  date: string;
  /** ISO timestamp — server-generated creation time */
  createdAt: string;
  /** UUID v4 generated client-side before submit. Used for idempotency. */
  idempotencyKey: string;
}

// ── Category ───────────────────────────────────────────────

// BUG-7 FIX: Canonical name is "Transport" — not "Travel".
// DESIGN.md had "Travel" but code everywhere uses "Transport". Standardized to "Transport".
export type PresetCategory =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Bills"
  | "Health"
  | "Entertainment"
  | "Education"
  | "Other";

// ── Filters ────────────────────────────────────────────────

export interface ExpenseFilters {
  /** null = "All categories" */
  category: string | null;
  /** true = newest first (default) */
  sortDesc: boolean;
}

// ── API Response Wrappers ──────────────────────────────────

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      error?: never;
      idempotent?: boolean;
    }
  | {
      success: false;
      data?: never;
      error: string;
      details?: Array<{ field: string; message: string }>;
    };

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
}

// ── Expense List API Meta ──────────────────────────────────

export interface ExpenseMeta {
  /** Count of returned items (after filter applied) */
  total: number;
  /** Sum of returned items in paise */
  visibleTotal: number;
  /** Pre-formatted total, e.g. "₹12,450.00" */
  visibleTotalFormatted: string;
  /** The active category filter, or null if "All" */
  filteredBy: string | null;
}

// ── Expense List API Response ──────────────────────────────

export interface ExpenseListResponse {
  items: Expense[];
  meta: ExpenseMeta;
}

// ── Create Expense API ─────────────────────────────────────

export interface CreateExpensePayload {
  /** Decimal rupee string, e.g. "149.99" */
  amount: string;
  category: string;
  description: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** UUID v4 */
  idempotencyKey: string;
}

export interface CreateExpenseResponse {
  expense: Expense;
}
