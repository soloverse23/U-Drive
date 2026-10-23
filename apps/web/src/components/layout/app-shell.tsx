"use client";

import type { Icon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cx } from "@/components/ui/cx";
import { Link, usePathname } from "@/i18n/navigation";
import { Wordmark } from "./wordmark";

export interface AppNavItem {
  href: string;
  label: string;
  /** Bottom tab bar label (one short word). */
  shortLabel: string;
  icon: Icon;
}

/** Spec §3.5: bottom tab bar holds at most 5 tabs. */
const MAX_TABS = 5;

function isActive(pathname: string, href: string, rootHref: string) {
  return href === rootHref
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

/** Logged-in layout: left sidebar on desktop, bottom tab bar on mobile. */
export function AppShell({ items, children }: { items: AppNavItem[]; children: ReactNode }) {
  const t = useTranslations("nav.app");
  const pathname = usePathname();
  const rootHref = items[0]?.href ?? "/";
  const tabs = items.slice(0, MAX_TABS);

  return (
    <div className="lg:flex">
      <aside className="sticky top-0 hidden h-screen w-sidebar shrink-0 flex-col border-r border-border px-4 py-6 lg:flex">
        <div className="px-3">
          <Wordmark />
        </div>
        <nav aria-label={t("label")} className="mt-8 flex-1">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const active = isActive(pathname, item.href, rootHref);
              const ItemIcon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex h-control items-center gap-3 rounded-control px-3 text-label transition-colors",
                      "ui-focus-visible:outline-2 ui-focus-visible:outline-fg",
                      active
                        ? "bg-surface-strong text-fg"
                        : "text-fg-muted ui-hover:bg-surface ui-hover:text-fg",
                    )}
                  >
                    <ItemIcon size={24} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-3">
          <LocaleSwitcher />
        </div>
      </aside>

      <main className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</main>

      <nav
        aria-label={t("label")}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="flex">
          {tabs.map((item) => {
            const active = isActive(pathname, item.href, rootHref);
            const ItemIcon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex flex-col items-center gap-1 border-t-2 pt-2 pb-2 text-caption transition-colors",
                    "ui-focus-visible:outline-2 ui-focus-visible:-outline-offset-2 ui-focus-visible:outline-fg",
                    active ? "border-fg text-fg" : "border-transparent text-fg-muted",
                  )}
                >
                  <ItemIcon size={24} aria-hidden />
                  {item.shortLabel}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
