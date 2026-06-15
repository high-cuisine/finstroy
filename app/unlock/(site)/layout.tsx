import { AppShell } from "@/app/shared/components/AppShell/AppShell";

export default function UnlockSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
