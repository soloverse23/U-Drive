import { describe, expect, it } from "vitest";
import type { ConfigValue } from "./config/types";
import { formatDate, formatMoney, ronToEur } from "./format";

const NBSP = " ";

describe("formatMoney", () => {
  it("writes RON as lei in Romanian", () => {
    expect(formatMoney(1234.5, "RON", "ro")).toBe(`1.234,50${NBSP}lei`);
  });

  it("writes RON as lei in English too", () => {
    expect(formatMoney(1234.5, "RON", "en")).toBe(`1,234.50${NBSP}lei`);
  });

  it("groups thousands in Romanian even for 4-digit amounts", () => {
    expect(formatMoney(7000, "RON", "ro", { decimals: 0 })).toBe(`7.000${NBSP}lei`);
  });

  it("formats EUR and supports whole amounts", () => {
    expect(formatMoney(15000, "EUR", "ro", { decimals: 0 })).toBe(`15.000${NBSP}EUR`);
  });
});

describe("formatDate", () => {
  it("uses dd.mm.yyyy in Romanian", () => {
    expect(formatDate("2026-03-05T12:00:00Z", "ro")).toBe("05.03.2026");
  });

  it("uses dd/mm/yyyy in English", () => {
    expect(formatDate(new Date("2026-03-05T12:00:00Z"), "en")).toBe("05/03/2026");
  });

  it("uses Bucharest time, not UTC", () => {
    // 23:30 UTC on 31 Dec is already 1 Jan in Bucharest (UTC+2).
    expect(formatDate("2026-12-31T23:30:00Z", "ro")).toBe("01.01.2027");
  });
});

describe("ronToEur", () => {
  const rate = (value: number, verified: boolean): ConfigValue<number> => ({
    value,
    unit: "RON per EUR",
    source: "test",
    sourceUrl: null,
    date: "2026-01-01",
    verified,
  });

  it("divides by the rate", () => {
    expect(ronToEur(1000, rate(5, true)).value).toBe(200);
  });

  it("flags results from an unverified rate as estimates", () => {
    expect(ronToEur(1000, rate(5, false)).estimate).toBe(true);
    expect(ronToEur(1000, rate(5, true)).estimate).toBe(false);
  });

  it("rejects a non-positive rate", () => {
    expect(() => ronToEur(1000, rate(0, false))).toThrow();
  });
});
