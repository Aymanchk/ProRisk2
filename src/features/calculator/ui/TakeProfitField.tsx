"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { NumberField } from "@/shared/ui/NumberField";
import { SelectField, type SelectOption } from "@/shared/ui/SelectField";
import { useFormat } from "@/shared/lib/useFormat";
import { TAKE_PROFIT_RATIOS } from "../model/constants";
import type { TakeProfitRatio } from "../model/types";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

const CUSTOM = "custom";

export const TakeProfitField = observer(function TakeProfitField({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const fmt = useFormat();
  const prefix = store.market === "forex" ? undefined : "$";
  const tpError = store.errors.takeProfitPrice;

  const ratioOptions: SelectOption<string>[] = TAKE_PROFIT_RATIOS.map((ratio) => ({
    value: String(ratio),
    label: `${ratio}:1`,
  }));

  // Manual take-profit shows its implied ratio as a read-only "custom" option.
  if (!store.tpFromRatio) {
    ratioOptions.push({ value: CUSTOM, label: `${fmt.decimal(store.displayedRatio, 0, 2)}:1` });
  }

  const handleRatio = (value: string) => {
    if (value !== CUSTOM) {
      store.setTakeProfitRatio(Number(value) as TakeProfitRatio);
    }
  };

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{t("fields.takeProfit")}</span>
      </div>
      <div className={styles.tpRow}>
        <div className={styles.tpField}>
          <NumberField
            value={store.takeProfitRaw}
            onChange={store.setTakeProfitRaw}
            prefix={prefix}
            ariaLabel={t("fields.takeProfit")}
            error={Boolean(tpError)}
            helperText={tpError ? t(`errors.${tpError}`) : undefined}
          />
        </div>
        <div className={styles.tpRatio}>
          <SelectField
            value={store.tpFromRatio ? String(store.takeProfitRatio) : CUSTOM}
            options={ratioOptions}
            onChange={handleRatio}
            ariaLabel={t("fields.takeProfit")}
          />
        </div>
      </div>
    </div>
  );
});
