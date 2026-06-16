import { CalculatorStore } from "@/features/calculator/store/CalculatorStore";

/**
 * Root MobX store. One calculator instance per market variant, so the three
 * panels (stocks / crypto / forex) hold independent state. A single RootStore
 * is created per client session and shared through React context.
 */
export class RootStore {
  readonly stocks: CalculatorStore;
  readonly crypto: CalculatorStore;
  readonly forex: CalculatorStore;

  constructor() {
    this.stocks = new CalculatorStore("stocks");
    this.crypto = new CalculatorStore("crypto");
    this.forex = new CalculatorStore("forex");
  }

  get calculators(): CalculatorStore[] {
    return [this.stocks, this.crypto, this.forex];
  }
}
