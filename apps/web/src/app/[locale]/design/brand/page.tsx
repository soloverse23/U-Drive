import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@u-drive/i18n";
import { buttonClasses } from "@/components/ui/button";
import { CompactMark, WordmarkSample, type WordmarkOption } from "./wordmark-options";

const options: WordmarkOption[] = ["a", "b", "c"];

export default function BrandPage({ params }: PageProps<"/[locale]/design/brand">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("design.brand");
  const tNav = useTranslations("nav.top");

  return (
    <main className="mx-auto max-w-content px-4 py-12 lg:px-6 lg:py-16">
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="text-h1">{t("title")}</h1>
          <p className="mt-4 text-body-lg text-fg-muted">{t("intro")}</p>
          <p className="mt-4 text-body-sm text-fg-muted">{t("note")}</p>
        </div>
      </div>

      {options.map((option) => (
        <section
          key={option}
          aria-labelledby={`option-${option}`}
          className="mt-16 grid gap-8 border-t border-border pt-12 lg:grid-cols-12"
        >
          <header className="lg:col-span-3">
            <h2 id={`option-${option}`} className="text-h3">
              {t(`options.${option}.name`)}
            </h2>
            <p className="mt-2 text-body-sm text-fg-muted">{t(`options.${option}.body`)}</p>
          </header>

          <div className="grid gap-6 lg:col-span-9">
            <div className="grid gap-6 sm:grid-cols-2">
              <figure>
                <div className="flex h-32 items-center rounded-card border border-border px-8">
                  <WordmarkSample option={option} size={48} />
                </div>
                <figcaption className="mt-2 text-caption text-fg-muted">{t("onLight")}</figcaption>
              </figure>
              <figure>
                <div className="dark-section flex h-32 items-center rounded-card px-8">
                  <WordmarkSample option={option} size={48} />
                </div>
                <figcaption className="mt-2 text-caption text-fg-muted">{t("onDark")}</figcaption>
              </figure>
            </div>

            <figure>
              <div className="flex h-16 items-center justify-between rounded-card border border-border px-6">
                <WordmarkSample option={option} size={20} />
                <span className={buttonClasses({ size: "compact" })}>{tNav("signup")}</span>
              </div>
              <figcaption className="mt-2 text-caption text-fg-muted">{t("inNav")}</figcaption>
            </figure>

            <div className="flex flex-wrap items-end gap-8">
              <figure>
                <div className="flex size-8 items-center justify-center border border-border bg-white text-black">
                  <CompactMark option={option} size={18} />
                </div>
                <figcaption className="mt-2 text-caption text-fg-muted">{t("favicon")}</figcaption>
              </figure>
              <figure>
                <div className="flex size-24 items-center justify-center rounded-card bg-black text-white">
                  <CompactMark option={option} size={44} />
                </div>
                <figcaption className="mt-2 text-caption text-fg-muted">{t("appIcon")}</figcaption>
              </figure>
              <figure>
                <div className="flex size-24 items-center justify-center rounded-card border border-border bg-white text-black">
                  <CompactMark option={option} size={44} />
                </div>
                <figcaption className="mt-2 text-caption text-fg-muted">{t("appIcon")}</figcaption>
              </figure>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
