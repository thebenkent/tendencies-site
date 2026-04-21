import Header from "../components/Header";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#080808",
        }}
      >
        <Header />
        <main style={{ paddingTop: "64px" }}>{children}</main>
      </body>
    </html>
  );
}