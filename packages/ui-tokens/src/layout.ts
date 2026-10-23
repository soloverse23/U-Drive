/** Spacing, shape, layout, elevation and motion (spec §3.4, §3.6). Values in px. */

/** 4px base unit. Keys follow Tailwind's naming (key × 4px). Nothing outside this scale exists. */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  24: 96,
  32: 128,
} as const;

/** Control heights (buttons, inputs) — component sizes, not spacing. */
export const controlHeight = { compact: 36, default: 48, large: 56 } as const;

export const radius = {
  /** Buttons and inputs. */
  control: 8,
  /** Cards and images. */
  card: 12,
  /** Chips and tags only. */
  pill: 9999,
} as const;

export const layout = {
  maxContentWidth: 1280,
  /** App sidebar on desktop (design-system addition). */
  sidebarWidth: 256,
  /** Max width of modals and toasts (design-system addition). */
  dialogWidth: 560,
  columns: { mobile: 4, desktop: 12 },
  sectionPadding: { mobile: 64, desktop: 96 },
  gutter: { mobile: 16, desktop: 24 },
} as const;

/** Spec has no breakpoints; these are Tailwind's defaults (recorded in DECISIONS.md). */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

/** Flat UI: the only shadow is for overlays (menus, modals, sheets). */
export const shadow = {
  overlay: "0 8px 24px rgba(0, 0, 0, 0.16)",
} as const;

export const motion = {
  durationFast: 150,
  durationBase: 200,
  easing: "cubic-bezier(0, 0, 0.2, 1)",
  /** Loading spinner only (design-system addition); disabled under prefers-reduced-motion. */
  spinDuration: 1000,
} as const;

/** 24px is the standard; 16px only inside compact elements (badges, compact buttons, captions). */
export const iconSize = { default: 24, small: 16 } as const;
