/**
 * Number parsing/formatting helpers shared by the store (parsing) and the UI
 * (locale-aware display). Kept framework-free so they're unit-testable.
 */

/** Parse a user-typed string into a number. Accepts spaces and a comma decimal. */
export function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(",", ".");
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return NaN;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

export interface Formatters {
  /** "$ 3 508" — currency with locale grouping and a leading symbol. */
  money: (value: number, decimals?: number) => string;
  /** Plain number with a fixed number of decimals (prices). */
  price: (value: number, decimals: number) => string;
  /** Number with a flexible fraction range (quantities). */
  decimal: (value: number, min?: number, max?: number) => string;
  /** Signed percent, e.g. "-0.061". */
  signed: (value: number, decimals: number) => string;
}

/** Build a set of formatters bound to a locale. */
export function createFormatters(locale: string): Formatters {
  const money = (value: number, decimals = 0) => {
    if (!Number.isFinite(value)) return "—";
    const num = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
    return `$ ${num}`;
  };

  const price = (value: number, decimals: number) => {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const decimal = (value: number, min = 0, max = 8) => {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(value);
  };

  const signed = (value: number, decimals: number) => {
    if (!Number.isFinite(value)) return "—";
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay: "exceptZero",
    }).format(value);
    return formatted;
  };

  return { money, price, decimal, signed };
}
