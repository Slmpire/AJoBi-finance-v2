import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AjoBI | Your hustle , your credit history",
  description: "AjoBI digitizes Nigeria's traditional Ajo/Esusu cooperative savings system. Save together, grow together — powered by Nomba.",
  manifest: "/manifest.json",
  keywords: ["ajo", "esusu", "cooperative savings", "Nigeria", "fintech", "savings group", "escrow"],
  authors: [{ name: "Pelumi Ogunleye", url: "https://github.com/Slmpire" }],

  // Favicon
  icons: {
    icon: [
      { url: "/images/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/icon-192x192.png",
  },

  // Open Graph — shows when link is shared on WhatsApp, LinkedIn, Telegram
  openGraph: {
    title: "AjoBI — Digital Cooperative Savings",
    description: "Your hustle is your credit history. Save with trusted people, rotate payouts automatically, transact securely in escrow.",
    url: "https://ajobi-frontend.vercel.app",
    siteName: "AjoBI",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "AjoBI — Digital Cooperative Savings Platform",
      },
    ],
    locale: "en_NG",
    type: "website",
  },

  // Twitter/X card
  twitter: {
    card: "summary_large_image",
    title: "AjoBI — Digital Cooperative Savings",
    description: "Your hustle is your credit history. Digitizing Nigeria's Ajo/Esusu savings tradition.",
    images: ["/images/ajobi_hero.png"],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AjoBI",
  },
};

export const viewport: Viewport = {
  themeColor: "#006C49",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-[#F4FBF4] text-[#111827]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
