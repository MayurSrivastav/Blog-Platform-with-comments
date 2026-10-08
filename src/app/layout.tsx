import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AuthNav from "./components/AuthNav";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A dynamic blog platform with comments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <header className="header">
            <div className="container header-content">
              <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                BlogApp
              </Link>
              <AuthNav />
            </div>
          </header>
          <main className="container main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
