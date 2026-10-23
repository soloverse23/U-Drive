"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type ChangeEvent } from "react";
import { formatMoney } from "@u-drive/core";
import { Button } from "@/components/ui/button";
import { CalculatorShell } from "@/components/ui/calculator-shell";
import { BottomSheet, DialogClose, Modal } from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/inputs";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";

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

export function ToastDemo() {
  const t = useTranslations("design.system.toast");
  const toast = useToast();
  return (
    <Button variant="secondary" onClick={() => toast(t("message"))}>
      {t("trigger")}
    </Button>
  );
}

export function ModalDemo() {
  const t = useTranslations("design.system.modal");
  return (
    <Modal
      trigger={<Button variant="secondary">{t("trigger")}</Button>}
      title={t("title")}
      description={t("body")}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="secondary" width="mobile-full">
              {t("cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" width="mobile-full">
              {t("confirm")}
            </Button>
          </DialogClose>
        </>
      }
    />
  );
}

export function SheetDemo() {
  const t = useTranslations("design.system.sheet");
  const tSeg = useTranslations("design.system.segmented");
  return (
    <BottomSheet
      trigger={<Button variant="secondary">{t("trigger")}</Button>}
      title={t("title")}
      footer={
        <DialogClose asChild>
          <Button width="full" size="large">
            {t("apply")}
          </Button>
        </DialogClose>
      }
    >
      <SegmentedControl
        label={tSeg("label")}
        options={[
          { value: "weekly", label: tSeg("weekly") },
          { value: "monthly", label: tSeg("monthly") },
        ]}
      />
    </BottomSheet>
  );
}

// Demo arithmetic only. Real calculators live in packages/core with unit tests (Phase 1).
const DEMO_COMMISSION_RATE = 0.25;

export function CalculatorDemo() {
  const t = useTranslations("design.system.calculator");
  const locale = useLocale();
  const [gross, setGross] = useState(2400);
  const [rent, setRent] = useState(715);
  const [fuel, setFuel] = useState(350);
  const commission = gross * DEMO_COMMISSION_RATE;
  const net = gross - commission - rent - fuel;
  const money = (v: number) => formatMoney(v, "RON", locale);
  const number = (setter: (v: number) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    setter(Number(e.target.value) || 0);

  return (
    <CalculatorShell
      title={t("title")}
      inputs={
        <>
          <TextInput
            type="number"
            inputMode="decimal"
            label={t("gross")}
            value={gross}
            min={0}
            onChange={number(setGross)}
          />
          <TextInput
            type="number"
            inputMode="decimal"
            label={t("rent")}
            value={rent}
            min={0}
            onChange={number(setRent)}
          />
          <TextInput
            type="number"
            inputMode="decimal"
            label={t("fuel")}
            value={fuel}
            min={0}
            onChange={number(setFuel)}
          />
        </>
      }
      resultLabel={t("result")}
      resultValue={money(net)}
      breakdown={[
        { label: t("gross"), value: money(gross) },
        { label: t("commission"), value: money(-commission) },
        { label: t("rent"), value: money(-rent) },
        { label: t("fuel"), value: money(-fuel) },
        { label: t("result"), value: money(net), total: true },
      ]}
      assumptions={[
        {
          label: t("commissionRate"),
          value: `${DEMO_COMMISSION_RATE * 100}%`,
          source: t("demoSource"),
          verified: false,
        },
      ]}
    />
  );
}
