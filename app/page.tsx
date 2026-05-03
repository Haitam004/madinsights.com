"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [market, setMarket] = useState<any>({});
  const [news, setNews] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch("/api/market").then(res => res.json()).then(setMarket).catch(() => setMarket({}));
    fetch("/api/news").then(res => res.json()).then(setNews).catch(() => setNews([]));
    fetch("/api/calendar").then(res => res.json()).then(setCalendar).catch(() => setCalendar([]));
  }, []);

  // --- LOGIQUE DE FILTRAGE ---
  const normalizeImpact = (impact: string) => {
    if (!impact) return "low";
    const i = impact.toLowerCase();
    return (i.includes("élev") || i.includes("high")) ? "high" : "low";
  };

  const importantEvents = calendar
    .filter(e => normalizeImpact(e.impact) === "high")
    .slice(0, 5);

  const topNews = news.slice(0, 5);

  const marketScore = (calendar.filter(e => e.impact === "high").length * 2) + (news.length > 0 ? 3 : 0);

  return (
    <div style={container}>
      <div style={pageWrapper}>
        
        {/* 1. HERO SECTION */}
        <div style={hero}>
          <h1 style={heroTitle}>Analyse économique Maroc 🇲🇦</h1>
          <p style={heroText}>Comprenez l’impact des news mondiales sur le marché marocain</p>
          <div style={ctaContainer}>
            <Link href="/calendar" style={cta}>📅 Voir Calendrier</Link>
            <Link href="/news" style={ctaSecondary}>📰 Actualités</Link>
          </div>
        </div>

        {/* 2. GRILLE D'ANALYSE (Les 6 cartes) */}
        <div style={analysisGrid}>
          <div style={analysisCard}>
            <p style={analysisTitle}>🧠 Score Marché</p>
            <h2 style={cardValue}>{marketScore}</h2>
            <p style={analysisDesc}>Basé sur événements + news</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>📊 Bias</p>
            <h2 style={{ ...cardValue, color: "#ff4d4d" }}>Risk OFF</h2>
            <p style={analysisDesc}>Direction globale du marché</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>🇲🇦 Impact Maroc</p>
            <h2 style={{ ...cardValue, color: "#facc15" }}>Pression USD</h2>
            <p style={analysisDesc}>Influence USD & inflation</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>⏱️ Prochain Event</p>
            <h3 style={{fontSize: '16px', margin: '10px 0'}}>US CPI Inflation</h3>
            <p style={{ color: "#aaa", fontSize: '12px' }}>Dans 0 min</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>💵 USD Direction</p>
            <h2 style={cardValue}>Neutre</h2>
            <p style={analysisDesc}>Basé sur calendrier USD</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>🚨 Zone Trading</p>
            <h2 style={{ ...cardValue, color: "#ff4d4d" }}>⚠️ Éviter</h2>
            <p style={analysisDesc}>Risque news imminentes</p>
          </div>
        </div>

        {/* 3. PRIX (Gold & USD/MAD) */}
        <div style={priceRow}>
          <div style={card}>
            <p style={analysisTitle}>GOLD</p>
            <h2 style={{ color: "#facc15", fontSize: '24px' }}>{market.gold || "4613.25"}</h2>
          </div>
          <div style={card}>
            <p style={analysisTitle}>USD/MAD</p>
            <h2 style={{ fontSize: '24px' }}>{market.usdmad || "9.238"}</h2>
          </div>
        </div>

        {/* 4. ÉVÉNEMENTS IMPORTANTS (Remis ici) */}
        <div style={card}>
          <h2 style={sectionTitle}>📅 Événements importants</h2>
          {importantEvents.length === 0 ? <p style={emptyText}>Aucun événement majeur</p> : 
            importantEvents.map((e, i) => (
              <p key={i} style={listItem}>
                {e.date ? new Date(e.date).toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"}) : "--:--"} • {e.title} <span style={{ color: "#ff4d4d" }}>🔴</span>
              </p>
            ))
          }
        </div>

        {/* 5. NEWS IMPORTANTES (Remis ici) */}
        <div style={card}>
          <h2 style={sectionTitle}>📰 News importantes</h2>
          {topNews.length === 0 ? <p style={emptyText}>Aucune news pour le moment</p> : 
            topNews.map((n, i) => <p key={i} style={listItem}>• {n.title}</p>)
          }
        </div>

      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const container = { background: "#020617", minHeight: "100vh", color: "white", width: "100%", overflowX: "hidden" as const };
const pageWrapper = { maxWidth: "1200px", margin: "0 auto", padding: "20px" };

const hero = { background: "#0b1e3a", padding: "30px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #1e293b" };
const heroTitle = { fontSize: "28px", fontWeight: "bold", marginBottom: "10px" };
const heroText = { color: "#94a3b8", marginBottom: "25px", fontSize: "14px" };

const ctaContainer = { display: "flex", gap: "12px" };
const cta = { padding: "10px 20px", background: "#facc15", color: "#000", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px", display: "inline-block" };
const ctaSecondary = { padding: "10px 20px", background: "#1e293b", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "14px", display: "inline-block" };

const analysisGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" };
const analysisCard = { background: "#0b1e3a", padding: "24px", borderRadius: "16px", border: "1px solid #1e293b" };

const analysisTitle = { color: "#94a3b8", fontSize: "12px", marginBottom: "10px" };
const cardValue = { fontSize: "24px", fontWeight: "bold", margin: "10px 0" };
const analysisDesc = { color: "#475569", fontSize: "12px" };

const priceRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px", marginBottom: "25px" };
const card = { background: "#0b1e3a", padding: "24px", borderRadius: "16px", border: "1px solid #1e293b", marginBottom: "20px" };

const sectionTitle = { fontSize: "18px", fontWeight: "bold", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" };
const listItem = { marginBottom: "12px", color: "#cbd5e1", fontSize: "14px", borderBottom: "1px solid #1e293b", paddingBottom: "8px" };
const emptyText = { color: "#475569", fontSize: "14px", fontStyle: "italic" };