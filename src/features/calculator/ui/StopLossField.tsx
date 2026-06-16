"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { NumberField } from "@/shared/ui/NumberField";
import { SelectField, type SelectOption } from "@/shared/ui/SelectField";
import { useFormat } from "@/shared/lib/useFormat";
import { DirectionToggle } from "./DirectionToggle";
import { ATR_PERIOD, STOP_MODES } from "../model/constants";
import type { StopMode } from "../model/types";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

export const StopLossField = observer(function StopLossField({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const fmt = useFormat();
  const prefix = store.market === "forex" ? undefined : "$";

  const modeOptions: SelectOption<StopMode>[] = STOP_MODES.map((mode) => ({
    value: mode,
    label:
      mode === "atr"
        ? t("stopMode.atr", { timeframe: store.atrTimeframe, multiplier: ATR_PERIOD })
        : t(`stopMode.${mode}`),
  }));

  const stopError = store.errors.stopPrice;

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{t("fields.stopLoss")}</span>
        <SelectField
          value={store.stopMode}
          options={modeOptions}
          onChange={store.setStopMode}
          ariaLabel={t("fields.stopLoss")}
        />
      </div>

      <NumberField
        value={store.isStopEditable ? store.stopRaw : fmt.price(store.resolvedStopPrice, store.priceDecimals)}
        onChange={store.isStopEditable ? store.setStopRaw : undefined}
        readOnly={!store.isStopEditable}
        prefix={prefix}
        ariaLabel={t("fields.stopLoss")}
        error={Boolean(stopError)}
        helperText={stopError ? t(`errors.${stopError}`) : undefined}
      />

      {/* Direction toggle follows the Figma frames: hidden in "numbers" mode,
          shown alongside the percent input in "%" mode and on its own in ATR. */}
      {store.stopMode !== "numbers" && (
        <div className={styles.controlsRow}>
          <AnimatePresence initial={false}>
            {store.stopMode === "percent" && (
              <motion.div
                key="stop-percent"
                className={styles.percentInput}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                <NumberField
                  value={store.stopPercentRaw}
                  onChange={store.setStopPercentRaw}
                  suffix="%"
                  alignEnd
                  ariaLabel={t("fields.stopPercent")}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ marginLeft: "auto" }}>
            <DirectionToggle store={store} />
          </div>
        </div>
      )}
    </div>
  );
});
