"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const normalizeImpact = (impact: string) => {
    if (!impact) return "low";
    const i = impact.toLowerCase();
    if (i.includes("élev") || i.includes("high")) return "high";
    if (i.includes("moy") || i.includes("medium")) return "medium";
    return "low";
  };

  const [market, setMarket] = useState<any>({});
  const [news, setNews] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/market")
      .then(res => res.json())
      .then(setMarket)
      .catch(() => setMarket({}));

    fetch("/api/news")
      .then(res => res.json())
      .then(setNews)
      .catch(() => setNews([]));

    fetch("/api/calendar")
      .then(res => res.json())
      .then(setCalendar)
      .catch(() => setCalendar([]));
  }, []);

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  const isRelevantEvent = (e: any) => {
    const c = e?.country;
    return c === "USD" || c === "EUR" || c === "MAD";
  };

  const isImportantKeyword = (title: string) => {
    const t = (title || "").toLowerCase();
    return t.includes("inflation") || t.includes("cpi") || t.includes("rate") || 
           t.includes("fed") || t.includes("gdp") || t.includes("oil");
  };

  const importantEvents = calendar
    .filter(e => normalizeImpact(e.impact) === "high" && isRelevantEvent(e) && isImportantKeyword(e.title))
    .slice(0, 5);
  
  const isRelevant = (title: string) => {
    const t = (title || "").toLowerCase();
    return t.includes("fed") || t.includes("inflation") || t.includes("cpi") || 
           t.includes("rate") || t.includes("oil") || t.includes("usd");
  };

  const topNews = news.filter(n => isRelevant(n.title)).slice(0, 5);
  const highImpactCount = calendar.filter(e => e.impact === "high").length;
  const newsScore = news.length > 0 ? Math.min(news.length, 5) : 0;
  const marketScore = highImpactCount * 2 + newsScore;

  let bias = "Neutre";
  let biasColor = "#aaa";
  if (marketScore >= 8) { bias = "Risk OFF"; biasColor = "#ff4d4d"; }
  else if (marketScore >= 4) { bias = "Volatile"; biasColor = "#facc15"; }
  else { bias = "Risk ON"; biasColor = "#4ade80"; }

  const nextEvent = calendar
    .filter(e => normalizeImpact(e.impact) === "high" && new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const getCountdown = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    if (diff <= 0) return "En cours";
    const min = Math.floor(diff / 60000);
    const h = Math.floor(min / 60);
    return h > 0 ? `${h}h ${min % 60}m` : `${min} min`;
  };

  let usdBias = "Neutre";
  let usdColor = "#aaa";
  const usdEvents = calendar.filter(e => e.country === "USD");
  if (usdEvents.length >= 3) { usdBias = "Volatil USD"; usdColor = "#facc15"; }
  if (usdEvents.filter(e => normalizeImpact(e.impact) === "high").length >= 2) {
    usdBias = "USD Très Volatil"; usdColor = "#ff4d4d";
  }

  let riskZone = "Safe";
  let riskColor = "#4ade80";
  if (nextEvent) {
    const diff = new Date(nextEvent.date).getTime() - Date.now();
    if (diff < 3600000) { riskZone = "⚠️ Éviter Trading"; riskColor = "#ff4d4d"; }
    else if (diff < 7200000) { riskZone = "Zone Volatile"; riskColor = "#facc15"; }
  }

  let moroccoImpact = "Stable";
  let moroccoColor = "#4ade80";
  const usdHigh = calendar.some(e => e.country === "USD" && normalizeImpact(e.impact) === "high");
  const madHigh = calendar.some(e => e.country === "MAD" && normalizeImpact(e.impact) === "high");
  if (usdHigh && madHigh) { moroccoImpact = "Volatil"; moroccoColor = "#ff4d4d"; }
  else if (usdHigh) { moroccoImpact = "Pression USD"; moroccoColor = "#facc15"; }
  else if (madHigh) { moroccoImpact = "Risque local"; moroccoColor = "#facc15"; }

  return (
    <div style={container}>
      {/* HEADER AMÉLIORÉ */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>MAD Insights</h2>
          <p style={subtitle}>Market Analytics • Morocco</p>
        </div>
        
        {/* Navigation isolée pour éviter l'accumulation */}
        <nav style={navLinks}>
          <Link href="/" style={activeLink}>Accueil</Link>
          <Link href="/news" style={link}>Actualités</Link>
          <Link href="/calendar" style={link}>Calendrier</Link>
        </nav>
      </div>

      <div style={horizontalScrollWrapper}>
        <div style={contentWidthLock}>
          
          <div style={hero}>
            <h1 style={heroTitle}>Analyse économique Maroc 🇲🇦</h1>
            <p style={heroText}>Comprenez l’impact des news mondiales sur le marché marocain</p>
            <div style={{ marginTop: "20px" }}>
              <Link href="/calendar" style={cta}>📅 Voir Calendrier</Link>
              <Link href="/news" style={ctaSecondary}>📰 Actualités</Link>
            </div>
          </div>

          <div style={analysisGrid}>
            <div style={analysisCard}>
              <p style={analysisTitle}>🧠 Score Marché</p>
              <h2>{marketScore}</h2>
              <p style={analysisDesc}>Basé sur événements + news</p>
            </div>
            <div style={analysisCard}>
              <p style={analysisTitle}>📊 Bias</p>
              <h2 style={{ color: biasColor }}>{bias}</h2>
              <p style={analysisDesc}>Direction globale du marché</p>
            </div>
            <div style={analysisCard}>
              <p style={analysisTitle}>🇲🇦 Impact Maroc</p>
              <h2 style={{ color: moroccoColor }}>{moroccoImpact}</h2>
              <p style={analysisDesc}>Influence USD & inflation</p>
            </div>
          </div>

          <div style={analysisGrid}>
            <div style={analysisCard}>
              <p style={analysisTitle}>⏱️ Prochain Event</p>
              {nextEvent ? (
                <>
                  <h3>{nextEvent.title}</h3>
                  <p style={{ color: "#aaa" }}>Dans {getCountdown(nextEvent.date)}</p>
                </>
              ) : <p>Aucun event</p>}
            </div>
            <div style={analysisCard}>
              <p style={analysisTitle}>💵 USD Direction</p>
              <h2 style={{ color: usdColor }}>{usdBias}</h2>
              <p style={analysisDesc}>Basé sur calendrier USD</p>
            </div>
            <div style={analysisCard}>
              <p style={analysisTitle}>🚨 Zone Trading</p>
              <h2 style={{ color: riskColor }}>{riskZone}</h2>
              <p style={analysisDesc}>Risque basé sur news imminentes</p>
            </div>
          </div>

          <div style={priceRow}>
            <div style={card}>
              <p>GOLD</p>
              <h2 style={gold}>{market.gold ? market.gold.toFixed(2) : "..."}</h2>
            </div>
            <div style={card}>
              <p>USD/MAD</p>
              <h2>{market.usdmad ? market.usdmad.toFixed(3) : "..."}</h2>
            </div>
          </div>

          <div style={card}>
            <h2 style={title}>📅 Événements importants</h2>
            {importantEvents.length === 0 ? <p>Aucun événement important</p> : 
              importantEvents.map((e, i) => (
                <p key={i} style={item}>
                  {e.date ? new Date(e.date).toLocaleTimeString("fr-FR", {hour: "2-digit", minute: "2-digit"}) : "--"} • {e.title} <span style={{ color: "#ff4d4d" }}>🔴</span>
                </p>
              ))
            }
          </div>

          <div style={card}>
            <h2 style={title}>📰 News importantes</h2>
            {topNews.length === 0 ? <p>Aucune news</p> : 
              topNews.map((n, i) => <p key={i} style={item}>• {n.title}</p>)
            }
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const container = { padding: "20px", background: "#020617", minHeight: "100vh", color: "white" };

// Header flexible pour éviter l'accumulation sur mobile
const header = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  flexWrap: "wrap" as const, 
  gap: "20px", 
  marginBottom: "30px", 
  borderBottom: "1px solid #1f3a5f", 
  paddingBottom: "15px" 
};

const navLinks = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap" as const
};

const link = { color: "#facc15", textDecoration: "none", fontSize: "14px" };
const activeLink = { color: "#fff", fontWeight: "bold", textDecoration: "none", fontSize: "14px" };
const subtitle = { margin: 0, fontSize: "12px", color: "#aaa" };
const hero = { background: "linear-gradient(135deg, #0b1e3a, #071530)", padding: "30px", borderRadius: "12px", marginBottom: "30px" };
const heroTitle = { fontSize: "24px", marginBottom: "10px" };
const heroText = { color: "#aaa", fontSize: "14px" };
const cta = { marginRight: "10px", padding: "10px 15px", background: "#facc15", color: "#000", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" };
const ctaSecondary = { padding: "10px 15px", background: "#071530", color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "13px" };
const priceRow = { display: "grid", gap: "15px", marginBottom: "30px", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" };
const card = { background: "#0b1e3a", padding: "20px", borderRadius: "12px", marginBottom: "20px" };
const title = { marginBottom: "10px", fontSize: "18px" };
const item = { marginBottom: "8px", color: "#ddd", fontSize: "14px" };
const gold = { color: "#facc15" };
const analysisGrid = { display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "nowrap" as const };
const analysisCard = { flex: "0 0 280px", background: "#0b1e3a", padding: "20px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" };
const analysisTitle = { color: "#aaa", fontSize: "13px", marginBottom: "5px" };
const analysisDesc = { color: "#777", fontSize: "12px" };
const horizontalScrollWrapper = { width: "100%", overflowX: "auto" as const, WebkitOverflowScrolling: "touch" as const };
const contentWidthLock = { minWidth: "900px", paddingBottom: "20px" };