import { useTranslations } from "next-intl";
import { brand } from "@u-drive/core";
import { Link } from "@/i18n/navigation";
import { cx } from "@/components/ui/cx";
import { markArt, wordmarkArt } from "./wordmark-paths";

/**
 * "Lane" logo (option C, founder pick): outlined Instrument Sans Bold, so it renders
 * the same everywhere. Uses currentColor, so it follows dark sections.
 * Regenerate with tools/brand/build_wordmark.py.
 */
export function WordmarkSvg({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark" | undefined;
  className?: string | undefined;
}) {
  const art = variant === "full" ? wordmarkArt : markArt;
  return (
    <svg viewBox={art.viewBox} aria-hidden className={cx("h-4 w-auto fill-current", className)}>
      <path d={art.d} />
    </svg>
  );
}

/** Wordmark linking to the home page, as used in the top nav and app sidebar. */
export function Wordmark() {
  const t = useTranslations("nav.top");
  return (
    <Link
      href="/"
      aria-label={`${brand.name} — ${t("home")}`}
      className="inline-flex rounded-control py-2 ui-focus-visible:outline-2 ui-focus-visible:outline-offset-2 ui-focus-visible:outline-fg"
    >
      <WordmarkSvg />
    </Link>
  );
}
