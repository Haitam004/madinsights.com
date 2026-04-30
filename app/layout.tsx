import { Inter } from "next/font/google";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  themeColor: "#020617",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          async
          crossOrigin="anonymous"
        />

        {children}

      </body>
    </html>
  );
}