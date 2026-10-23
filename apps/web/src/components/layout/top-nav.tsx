"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { buttonClasses } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "./wordmark";

// Public pages arrive in Phase 1; until then these links 404 by design.
const links = [
  { href: "/drivers", key: "drivers" },
  { href: "/owners", key: "owners" },
  { href: "/partners", key: "partners" },
  { href: "/how-it-works", key: "howItWorks" },
] as const;

const iconButton =
  "inline-flex size-12 items-center justify-center rounded-control transition-colors ui-hover:bg-surface ui-focus-visible:outline-2 ui-focus-visible:outline-fg";

/**
 * Public top bar (spec §3.5): wordmark, links, RO/EN, Log in, Sign up. Below xl the full-screen
 * menu is used: the Romanian labels are long and would wrap at tablet widths.
 */
export function TopNav() {
  const t = useTranslations("nav.top");
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-8 px-4 lg:px-6">
        <Wordmark />

        <nav aria-label={t("label")} className="hidden flex-1 xl:block">
          <ul className="flex gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-label whitespace-nowrap text-fg-muted transition-colors ui-hover:text-fg"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <LocaleSwitcher />
          <Link href="/login" className={buttonClasses({ variant: "tertiary", size: "compact" })}>
            {t("login")}
          </Link>
          <Link href="/signup" className={buttonClasses({ size: "compact" })}>
            {t("signup")}
          </Link>
        </div>

        <RadixDialog.Root open={open} onOpenChange={setOpen}>
          <RadixDialog.Trigger
            aria-label={t("openMenu")}
            className={`${iconButton} -mr-3 xl:hidden`}
          >
            <ListIcon size={24} aria-hidden />
          </RadixDialog.Trigger>
          <RadixDialog.Portal>
            <RadixDialog.Content className="fixed inset-0 z-50 flex flex-col bg-bg text-fg outline-hidden xl:hidden">
              <RadixDialog.Title className="sr-only">{t("menuTitle")}</RadixDialog.Title>
              <RadixDialog.Description className="sr-only">{t("label")}</RadixDialog.Description>
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Wordmark />
                <RadixDialog.Close aria-label={t("closeMenu")} className={`${iconButton} -mr-3`}>
                  <XIcon size={24} aria-hidden />
                </RadixDialog.Close>
              </div>
              <nav aria-label={t("label")} className="flex-1 overflow-y-auto px-4 py-8">
                <ul className="flex flex-col gap-6">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} onClick={() => setOpen(false)} className="text-h3">
                        {t(link.key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex flex-col gap-3 border-t border-border px-4 pt-4 pb-8">
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={buttonClasses({ size: "large", width: "full" })}
                >
                  {t("signup")}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={buttonClasses({ variant: "secondary", size: "large", width: "full" })}
                >
                  {t("login")}
                </Link>
                <div className="pt-3">
                  <LocaleSwitcher />
                </div>
              </div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        </RadixDialog.Root>
      </div>
    </header>
  );
}
