import enCommon from "../messages/en/common.json";
import enDesign from "../messages/en/design.json";
import enNav from "../messages/en/nav.json";
import roCommon from "../messages/ro/common.json";
import roDesign from "../messages/ro/design.json";
import roNav from "../messages/ro/nav.json";

export const locales = ["ro", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ro";

/** BCP 47 tags used for Intl formatting. */
export const intlLocale: Record<Locale, string> = { ro: "ro-RO", en: "en-GB" };

/** One namespace per feature; add new files to both locales and register them here. */
const ro = { common: roCommon, nav: roNav, design: roDesign };
export type Messages = typeof ro;

export const messages: Record<Locale, Messages> = {
  ro,
  en: { common: enCommon, nav: enNav, design: enDesign },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
