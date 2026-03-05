import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FundLink - Smart Funding Platform",
  description: "We connect your projects with the right companies and investors. No more cold emails or wondering who to contact – we know exactly where your idea belongs.",
  keywords: "funding, investment, startup, venture capital, angel investors, business funding",
  authors: [{ name: "FundLink" }],
  openGraph: {
    title: "FundLink - Smart Funding Platform",
    description: "Connect your projects with the right companies and investors",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FundLink - Smart Funding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FundLink - Smart Funding Platform",
    description: "Connect your projects with the right companies and investors",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}