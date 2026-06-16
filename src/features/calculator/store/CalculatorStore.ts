import { makeAutoObservable, runInAction } from "mobx";
import { parseNumericInput } from "@/shared/lib/format";
import {
  computePosition,
  impliedRatio,
  resolveStopPrice,
  resolveTakeProfit,
  validatePosition,
} from "../model/calculations";
import {
  DEFAULT_ATR_MULTIPLIER,
  DEFAULT_ATR_TIMEFRAME,
  DEFAULT_DEPOSIT,
  DEFAULT_LEVERAGE,
  DEFAULT_RISK_PERCENT,
  DEFAULT_TAKE_PROFIT_RATIO,
  MARKET_DEFAULTS,
  MOCK_ATR,
  PRICE_DECIMALS,
} from "../model/constants";
import type {
  AtrTimeframe,
  Direction,
  MarketKind,
  PositionResult,
  StopMode,
  TakeProfitRatio,
  ValidationErrors,
} from "../model/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Non-grouped string for editable fields, e.g. 175.4 -> "175.40". */
const toRawString = (value: number, decimals: number) =>
  Number.isFinite(value) ? value.toFixed(decimals) : "";

/**
 * Drives the risk calculator. Holds raw field strings (so partial input is
 * preserved) and exposes parsed numbers + derived results as MobX computeds.
 */
export class CalculatorStore {
  market: MarketKind = "stocks";
  direction: Direction = "long";

  entryRaw = "";
  stopRaw = "";
  stopPercentRaw = "";

  stopMode: StopMode = "numbers";
  atrTimeframe: AtrTimeframe = DEFAULT_ATR_TIMEFRAME;
  atrMultiplier = DEFAULT_ATR_MULTIPLIER;

  takeProfitRaw = "";
  takeProfitRatio: TakeProfitRatio = DEFAULT_TAKE_PROFIT_RATIO;
  /** True while the TP price is being kept in sync with the chosen ratio. */
  tpFromRatio = true;

  deposit = DEFAULT_DEPOSIT;
  riskPercent = DEFAULT_RISK_PERCENT;
  leverage = DEFAULT_LEVERAGE.stocks;

  isSubmitting = false;
  isLoadingMarket = false;
  justActivated = false;

  constructor(initialMarket: MarketKind = "stocks") {
    this.market = initialMarket;
    makeAutoObservable(this, {}, { autoBind: true });
    this.applyMarketDefaults(initialMarket);
  }

  // --- parsed inputs ---------------------------------------------------------

  get entryPrice() {
    return parseNumericInput(this.entryRaw);
  }

  get stopInputPrice() {
    return parseNumericInput(this.stopRaw);
  }

  get stopPercent() {
    return parseNumericInput(this.stopPercentRaw);
  }

  get atrValue() {
    return MOCK_ATR[this.market][this.atrTimeframe];
  }

  get resolvedStopPrice() {
    return resolveStopPrice({
      mode: this.stopMode,
      direction: this.direction,
      entryPrice: this.entryPrice,
      stopPrice: this.stopInputPrice,
      stopPercent: this.stopPercent,
      atr: this.atrValue,
      atrMultiplier: this.atrMultiplier,
    });
  }

  get takeProfitPrice() {
    return parseNumericInput(this.takeProfitRaw);
  }

  get riskAmount() {
    return (this.deposit * this.riskPercent) / 100;
  }

  get priceDecimals() {
    return PRICE_DECIMALS[this.market];
  }

  get priceChange() {
    return MARKET_DEFAULTS[this.market].priceChange;
  }

  get isStopEditable() {
    return this.stopMode === "numbers";
  }

  /** Reward:risk to show in the dropdown (preset, or implied from a manual TP). */
  get displayedRatio() {
    if (this.tpFromRatio) return this.takeProfitRatio;
    return impliedRatio({
      entryPrice: this.entryPrice,
      stopPrice: this.resolvedStopPrice,
      takeProfitPrice: this.takeProfitPrice,
    });
  }

  // --- validation & results --------------------------------------------------

  get errors(): ValidationErrors {
    return validatePosition({
      direction: this.direction,
      entryPrice: this.entryPrice,
      stopPrice: this.resolvedStopPrice,
      takeProfitPrice: this.takeProfitPrice,
    });
  }

  get isValid() {
    return Object.keys(this.errors).length === 0 && this.riskAmount > 0;
  }

  get result(): PositionResult {
    return computePosition({
      market: this.market,
      direction: this.direction,
      entryPrice: this.entryPrice,
      stopPrice: this.resolvedStopPrice,
      takeProfitPrice: this.takeProfitPrice,
      riskAmount: this.riskAmount,
      leverage: this.leverage,
    });
  }

  // --- actions ---------------------------------------------------------------

  setMarket(market: MarketKind) {
    if (market === this.market) return;
    this.market = market;
    this.applyMarketDefaults(market);
    // Simulate fetching fresh quotes for the new market (skeleton state).
    this.isLoadingMarket = true;
    void this.finishMarketLoading();
  }

  private async finishMarketLoading() {
    await delay(450);
    runInAction(() => {
      this.isLoadingMarket = false;
    });
  }

  private applyMarketDefaults(market: MarketKind) {
    const defaults = MARKET_DEFAULTS[market];
    const decimals = PRICE_DECIMALS[market];
    this.entryRaw = toRawString(defaults.entryPrice, decimals);
    this.stopRaw = toRawString(defaults.stopPrice, decimals);
    this.stopPercentRaw = String(defaults.stopPercent);
    this.leverage = DEFAULT_LEVERAGE[market];
    this.tpFromRatio = true;
    this.recalcTakeProfit();
  }

  /** Recompute the TP price from the active ratio while the link is on. */
  private recalcTakeProfit() {
    if (!this.tpFromRatio) return;
    const tp = resolveTakeProfit({
      direction: this.direction,
      entryPrice: this.entryPrice,
      stopPrice: this.resolvedStopPrice,
      ratio: this.takeProfitRatio,
    });
    this.takeProfitRaw = Number.isFinite(tp) ? toRawString(tp, this.priceDecimals) : "";
  }

  setDirection(direction: Direction) {
    this.direction = direction;
    this.recalcTakeProfit();
  }

  setStopMode(mode: StopMode) {
    this.stopMode = mode;
    this.recalcTakeProfit();
  }

  setAtrTimeframe(timeframe: AtrTimeframe) {
    this.atrTimeframe = timeframe;
    this.recalcTakeProfit();
  }

  setEntryRaw(value: string) {
    this.entryRaw = value;
    this.recalcTakeProfit();
  }

  setStopRaw(value: string) {
    this.stopRaw = value;
    this.recalcTakeProfit();
  }

  setStopPercentRaw(value: string) {
    this.stopPercentRaw = value;
    this.recalcTakeProfit();
  }

  setTakeProfitRaw(value: string) {
    this.takeProfitRaw = value;
    this.tpFromRatio = false; // user took manual control
  }

  setTakeProfitRatio(ratio: TakeProfitRatio) {
    this.takeProfitRatio = ratio;
    this.tpFromRatio = true;
    this.recalcTakeProfit();
  }

  setLeverage(value: number) {
    this.leverage = value;
  }

  setDeposit(value: number) {
    this.deposit = value;
  }

  setRiskPercent(value: number) {
    this.riskPercent = value;
  }

  async activate() {
    if (!this.isValid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.justActivated = false;
    await delay(900); // simulate the order request
    runInAction(() => {
      this.isSubmitting = false;
      this.justActivated = true;
    });
    await delay(2500);
    runInAction(() => {
      this.justActivated = false;
    });
  }
}
