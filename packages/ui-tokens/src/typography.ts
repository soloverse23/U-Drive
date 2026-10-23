/** Type scale (spec §3.3). Sizes in px; the CSS output converts to rem. */
export interface TextStyle {
  size: number;
  lineHeight: number;
  weight: 400 | 500 | 700;
  letterSpacing?: string;
}

export const fontWeight = { regular: 400, medium: 500, bold: 700 } as const;

export const textStyles = {
  /** Desktop display; use `displaySm` below the lg breakpoint. */
  display: { size: 56, lineHeight: 64, weight: 700, letterSpacing: "-0.02em" },
  displaySm: { size: 40, lineHeight: 48, weight: 700, letterSpacing: "-0.02em" },
  h1: { size: 40, lineHeight: 48, weight: 700 },
  h2: { size: 32, lineHeight: 40, weight: 700 },
  h3: { size: 24, lineHeight: 32, weight: 700 },
  h4: { size: 20, lineHeight: 28, weight: 500 },
  bodyLg: { size: 18, lineHeight: 28, weight: 400 },
  body: { size: 16, lineHeight: 24, weight: 400 },
  bodySm: { size: 14, lineHeight: 20, weight: 400 },
  label: { size: 16, lineHeight: 20, weight: 500 },
  caption: { size: 12, lineHeight: 16, weight: 500 },
} as const satisfies Record<string, TextStyle>;

/** The chosen family is injected as `--font-brand` by the app (font pick pending, step 0.5). */
export const fontFallback = "ui-sans-serif, system-ui, sans-serif";
