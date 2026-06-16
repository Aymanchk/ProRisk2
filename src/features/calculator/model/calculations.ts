import {
  CRYPTO_MAINTENANCE_MARGIN_RATE,
  FOREX_CONTRACT_SIZE,
  FOREX_PIP_SIZE,
} from "./constants";
import type {
  Direction,
  PositionInput,
  PositionResult,
  StopMode,
  ValidationErrors,
} from "./types";

const isLong = (direction: Direction) => direction === "long";

/** Resolve the absolute stop-loss price from the active input mode. */
export function resolveStopPrice(params: {
  mode: StopMode;
  direction: Direction;
  entryPrice: number;
  /** "numbers" mode — used directly. */
  stopPrice: number;
  /** "percent" mode — offset from entry in %. */
  stopPercent: number;
  /** "atr" mode — ATR value for the chosen timeframe. */
  atr: number;
  atrMultiplier: number;
}): number {
  const { mode, direction, entryPrice, stopPrice, stopPercent, atr, atrMultiplier } =
    params;
  const long = isLong(direction);

  switch (mode) {
    case "numbers":
      return stopPrice;
    case "percent": {
      const factor = stopPercent / 100;
      return long ? entryPrice * (1 - factor) : entryPrice * (1 + factor);
    }
    case "atr": {
      const offset = atr * atrMultiplier;
      return long ? entryPrice - offset : entryPrice + offset;
    }
  }
}

/** Take-profit price for a given reward:risk ratio. */
export function resolveTakeProfit(params: {
  direction: Direction;
  entryPrice: number;
  stopPrice: number;
  ratio: number;
}): number {
  const { direction, entryPrice, stopPrice, ratio } = params;
  const riskPerUnit = Math.abs(entryPrice - stopPrice);
  return isLong(direction)
    ? entryPrice + ratio * riskPerUnit
    : entryPrice - ratio * riskPerUnit;
}

/** Reward:risk implied by an explicit take-profit price (for the dropdown label). */
export function impliedRatio(params: {
  entryPrice: number;
  stopPrice: number;
  takeProfitPrice: number;
}): number {
  const { entryPrice, stopPrice, takeProfitPrice } = params;
  const riskPerUnit = Math.abs(entryPrice - stopPrice);
  if (riskPerUnit === 0) return 0;
  return Math.abs(takeProfitPrice - entryPrice) / riskPerUnit;
}

/** Blocking validation. Returns a map of field -> i18n error key. */
export function validatePosition(params: {
  direction: Direction;
  entryPrice: number;
  stopPrice: number;
  takeProfitPrice: number;
}): ValidationErrors {
  const { direction, entryPrice, stopPrice, takeProfitPrice } = params;
  const errors: ValidationErrors = {};

  if (!Number.isFinite(entryPrice) || entryPrice <= 0) errors.entryPrice = "positive";
  if (!Number.isFinite(stopPrice) || stopPrice <= 0) errors.stopPrice = "positive";
  if (!Number.isFinite(takeProfitPrice) || takeProfitPrice <= 0)
    errors.takeProfitPrice = "positive";

  // Relationship checks only once both prices are valid positive numbers.
  if (!errors.entryPrice && !errors.stopPrice) {
    if (stopPrice === entryPrice) {
      errors.stopPrice = "stopEqualsEntry";
    } else if (isLong(direction) && stopPrice > entryPrice) {
      errors.stopPrice = "stopAboveEntryLong";
    } else if (!isLong(direction) && stopPrice < entryPrice) {
      errors.stopPrice = "stopBelowEntryShort";
    }
  }

  return errors;
}

const EMPTY_RESULT: PositionResult = {
  riskPerUnit: 0,
  quantity: 0,
  risk: 0,
  profit: 0,
  notional: 0,
  margin: 0,
  liquidationPrice: null,
  pipValue: null,
};

/**
 * Core position-sizing math. Assumes inputs are valid (see `validatePosition`).
 * Profit is signed by direction, so a wrong-side take-profit yields a negative
 * value rather than throwing.
 */
export function computePosition(input: PositionInput): PositionResult {
  const { market, direction, entryPrice, stopPrice, takeProfitPrice, riskAmount, leverage } =
    input;

  const riskPerUnit = Math.abs(entryPrice - stopPrice);
  if (riskPerUnit <= 0 || !Number.isFinite(riskPerUnit)) {
    return EMPTY_RESULT;
  }

  const dirSign = isLong(direction) ? 1 : -1;
  const signedMove = dirSign * (takeProfitPrice - entryPrice);

  if (market === "forex") {
    const units = riskAmount / riskPerUnit; // base-currency units
    const lots = units / FOREX_CONTRACT_SIZE;
    return {
      riskPerUnit,
      quantity: lots,
      risk: units * riskPerUnit,
      profit: units * signedMove,
      notional: units * entryPrice,
      margin: leverage > 0 ? (units * entryPrice) / leverage : units * entryPrice,
      liquidationPrice: null,
      pipValue: units * FOREX_PIP_SIZE,
    };
  }

  // Stocks & crypto: size in units, whole shares for stocks.
  const rawQuantity = riskAmount / riskPerUnit;
  const quantity = market === "stocks" ? Math.floor(rawQuantity) : rawQuantity;
  const notional = quantity * entryPrice;

  let liquidationPrice: number | null = null;
  if (market === "crypto" && leverage > 0) {
    liquidationPrice = isLong(direction)
      ? entryPrice * (1 - 1 / leverage + CRYPTO_MAINTENANCE_MARGIN_RATE)
      : entryPrice * (1 + 1 / leverage - CRYPTO_MAINTENANCE_MARGIN_RATE);
  }

  return {
    riskPerUnit,
    quantity,
    risk: quantity * riskPerUnit,
    profit: quantity * signedMove,
    notional,
    margin: leverage > 0 ? notional / leverage : notional,
    liquidationPrice,
    pipValue: null,
  };
}
