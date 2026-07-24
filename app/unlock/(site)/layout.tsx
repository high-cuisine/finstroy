import { UnlockChrome } from "./UnlockChrome";

export default function UnlockSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UnlockChrome>{children}</UnlockChrome>;
}
