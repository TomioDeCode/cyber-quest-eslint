import { SessionsProvider } from "@/components/core/SessionProvider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/core/ThemeProvider";

const fontPoppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cyberquest.web.id"),
  title: {
    default:
      "Cyber Quest - CTF Platform | Learn Cybersecurity Through Challenges",
    template: "%s | Cyber Quest CTF",
  },
  description:
    "Cyber Quest is a Capture The Flag (CTF) platform where you can learn cybersecurity through hands-on challenges, competitions, and educational resources.",
  keywords: [
    "CTF",
    "Capture The Flag",
    "Cybersecurity",
    "Security Challenges",
    "Hacking Competitions",
    "Security Learning",
  ],
  authors: [{ name: "Muhammad Syamsu Ni'am" }],
  creator: "TomioDeCode",
  publisher: "TomioDeCode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Cyber Quest - CTF Platform",
    description:
      "Learn cybersecurity through hands-on challenges and competitions",
    url: "https://cyberquest.web.id",
    siteName: "Cyber Quest CTF",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://cyberquest.web.id/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Cyber Quest CTF Platform",
      },
    ],
  },
  alternates: {
    types: {
      "application/x-instagram": "https://instagram.com/_this.niam",
      "application/x-github": "https://github.com/tomiodecode",
    },
  },
  verification: {
    other: {
      "instagram-verification": "@_this.niam",
      "github-verification": "TomioDeCode",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={false}
      itemScope
      itemType="http://schema.org/WebSite"
    >
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://cyberquest.web.id" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${fontPoppins.variable} antialiased`}>
        <SidebarProvider>
          <SessionsProvider>
            <ThemeProvider defaultTheme="system" attribute="class">
              <main className="min-h-screen w-full">
                {children}
                <Toaster />
              </main>
            </ThemeProvider>
          </SessionsProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
