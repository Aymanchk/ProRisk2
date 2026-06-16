"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";
import { SegmentedToggle, type SegmentedOption } from "./SegmentedToggle";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const options: SegmentedOption<Locale>[] = routing.locales.map((value) => ({
    value,
    label: t(`lang.${value}`),
    tone: "neutral",
  }));

  return (
    <SegmentedToggle
      value={locale}
      options={options}
      onChange={(next) => router.replace(pathname, { locale: next })}
      ariaLabel={t("lang.switch")}
    />
  );
}
