import type { ReactNode } from "react";
import { XCircleIcon } from "@phosphor-icons/react/ssr";

/**
 * Shared field styling (spec §3.5): gray-50 fill, no border at rest, 2px black border on
 * focus, label above, helper or error below. Error text stays fg; the icon carries the color.
 */
export const controlClasses = [
  "h-control w-full rounded-control border-2 border-transparent bg-surface px-4",
  "text-body text-fg placeholder:text-fg-muted transition-colors outline-hidden",
  "ui-hover:bg-surface-strong ui-focus:border-fg ui-focus:bg-surface",
  "aria-invalid:border-error",
  "disabled:cursor-not-allowed disabled:bg-surface disabled:text-fg-disabled",
].join(" ");

export interface FieldProps {
  id: string;
  label: string;
  helper?: string | undefined;
  error?: string | undefined;
  children: ReactNode;
}

export function messageId(id: string) {
  return `${id}-message`;
}

export function Field({ id, label, helper, error, children }: FieldProps) {
  const message = error ?? helper;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label">
        {label}
      </label>
      {children}
      {message && (
        <p
          id={messageId(id)}
          className={error ? "flex items-center gap-2 text-body-sm" : "text-body-sm text-fg-muted"}
        >
          {error && <XCircleIcon size={16} aria-hidden className="shrink-0 text-error" />}
          {message}
        </p>
      )}
    </div>
  );
}

/** ARIA props a control needs to point at its helper/error message. */
export function describedBy(id: string, helper?: string, error?: string) {
  return {
    "aria-describedby": helper || error ? messageId(id) : undefined,
    "aria-invalid": error ? true : undefined,
  } as const;
}
