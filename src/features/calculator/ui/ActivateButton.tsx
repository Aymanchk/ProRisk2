"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { LinkIcon } from "@/shared/ui/LinkIcon";
import type { CalculatorStore } from "../store/CalculatorStore";
import styles from "./RiskCalculator.module.scss";

/** Build a shareable link that encodes the current setup. */
function buildShareLink(store: CalculatorStore): string {
  const params = new URLSearchParams({
    market: store.market,
    direction: store.direction,
    entry: store.entryRaw,
    stop: store.stopRaw,
    mode: store.stopMode,
    tp: store.takeProfitRaw,
  });
  const base = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  return `${base}?${params.toString()}`;
}

export const ActivateButton = observer(function ActivateButton({
  store,
}: {
  store: CalculatorStore;
}) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(buildShareLink(store));
      setCopied(true);
    } catch {
      // Clipboard can be blocked (e.g. insecure context) — fail silently.
    }
  };

  return (
    <>
      <div className={styles.footer}>
        <Button
          className={styles.activate}
          variant="contained"
          color="primary"
          disableElevation
          disabled={!store.isValid || store.isSubmitting}
          onClick={store.activate}
          startIcon={
            store.isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined
          }
        >
          {store.isSubmitting ? t("actions.activating") : t("actions.activate")}
        </Button>

        <Tooltip title={t("actions.share")}>
          <IconButton aria-label={t("actions.share")} onClick={handleShare} color="primary">
            <LinkIcon />
          </IconButton>
        </Tooltip>
      </div>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" variant="filled" onClose={() => setCopied(false)}>
          {t("actions.copied")}
        </Alert>
      </Snackbar>

      <Snackbar
        open={store.justActivated}
        autoHideDuration={2500}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          {t("actions.activated")}
        </Alert>
      </Snackbar>
    </>
  );
});
