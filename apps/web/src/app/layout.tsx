import type { ReactNode } from "react";

// The real root layout (with <html lang>) is app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
