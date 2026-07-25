import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "LuminaStore | The Premium Marketplace",
    template: "%s | LuminaStore"
  },
  description: "Discover luxury products, exclusive brands, and a seamless shopping experience.",
  keywords: ["ecommerce", "luxury", "marketplace", "premium"],
  authors: [{ name: "LuminaStore Team" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.luminastore.com",
    title: "LuminaStore | The Premium Marketplace",
    description: "Discover luxury products, exclusive brands, and a seamless shopping experience.",
    siteName: "LuminaStore",
  },
  twitter: {
    card: "summary_large_image",
    title: "LuminaStore | The Premium Marketplace",
    description: "Discover luxury products, exclusive brands, and a seamless shopping experience.",
    creator: "@luminastore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <QueryProvider>
          <AuthProvider>
            <SmoothScroll>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScroll>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
