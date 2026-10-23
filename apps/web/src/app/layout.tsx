import type { Metadata } from "next";
import type { ReactNode } from "react";
import { brand } from "@u-drive/core";

export const metadata: Metadata = {
  title: brand.name,
};

// Temporary root layout; step 0.4 moves pages under /[locale] with next-intl.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
