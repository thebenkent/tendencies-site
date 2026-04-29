import Header from "@/components/Header";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Tendencies",
  description: "Custom merch & apparel.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
      </body>
    </html>
  );
}