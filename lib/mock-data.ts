/**
 * PiggyBank — Mock Data
 * 10 realistic expenses across 5 categories for frontend development.
 *
 * ⚠️  REMOVE THIS FILE in Phase 8 when wiring to the real API.
 *     Replace useExpenses and useCategories with real fetch calls.
 */

import type { Expense, ExpenseMeta } from "@/types";
import { formatCurrency, sumPaise } from "@/lib/money";

// ── Mock Expenses ──────────────────────────────────────────

export const MOCK_EXPENSES: Expense[] = [
  {
    id: "exp_01",
    amount: 425000,                         // ₹4,250.00
    amountFormatted: formatCurrency(425000),
    category: "Food",
    description: "Dinner at The Ivy",
    date: "2026-05-01",
    createdAt: "2026-05-01T20:30:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000001",
  },
  {
    id: "exp_02",
    amount: 180000,                         // ₹1,800.00
    amountFormatted: formatCurrency(180000),
    category: "Transport",
    description: "Uber to Airport",
    date: "2026-04-30",
    createdAt: "2026-04-30T10:15:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000002",
  },
  {
    id: "exp_03",
    amount: 315000,                         // ₹3,150.00
    amountFormatted: formatCurrency(315000),
    category: "Bills",
    description: "Electricity Bill — April",
    date: "2026-04-28",
    createdAt: "2026-04-28T09:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000003",
  },
  {
    id: "exp_04",
    amount: 325000,                         // ₹3,250.00
    amountFormatted: formatCurrency(325000),
    category: "Shopping",
    description: "Groceries — weekly",
    date: "2026-04-26",
    createdAt: "2026-04-26T18:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000004",
  },
  {
    id: "exp_05",
    amount: 85000,                          // ₹850.00
    amountFormatted: formatCurrency(85000),
    category: "Food",
    description: "Bistro Lunch",
    date: "2026-04-25",
    createdAt: "2026-04-25T13:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000005",
  },
  {
    id: "exp_06",
    amount: 32000,                          // ₹320.00
    amountFormatted: formatCurrency(32000),
    category: "Transport",
    description: "Uber Ride — office",
    date: "2026-04-24",
    createdAt: "2026-04-24T09:30:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000006",
  },
  {
    id: "exp_07",
    amount: 245000,                         // ₹2,450.00
    amountFormatted: formatCurrency(245000),
    category: "Bills",
    description: "Internet & OTT subscriptions",
    date: "2026-04-22",
    createdAt: "2026-04-22T12:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000007",
  },
  {
    id: "exp_08",
    amount: 189900,                         // ₹1,899.00
    amountFormatted: formatCurrency(189900),
    category: "Health",
    description: "Pharmacy — monthly meds",
    date: "2026-04-20",
    createdAt: "2026-04-20T11:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000008",
  },
  {
    id: "exp_09",
    amount: 599900,                         // ₹5,999.00
    amountFormatted: formatCurrency(599900),
    category: "Shopping",
    description: "Running shoes — Nike",
    date: "2026-04-18",
    createdAt: "2026-04-18T17:30:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000009",
  },
  {
    id: "exp_10",
    amount: 149900,                         // ₹1,499.00
    amountFormatted: formatCurrency(149900),
    category: "Entertainment",
    description: "Concert tickets — The Local Train",
    date: "2026-04-15",
    createdAt: "2026-04-15T19:00:00.000Z",
    idempotencyKey: "00000000-0000-0000-0000-000000000010",
  },
];

// ── Mock Helper: Filter + Meta ─────────────────────────────

/**
 * Returns filtered expenses and computed meta for a given category filter.
 * Mirrors the server response shape exactly so switching to real API is a drop-in.
 */
export function getMockExpenses(category: string | null): {
  items: Expense[];
  meta: ExpenseMeta;
} {
  const items =
    category && category !== "all"
      ? MOCK_EXPENSES.filter((e) => e.category === category)
      : [...MOCK_EXPENSES];

  // Always sorted newest-first
  items.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const visibleTotal = sumPaise(items.map((e) => e.amount));

  return {
    items,
    meta: {
      total: items.length,
      visibleTotal,
      visibleTotalFormatted: formatCurrency(visibleTotal),
      filteredBy: category,
    },
  };
}

/** All distinct categories from mock data (sorted, deduped). */
export const MOCK_CATEGORIES: string[] = [
  ...new Set(MOCK_EXPENSES.map((e) => e.category)),
].sort();
