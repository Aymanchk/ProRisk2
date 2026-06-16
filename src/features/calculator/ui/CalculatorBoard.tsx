"use client";

import { observer } from "mobx-react-lite";
import { useStore } from "@/providers/StoreProvider";
import { RiskCalculator } from "./RiskCalculator";
import styles from "./CalculatorBoard.module.scss";

/**
 * Shows the three market variants (stocks / crypto / forex) as separate panels,
 * matching how the Figma presents them as separate frames. Each panel is bound
 * to its own store, so they hold independent state. Stacks on mobile.
 */
export const CalculatorBoard = observer(function CalculatorBoard() {
  const { stocks, crypto, forex } = useStore();

  return (
    <div className={styles.board}>
      <RiskCalculator store={stocks} />
      <RiskCalculator store={crypto} />
      <RiskCalculator store={forex} />
    </div>
  );
});
