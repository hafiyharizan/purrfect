import type { Metadata } from "next";
import { Baloo_2, Playfair_Display, Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Snuggle Cat Sitter — Snuggles Delivered Daily | Perth, WA",
  description:
    "In-home cat sitting for Southern River and surrounding Perth suburbs. Feeding & fresh water, litter cleaning, snuggles & playtime, and daily photo & video updates while you're away.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${playfair.variable} ${quicksand.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
