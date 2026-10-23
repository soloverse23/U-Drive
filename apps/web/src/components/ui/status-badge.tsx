import {
  CheckCircleIcon,
  CircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";

export type Status = "success" | "warning" | "error" | "info" | "neutral";

const icons = {
  success: { Icon: CheckCircleIcon, color: "text-success" },
  warning: { Icon: WarningIcon, color: "text-warning" },
  error: { Icon: XCircleIcon, color: "text-error" },
  info: { Icon: InfoIcon, color: "text-info" },
  neutral: { Icon: CircleIcon, color: "text-fg-muted" },
} as const;

/** Icon carries the color, text stays fg: color is never the only signal (spec §3.2). */
export function StatusBadge({ status, children }: { status: Status; children: ReactNode }) {
  const { Icon, color } = icons[status];
  return (
    <span className="inline-flex items-center gap-1 rounded-pill border border-border bg-bg py-1 pr-3 pl-2 text-caption text-fg">
      <Icon size={16} aria-hidden className={color} />
      {children}
    </span>
  );
}
