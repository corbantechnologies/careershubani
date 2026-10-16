import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

const googleSans = localFont({
  src: [
    {
      path: "../public/fonts/GoogleSans-VariableFont.ttf",
      style: "normal",
      weight: "100 700",
    },
    {
      path: "../public/fonts/GoogleSans-Italic.ttf",
      style: "italic",
      weight: "100 700",
    },
  ],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://careers.hubani.org"),
  title: {
    default: "Hubani Careers | High-Velocity Growth & Executive Opportunities",
    template: "%s | Hubani Careers",
  },
  description:
    "Explore career opportunities at Hubani Limited. We are an agile holding company operating across music publishing, telemetry software, and international tournament leagues.",
  keywords: [
    "Hubani Careers",
    "Hubani Limited Jobs",
    "Company Secretary Jobs Kenya",
    "Chief of Staff Kenya",
    "Mombasa Jobs",
    "Remote Jobs Kenya",
    "BOTYA",
    "Nairobi Jobs",
  ],
  authors: [{ name: "Hubani Limited", url: "https://hubani.org" }],
  creator: "Hubani Limited",
  publisher: "Hubani Limited",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careers.hubani.org",
    title: "Hubani Careers | High-Velocity Growth & Executive Opportunities",
    description:
      "Explore executive and operational opportunities at Hubani Limited. Young directors, mentorship, high autonomy, and rapid growth.",
    siteName: "Hubani Careers",
  },
  twitter: {
    card: "summary",
    title: "Hubani Careers",
    description: "Explore executive and operational opportunities at Hubani Limited.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${googleSans.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-100 selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
