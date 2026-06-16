/** Three market variants from the Figma right rail. */
export type MarketKind = "stocks" | "crypto" | "forex";

/** Position direction. Forex reuses the same values, labelled Buy/Sell in the UI. */
export type Direction = "long" | "short";

/** How the stop loss is entered. */
export type StopMode = "numbers" | "percent" | "atr";

/** Reward-to-risk presets shown in the take-profit dropdown (e.g. "2:1"). */
export type TakeProfitRatio = 1 | 1.5 | 2 | 3 | 4;

/** ATR timeframe options. */
export type AtrTimeframe = "1m" | "5m" | "15m" | "1h" | "1d";

/** Resolved, validated inputs handed to the pure calculation core. */
export interface PositionInput {
  market: MarketKind;
  direction: Direction;
  entryPrice: number;
  stopPrice: number;
  takeProfitPrice: number;
  /** Money at risk = deposit * riskPercent / 100. */
  riskAmount: number;
  /** x for crypto/stocks; denominator of 1:N for forex. */
  leverage: number;
}

/** Output of the calculation core. Market-specific fields are nullable. */
export interface PositionResult {
  riskPerUnit: number;
  /** shares (stocks) · coins (crypto) · lots (forex). */
  quantity: number;
  risk: number;
  profit: number;
  /** Gross notional value of the position (stocks/crypto). */
  notional: number;
  /** Required margin (forex). */
  margin: number;
  /** Crypto only — estimated liquidation price. */
  liquidationPrice: number | null;
  /** Forex only — value of one pip for the whole position. */
  pipValue: number | null;
}

export type ValidationField = "entryPrice" | "stopPrice" | "takeProfitPrice";

/** i18n message keys under `errors.*`. */
export type ValidationErrorKey =
  | "required"
  | "positive"
  | "stopEqualsEntry"
  | "stopAboveEntryLong"
  | "stopBelowEntryShort";

export type ValidationErrors = Partial<Record<ValidationField, ValidationErrorKey>>;
