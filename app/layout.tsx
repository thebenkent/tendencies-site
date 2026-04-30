import "./globals.css";
import Header from "@/components/Header";
import type { Metadata, Viewport } from "next";
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