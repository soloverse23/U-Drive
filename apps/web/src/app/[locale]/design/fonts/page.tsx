import { use } from "react";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { formatMoney } from "@u-drive/core";
import type { Locale } from "@u-drive/i18n";
import { StatusBadge } from "@/components/ui/status-badge";
import { fontCandidates } from "./candidates";

// Illustrative demo data for typography only — not listings, not market data.
const demoCars = [
  { model: "Toyota Corolla", year: 2022, fuel: "hybrid", weeklyRent: 715 },
  { model: "Dacia Logan", year: 2021, fuel: "lpg", weeklyRent: 550 },
  { model: "Škoda Octavia", year: 2020, fuel: "petrol", weeklyRent: 600 },
] as const;

const demoCalc = { gross: 2400, commission: -600, rent: -715, fuel: -350 } as const;
const demoNet = Object.values(demoCalc).reduce((sum, v) => sum + v, 0);

export default function FontsPage({ params }: PageProps<"/[locale]/design/fonts">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("design.fonts");

  return (
    <main className="mx-auto max-w-content px-4 py-16 lg:px-6 lg:py-24">
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="text-h1">{t("title")}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{t("intro")}</p>
        </div>
      </div>

      {fontCandidates.map((font) => (
        <FontSample
          key={font.id}
          name={font.name}
          className={font.className}
          chosen={font.chosen}
        />
      ))}
    </main>
  );
}

function FontSample({
  name,
  className,
  chosen,
}: {
  name: string;
  className: string;
  chosen: boolean;
}) {
  const t = useTranslations("design.fonts");
  const locale = useLocale();
  const money = (amount: number) => formatMoney(amount, "RON", locale);

  return (
    <section
      aria-labelledby={`font-${name}`}
      className={`mt-16 grid gap-8 border-t border-border pt-12 lg:mt-24 lg:grid-cols-12 ${className}`}
    >
      <header className="lg:col-span-4">
        <h2 id={`font-${name}`} className="text-h2">
          {name}
        </h2>
        {chosen && (
          <p className="mt-2">
            <StatusBadge status="success">{t("chosen")}</StatusBadge>
          </p>
        )}
        <ul className="mt-4 space-y-1 text-body-sm text-fg-muted">
          <li>{t("license")}</li>
          <li>{t("weights")}</li>
          <li>{t("checks")}</li>
        </ul>
      </header>

      <div className="space-y-12 lg:col-span-8">
        <div>
          <p className="text-display-sm lg:text-display">{t("headline")}</p>
          <p className="mt-6 text-body-lg">{t("paragraph")}</p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-h4">
            <span className="font-regular">{t("weight400")}</span>
            <span className="font-medium">{t("weight500")}</span>
            <span className="font-bold">{t("weight700")}</span>
          </div>
        </div>

        <table className="w-full text-left text-body">
          <caption className="pb-3 text-left text-label">{t("table.caption")}</caption>
          <thead className="text-body-sm text-fg-muted">
            <tr className="border-b border-border">
              <th scope="col" className="py-3 font-medium">
                {t("table.car")}
              </th>
              <th scope="col" className="py-3 text-right font-medium">
                {t("table.year")}
              </th>
              <th scope="col" className="py-3 pl-4 font-medium">
                {t("table.fuel")}
              </th>
              <th scope="col" className="py-3 text-right font-medium">
                {t("table.price")}
              </th>
            </tr>
          </thead>
          <tbody>
            {demoCars.map((car) => (
              <tr key={car.model} className="border-b border-border">
                <td className="py-3">{car.model}</td>
                <td className="py-3 text-right tabular-nums">{car.year}</td>
                <td className="py-3 pl-4">{t(`table.${car.fuel}`)}</td>
                <td className="py-3 text-right tabular-nums">{money(car.weeklyRent)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="rounded-card bg-surface p-6 lg:p-8">
          <p className="text-label">{t("calc.title")}</p>
          <p className="mt-2 text-display-sm tabular-nums">{money(demoNet)}</p>
          <dl className="mt-6 divide-y divide-border text-body">
            {(Object.keys(demoCalc) as (keyof typeof demoCalc)[]).map((key) => (
              <div key={key} className="flex justify-between py-2">
                <dt className="text-fg-muted">{t(`calc.${key}`)}</dt>
                <dd className="tabular-nums">{money(demoCalc[key])}</dd>
              </div>
            ))}
            <div className="flex justify-between py-2 font-bold">
              <dt>{t("calc.net")}</dt>
              <dd className="tabular-nums">{money(demoNet)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-caption text-fg-muted">{t("calc.example")}</p>
        </div>

        <div>
          <p className="text-label">{t("glyphs")}</p>
          <p className="mt-2 text-h3">{t("pangram")}</p>
          <p className="mt-2 text-h3 tabular-nums">{"ȘȚĂÎÂ șțăîâ 0123456789 1.111,11 8.888,88"}</p>
        </div>
      </div>
    </section>
  );
}
