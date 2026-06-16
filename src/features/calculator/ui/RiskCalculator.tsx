"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "@mui/material/Skeleton";
import type { CalculatorStore } from "../store/CalculatorStore";
import { SettingsPopover } from "./SettingsPopover";
import { EntryPriceField } from "./EntryPriceField";
import { StopLossField } from "./StopLossField";
import { TakeProfitField } from "./TakeProfitField";
import { ResultsSummary } from "./ResultsSummary";
import { LiquidationNotice } from "./LiquidationNotice";
import { ActivateButton } from "./ActivateButton";
import styles from "./RiskCalculator.module.scss";

export const RiskCalculator = observer(function RiskCalculator({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();

  return (
    <section className={styles.panel} aria-label={t("app.title")}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t(`markets.${store.market}`)}</h2>
        <SettingsPopover store={store} />
      </div>

      {store.isLoadingMarket ? (
        <LoadingState />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={store.market}
            className={styles.skeletonStack}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <EntryPriceField store={store} />
            <StopLossField store={store} />
            <TakeProfitField store={store} />
            <ResultsSummary store={store} />
            <LiquidationNotice store={store} />
            <ActivateButton store={store} />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
});

function LoadingState() {
  return (
    <div className={styles.skeletonStack} aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className={styles.field}>
          <Skeleton variant="text" width={90} height={20} />
          <Skeleton variant="rounded" height={42} />
        </div>
      ))}
      <Skeleton variant="rounded" height={88} />
      <Skeleton variant="rounded" height={48} />
    </div>
  );
}
