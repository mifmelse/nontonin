import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Nontonin — Nonton Film Gratis",
    template: "%s | Nontonin",
  },
  description:
    "Platform nonton film domain publik gratis. Streaming langsung dari Internet Archive dengan kualitas terbaik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-bg-base font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-7xl animate-fade-in">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
