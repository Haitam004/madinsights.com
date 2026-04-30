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

  // 🔥 EVENTS HIGH IMPACT
 const isRelevantEvent = (e: any) => {
  const c = e?.country;

  return (
    c === "USD" ||
    c === "EUR" ||
    c === "MAD"
  );
};

const isImportantKeyword = (title: string) => {
  const t = (title || "").toLowerCase();

  return (
    t.includes("inflation") ||
    t.includes("cpi") ||
    t.includes("rate") ||
    t.includes("fed") ||
    t.includes("gdp") ||
    t.includes("oil")
  );
};

const importantEvents = calendar
  .filter(e =>
   normalizeImpact(e.impact) === "high" &&
    isRelevantEvent(e) &&
    isImportantKeyword(e.title)
  )
  .slice(0, 5);
 
  
  // 🔥 TOP NEWS
 const isRelevant = (title: string) => {
  const t = (title || "").toLowerCase();

  return (
    t.includes("fed") ||
    t.includes("inflation") ||
    t.includes("cpi") ||
    t.includes("rate") ||
    t.includes("oil") ||
    t.includes("usd") ||
    t.includes("economy") ||
    t.includes("growth")
  );
};

const topNews = news
  .filter(n => isRelevant(n.title))
  .slice(0, 5);

// 🧠 SCORE MARCHE
const highImpactCount = calendar.filter(e => e.impact === "high").length;

const newsScore = news.length > 0 ? Math.min(news.length, 5) : 0;

const marketScore = highImpactCount * 2 + newsScore;

// 📊 BIAS
let bias = "Neutre";
let biasColor = "#aaa";

if (marketScore >= 8) {
  bias = "Risk OFF";
  biasColor = "#ff4d4d";
} else if (marketScore >= 4) {
  bias = "Volatile";
  biasColor = "#facc15";
} else {
  bias = "Risk ON";
  biasColor = "#4ade80";
}
// ⏱️ PROCHAIN EVENT HIGH IMPACT
const nextEvent = calendar
  .filter(e => normalizeImpact(e.impact) === "high" && new Date(e.date) > new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

// ⏳ COUNTDOWN
const getCountdown = (date: string) => {
  const diff = new Date(date).getTime() - Date.now();

  if (diff <= 0) return "En cours";

  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);

  if (h > 0) return `${h}h ${min % 60}m`;
  return `${min} min`;
};

// 💵 USD DIRECTION
let usdBias = "Neutre";
let usdColor = "#aaa";

const usdEvents = calendar.filter(e => e.country === "USD");

if (usdEvents.length >= 3) {
  usdBias = "Volatil USD";
  usdColor = "#facc15";
}

if (usdEvents.filter(e => normalizeImpact(e.impact) === "high").length >= 2) {
  usdBias = "USD Très Volatil";
  usdColor = "#ff4d4d";
}

// 🚨 ZONE DE RISQUE
let riskZone = "Safe";
let riskColor = "#4ade80";

if (nextEvent) {
  const diff = new Date(nextEvent.date).getTime() - Date.now();

  if (diff < 3600000) {
    riskZone = "⚠️ Éviter Trading";
    riskColor = "#ff4d4d";
  } else if (diff < 7200000) {
    riskZone = "Zone Volatile";
    riskColor = "#facc15";
  }
}
// 🇲🇦 IMPACT MAROC CLEAN
let moroccoImpact = "Stable";
let moroccoColor = "#4ade80";

const usdHigh = calendar.some(
  e => e.country === "USD" && normalizeImpact(e.impact) === "high"
);

const madHigh = calendar.some(
  e => e.country === "MAD" && normalizeImpact(e.impact) === "high"
);

if (usdHigh && madHigh) {
  moroccoImpact = "Volatil";
  moroccoColor = "#ff4d4d";
} else if (usdHigh) {
  moroccoImpact = "Pression USD";
  moroccoColor = "#facc15";
} else if (madHigh) {
  moroccoImpact = "Risque local";
  moroccoColor = "#facc15";
}

  return (
  
    <div style={container}>

      {/* HEADER */}
     <div style={header}>
  <div>
    <h2 style={{ margin: 0 }}>MAD Insights</h2>
    <p style={subtitle}>
      Market Analytics • Morocco
    </p>
  </div>
        <div>
          <Link href="/" style={activeLink}>Accueil</Link>
          <Link href="/news" style={link}>Actualités</Link>
          <Link href="/calendar" style={link}>Calendrier</Link>
        </div>
      </div>

      {/* HERO */}
      <div style={hero}>
        <div>
          <h1 style={heroTitle}>Analyse économique Maroc 🇲🇦</h1>
          <p style={heroText}>
            Comprenez l’impact des news mondiales sur le marché marocain
          </p>
          <div style={{ marginTop: "20px" }}>
            <Link href="/calendar" style={cta}>📅 Voir Calendrier</Link>
            <Link href="/news" style={ctaSecondary}>📰 Actualités</Link>
          </div>
        </div>
      </div>
      <div style={{ margin: "20px 0", textAlign: "center" }}>
 
</div>
      {/* 🧠 MARKET ANALYSIS */}
<div style={analysisGrid}>

  <div style={analysisCard}>
    <p style={analysisTitle}>🧠 Score Marché</p>
    <h2>{marketScore}</h2>
    <p style={analysisDesc}>
      Basé sur événements + news
    </p>
  </div>

  <div style={analysisCard}>
    <p style={analysisTitle}>📊 Bias</p>
    <h2 style={{ color: biasColor }}>{bias}</h2>
    <p style={analysisDesc}>
      Direction globale du marché
    </p>
  </div>

  <div style={analysisCard}>
    <p style={analysisTitle}>🇲🇦 Impact Maroc</p>
    <h2 style={{ color: moroccoColor }}>{moroccoImpact}</h2>
    <p style={analysisDesc}>
      Influence USD & inflation
    </p>
  </div>

</div>
      {/* ⚡ TRADING INTEL */}
<div style={analysisGrid}>

  {/* ⏱️ COUNTDOWN */}
  <div style={analysisCard}>
    <p style={analysisTitle}>⏱️ Prochain Event</p>

    {nextEvent ? (
      <>
        <h3>{nextEvent.title}</h3>
        <p style={{ color: "#aaa" }}>
          Dans {getCountdown(nextEvent.date)}
        </p>
      </>
    ) : (
      <p>Aucun event</p>
    )}
  </div>

  {/* 💵 USD */}
  <div style={analysisCard}>
    <p style={analysisTitle}>💵 USD Direction</p>
    <h2 style={{ color: usdColor }}>{usdBias}</h2>
    <p style={analysisDesc}>
      Basé sur calendrier USD
    </p>
  </div>

  {/* 🚨 RISK */}
  <div style={analysisCard}>
    <p style={analysisTitle}>🚨 Zone Trading</p>
    <h2 style={{ color: riskColor }}>{riskZone}</h2>
    <p style={analysisDesc}>
      Risque basé sur news imminentes
    </p>
  </div>

</div>
      {/* PRICES */}
      <div style={priceRow}>
        <div style={card}>
          <p>GOLD</p>
          <h2 style={gold}>
            {market.gold ? market.gold.toFixed(2) : "..."}
          </h2>
        </div>

        <div style={card}>
          <p>USD/MAD</p>
          <h2>
            {market.usdmad ? market.usdmad.toFixed(3) : "..."}
          </h2>
        </div>
      </div>

      {/* EVENTS */}
      <div style={card}>
        <h2 style={title}>📅 Événements importants</h2>

        {importantEvents.length === 0 ? (
          <p>Aucun événement important</p>
        ) : (
          importantEvents.map((e, i) => {
            const d = e.date ? new Date(e.date) : null;

            return (
              <p key={i} style={item}>
                {d
                  ? d.toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "--"}{" "}
                • {e.title}{" "}
                <span style={{ color: "#ff4d4d" }}>🔴</span>
              </p>
            );
          })
        )}
      </div>

      {/* NEWS */}
      <div style={card}>
        <h2 style={title}>📰 News importantes</h2>

        {topNews.length === 0 ? (
          <p>Aucune news</p>
        ) : (
          topNews.map((n, i) => (
            <p key={i} style={item}>
              • {n.title}
            </p>
          ))
        )}
      </div>

    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  padding: "30px",
  background: "#020617",
  minHeight: "100vh",
  color: "white"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  borderBottom: "1px solid #1f3a5f",
  paddingBottom: "15px"
};

const link = {
  marginRight: "15px",
  color: "#facc15",
  textDecoration: "none"
};

const activeLink = {
  marginRight: "15px",
  color: "#fff",
  fontWeight: "bold"
};

const hero = {
  background: "linear-gradient(135deg, #0b1e3a, #071530)",
  padding: "40px",
  borderRadius: "12px",
  marginBottom: "30px"
};

const heroTitle = {
  fontSize: "28px",
  marginBottom: "10px"
};

const heroText = {
  color: "#aaa",
  fontSize: "14px"
};

const cta = {
  marginRight: "10px",
  padding: "10px 15px",
  background: "#facc15",
  color: "#000",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "bold"
};

const ctaSecondary = {
  padding: "10px 15px",
  background: "#071530",
  color: "#fff",
  borderRadius: "6px",
  textDecoration: "none"
};

const priceRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "15px",
  marginBottom: "30px"
};

const card = {
  background: "#0b1e3a",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px"
};

const title = {
  marginBottom: "10px"
};

const item = {
  marginBottom: "8px",
  color: "#ddd"
};

const gold = {
  color: "#facc15"
};
const subtitle = {
  margin: 0,
  fontSize: "12px",
  color: "#aaa"
};
const analysisGrid = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
  flexWrap: "wrap" as const
};
const analysisCard = {
  flex: 1,
  minWidth: "200px",
  background: "#0b1e3a",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
};

const analysisTitle = {
  color: "#aaa",
  fontSize: "13px",
  marginBottom: "5px"
};

const analysisDesc = {
  color: "#777",
  fontSize: "12px"
};
