import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { brand } from "@u-drive/core";
import type { Locale } from "@u-drive/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("common.home");

  return (
    <main className="mx-auto max-w-content px-4 py-16 lg:px-6 lg:py-24">
      <LocaleSwitcher />
      <h1 className="mt-16 text-display-sm lg:text-display">{brand.name}</h1>
      <p className="mt-4 text-body-lg text-fg-muted">{t("status")}</p>
    </main>
  );
}
