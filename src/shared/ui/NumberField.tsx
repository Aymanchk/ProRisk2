"use client";

import { forwardRef, type ReactNode } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

export interface NumberFieldProps {
  value: string;
  onChange?: (value: string) => void;
  prefix?: ReactNode;
  suffix?: ReactNode;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  readOnly?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  /** Visually right-align the value (used for the offset/percent input). */
  alignEnd?: boolean;
}

// Allow only digits, separators, spaces and a leading minus.
const SANITIZE = /[^\d.,\s-]/g;

/**
 * UI-kit numeric input: MUI TextField tuned for the calculator. Keeps the raw
 * string (no live re-formatting while typing) and surfaces error/read-only
 * states. Formatting for display is done by the caller.
 */
export const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(
  function NumberField(
    { value, onChange, prefix, suffix, placeholder, error, helperText, readOnly, disabled, ariaLabel, alignEnd },
    ref,
  ) {
    return (
      <TextField
        ref={ref}
        fullWidth
        size="small"
        value={value}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value.replace(SANITIZE, ""))}
        slotProps={{
          input: {
            readOnly,
            startAdornment: prefix ? (
              <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                {prefix}
              </InputAdornment>
            ) : undefined,
            endAdornment: suffix ? (
              <InputAdornment position="end" sx={{ color: "text.secondary" }}>
                {suffix}
              </InputAdornment>
            ) : undefined,
            sx: readOnly ? { bgcolor: "action.hover" } : undefined,
          },
          htmlInput: {
            inputMode: "decimal",
            "aria-label": ariaLabel,
            style: alignEnd ? { textAlign: "end" } : undefined,
          },
        }}
      />
    );
  },
);
