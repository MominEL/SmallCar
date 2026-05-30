import type { Metadata } from "next";
import { Playfair_Display, Syne } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeToggle/ThemeScript";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "SmallCar by PMS Motors — Premium City Cars, Virginia Water",
    template: "%s | SmallCar by PMS Motors",
  },
  description:
    "A curated collection of premium compact cars — each personally sourced and verified. Based in Virginia Water, Surrey. Enquire to view.",
  keywords: [
    "small cars",
    "city cars",
    "MINI",
    "Fiat 500",
    "Abarth",
    "Virginia Water",
    "Surrey",
    "used cars",
    "PMS Motors",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "SmallCar by PMS Motors",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { GlobalToast } from "@/components/Compare/GlobalToast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${playfair.variable} ${syne.variable}`}>
        {children}
        <GlobalToast />
      </body>
    </html>
  );
}
