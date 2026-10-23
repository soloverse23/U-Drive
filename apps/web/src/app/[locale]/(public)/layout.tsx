import { TopNav } from "@/components/layout/top-nav";

export default function PublicLayout({ children }: LayoutProps<"/[locale]">) {
  return (
    <>
      <TopNav />
      {children}
    </>
  );
}
