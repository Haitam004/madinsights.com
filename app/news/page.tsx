"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => {
        setNews(data);
        setLoading(false);
      });
  }, []);

  return (
    <div style={container}>

      {/* HEADER AVEC LIGNE DE SÉPARATION FINE */}
      <div style={headerWrapper}>
        <div style={headerContent}>
          <div>
            <h1 style={mainTitle}>MAD Insights</h1>
            <p style={subtitle}>Market Analytics • Morocco</p>
          </div>

          <nav style={navLinks}>
            <Link href="/" style={link}>Accueil</Link>
            <Link href="/news" style={activeLink}>Actualités</Link>
            <Link href="/calendar" style={link}>Calendrier</Link>
            
            {/* AJOUT DU LIEN DASHBOARD ICI */}
            <Link href="/dashboard" style={link}>Dashboard</Link>
            
            {/* LIEN D'AFFILIATION EXNESS RÉEL */}
            <a 
              href="https://one.exnessonelink.com/a/o9d6u5m1ye" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={exnessLink}
            >
              Trader sur Exness
            </a>
          </nav>
        </div>
      </div>

      {/* CORPS DE LA PAGE */}
      <div style={bodyContent}>
        <h2 style={sectionTitle}>Actualités</h2>

        {/* 2. APPEL À L'ACTION (CTA) CONTEXTUEL POUR EXNESS */}
        <div style={{
          background: "linear-gradient(90deg, #1e293b 0%, #0f172a 100%)",
          padding: "15px",
          borderRadius: "8px",
          borderLeft: "4px solid #facc15",
          marginBottom: "25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>Prêt à trader ces opportunités ?</p>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>Ouvrez un compte chez notre partenaire de confiance au Maroc.</p>
          </div>
          <a 
            href="https://one.exnessonelink.com/a/o9d6u5m1ye" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              backgroundColor: "#facc15", 
              color: "#000", 
              padding: "8px 15px", 
              borderRadius: "5px", 
              fontWeight: "bold", 
              textDecoration: "none",
              fontSize: "13px" 
            }}
          >
            Trader maintenant
          </a>
        </div>

        {/* PUB ADSENSE HAUT DE PAGE */}
        <div style={adSpaceHeader}>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8489437208975699"
               data-ad-slot="XXXXXXXXXX"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div style={newsList}>
            {news.map((n, i) => (
              <div key={i}>
                <div style={newsCard}>
                  <p style={newsTitle}>{n.title}</p>
                  <p style={sourceStyle}>Source: {n.source}</p>
                  
                  <p style={{
                    color: (n.impact === "Haut" || n.impact === "High") ? "#ff4d4d" : "#4ade80",
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginTop: "10px"
                  }}>
                    Impact : {n.impact || "Faible"}
                  </p>
                </div>

                {/* PUB ADSENSE TOUTES LES 3 NEWS */}
                {i % 3 === 2 && (
                  <div style={adSpaceInList}>
                    <ins className="adsbygoogle"
                         style={{ display: 'block' }}
                         data-ad-client="ca-pub-8489437208975699"
                         data-ad-slot="XXXXXXXXXX"
                         data-ad-format="fluid"
                         data-ad-layout-key="-fb+5w+4e-db+86"></ins>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = { background: "#020617", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif" };
const headerWrapper = { borderBottom: "1px solid #1e293b", padding: "20px 0", marginBottom: "30px" };
const headerContent = { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const mainTitle = { fontSize: "28px", fontWeight: "bold", margin: 0 };
const subtitle = { margin: 0, color: "#94a3b8", fontSize: "12px" };
const navLinks = { display: "flex", gap: "20px", alignItems: "center" };
const link = { color: "#facc15", textDecoration: "none", fontSize: "14px" };
const activeLink = { color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "14px" };

const exnessLink = { 
  color: "#000", 
  background: "#facc15", 
  padding: "6px 14px", 
  borderRadius: "6px", 
  textDecoration: "none", 
  fontSize: "13px", 
  fontWeight: "bold" as const,
  transition: "0.3s"
};

const bodyContent = { maxWidth: "1200px", margin: "0 auto", padding: "0 20px" };
const sectionTitle = { fontSize: "22px", marginBottom: "20px" };
const newsList = { display: "flex", flexDirection: "column" as const, gap: "15px" };
const newsCard = { background: "#0b1e3a", padding: "20px", borderRadius: "8px", border: "1px solid #1e293b" };
const newsTitle = { fontWeight: "bold", fontSize: "16px", margin: 0, lineHeight: "1.5" };
const sourceStyle = { color: "#94a3b8", fontSize: "13px", marginTop: "5px" };

const adSpaceHeader = { margin: "0 auto 30px auto", textAlign: "center" as const, minHeight: "90px" };
const adSpaceInList = { margin: "10px 0 25px 0", textAlign: "center" as const, minHeight: "100px" };