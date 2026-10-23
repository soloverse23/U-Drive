import type { Locale, Messages } from "@u-drive/i18n";

// Type-checks every translation key and locale used with next-intl.
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
