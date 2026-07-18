/* ------------------------------------------------------------------ */
/*  Shared safe-formatting utilities for all pages                      */
/* ------------------------------------------------------------------ */

/** Format a number as BDT currency (৳). Falls back to "৳0.00". */
export function formatCurrency(amount: number | null | undefined): string {
  const safe = typeof amount === "number" && isFinite(amount) ? amount : 0;
  return `৳${safe.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Format a ratio (0–1) as a percentage string. Falls back to "0%". */
export function formatPercent(value: number | null | undefined): string {
  const safe = typeof value === "number" && isFinite(value) ? value : 0;
  return `${(safe * 100).toFixed(1)}%`;
}

/** Return `value` if it is a non-empty array, otherwise `fallback`. */
export function safeArray<T>(value: T[] | null | undefined, fallback: T[] = []): T[] {
  return Array.isArray(value) && value.length > 0 ? value : fallback;
}
