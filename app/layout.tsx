import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script"; 
import Footer from "./components/Footer"; // 1. On importe le Footer

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
      <head>
        {/* Intégration Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8489437208975699"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: "#020617", color: "white" }}>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
          
          {/* Le contenu de tes pages s'affiche ici */}
          <main style={{ flex: 1 }}>
            {children}
          </main>

          {/* 2. Le Footer s'affichera maintenant sur toutes les pages */}
          <Footer /> 
          
        </div>
      </body>
    </html>
  );
}