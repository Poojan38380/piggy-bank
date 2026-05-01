/**
 * PiggyBank — Money Utilities
 *
 * Rules (non-negotiable):
 *  - Money is ALWAYS stored and summed as integer paise (1 INR = 100 paise).
 *  - Never use JavaScript floats for money arithmetic.
 *  - All formatting uses Intl.NumberFormat with 'en-IN' locale.
 */

const INR_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ── Conversion ─────────────────────────────────────────────

/**
 * Converts a decimal rupee string (user input) to integer paise.
 * Returns null if the input is invalid.
 *
 * @example
 * parseAmountToPaise("149.99") // → 14999
 * parseAmountToPaise("100")    // → 10000
 * parseAmountToPaise("0.1")    // → 10
 * parseAmountToPaise("-1")     // → null (negative)
 * parseAmountToPaise("abc")    // → null (not a number)
 */
export function parseAmountToPaise(input: string): number | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();
  if (trimmed === "") return null;

  // Only allow valid decimal numbers (digits, optional single dot, up to 2 decimals)
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;

  const float = parseFloat(trimmed);

  if (isNaN(float)) return null;
  if (float < 0) return null;
  if (float === 0) return null; // expenses must be > 0

  // Use Math.round to avoid float drift (e.g. 149.99 * 100 = 14998.999...)
  return Math.round(float * 100);
}

/**
 * Converts integer paise to decimal rupees (for display math only).
 * Do NOT use this for arithmetic — always work in paise.
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

// ── Formatting ─────────────────────────────────────────────

/**
 * Formats integer paise as a human-readable INR string.
 * @example formatCurrency(14999) → "₹149.99"
 * @example formatCurrency(0)     → "₹0.00"
 */
export function formatCurrency(paise: number): string {
  return INR_FORMATTER.format(paiseToRupees(paise));
}

/**
 * Formats a decimal rupee number as a human-readable INR string.
 * Use only when you already have rupees (e.g. from a trusted API response).
 * @example formatRupees(149.99) → "₹149.99"
 */
export function formatRupees(rupees: number): string {
  return INR_FORMATTER.format(rupees);
}

// ── Arithmetic ─────────────────────────────────────────────

/**
 * Sums an array of integer paise values.
 * Always use this instead of .reduce() + arithmetic to keep intent explicit.
 * @example sumPaise([10000, 4999]) → 14999
 */
export function sumPaise(items: number[]): number {
  return items.reduce((acc, val) => acc + val, 0);
}

// ── Validation ─────────────────────────────────────────────

/**
 * Returns true if the string is a valid, positive rupee amount
 * with at most 2 decimal places.
 */
export function isValidAmount(input: string): boolean {
  return parseAmountToPaise(input) !== null;
}

/**
 * Returns a user-facing error message for an invalid amount input,
 * or undefined if valid.
 */
export function getAmountError(input: string): string | undefined {
  const trimmed = input.trim();
  if (trimmed === "") return "Amount is required";
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return "Enter a valid amount (e.g. 149.99)";
  const float = parseFloat(trimmed);
  if (float <= 0) return "Amount must be greater than ₹0";
  if (float > 10_000_000) return "Amount seems too large — please check";
  return undefined;
}
