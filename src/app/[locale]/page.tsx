import { getTranslations, setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { CalculatorBoard } from "@/features/calculator/ui/CalculatorBoard";
import styles from "./page.module.scss";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <div className={styles.heading}>
          <h1 className={styles.h1}>{t("app.title")}</h1>
          <p className={styles.sub}>{t("app.subtitle")}</p>
        </div>
        <LanguageSwitcher />
      </div>

      <div className={styles.stage}>
        <CalculatorBoard />
      </div>
    </main>
  );
}
