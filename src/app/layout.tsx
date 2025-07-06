import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react"
import SessionProvider from "@/components/SessionProvider"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JouwLiedjes - AI Muziek Generator",
  description: "Maak je eigen unieke liedjes met AI voor slechts €5 per liedje",
  keywords: ["ai muziek", "muziek generator", "suno", "liedjes maken", "nederlands"],
  creator: "JouwLiedjes.nl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${inter.className} overflow-y-scroll`} >
        <SessionProvider>
          <Header />
          <main className="flex flex-col items-center m-auto w-full">
            {children}
          </main>
          <Footer />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
