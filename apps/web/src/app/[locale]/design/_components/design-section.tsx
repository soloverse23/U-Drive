import type { ReactNode } from "react";

export function DesignSection({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-8 border-t border-border py-12 lg:grid-cols-12 lg:py-16"
    >
      <header className="lg:col-span-3">
        <h2 id={id} className="text-h3">
          {title}
        </h2>
        {note && <p className="mt-2 text-body-sm text-fg-muted">{note}</p>}
      </header>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

/** Small mono-ish caption under a sample: token name and value. */
export function TokenCaption({ name, value }: { name: string; value: string }) {
  return (
    <p className="mt-2 text-caption">
      <span className="block">{name}</span>
      <span className="block text-fg-muted">{value}</span>
    </p>
  );
}
