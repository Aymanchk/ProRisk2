import type {
  AtrTimeframe,
  Direction,
  MarketKind,
  StopMode,
  TakeProfitRatio,
} from "./types";

/** Account defaults that drive `riskAmount` (configurable via the gear popover). */
export const DEFAULT_DEPOSIT = 10_000;
export const DEFAULT_RISK_PERCENT = 1;

/** Forex conventions (1 standard lot, non-JPY pip). */
export const FOREX_CONTRACT_SIZE = 100_000;
export const FOREX_PIP_SIZE = 0.0001;

/**
 * Crypto liquidation estimate uses an isolated-margin model with a flat
 * maintenance-margin rate. Real exchanges use tiered rates — see README.
 */
export const CRYPTO_MAINTENANCE_MARGIN_RATE = 0.005;

/** Per-market default leverage. Forex value is the 1:N denominator. */
export const DEFAULT_LEVERAGE: Record<MarketKind, number> = {
  stocks: 2,
  crypto: 10,
  forex: 100,
};

export const TAKE_PROFIT_RATIOS: readonly TakeProfitRatio[] = [1, 1.5, 2, 3, 4];
export const DEFAULT_TAKE_PROFIT_RATIO: TakeProfitRatio = 2;

export const STOP_MODES: readonly StopMode[] = ["numbers", "percent", "atr"];
export const DIRECTIONS: readonly Direction[] = ["long", "short"];

export const ATR_TIMEFRAMES: readonly AtrTimeframe[] = ["1m", "5m", "15m", "1h", "1d"];
export const DEFAULT_ATR_TIMEFRAME: AtrTimeframe = "1m";
export const ATR_PERIOD = 10;
export const DEFAULT_ATR_MULTIPLIER = 1.5;

/**
 * Mock ATR values per market and timeframe. No live quote feed is wired, so
 * these stand in for indicator data (documented in README).
 */
export const MOCK_ATR: Record<MarketKind, Record<AtrTimeframe, number>> = {
  stocks: { "1m": 0.35, "5m": 0.9, "15m": 1.6, "1h": 3.2, "1d": 8.4 },
  crypto: { "1m": 95, "5m": 240, "15m": 480, "1h": 950, "1d": 2600 },
  forex: { "1m": 0.0006, "5m": 0.0012, "15m": 0.0021, "1h": 0.0045, "1d": 0.012 },
};

/** Seed values per market so the panel opens pre-filled like the Figma. */
export const MARKET_DEFAULTS: Record<
  MarketKind,
  { entryPrice: number; stopPrice: number; stopPercent: number; priceChange: number }
> = {
  stocks: { entryPrice: 175.4, stopPrice: 170.4, stopPercent: 2.85, priceChange: 0 },
  crypto: { entryPrice: 67_420, stopPrice: 66_420, stopPercent: 1.48, priceChange: -0.061 },
  forex: { entryPrice: 1.0845, stopPrice: 1.0825, stopPercent: 0.18, priceChange: 0 },
};

/** Decimal places used for price inputs/labels per market. */
export const PRICE_DECIMALS: Record<MarketKind, number> = {
  stocks: 2,
  crypto: 0,
  forex: 5,
};
