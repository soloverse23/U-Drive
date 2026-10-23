import { useTranslations } from "next-intl";
import { brand } from "@u-drive/core";
import { Link } from "@/i18n/navigation";

/** Text wordmark until the designed one lands (step 0.8). */
export function Wordmark() {
  const t = useTranslations("nav.top");
  return (
    <Link
      href="/"
      aria-label={`${brand.name} — ${t("home")}`}
      className="rounded-control text-h4 font-bold ui-focus-visible:outline-2 ui-focus-visible:outline-offset-2 ui-focus-visible:outline-fg"
    >
      {brand.name}
    </Link>
  );
}
