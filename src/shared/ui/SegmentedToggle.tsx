"use client";

import styles from "./SegmentedToggle.module.scss";

export type Tone = "positive" | "negative" | "neutral";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  tone?: Tone;
}

export interface SegmentedToggleProps<T extends string> {
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

/**
 * UI-kit segmented control used for Long/Short and Buy/Sell. The selected
 * option fills with its tone color (teal for buy/long, red for sell/short).
 */
export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: SegmentedToggleProps<T>) {
  return (
    <div className={styles.group} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;
        const tone = option.tone ?? "neutral";
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            className={[styles.option, active ? `${styles.active} ${styles[tone]}` : ""]
              .join(" ")
              .trim()}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
