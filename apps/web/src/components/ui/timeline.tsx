import { cx } from "./cx";

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  body?: string | undefined;
  done: boolean;
}

/** Vertical timeline: filled dot when done, outlined when upcoming. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <span
              aria-hidden
              className={cx(
                "size-3 shrink-0 rounded-pill border-2",
                item.done ? "border-fg bg-fg" : "border-fg-disabled bg-bg",
              )}
            />
            {index < items.length - 1 && <span aria-hidden className="w-px flex-1 bg-border" />}
          </div>
          <div className="pb-8">
            <p className="text-caption text-fg-muted">{item.date}</p>
            <p className={cx("mt-1 text-label", !item.done && "text-fg-muted")}>{item.title}</p>
            {item.body && <p className="mt-1 text-body-sm text-fg-muted">{item.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
