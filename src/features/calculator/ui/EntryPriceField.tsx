"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { NumberField } from "@/shared/ui/NumberField";
import { useFormat } from "@/shared/lib/useFormat";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

export const EntryPriceField = observer(function EntryPriceField({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const fmt = useFormat();
  const prefix = store.market === "forex" ? undefined : "$";
  const change = store.priceChange;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{t("fields.entryPrice")}</span>
        {change !== 0 && (
          <span className={`${styles.priceChange} ${change < 0 ? styles.negative : ""}`.trim()}>
            {t("priceChange", { value: fmt.signed(change, 3) })}
          </span>
        )}
      </div>
      <NumberField
        value={store.entryRaw}
        onChange={store.setEntryRaw}
        prefix={prefix}
        ariaLabel={t("fields.entryPrice")}
        error={Boolean(store.errors.entryPrice)}
        helperText={store.errors.entryPrice ? t(`errors.${store.errors.entryPrice}`) : undefined}
      />
    </div>
  );
});
