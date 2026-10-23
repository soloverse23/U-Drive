import { notFound } from "next/navigation";

// Unknown paths under a valid locale render [locale]/not-found.tsx.
export default function CatchAll() {
  notFound();
}
