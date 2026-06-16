"use client";

import Select, { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectFieldProps<T extends string> {
  value: T;
  options: ReadonlyArray<SelectOption<T>>;
  onChange: (value: T) => void;
  ariaLabel?: string;
  /** Ghost = borderless inline dropdown (field headers); outlined = boxed. */
  variant?: "ghost" | "outlined";
}

/**
 * UI-kit dropdown. The "ghost" variant matches the inline selectors in the
 * Figma (stop-loss mode, take-profit ratio); "outlined" is the boxed form.
 */
export function SelectField<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  variant = "ghost",
}: SelectFieldProps<T>) {
  const handleChange = (event: SelectChangeEvent<T>) => onChange(event.target.value as T);
  const ghost = variant === "ghost";

  return (
    <Select<T>
      value={value}
      onChange={handleChange}
      variant={ghost ? "standard" : "outlined"}
      size="small"
      inputProps={{ "aria-label": ariaLabel }}
      MenuProps={{ disableScrollLock: true }}
      sx={{
        fontSize: 14,
        fontWeight: 500,
        color: ghost ? "text.secondary" : "text.primary",
        "& .MuiSelect-select": ghost
          ? { py: 0, pr: "22px !important", display: "flex", alignItems: "center" }
          : undefined,
        ...(ghost ? { "&:before, &:after": { display: "none" } } : {}),
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} sx={{ fontSize: 14 }}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
