import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MAD Insights",
  description: "Market Analytics Morocco",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: "#020617", color: "white" }}><div style={{ background: "#020617", minHeight: "100vh", width: "100%" }}>{children}</div></body>
    </html>
  );
}