"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastStatus = "success" | "warning" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  status: ToastStatus;
}

const icons = {
  success: { Icon: CheckCircleIcon, color: "text-success" },
  warning: { Icon: WarningIcon, color: "text-warning" },
  error: { Icon: XCircleIcon, color: "text-error" },
  info: { Icon: InfoIcon, color: "text-info" },
} as const;

const ToastContext = createContext<((message: string, status?: ToastStatus) => void) | null>(null);

/** Shows a short confirmation. Messages must come from translations. */
export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used inside <ToastProvider>");
  return show;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("ui.toast");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((message: string, status: ToastStatus = "success") => {
    setToasts((current) => [...current, { id: Date.now(), message, status }]);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      <RadixToast.Provider duration={5000} label={t("region")}>
        {children}
        {toasts.map((toast) => {
          const { Icon, color } = icons[toast.status];
          return (
            <RadixToast.Root
              key={toast.id}
              onOpenChange={(open) => {
                if (!open) setToasts((current) => current.filter((x) => x.id !== toast.id));
              }}
              className="flex items-center gap-3 rounded-card bg-inverse-bg py-3 pr-3 pl-4 text-inverse-fg shadow-overlay"
            >
              {/* Dark surface: status colors still pass 3:1 for icons on black. */}
              <Icon size={24} aria-hidden className={`shrink-0 ${color}`} />
              <RadixToast.Description className="flex-1 text-body">
                {toast.message}
              </RadixToast.Description>
              <RadixToast.Close
                aria-label={t("close")}
                className="inline-flex size-12 shrink-0 items-center justify-center rounded-control ui-focus-visible:outline-2 ui-focus-visible:outline-inverse-fg"
              >
                <XIcon size={24} aria-hidden />
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className="fixed inset-x-4 bottom-4 z-50 flex flex-col gap-2 outline-hidden sm:right-6 sm:bottom-6 sm:left-auto sm:w-full sm:max-w-dialog" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}
