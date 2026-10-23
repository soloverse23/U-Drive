import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react/ssr";
import { cx } from "./cx";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";
export type ButtonSize = "compact" | "default" | "large";
/** "mobile-full": full width below the sm breakpoint (spec §3.5, mobile forms). */
export type ButtonWidth = "auto" | "full" | "mobile-full";

const base = cx(
  "relative inline-flex shrink-0 select-none items-center justify-center gap-2 overflow-hidden",
  "rounded-control font-medium transition-colors",
  "ui-focus-visible:outline-2 ui-focus-visible:outline-offset-2 ui-focus-visible:outline-fg",
  // State layer: a wash of the text color, so hover/press work on light and dark surfaces.
  "before:pointer-events-none before:absolute before:inset-0 before:bg-current before:opacity-0",
  "before:transition-opacity ui-hover:before:opacity-8 ui-active:before:opacity-16",
  "disabled:cursor-not-allowed disabled:before:hidden aria-busy:cursor-progress",
);

const variants: Record<ButtonVariant, string> = {
  primary: "bg-inverse-bg text-inverse-fg disabled:bg-surface-strong disabled:text-fg-disabled",
  secondary: "bg-surface-strong text-fg disabled:text-fg-disabled",
  tertiary: cx(
    "bg-transparent text-fg underline-offset-4 before:hidden",
    "ui-hover:underline ui-active:underline disabled:text-fg-disabled",
  ),
  destructive: "bg-error text-white disabled:bg-surface-strong disabled:text-fg-disabled",
};

const sizes: Record<ButtonSize, string> = {
  compact: "h-control-compact px-3 text-body-sm",
  default: "h-control px-4 text-label",
  large: "h-control-large px-6 text-label",
};

const widths: Record<ButtonWidth, string> = {
  auto: "",
  full: "w-full",
  "mobile-full": "w-full sm:w-auto",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  width?: ButtonWidth | undefined;
}

/** Same look for links styled as buttons. */
export function buttonClasses({
  variant = "primary",
  size = "default",
  width = "auto",
}: ButtonStyleOptions = {}): string {
  return cx(base, variants[variant], sizes[size], widths[width]);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  /** Shows a spinner, keeps the label, and blocks clicks while an action runs. */
  loading?: boolean | undefined;
  /** Leading icon (24px; 16px for compact). */
  icon?: ReactNode | undefined;
}

export function Button({
  variant,
  size = "default",
  width,
  loading = false,
  icon,
  className,
  children,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const iconSize = size === "compact" ? 16 : 24;
  return (
    <button
      type={type}
      className={cx(buttonClasses({ variant, size, width }), className)}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading ? (
        <CircleNotchIcon
          size={iconSize}
          aria-hidden
          className="animate-spin motion-reduce:animate-none"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
