/**
 * Joins class names. Deliberately not tailwind-merge: it doesn't know our token utilities
 * (e.g. it would treat text-label and text-fg as conflicting and drop one).
 */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
