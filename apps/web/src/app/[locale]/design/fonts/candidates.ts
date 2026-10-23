import { Figtree, Instrument_Sans, Inter, Manrope } from "next/font/google";

// next/font downloads these at build time and serves them from our domain:
// no runtime request to Google. Options must be literals (next/font requirement).
const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const fontCandidates = [
  { id: "manrope", name: "Manrope", className: manrope.className },
  { id: "figtree", name: "Figtree", className: figtree.className },
  { id: "instrument-sans", name: "Instrument Sans", className: instrumentSans.className },
  { id: "inter", name: "Inter", className: inter.className },
] as const;
