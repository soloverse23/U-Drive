import { describe, expect, it } from "vitest";
import { palette, semantic, status, type SemanticColor } from "./colors";
import { AA, contrastRatio } from "./contrast";

describe("contrastRatio", () => {
  it("matches known WCAG values", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
    expect(contrastRatio("#757575", "#FFFFFF")).toBeCloseTo(4.61, 2);
  });

  it("rejects non-hex input", () => {
    expect(() => contrastRatio("black", "#FFFFFF")).toThrow();
  });
});

// Every text role must pass AA on every background it is allowed on, in both modes.
const textOn: Partial<Record<SemanticColor, SemanticColor[]>> = {
  fg: ["bg", "surface", "surfaceStrong"],
  fgMuted: ["bg", "surface", "surfaceStrong"],
  fgSubtle: ["bg"],
  inverseFg: ["inverseBg"],
};

describe.each(["light", "dark"] as const)("%s mode", (mode) => {
  const roles = semantic[mode];

  for (const [text, backgrounds] of Object.entries(textOn)) {
    for (const bg of backgrounds) {
      it(`${text} on ${bg} passes AA text (4.5:1)`, () => {
        const ratio = contrastRatio(roles[text as SemanticColor], roles[bg]);
        expect(ratio).toBeGreaterThanOrEqual(AA.text);
      });
    }
  }

  // Status colors are icons/borders only, so they need the 3:1 non-text minimum.
  for (const [name, color] of Object.entries(status)) {
    for (const bg of ["bg", "surface"] as const) {
      it(`status ${name} on ${bg} passes AA non-text (3:1)`, () => {
        expect(contrastRatio(color, roles[bg])).toBeGreaterThanOrEqual(AA.nonText);
      });
    }
  }
});

describe("documented restrictions", () => {
  it("gray-500 is not usable as text on gray-50 (why fgSubtle is bg-only)", () => {
    expect(contrastRatio(palette.gray500, palette.gray50)).toBeLessThan(AA.text);
  });

  it("success and warning fail as text on white (why status colors are icon-only)", () => {
    expect(contrastRatio(status.success, palette.white)).toBeLessThan(AA.text);
    expect(contrastRatio(status.warning, palette.white)).toBeLessThan(AA.text);
  });
});

describe("component color pairs", () => {
  it("destructive button text (white on error) passes AA text", () => {
    expect(contrastRatio(palette.white, status.error)).toBeGreaterThanOrEqual(AA.text);
  });

  it("input placeholder (fg-muted on surface) passes AA text", () => {
    expect(contrastRatio(semantic.light.fgMuted, semantic.light.surface)).toBeGreaterThanOrEqual(
      AA.text,
    );
  });

  it("input error border (error on surface) passes AA non-text", () => {
    expect(contrastRatio(status.error, semantic.light.surface)).toBeGreaterThanOrEqual(AA.nonText);
  });
});
