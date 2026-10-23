import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { formatDate, formatMoney } from "@u-drive/core";
import type { Locale } from "@u-drive/i18n";
import { palette, radius, semantic, spacing, status, textStyles } from "@u-drive/ui-tokens";
import { TopNav } from "@/components/layout/top-nav";
import { Button, buttonClasses, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Stepper } from "@/components/ui/stepper";
import { Timeline } from "@/components/ui/timeline";
import { Link } from "@/i18n/navigation";
import { FileInput } from "@/components/ui/file-input";
import { DateInput, Select, TextInput } from "@/components/ui/inputs";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import {
  CalculatorDemo,
  ModalDemo,
  SegmentedDemo,
  SheetDemo,
  TabsDemo,
  ToastDemo,
} from "./_components/demos";
import { DesignSection, TokenCaption } from "./_components/design-section";

// Literal class names so Tailwind's scanner sees them.
const textClass: Record<keyof typeof textStyles, string> = {
  display: "text-display",
  displaySm: "text-display-sm",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  bodyLg: "text-body-lg",
  body: "text-body",
  bodySm: "text-body-sm",
  label: "text-label",
  caption: "text-caption",
};
const radiusClass: Record<keyof typeof radius, string> = {
  control: "rounded-control",
  card: "rounded-card",
  pill: "rounded-pill",
};

const buttonVariants: ButtonVariant[] = ["primary", "secondary", "tertiary", "destructive"];
const buttonSizes: ButtonSize[] = ["compact", "default", "large"];
const buttonStates = ["default", "hover", "focus", "active", "disabled", "loading"] as const;
const inputStates = ["default", "hover", "focus", "filled", "error", "disabled"] as const;
const statuses: Status[] = ["success", "warning", "error", "info", "neutral"];
const cities = ["București", "Cluj-Napoca", "Timișoara", "Iași"];

// Illustrative rows for the table and timeline demos — not real data.
const demoPayments = [
  { id: "p3", date: "2026-10-19", kind: "rent", week: 43, amount: -715 },
  { id: "p2", date: "2026-10-12", kind: "rent", week: 42, amount: -715 },
  { id: "p1", date: "2026-10-05", kind: "deposit", week: 0, amount: -1500 },
] as const;
const onboardingSteps = ["atestat", "pfa", "arr", "copie", "platforms"] as const;
const timelineSteps = [
  { key: "signed", date: "2026-10-01", done: true },
  { key: "deposit", date: "2026-10-02", done: true },
  { key: "handover", date: "2026-10-05", done: true },
  { key: "firstRent", date: "2026-10-12", done: false },
] as const;

export default function DesignSystemPage({ params }: PageProps<"/[locale]/design">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("design.system");
  const l = locale as Locale;

  return (
    <main className="mx-auto max-w-content px-4 py-12 lg:px-6 lg:py-16">
      <div className="grid pb-12 lg:grid-cols-12 lg:pb-16">
        <div className="lg:col-span-8">
          <h1 className="text-h1">{t("title")}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{t("intro")}</p>
        </div>
      </div>

      <DesignSection id="colors" title={t("sections.colors")}>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(palette).map(([name, hex]) => (
            <li key={name}>
              <div
                className="h-16 rounded-card border border-border"
                style={{ backgroundColor: hex }}
              />
              <TokenCaption name={name} value={hex} />
            </li>
          ))}
        </ul>
      </DesignSection>

      <DesignSection id="status" title={t("sections.status")} note={t("notes.status")}>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {Object.entries(status).map(([name, hex]) => (
            <li key={name}>
              <div className="h-16 rounded-card" style={{ backgroundColor: hex }} />
              <TokenCaption name={name} value={hex} />
            </li>
          ))}
        </ul>
      </DesignSection>

      <DesignSection id="semantic" title={t("sections.semantic")} note={t("notes.semantic")}>
        <table className="w-full text-left text-body-sm">
          <thead className="text-caption text-fg-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-3 font-medium">
                {t("modes.role")}
              </th>
              <th scope="col" className="py-3 font-medium">
                {t("modes.light")}
              </th>
              <th scope="col" className="py-3 font-medium">
                {t("modes.dark")}
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(semantic.light).map((role) => {
              const key = role as keyof typeof semantic.light;
              return (
                <tr key={role} className="border-b border-border">
                  <th scope="row" className="py-3 font-medium">
                    {role}
                  </th>
                  {(["light", "dark"] as const).map((mode) => (
                    <td key={mode} className="py-3">
                      <span className="flex items-center gap-2">
                        <span
                          className="size-6 shrink-0 rounded-control border border-border"
                          style={{ backgroundColor: semantic[mode][key] }}
                        />
                        <span className="text-fg-muted">{semantic[mode][key]}</span>
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </DesignSection>

      <DesignSection id="typography" title={t("sections.typography")}>
        <ul className="space-y-6">
          {(Object.keys(textStyles) as (keyof typeof textStyles)[]).map((name) => {
            const style = textStyles[name];
            return (
              <li key={name} className="grid gap-2 sm:grid-cols-4 sm:gap-6">
                <TokenCaption
                  name={name}
                  value={`${style.size}/${style.lineHeight} · ${style.weight}`}
                />
                <p className={`${textClass[name]} min-w-0 sm:col-span-3`}>{t("sample")}</p>
              </li>
            );
          })}
        </ul>
      </DesignSection>

      <DesignSection id="spacing" title={t("sections.spacing")}>
        <ul className="space-y-2">
          {Object.entries(spacing)
            .filter(([, px]) => px > 0)
            .map(([key, px]) => (
              <li key={key} className="flex items-center gap-4">
                <span className="w-16 shrink-0 text-caption text-fg-muted">{`${px}px`}</span>
                <span className="h-4 bg-inverse-bg" style={{ width: px }} />
              </li>
            ))}
        </ul>
      </DesignSection>

      <DesignSection id="radius" title={t("sections.radius")}>
        <ul className="flex flex-wrap gap-8">
          {(Object.keys(radius) as (keyof typeof radius)[]).map((name) => (
            <li key={name}>
              <div className={`h-16 w-32 border-2 border-fg ${radiusClass[name]}`} />
              <TokenCaption name={name} value={name === "pill" ? "9999px" : `${radius[name]}px`} />
            </li>
          ))}
        </ul>
      </DesignSection>

      <DesignSection id="buttons" title={t("sections.buttons")}>
        <div className="overflow-x-auto">
          <table className="text-left">
            <thead>
              <tr>
                <td />
                {buttonVariants.map((variant) => (
                  <th key={variant} scope="col" className="pr-6 pb-4 text-caption text-fg-muted">
                    {t(`variants.${variant}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buttonStates.map((state) => (
                <tr key={state}>
                  <th scope="row" className="pr-6 pb-4 text-caption text-fg-muted">
                    {t(`states.${state}`)}
                  </th>
                  {buttonVariants.map((variant) => (
                    <td key={variant} className="pr-6 pb-4">
                      <Button
                        variant={variant}
                        data-preview={
                          ["hover", "focus", "active"].includes(state) ? state : undefined
                        }
                        disabled={state === "disabled"}
                        loading={state === "loading"}
                        className="whitespace-nowrap"
                      >
                        {t(`buttons.${variant}`)}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-wrap items-end gap-6">
          {buttonSizes.map((size) => (
            <div key={size}>
              <Button size={size}>{t("buttons.primary")}</Button>
              <p className="mt-2 text-caption text-fg-muted">{t(`sizes.${size}`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Button width="mobile-full" size="large">
            {t("buttons.primary")}
          </Button>
        </div>
      </DesignSection>

      <DesignSection id="inputs" title={t("sections.inputs")}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {inputStates.map((state) => (
            <div key={state}>
              <p className="mb-2 text-caption text-fg-muted">{t(`states.${state}`)}</p>
              <TextInput
                label={t("inputs.name.label")}
                placeholder={t("inputs.name.placeholder")}
                helper={state === "error" ? undefined : t("inputs.name.helper")}
                error={state === "error" ? t("inputs.name.error") : undefined}
                defaultValue={state === "filled" ? t("inputs.name.value") : undefined}
                disabled={state === "disabled"}
                data-preview={state === "hover" || state === "focus" ? state : undefined}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label={t("inputs.city.label")}
            placeholder={t("inputs.city.placeholder")}
            helper={t("inputs.city.helper")}
            defaultValue=""
            options={cities.map((city) => ({ value: city, label: city }))}
          />
          <DateInput label={t("inputs.date.label")} helper={t("inputs.date.helper")} />
          <FileInput
            label={t("inputs.file.label")}
            helper={t("inputs.file.helper")}
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
      </DesignSection>

      <DesignSection id="tabs" title={t("sections.tabs")}>
        <TabsDemo />
      </DesignSection>

      <DesignSection id="segmented" title={t("sections.segmented")}>
        <SegmentedDemo />
      </DesignSection>

      <DesignSection id="badges" title={t("sections.badges")}>
        <ul className="flex flex-wrap gap-4">
          {statuses.map((s) => (
            <li key={s}>
              <StatusBadge status={s}>{t(`badges.${s}`)}</StatusBadge>
            </li>
          ))}
        </ul>
      </DesignSection>

      <DesignSection id="nav" title={t("sections.nav")} note={t("notes.nav")}>
        <div className="overflow-hidden rounded-card border border-border">
          <TopNav />
        </div>
      </DesignSection>

      <DesignSection id="shell" title={t("sections.shell")} note={t("notes.shell")}>
        <Link href="/design/app-shell" className={buttonClasses({ variant: "secondary" })}>
          {t("shell.open")}
        </Link>
      </DesignSection>

      <DesignSection id="cards" title={t("sections.cards")}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="text-h4">{t("cards.bordered")}</p>
            <p className="mt-2 text-body text-fg-muted">{t("cards.body")}</p>
          </Card>
          <Card variant="filled">
            <p className="text-h4">{t("cards.filled")}</p>
            <p className="mt-2 text-body text-fg-muted">{t("cards.body")}</p>
          </Card>
          <Card padding="none">
            <div className="h-32 bg-surface-strong" />
            <div className="p-6">
              <p className="text-label">{t("cards.exampleTitle")}</p>
              <p className="mt-1 text-body-sm text-fg-muted">{t("cards.exampleMeta")}</p>
              <p className="mt-4 text-h3 tabular-nums">
                {formatMoney(715, "RON", l, { decimals: 0 })}
                <span className="text-body-sm font-regular text-fg-muted">{` ${t("cards.perWeek")}`}</span>
              </p>
            </div>
          </Card>
        </div>
      </DesignSection>

      <DesignSection id="table" title={t("sections.table")}>
        <DataTable
          caption={t("table.caption")}
          rows={[...demoPayments]}
          rowKey={(row) => row.id}
          columns={[
            { key: "date", header: t("table.date"), render: (row) => formatDate(row.date, l) },
            {
              key: "description",
              header: t("table.description"),
              render: (row) =>
                row.kind === "rent" ? t("table.rent", { week: row.week }) : t("table.deposit"),
            },
            {
              key: "amount",
              header: t("table.amount"),
              numeric: true,
              render: (row) => formatMoney(row.amount, "RON", l),
            },
          ]}
        />
      </DesignSection>

      <DesignSection id="stepper" title={t("sections.stepper")}>
        <Stepper
          label={t("stepper.label")}
          current={1}
          steps={onboardingSteps.map((key) => ({ id: key, label: t(`stepper.${key}`) }))}
        />
      </DesignSection>

      <DesignSection id="timeline" title={t("sections.timeline")}>
        <Timeline
          items={timelineSteps.map((step) => ({
            id: step.key,
            date: formatDate(step.date, l),
            title: t(`timeline.${step.key}`),
            body: t(`timeline.${step.key}Body`),
            done: step.done,
          }))}
        />
      </DesignSection>

      <DesignSection id="empty" title={t("sections.empty")}>
        <div className="lg:w-2/3">
          <EmptyState
            title={t("empty.title")}
            body={t("empty.body")}
            action={<Button>{t("empty.action")}</Button>}
          />
        </div>
      </DesignSection>

      <DesignSection
        id="overlays"
        title={`${t("sections.toast")} · ${t("sections.modal")} · ${t("sections.sheet")}`}
        note={t("notes.sheet")}
      >
        <div className="flex flex-wrap gap-4">
          <ToastDemo />
          <ModalDemo />
          <SheetDemo />
        </div>
      </DesignSection>

      <DesignSection id="calculator" title={t("sections.calculator")} note={t("notes.calculator")}>
        <CalculatorDemo />
      </DesignSection>

      <DesignSection id="dark" title={t("sections.dark")} note={t("notes.dark")}>
        <div className="dark-section rounded-card p-6 lg:p-12">
          <p className="text-h2">{t("sample")}</p>
          <p className="mt-2 text-body-lg text-fg-muted">{t("intro")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>{t("buttons.primary")}</Button>
            <Button variant="secondary">{t("buttons.secondary")}</Button>
            <Button variant="tertiary">{t("buttons.tertiary")}</Button>
            <Button data-preview="focus">{t("states.focus")}</Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-4">
            {statuses.map((s) => (
              <li key={s}>
                <StatusBadge status={s}>{t(`badges.${s}`)}</StatusBadge>
              </li>
            ))}
          </ul>
        </div>
      </DesignSection>
    </main>
  );
}
