import { intlLocale, type Locale } from "@u-drive/i18n";
import type { ConfigValue } from "./config/types";

export type Currency = "RON" | "EUR";

/** All dates are shown in Romanian time, whatever the viewer's device zone. */
const TIME_ZONE = "Europe/Bucharest";

/** RON is always written "lei" after the amount, in every locale (founder decision). */
const RON_UNIT = "lei";

/** ro: "1.234,50 lei" · en: "1,234.50 lei". Prices default to 2 decimals. */
export function formatMoney(
  amount: number,
  currency: Currency,
  locale: Locale,
  { decimals = 2 }: { decimals?: number } = {},
): string {
  const digits = { minimumFractionDigits: decimals, maximumFractionDigits: decimals };
  if (currency === "RON") {
    const number = new Intl.NumberFormat(intlLocale[locale], digits).format(amount);
    return `${number}\u00a0${RON_UNIT}`;
  }
  return new Intl.NumberFormat(intlLocale[locale], {
    style: "currency",
    currency,
    ...digits,
  }).format(amount);
}

/** ro: dd.mm.yyyy (spec §2) · en: dd/mm/yyyy. */
export function formatDate(date: Date | string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(typeof date === "string" ? new Date(date) : date);
}

/**
 * Converts RON to EUR with a BNR rate from config (unit: RON per 1 EUR).
 * `estimate` is true while the rate is unverified, so the UI can label it.
 */
export function ronToEur(
  ron: number,
  rate: ConfigValue<number>,
): { value: number; estimate: boolean } {
  if (rate.value <= 0) throw new Error("Exchange rate must be positive");
  return { value: ron / rate.value, estimate: !rate.verified };
}
