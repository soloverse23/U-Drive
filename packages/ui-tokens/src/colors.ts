/** Raw palette (spec §3.2). No brand accent: black is the accent. */
export const palette = {
  black: "#000000",
  white: "#FFFFFF",
  gray50: "#F6F6F6",
  gray100: "#EEEEEE",
  gray200: "#E2E2E2",
  gray300: "#CBCBCB",
  gray400: "#AFAFAF",
  gray500: "#757575",
  gray600: "#545454",
  gray700: "#333333",
  gray800: "#1F1F1F",
} as const;

/**
 * Status colors are for icons, borders and indicator bars only (non-text, 3:1).
 * Status message text uses `fg`, so color is never the only signal and text always passes AA.
 * See docs/DECISIONS.md (2026-10-23, status colors).
 */
export const status = {
  success: "#05944F",
  warning: "#C77700",
  error: "#E11900",
  info: "#276EF1",
} as const;

export type SemanticColor =
  | "bg"
  | "surface"
  | "surfaceStrong"
  | "border"
  | "fg"
  | "fgMuted"
  | "fgSubtle"
  | "fgDisabled"
  | "inverseBg"
  | "inverseFg";

/**
 * Components use these roles, never raw palette values, so a dark section
 * (spec §3.2 "dark-section variant") only swaps the mapping.
 */
export const semantic: Record<"light" | "dark", Record<SemanticColor, string>> = {
  light: {
    bg: palette.white,
    surface: palette.gray50,
    surfaceStrong: palette.gray100,
    border: palette.gray200,
    fg: palette.black,
    fgMuted: palette.gray600,
    /** Only on `bg`: gray-500 fails AA on gray-50/100. */
    fgSubtle: palette.gray500,
    fgDisabled: palette.gray400,
    inverseBg: palette.black,
    inverseFg: palette.white,
  },
  dark: {
    bg: palette.black,
    surface: palette.gray800,
    surfaceStrong: palette.gray700,
    border: palette.gray700,
    fg: palette.white,
    fgMuted: palette.gray400,
    fgSubtle: palette.gray400,
    fgDisabled: palette.gray600,
    inverseBg: palette.white,
    inverseFg: palette.black,
  },
};
