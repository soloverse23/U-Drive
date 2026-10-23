import { defaultLocale, locales } from "@u-drive/i18n";
import { defineRouting } from "next-intl/routing";

// Locale is always in the URL (/ro/..., /en/...), per spec §2.
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
