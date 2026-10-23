import { brand } from "@u-drive/core";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 lg:py-24">
      <h1 className="text-display-sm lg:text-display">{brand.name}</h1>
    </main>
  );
}
