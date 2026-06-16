"use client";

import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import { SegmentedToggle, type SegmentedOption } from "@/shared/ui/SegmentedToggle";
import type { CalculatorStore } from "../store/CalculatorStore";
import type { Direction } from "../model/types";

export const DirectionToggle = observer(function DirectionToggle({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const isForex = store.market === "forex";

  const options: SegmentedOption<Direction>[] = [
    { value: "long", label: isForex ? t("direction.buy") : t("direction.long"), tone: "positive" },
    { value: "short", label: isForex ? t("direction.sell") : t("direction.short"), tone: "negative" },
  ];

  return (
    <SegmentedToggle
      value={store.direction}
      options={options}
      onChange={store.setDirection}
      ariaLabel={t("fields.stopLoss")}
    />
  );
});
