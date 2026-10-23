import { defaultLocale, messages } from "@u-drive/i18n";
import "./globals.css";

// Only reached for paths outside the proxy's locale handling; localized 404s use [locale]/not-found.tsx.
export default function GlobalNotFound() {
  const t = messages[defaultLocale].common.notFound;

  return (
    <html lang={defaultLocale}>
      <body>
        <main className="mx-auto max-w-content px-4 py-16 lg:px-6 lg:py-24">
          <h1 className="text-h1">{t.title}</h1>
          <a href={`/${defaultLocale}`} className="mt-8 inline-block text-label underline">
            {t.home}
          </a>
        </main>
      </body>
    </html>
  );
}
