import type { HTMLAttributes } from "react";
import { cx } from "./cx";

/** Flat cards only (spec §3.5): white with a gray-200 border, or a gray-50 fill. */
export function Card({
  variant = "bordered",
  padding = "default",
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  variant?: "bordered" | "filled" | undefined;
  /** "none" for edge-to-edge media (e.g. a car photo on top). */
  padding?: "default" | "none" | undefined;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-card",
        padding === "default" && "p-6",
        variant === "bordered" ? "border border-border bg-bg" : "bg-surface",
        className,
      )}
      {...rest}
    />
  );
}
