"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import type { ReactNode } from "react";

export interface TabItem {
  value: string;
  label: string;
  content: ReactNode;
}

/** Tabs with a black underline on the active tab (spec §3.5). Keyboard: arrow keys. */
export function Tabs({
  items,
  defaultValue,
  label,
}: {
  items: TabItem[];
  defaultValue?: string;
  label: string;
}) {
  return (
    <RadixTabs.Root defaultValue={defaultValue ?? items[0]?.value}>
      <RadixTabs.List aria-label={label} className="flex gap-8 border-b border-border">
        {items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className="-mb-px h-control border-b-2 border-transparent text-label text-fg-muted transition-colors ui-hover:text-fg ui-focus-visible:outline-2 ui-focus-visible:outline-offset-2 ui-focus-visible:outline-fg data-[state=active]:border-fg data-[state=active]:text-fg"
          >
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {items.map((item) => (
        <RadixTabs.Content
          key={item.value}
          value={item.value}
          className="pt-6 ui-focus-visible:outline-2 ui-focus-visible:outline-fg"
        >
          {item.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  );
}
