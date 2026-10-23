"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

const links = [
  { href: "/design", key: "system" },
  { href: "/design/fonts", key: "fonts" },
  { href: "/design/app-shell", key: "shell" },
] as const;

function isCurrent(pathname: string, href: string) {
  return href === "/design" ? pathname === href : pathname.startsWith(href);
}

export function DesignNav() {
  const t = useTranslations("design.system.nav");
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-content items-center justify-between border-b border-border px-4 lg:px-6">
      <nav aria-label={t("label")} className="flex gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
            className="-mb-px flex h-control items-center border-b-2 border-transparent text-label text-fg-muted transition-colors ui-hover:text-fg aria-[current=page]:border-fg aria-[current=page]:text-fg"
          >
            {t(link.key)}
          </Link>
        ))}
      </nav>
      <LocaleSwitcher />
    </div>
  );
}
