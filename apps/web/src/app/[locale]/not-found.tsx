import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <main className="mx-auto max-w-content px-4 py-16 lg:px-6 lg:py-24">
      <h1 className="text-h1">{t("title")}</h1>
      <p className="mt-4 text-body-lg text-fg-muted">{t("body")}</p>
      <Link href="/" className="mt-8 inline-block text-label underline underline-offset-4">
        {t("home")}
      </Link>
    </main>
  );
}
