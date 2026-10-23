"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState } from "react";

export interface SegmentOption {
  value: string;
  label: string;
}

/** 2–3 mutually exclusive options (spec §3.5). Always keeps one option selected. */
export function SegmentedControl({
  options,
  defaultValue,
  label,
  onValueChange,
}: {
  options: SegmentOption[];
  defaultValue?: string;
  label: string;
  onValueChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? options[0]?.value ?? "");

  return (
    <ToggleGroup.Root
      type="single"
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        if (!next) return; // ignore deselect
        setValue(next);
        onValueChange?.(next);
      }}
      className="inline-flex gap-1 rounded-control bg-surface-strong p-1"
    >
      {options.map((option) => (
        <ToggleGroup.Item
          key={option.value}
          value={option.value}
          className="h-control-compact rounded-control px-4 text-label text-fg-muted transition-colors ui-hover:text-fg ui-focus-visible:outline-2 ui-focus-visible:outline-fg data-[state=on]:bg-bg data-[state=on]:text-fg"
        >
          {option.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
