/**
 * Shape of every market, fee, tax and price value (spec §5).
 * Anything with `verified: false` must be labelled as an estimate in the UI.
 */
export interface ConfigValue<T> {
  value: T;
  unit: string;
  source: string;
  sourceUrl: string | null;
  /** ISO date (yyyy-mm-dd) the value was published or checked. */
  date: string;
  verified: boolean;
}

export function isEstimate(entry: ConfigValue<unknown>): boolean {
  return !entry.verified;
}
