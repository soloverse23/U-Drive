import { palette, semantic, status, type SemanticColor } from "./colors";
import { breakpoints, controlHeight, layout, motion, radius, shadow, spacing } from "./layout";
import { fontFallback, fontWeight, textStyles } from "./typography";

const kebab = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    // gray50 -> gray-50, but h1 stays h1
    .replace(/([a-z]{2,})([0-9])/g, "$1-$2")
    .toLowerCase();
const rem = (px: number) => (px === 0 ? "0" : `${px / 16}rem`);
const decl = (name: string, value: string | number) => `  --${name}: ${value};`;

/**
 * Tailwind v4 theme built from the tokens. `--*: initial` removes every Tailwind default,
 * so off-system values (rounded-2xl, shadow-lg, purple-500, p-5) simply do not exist.
 */
export function buildThemeCss(): string {
  const theme = [
    decl("*", "initial"),
    ...Object.entries(breakpoints).map(([k, v]) => decl(`breakpoint-${k}`, rem(v))),
    ...Object.entries({ ...palette, ...status }).map(([k, v]) => decl(`color-${kebab(k)}`, v)),
    decl("font-sans", `var(--font-brand), ${fontFallback}`),
    decl("default-font-family", "var(--font-sans)"),
    ...Object.entries(fontWeight).map(([k, v]) => decl(`font-weight-${k}`, v)),
    ...Object.entries(textStyles).flatMap(([k, s]) => {
      const name = `text-${kebab(k)}`;
      return [
        decl(name, rem(s.size)),
        decl(`${name}--line-height`, rem(s.lineHeight)),
        decl(`${name}--font-weight`, s.weight),
        ...("letterSpacing" in s ? [decl(`${name}--letter-spacing`, s.letterSpacing)] : []),
      ];
    }),
    decl("spacing-px", "1px"),
    ...Object.entries(spacing).map(([k, v]) => decl(`spacing-${k}`, rem(v))),
    ...Object.entries(controlHeight).map(([k, v]) =>
      decl(k === "default" ? "spacing-control" : `spacing-control-${k}`, rem(v)),
    ),
    decl("container-content", rem(layout.maxContentWidth)),
    decl("container-sidebar", rem(layout.sidebarWidth)),
    decl("container-dialog", rem(layout.dialogWidth)),
    ...Object.entries(radius).map(([k, v]) =>
      decl(`radius-${k}`, k === "pill" ? "9999px" : rem(v)),
    ),
    ...Object.entries(shadow).map(([k, v]) => decl(`shadow-${k}`, v)),
    decl("ease-out", motion.easing),
    decl("default-transition-duration", `${motion.durationFast}ms`),
    decl("default-transition-timing-function", motion.easing),
    decl("animate-spin", `spin ${motion.spinDuration}ms linear infinite`),
    "  @keyframes spin {",
    "    to {",
    "      transform: rotate(360deg);",
    "    }",
    "  }",
  ];

  const roles = Object.keys(semantic.light) as SemanticColor[];
  const roleVars = (mode: "light" | "dark") =>
    roles.map((role) => decl(`ud-${kebab(role)}`, semantic[mode][role]));

  return [
    "/* Generated from packages/ui-tokens/src. Do not edit; run `pnpm --filter @u-drive/ui-tokens generate`. */",
    "",
    "@theme {",
    ...theme,
    "}",
    "",
    "/* Semantic roles resolve at runtime so .dark-section can remap them. */",
    "@theme inline {",
    ...roles.map((role) => decl(`color-${kebab(role)}`, `var(--ud-${kebab(role)})`)),
    "}",
    "",
    ":root,",
    ".light-section {",
    ...roleVars("light"),
    "}",
    "",
    ".dark-section {",
    ...roleVars("dark"),
    "  background-color: var(--ud-bg);",
    "  color: var(--ud-fg);",
    "}",
    "",
  ].join("\n");
}
