import type { ReactNode } from "react";
import { Card } from "./card";

/** One-line explanation and one action (spec §3.5). No illustrations. */
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: ReactNode;
}) {
  return (
    <Card variant="filled" className="lg:p-8">
      <p className="text-h4">{title}</p>
      <p className="mt-2 text-body text-fg-muted">{body}</p>
      <div className="mt-6">{action}</div>
    </Card>
  );
}
