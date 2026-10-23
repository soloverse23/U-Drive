import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cx } from "./cx";
import { StatusBadge } from "./status-badge";

export interface BreakdownRow {
  label: string;
  value: string;
  /** Bold total row. */
  total?: boolean | undefined;
}

export interface Assumption {
  label: string;
  value: string;
  source: string;
  /** From the ConfigValue; unverified values show an "Estimate" badge. */
  verified: boolean;
}

/**
 * Calculator pattern (spec §3.5): inputs left, large result right (below on mobile),
 * breakdown table, expandable assumptions with source and estimate badges, disclaimer.
 */
export function CalculatorShell({
  title,
  inputs,
  resultLabel,
  resultValue,
  breakdown,
  assumptions,
}: {
  title: string;
  inputs: ReactNode;
  resultLabel: string;
  resultValue: string;
  breakdown: BreakdownRow[];
  assumptions: Assumption[];
}) {
  const t = useTranslations("ui.calculator");

  return (
    <section aria-label={title} className="grid gap-8 lg:grid-cols-12">
      <div className="flex flex-col gap-6 lg:col-span-5">{inputs}</div>

      <div className="rounded-card bg-surface p-6 lg:col-span-7 lg:p-8">
        <p className="text-label">{resultLabel}</p>
        <p aria-live="polite" className="mt-2 text-display-sm tabular-nums lg:text-display">
          {resultValue}
        </p>

        <dl aria-label={t("breakdown")} className="mt-6 divide-y divide-border text-body">
          {breakdown.map((row) => (
            <div
              key={row.label}
              className={cx("flex justify-between gap-4 py-2", row.total && "font-bold")}
            >
              <dt className={row.total ? undefined : "text-fg-muted"}>{row.label}</dt>
              <dd className="tabular-nums whitespace-nowrap">{row.value}</dd>
            </div>
          ))}
        </dl>

        <details className="group mt-6 border-t border-border pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-label ui-focus-visible:outline-2 ui-focus-visible:outline-fg [&::-webkit-details-marker]:hidden">
            {t("assumptions")}
            <CaretDownIcon
              size={24}
              aria-hidden
              className="transition-transform group-open:rotate-180 motion-reduce:transition-none"
            />
          </summary>
          <ul className="mt-4 space-y-4">
            {assumptions.map((a) => (
              <li key={a.label}>
                <div className="flex justify-between gap-4 text-body">
                  <span>{a.label}</span>
                  <span className="tabular-nums">{a.value}</span>
                </div>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-caption text-fg-muted">{`${t("source")}: ${a.source}`}</span>
                  <StatusBadge status={a.verified ? "success" : "warning"}>
                    {a.verified ? t("verified") : t("estimate")}
                  </StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        </details>

        <p className="mt-6 text-caption text-fg-muted">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
