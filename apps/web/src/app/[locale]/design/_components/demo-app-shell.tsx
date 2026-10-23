"use client";

import { CarIcon, CreditCardIcon, FileTextIcon, GearIcon, HouseIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { AppShell, type AppNavItem } from "@/components/layout/app-shell";

const base = "/design/app-shell";

/** Driver-style shell for the /design demo. Icons are components, so items live client-side. */
export function DemoAppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("nav.app");
  const items: AppNavItem[] = [
    { href: base, label: t("overview"), shortLabel: t("overviewShort"), icon: HouseIcon },
    {
      href: `${base}/documents`,
      label: t("documents"),
      shortLabel: t("documentsShort"),
      icon: FileTextIcon,
    },
    { href: `${base}/rental`, label: t("rental"), shortLabel: t("rentalShort"), icon: CarIcon },
    {
      href: `${base}/payments`,
      label: t("payments"),
      shortLabel: t("paymentsShort"),
      icon: CreditCardIcon,
    },
    {
      href: `${base}/settings`,
      label: t("settings"),
      shortLabel: t("settingsShort"),
      icon: GearIcon,
    },
  ];
  return <AppShell items={items}>{children}</AppShell>;
}
