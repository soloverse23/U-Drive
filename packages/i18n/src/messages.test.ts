import { describe, expect, it } from "vitest";
import { bannedPhrases, cedillaChars, flattenMessages } from "./copy-rules";
import { locales, messages } from "./index";

const flat = Object.fromEntries(locales.map((l) => [l, flattenMessages(messages[l])])) as Record<
  (typeof locales)[number],
  Record<string, string>
>;

describe("translation files", () => {
  it("ro and en have exactly the same keys", () => {
    expect(Object.keys(flat.en).sort()).toEqual(Object.keys(flat.ro).sort());
  });

  it.each(locales)("%s has no empty strings", (locale) => {
    const empty = Object.entries(flat[locale]).filter(([, v]) => v.trim() === "");
    expect(empty).toEqual([]);
  });

  it("Romanian uses comma-below ș/ț, never cedilla ş/ţ", () => {
    const bad = Object.entries(flat.ro).filter(([, v]) => cedillaChars.some((c) => v.includes(c)));
    expect(bad).toEqual([]);
  });

  it.each(locales)("%s contains no banned phrases (spec §3.8)", (locale) => {
    const bad = Object.entries(flat[locale]).filter(([, v]) =>
      bannedPhrases.some((p) => v.toLowerCase().includes(p)),
    );
    expect(bad).toEqual([]);
  });
});

describe("flattenMessages", () => {
  it("flattens nested keys with dots", () => {
    expect(flattenMessages({ a: { b: "x" }, c: "y" })).toEqual({ "a.b": "x", c: "y" });
  });

  it("rejects non-string leaves", () => {
    expect(() => flattenMessages({ a: 1 })).toThrow(/a/);
  });
});
