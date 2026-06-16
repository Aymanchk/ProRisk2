import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Open_Sans } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AppProviders } from "@/providers/AppProviders";
import "@/app/globals.scss";

// Figma uses Lato, but Lato has no Cyrillic on Google Fonts / Fontsource and
// the UI is Russian. Open Sans is the closest humanist match with Cyrillic and
// the needed weights. Swap to self-hosted Lato (woff2 with Cyrillic) if available.
const sans = Open_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProRiski — Калькулятор риска",
  description: "Расчёт размера позиции по риску: акции, крипта, форекс.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  // Enables static rendering for this locale.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={sans.variable}>
      <body>
        <NextIntlClientProvider>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
