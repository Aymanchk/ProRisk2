"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { StatPair } from "@/shared/ui/StatPair";
import { useFormat } from "@/shared/lib/useFormat";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

export const ResultsSummary = observer(function ResultsSummary({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const fmt = useFormat();
  const { result, market, isValid } = store;

  // Quantity + cost/margin labels differ per market.
  let quantityValue: string;
  let costLabel: string;
  let costValue: string;

  if (market === "stocks") {
    quantityValue = isValid ? t("results.shares", { count: result.quantity }) : "—";
    costLabel = t("results.cost");
    costValue = fmt.money(result.notional, 0);
  } else if (market === "crypto") {
    quantityValue = isValid ? fmt.decimal(result.quantity, 0, 9) : "—";
    costLabel = t("results.cost");
    costValue = fmt.money(result.notional, 0);
  } else {
    quantityValue = isValid ? t("results.lots", { count: fmt.decimal(result.quantity, 2, 2) }) : "—";
    costLabel = t("results.margin");
    costValue = fmt.money(result.margin, 0);
  }

  const profitTone = result.profit < 0 ? "risk" : "profit";

  return (
    <div className={styles.results}>
      <div className={styles.statRow}>
        <StatPair label={t("results.risk")} value={fmt.money(result.risk, 0)} tone="risk" />
        <span className={styles.vDivider} />
        <StatPair
          label={t("results.profit")}
          value={fmt.money(result.profit, 0)}
          tone={profitTone}
          alignEnd
        />
      </div>
      <div className={styles.statRow}>
        <StatPair label={t("results.buyLabel")} value={quantityValue} />
        <StatPair label={costLabel} value={costValue} alignEnd />
      </div>

      <div className={styles.leverageRow}>
        {market === "forex" ? (
          <>
            <span className={styles.leverageLabel}>
              {isValid ? t("results.perPip", { value: fmt.money(result.pipValue ?? 0, 0) }) : "—"}
            </span>
            <span className={styles.leverageValue}>
              {t("results.leverageForex", { ratio: store.leverage })}
            </span>
          </>
        ) : (
          <>
            <span className={styles.leverageLabel}>{t("results.leverage")}</span>
            <span className={styles.leverageValue}>
              {t("results.leverageValue", { value: store.leverage })}
            </span>
          </>
        )}
      </div>
    </div>
  );
});
