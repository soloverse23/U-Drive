import { Instrument_Sans } from "next/font/google";

// Brand typeface (founder pick, 2026-10-23). Self-hosted at build time; exposed as
// --font-brand, which the token theme uses for --font-sans.
export const brandFont = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-brand",
});
