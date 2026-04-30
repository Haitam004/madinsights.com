import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className} style={{
        margin: 0,
        background: "linear-gradient(135deg, #071530 0%, #0a1f44 50%, #020617 100%)",
        color: "white"
      }}>
        {children}
      </body>
    </html>
  );
}