"use client";

import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { NumberField } from "@/shared/ui/NumberField";
import { parseNumericInput } from "@/shared/lib/format";
import type { CalculatorStore } from "../store/CalculatorStore";

export const SettingsPopover = observer(function SettingsPopover({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [deposit, setDeposit] = useState("");
  const [risk, setRisk] = useState("");
  const [leverage, setLeverage] = useState("");

  const open = Boolean(anchor);

  // Seed local fields from the store each time the popover opens.
  useEffect(() => {
    if (open) {
      setDeposit(String(store.deposit));
      setRisk(String(store.riskPercent));
      setLeverage(String(store.leverage));
    }
  }, [open, store.deposit, store.riskPercent, store.leverage]);

  const commit = (raw: string, apply: (value: number) => void) => {
    const value = parseNumericInput(raw);
    if (Number.isFinite(value) && value >= 0) apply(value);
  };

  return (
    <>
      <IconButton
        aria-label={t("settings.title")}
        onClick={(e) => setAnchor(e.currentTarget)}
        size="small"
        sx={{ color: "text.secondary" }}
      >
        <TuneRoundedIcon fontSize="small" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableScrollLock
      >
        <Box sx={{ width: 260, p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {t("settings.title")}
          </Typography>

          <FieldBlock label={t("settings.deposit")}>
            <NumberField
              value={deposit}
              onChange={(v) => {
                setDeposit(v);
                commit(v, store.setDeposit);
              }}
              prefix="$"
              ariaLabel={t("settings.deposit")}
            />
          </FieldBlock>

          <FieldBlock label={t("settings.riskPerTrade")}>
            <NumberField
              value={risk}
              onChange={(v) => {
                setRisk(v);
                commit(v, store.setRiskPercent);
              }}
              suffix="%"
              ariaLabel={t("settings.riskPerTrade")}
            />
          </FieldBlock>

          <FieldBlock label={t("settings.leverage")}>
            <NumberField
              value={leverage}
              onChange={(v) => {
                setLeverage(v);
                commit(v, store.setLeverage);
              }}
              suffix="x"
              ariaLabel={t("settings.leverage")}
            />
          </FieldBlock>

          <Typography variant="caption" color="text.secondary">
            {t("settings.hint")}
          </Typography>
        </Box>
      </Popover>
    </>
  );
});

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {children}
    </Box>
  );
}
