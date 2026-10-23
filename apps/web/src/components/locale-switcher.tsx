"use client";

import { useLocale, useTranslations } from "next-intl";
import { locales } from "@u-drive/i18n";
import { Link, usePathname } from "@/i18n/navigation";

/** RO / EN switch that keeps the current page. Full component styling lands in step 0.7. */
export function LocaleSwitcher() {
  const t = useTranslations("nav.localeSwitcher");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="flex gap-4">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          hrefLang={locale}
          lang={locale}
          aria-label={t(`${locale}Name`)}
          aria-current={locale === current ? "true" : undefined}
          className="text-label text-fg-muted underline-offset-4 transition-colors hover:text-fg aria-[current=true]:text-fg aria-[current=true]:underline"
        >
          {t(locale)}
        </Link>
      ))}
    </nav>
  );
}
