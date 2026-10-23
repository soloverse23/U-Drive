import { describe, expect, it } from "vitest";
import { isEstimate, type ConfigValue } from "./types";

const entry = (verified: boolean): ConfigValue<number> => ({
  value: 1,
  unit: "count",
  source: "test",
  sourceUrl: null,
  date: "2026-01-01",
  verified,
});

describe("isEstimate", () => {
  it("treats unverified values as estimates", () => {
    expect(isEstimate(entry(false))).toBe(true);
  });

  it("treats verified values as facts", () => {
    expect(isEstimate(entry(true))).toBe(false);
  });
});
