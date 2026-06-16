import type { ReactNode } from "react";
import styles from "./StatPair.module.scss";

export type StatTone = "default" | "risk" | "profit" | "muted";

export interface StatPairProps {
  label: ReactNode;
  value: ReactNode;
  tone?: StatTone;
  alignEnd?: boolean;
}

const TONE_CLASS: Record<StatTone, string> = {
  default: "",
  risk: styles.risk,
  profit: styles.profit,
  muted: styles.muted,
};

/** UI-kit label/value pair used for the calculation summary rows. */
export function StatPair({ label, value, tone = "default", alignEnd }: StatPairProps) {
  return (
    <div className={`${styles.pair} ${alignEnd ? styles.alignEnd : ""}`.trim()}>
      <span className={styles.label}>{label}</span>
      <span className={`${styles.value} ${TONE_CLASS[tone]}`.trim()}>{value}</span>
    </div>
  );
}
