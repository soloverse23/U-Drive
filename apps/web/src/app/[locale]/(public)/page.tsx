import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { brand } from "@u-drive/core";
import type { Locale } from "@u-drive/i18n";

export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("common.home");

  return (
    <main className="mx-auto max-w-content px-4 py-16 lg:px-6 lg:py-24">
      <h1 className="text-display-sm lg:text-display">{brand.name}</h1>
      <p className="mt-4 text-body-lg text-fg-muted">{t("status")}</p>
    </main>
  );
}
