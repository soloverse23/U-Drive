import { use } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@u-drive/i18n";
import { DemoAppShell } from "../../_components/demo-app-shell";

const sections = ["documents", "rental", "payments", "settings"] as const;
type Section = (typeof sections)[number];

export default function AppShellDemoPage({
  params,
}: PageProps<"/[locale]/design/app-shell/[[...section]]">) {
  const { locale, section } = use(params);
  setRequestLocale(locale as Locale);
  const tNav = useTranslations("nav.app");
  const t = useTranslations("design.system.shell");

  const current = section?.[0];
  if (section && (section.length > 1 || !sections.includes(current as Section))) notFound();

  return (
    <DemoAppShell>
      <div className="px-4 py-8 lg:px-12 lg:py-12">
        <h1 className="text-h1">{current ? tNav(current as Section) : t("title")}</h1>
        <p className="mt-4 text-body-lg text-fg-muted">{t("body")}</p>
      </div>
    </DemoAppShell>
  );
}
