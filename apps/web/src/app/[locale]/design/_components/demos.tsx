"use client";

import { useTranslations } from "next-intl";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tabs } from "@/components/ui/tabs";

const tabKeys = ["overview", "documents", "payments"] as const;

export function TabsDemo() {
  const t = useTranslations("design.system.tabs");
  return (
    <Tabs
      label={t("overview")}
      items={tabKeys.map((key) => ({
        value: key,
        label: t(key),
        content: <p className="text-body text-fg-muted">{t("panel", { tab: t(key) })}</p>,
      }))}
    />
  );
}

export function SegmentedDemo() {
  const t = useTranslations("design.system.segmented");
  return (
    <SegmentedControl
      label={t("label")}
      options={[
        { value: "weekly", label: t("weekly") },
        { value: "monthly", label: t("monthly") },
      ]}
    />
  );
}
