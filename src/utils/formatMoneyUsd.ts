/**
 * Format số tiền theo USD (ví dụ: $1,234.56).
 * Dùng tạm cho dashboard charts; sau có thể mở rộng theo locale/currency.
 */
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number | string | undefined | null): string {
  const n = typeof value === "number" ? value : Number(value ?? 0);
  if (!Number.isFinite(n)) return usdFormatter.format(0);
  return usdFormatter.format(n);
}
