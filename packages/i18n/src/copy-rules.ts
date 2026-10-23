/** Banned marketing phrases (spec §3.8), matched case-insensitively as substrings. */
export const bannedPhrases = [
  "revolutionary",
  "unlock",
  "seamless",
  "game-changer",
  "game changer",
  "next-level",
  "next level",
  "supercharge",
  "effortless",
  "ai-powered",
  "revoluționar",
  "fără efort",
  "fără cusur",
  "deblochează",
  "următorul nivel",
  "bazat pe ai",
  "alimentat de ai",
] as const;

/** Cedilla forms that must never appear in Romanian (use ș ț Ș Ț, comma-below). */
export const cedillaChars = ["ş", "ţ", "Ş", "Ţ"] as const;

export function flattenMessages(tree: unknown, prefix = ""): Record<string, string> {
  if (typeof tree === "string") return { [prefix]: tree };
  if (tree === null || typeof tree !== "object") {
    throw new Error(`Invalid message at "${prefix}": expected string or object`);
  }
  return Object.entries(tree).reduce<Record<string, string>>(
    (acc, [key, value]) => ({
      ...acc,
      ...flattenMessages(value, prefix ? `${prefix}.${key}` : key),
    }),
    {},
  );
}
