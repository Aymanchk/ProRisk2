"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { createFormatters, type Formatters } from "./format";

/** Locale-bound number/currency formatters for client components. */
export function useFormat(): Formatters {
  const locale = useLocale();
  return useMemo(() => createFormatters(locale), [locale]);
}
