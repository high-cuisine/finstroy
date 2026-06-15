import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/shared/context/ThemeContext";
import { themeInitScript } from "@/app/shared/lib/theme";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Финстрой — строительные материалы оптом",
  description:
    "Снабжаем строительные компании широким спектром материалов. Более 30 лет на рынке.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geologica.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
