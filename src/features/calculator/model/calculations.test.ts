import { describe, expect, it } from "vitest";
import {
  computePosition,
  impliedRatio,
  resolveStopPrice,
  resolveTakeProfit,
  validatePosition,
} from "./calculations";

describe("resolveStopPrice", () => {
  it("returns the raw price in numbers mode", () => {
    expect(
      resolveStopPrice({
        mode: "numbers",
        direction: "long",
        entryPrice: 100,
        stopPrice: 95,
        stopPercent: 0,
        atr: 0,
        atrMultiplier: 0,
      }),
    ).toBe(95);
  });

  it("computes a percent offset below entry for long, above for short", () => {
    const base = { mode: "percent" as const, entryPrice: 100, stopPrice: 0, stopPercent: 2, atr: 0, atrMultiplier: 0 };
    expect(resolveStopPrice({ ...base, direction: "long" })).toBeCloseTo(98);
    expect(resolveStopPrice({ ...base, direction: "short" })).toBeCloseTo(102);
  });

  it("computes an ATR offset using the multiplier", () => {
    const base = { mode: "atr" as const, entryPrice: 100, stopPrice: 0, stopPercent: 0, atr: 2, atrMultiplier: 1.5 };
    expect(resolveStopPrice({ ...base, direction: "long" })).toBeCloseTo(97);
    expect(resolveStopPrice({ ...base, direction: "short" })).toBeCloseTo(103);
  });
});

describe("resolveTakeProfit / impliedRatio", () => {
  it("derives TP from a reward:risk ratio (round-trips with impliedRatio)", () => {
    const tp = resolveTakeProfit({ direction: "long", entryPrice: 175.4, stopPrice: 170.4, ratio: 2 });
    expect(tp).toBeCloseTo(185.4);
    expect(impliedRatio({ entryPrice: 175.4, stopPrice: 170.4, takeProfitPrice: tp })).toBeCloseTo(2);
  });

  it("places TP below entry for a short", () => {
    expect(resolveTakeProfit({ direction: "short", entryPrice: 100, stopPrice: 105, ratio: 3 })).toBeCloseTo(85);
  });
});

describe("validatePosition", () => {
  const ok = { direction: "long" as const, entryPrice: 100, stopPrice: 95, takeProfitPrice: 110 };

  it("passes for a valid long setup", () => {
    expect(validatePosition(ok)).toEqual({});
  });

  it("flags non-positive prices", () => {
    expect(validatePosition({ ...ok, entryPrice: 0 }).entryPrice).toBe("positive");
  });

  it("flags stop equal to entry", () => {
    expect(validatePosition({ ...ok, stopPrice: 100 }).stopPrice).toBe("stopEqualsEntry");
  });

  it("flags a stop on the wrong side for long and short", () => {
    expect(validatePosition({ ...ok, stopPrice: 105 }).stopPrice).toBe("stopAboveEntryLong");
    expect(
      validatePosition({ direction: "short", entryPrice: 100, stopPrice: 95, takeProfitPrice: 90 }).stopPrice,
    ).toBe("stopBelowEntryShort");
  });
});

describe("computePosition — stocks", () => {
  it("reproduces the Figma example: 20 whole shares, $3 508 notional, $200 profit", () => {
    const r = computePosition({
      market: "stocks",
      direction: "long",
      entryPrice: 175.4,
      stopPrice: 170.4,
      takeProfitPrice: 185.4,
      riskAmount: 100,
      leverage: 2,
    });
    expect(r.quantity).toBe(20);
    expect(r.risk).toBeCloseTo(100);
    expect(r.profit).toBeCloseTo(200);
    expect(r.notional).toBeCloseTo(3508);
  });

  it("rounds shares down (never risks more than the budget)", () => {
    const r = computePosition({
      market: "stocks",
      direction: "long",
      entryPrice: 100,
      stopPrice: 97,
      takeProfitPrice: 110,
      riskAmount: 100,
      leverage: 1,
    });
    expect(r.quantity).toBe(33); // floor(100 / 3)
    expect(r.risk).toBeLessThanOrEqual(100);
  });
});

describe("computePosition — crypto", () => {
  it("keeps fractional size and estimates a liquidation price below entry for a long", () => {
    const r = computePosition({
      market: "crypto",
      direction: "long",
      entryPrice: 67_420,
      stopPrice: 66_420,
      takeProfitPrice: 69_420,
      riskAmount: 100,
      leverage: 10,
    });
    expect(r.quantity).toBeCloseTo(0.1);
    expect(r.profit).toBeCloseTo(200);
    expect(r.liquidationPrice).not.toBeNull();
    expect(r.liquidationPrice!).toBeLessThan(67_420);
    // entry * (1 - 1/10 + 0.005)
    expect(r.liquidationPrice!).toBeCloseTo(61_015.1);
  });
});

describe("computePosition — forex", () => {
  it("reproduces the Figma example: 0.50 lots, ~$542 margin, $5/pip", () => {
    const r = computePosition({
      market: "forex",
      direction: "long",
      entryPrice: 1.0845,
      stopPrice: 1.0825, // 20 pips
      takeProfitPrice: 1.0885,
      riskAmount: 100,
      leverage: 100,
    });
    expect(r.quantity).toBeCloseTo(0.5);
    expect(r.margin).toBeCloseTo(542.25, 1);
    expect(r.pipValue).toBeCloseTo(5);
    expect(r.profit).toBeCloseTo(200);
  });
});
