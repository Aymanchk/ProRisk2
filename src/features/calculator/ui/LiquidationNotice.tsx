"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { useFormat } from "@/shared/lib/useFormat";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

export const LiquidationNotice = observer(function LiquidationNotice({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const fmt = useFormat();

  const show =
    store.market === "crypto" &&
    store.isValid &&
    store.result.liquidationPrice !== null;

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={styles.notice}
          initial={{ opacity: 0, height: 0, marginTop: -12 }}
          animate={{ opacity: 1, height: "auto", marginTop: 0 }}
          exit={{ opacity: 0, height: 0, marginTop: -12 }}
          transition={{ duration: 0.2 }}
        >
          <span className={styles.noticeLabel}>
            <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
            {t("results.liquidation")}
          </span>
          <span className={styles.noticeValue}>
            {fmt.money(store.result.liquidationPrice ?? 0, 0)}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
