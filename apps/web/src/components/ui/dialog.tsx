"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { cx } from "./cx";

interface DialogBaseProps {
  trigger: ReactNode;
  title: string;
  description?: string | undefined;
  children?: ReactNode;
  /** Buttons; wrap closing ones in <DialogClose asChild>. */
  footer?: ReactNode;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

export const DialogClose = RadixDialog.Close;

const overlay = "fixed inset-0 z-40 bg-black/50";

function CloseButton() {
  const t = useTranslations("ui.dialog");
  return (
    <RadixDialog.Close
      aria-label={t("close")}
      className="-mt-2 -mr-2 inline-flex size-12 shrink-0 items-center justify-center rounded-control transition-colors ui-hover:bg-surface ui-focus-visible:outline-2 ui-focus-visible:outline-fg"
    >
      <XIcon size={24} aria-hidden />
    </RadixDialog.Close>
  );
}

function Body({ title, description, children, footer }: DialogBaseProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <RadixDialog.Title className="text-h3">{title}</RadixDialog.Title>
        <CloseButton />
      </div>
      {description ? (
        <RadixDialog.Description className="mt-2 text-body text-fg-muted">
          {description}
        </RadixDialog.Description>
      ) : (
        <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
      )}
      {children && <div className="mt-6">{children}</div>}
      {footer && (
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">{footer}</div>
      )}
    </>
  );
}

/** Centered modal. Focus is trapped; Escape and the overlay close it. */
export function Modal(props: DialogBaseProps) {
  return (
    <RadixDialog.Root
      {...(props.open !== undefined && { open: props.open })}
      {...(props.onOpenChange && { onOpenChange: props.onOpenChange })}
    >
      <RadixDialog.Trigger asChild>{props.trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={overlay} />
        <RadixDialog.Content
          className={cx(
            "fixed top-1/2 left-1/2 z-50 w-full max-w-dialog -translate-x-1/2 -translate-y-1/2",
            "rounded-card bg-bg p-6 text-fg shadow-overlay outline-hidden sm:p-8",
            // Keep a 16px gutter on phones.
            "max-sm:w-[calc(100%-2rem)]",
          )}
        >
          <Body {...props} />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

/** Mobile bottom sheet (spec §3.5). Same behavior as Modal, anchored to the bottom edge. */
export function BottomSheet(props: DialogBaseProps) {
  return (
    <RadixDialog.Root
      {...(props.open !== undefined && { open: props.open })}
      {...(props.onOpenChange && { onOpenChange: props.onOpenChange })}
    >
      <RadixDialog.Trigger asChild>{props.trigger}</RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={overlay} />
        <RadixDialog.Content
          className={cx(
            "fixed inset-x-0 bottom-0 z-50 overflow-y-auto rounded-t-card bg-bg px-4 pt-3 pb-8",
            "text-fg shadow-overlay outline-hidden sm:px-6",
            // Leave room above the sheet so it reads as a sheet, not a page.
            "max-h-[85dvh]",
          )}
          style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
        >
          <div aria-hidden className="mx-auto mb-4 h-1 w-12 rounded-pill bg-border" />
          <Body {...props} />
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
