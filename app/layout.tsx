import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "@/providers/theme-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { VolcanoDataProvider } from "@/providers/volcano-data-provider";
import { CustomCursor } from "@/components/shared/custom-cursor";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist"
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://simonestella.github.io/ignis"),
  title: "Ignis — Interactive Volcano Map",
  description: "Explore active volcanoes worldwide on an interactive map powered by real-time USGS data.",
  icons: {
    icon: `${basePath}/icon.png`,
    apple: `${basePath}/apple-icon.png`,
  },
  appleWebApp: {
    capable: true,
    title: "Ignis",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Ignis — Interactive Volcano Map",
    description: "Explore active volcanoes worldwide on an interactive map powered by real-time USGS data.",
    images: [{ url: "/logo.png", width: 800, height: 400, alt: "Ignis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignis — Interactive Volcano Map",
    description: "Explore active volcanoes worldwide on an interactive map powered by real-time USGS data.",
    images: ["/logo.png"],
  },
  other: {
    referrer: "strict-origin-when-cross-origin",
  },
};

const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org",
  "connect-src 'self' https://volcanoes.usgs.gov",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <link rel="icon" type="image/png" href={`${basePath}/icon.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${basePath}/apple-icon.png`} />
      </head>
      <body className={`${geist.variable} antialiased`}>
        <AppProviders>
          <LocaleProvider>
            <VolcanoDataProvider>
              <CustomCursor />
              <div className="bg-orb bg-orb-1" aria-hidden />
              <div className="bg-orb bg-orb-2" aria-hidden />
              <div className="bg-orb bg-orb-3" aria-hidden />
              <div className="mesh-bg">
                {children}
              </div>
            </VolcanoDataProvider>
          </LocaleProvider>
        </AppProviders>
      </body>
    </html>
  );
}
