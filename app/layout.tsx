import "./globals.css";
import Header from "@/components/Header";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tendencies.co.nz"),

  title: "Tendencies",
  description: "Custom merch & apparel.",

  icons: {
    icon: "/icon-v2.png?v=3",
  },

  openGraph: {
    title: "Tendencies",
    description: "Custom merch & apparel.",
    url: "https://www.tendencies.co.nz",
    siteName: "Tendencies",
    images: [
      {
        url: "/og-image.jpg", // add this file to /public
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  verification: {
    google: "google4ad118bd24d3f279",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}