import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildThemeCss } from "./theme-css";

const css = buildThemeCss();

describe("theme.css", () => {
  it("is up to date with the tokens (run `pnpm --filter @u-drive/ui-tokens generate`)", () => {
    const committed = readFileSync(new URL("../theme.css", import.meta.url), "utf8");
    expect(committed).toBe(css);
  });

  it("resets Tailwind defaults so off-system values do not exist", () => {
    expect(css).toContain("--*: initial;");
  });

  it("emits the type scale in rem with line height and weight", () => {
    expect(css).toContain("--text-display: 3.5rem;");
    expect(css).toContain("--text-display--line-height: 4rem;");
    expect(css).toContain("--text-display--letter-spacing: -0.02em;");
    expect(css).toContain("--text-body-sm: 0.875rem;");
    expect(css).toContain("--text-h1: 2.5rem;");
    expect(css).toContain("--color-gray-50: #F6F6F6;");
    expect(css).toContain("--color-fg-muted: var(--ud-fg-muted);");
  });

  it("emits only the spec spacing scale", () => {
    const keys = [...css.matchAll(/--spacing-([\w-]+):/g)].map((m) => m[1]);
    expect(keys).toEqual([
      "px",
      "0",
      "1",
      "2",
      "3",
      "4",
      "6",
      "8",
      "12",
      "16",
      "24",
      "32",
      "control-compact",
      "control",
      "control-large",
    ]);
  });

  it("remaps semantic roles inside dark sections", () => {
    expect(css).toMatch(/\.dark-section \{[^}]*--ud-bg: #000000;/);
    expect(css).toMatch(/\.dark-section \{[^}]*--ud-fg: #FFFFFF;/);
  });
});
