import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { showInternalRoutes } from "@/lib/env";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Spec §3.9: /design is staging-only.
export default async function DesignLayout({ children }: LayoutProps<"/[locale]/design">) {
  if (!showInternalRoutes()) notFound();
  const t = await getTranslations("design.layout");

  return (
    <>
      <p className="border-b border-border bg-surface px-4 py-2 text-caption text-fg-muted lg:px-6">
        {t("badge")}
      </p>
      {children}
    </>
  );
}
