"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [market, setMarket] = useState<any>({});
  const [news, setNews] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // État pour le Journal de Trading
  const [trades, setTrades] = useState<any[]>([]);
  
  // État pour le formulaire d'ajout
  const [newTrade, setNewTrade] = useState({ pair: "GOLD", entry: "", sl: "", tp: "", risk: "1" });

  // 1. Initialisation et chargement des données
  useEffect(() => {
    setIsMounted(true);
    
    // Charger les trades du localStorage
    const savedTrades = localStorage.getItem("trading_journal");
    if (savedTrades) {
      try {
        setTrades(JSON.parse(savedTrades));
      } catch (e) {
        console.error("Erreur de lecture du localStorage", e);
      }
    }

    fetch("/api/market").then(res => res.json()).then(setMarket).catch(() => setMarket({}));
    fetch("/api/news").then(res => res.json()).then(setNews).catch(() => setNews([]));
    fetch("/api/calendar").then(res => res.json()).then(setCalendar).catch(() => setCalendar([]));
  }, []);

  // 2. Sauvegarde automatique dans le localStorage à chaque modification
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("trading_journal", JSON.stringify(trades));
    }
  }, [trades, isMounted]);

  // --- LOGIQUE DU JOURNAL ---
  const addTrade = () => {
    if (!newTrade.entry || !newTrade.sl || !newTrade.tp) return;
    
    const entry = parseFloat(newTrade.entry);
    const sl = parseFloat(newTrade.sl);
    const tp = parseFloat(newTrade.tp);
    const rrr = Math.abs((tp - entry) / (entry - sl)).toFixed(2);

    const trade = {
      id: Date.now(),
      pair: newTrade.pair,
      sl: newTrade.sl,
      risk: newTrade.risk,
      rrr: `1:${rrr}`,
      status: "En cours",
      date: new Date().toLocaleDateString("fr-FR")
    };

    setTrades([trade, ...trades]);
    setNewTrade({ pair: "GOLD", entry: "", sl: "", tp: "", risk: "1" });
  };

  const deleteTrade = (id: number) => {
    if (confirm("Supprimer ce trade ?")) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  const toggleStatus = (id: number) => {
    setTrades(trades.map(t => {
      if (t.id === id) {
        const states = ["En cours", "Gagné", "Perdu"];
        const nextIndex = (states.indexOf(t.status) + 1) % states.length;
        return { ...t, status: states[nextIndex] };
      }
      return t;
    }));
  };

  // --- DYNAMISATION DES INDICATEURS ---
  const getMarketDynamics = () => {
    const highImpact = calendar.filter(e => e.impact?.toLowerCase().includes("high") || e.impact?.toLowerCase().includes("élev")).length;
    const medImpact = calendar.filter(e => e.impact?.toLowerCase().includes("medium") || e.impact?.toLowerCase().includes("moy")).length;
    
    const newsScore = Math.min(news.length, 5);
    const totalScore = (highImpact * 5) + (medImpact * 2) + newsScore;

    let bias = "Neutre";
    let color = "#94a3b8"; 
    let riskZone = "Safe";

    if (totalScore >= 12) {
      bias = "Risk OFF";
      color = "#ff4d4d"; 
      riskZone = "⚠️ Éviter Trading";
    } else if (totalScore >= 6) {
      bias = "Volatile";
      color = "#facc15"; 
      riskZone = "Prudence accrue";
    } else if (isMounted) {
      bias = "Risk ON";
      color = "#4ade80"; 
      riskZone = "Conditions Calmes";
    }

    return { totalScore, bias, color, riskZone };
  };

  const dynamics = getMarketDynamics();

  const nextEvent = calendar
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div style={container}>
      <div style={pageWrapper}>
        
        {/* HERO SECTION */}
        <div style={hero}>
          <h1 style={heroTitle}>Analyse économique Maroc 🇲🇦</h1>
          <p style={heroText}>Interface de décision en temps réel pour le marché local.</p>
          <div style={ctaContainer}>
            <Link href="/calendar" style={cta}>📅 Voir Calendrier</Link>
            <Link href="/news" style={ctaSecondary}>📰 Actualités</Link>
          </div>
        </div>

        {/* 1. INDICATEURS DYNAMIQUES */}
        <div style={analysisGrid}>
          <div style={analysisCard}>
            <p style={analysisTitle}>🧠 Score Marché</p>
            <h2 style={cardValue}>{dynamics.totalScore}</h2>
            <p style={analysisDesc}>Pondération Events + News</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>📊 Biais Global</p>
            <h2 style={{ ...cardValue, color: dynamics.color }}>{dynamics.bias}</h2>
            <p style={analysisDesc}>Sentiment dominant actuel</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>🇲🇦 Impact Maroc</p>
            <h2 style={{ ...cardValue, color: dynamics.totalScore > 8 ? "#facc15" : "#4ade80" }}>
              {dynamics.totalScore > 8 ? "Pression USD" : "Stable"}
            </h2>
            <p style={analysisDesc}>Influence sur le Dirham</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>⏱️ Prochain Event</p>
            <h3 style={{fontSize: '15px', margin: '10px 0'}}>{nextEvent?.title || "Aucun event"}</h3>
            <p style={{ color: "#aaa", fontSize: '12px' }}>{nextEvent ? "À venir" : "--"}</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>💵 USD Direction</p>
            <h2 style={cardValue}>{dynamics.totalScore > 10 ? "Haussier" : "Neutre"}</h2>
            <p style={analysisDesc}>Basé sur flux sécuritaires</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>🚨 Zone Trading</p>
            <h2 style={{ ...cardValue, color: dynamics.color }}>{dynamics.riskZone}</h2>
            <p style={analysisDesc}>Niveau de risque opérationnel</p>
          </div>
        </div>

        {/* 2. PRIX DU MARCHÉ */}
        <div style={priceRow}>
          <div style={card}>
            <p style={analysisTitle}>GOLD (XAU/USD)</p>
            <h2 style={{ color: "#facc15", fontSize: '24px' }}>{market.gold || "Chargement..."}</h2>
          </div>
          <div style={card}>
            <p style={analysisTitle}>USD/MAD (Spot)</p>
            <h2 style={{ fontSize: '24px' }}>{market.usdmad || "Chargement..."}</h2>
          </div>
        </div>

        {/* 3. CONFIGURATION DU JOURNAL DE TRADING */}
        <div style={card}>
          <h2 style={sectionTitle}>📓 Nouveau Trade</h2>
          <div style={formGrid}>
            <select 
              style={inputStyle} 
              value={newTrade.pair} 
              onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})}
            >
              <option value="GOLD">GOLD</option>
              <option value="USD/MAD">USD/MAD</option>
              <option value="EUR/USD">EUR/USD</option>
            </select>
            <input style={inputStyle} type="number" placeholder="Prix d'entrée" value={newTrade.entry} onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Stop Loss (SL)" value={newTrade.sl} onChange={(e) => setNewTrade({...newTrade, sl: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="Take Profit (TP)" value={newTrade.tp} onChange={(e) => setNewTrade({...newTrade, tp: e.target.value})} />
            <select 
              style={inputStyle} 
              value={newTrade.risk} 
              onChange={(e) => setNewTrade({...newTrade, risk: e.target.value})}
            >
              <option value="0.5">Risque : 0.5%</option>
              <option value="1">Risque : 1%</option>
              <option value="2">Risque : 2%</option>
            </select>
            <button style={addButton} onClick={addTrade}>Ajouter</button>
          </div>
        </div>

        <div style={card}>
          <h2 style={sectionTitle}>📜 Historique des Positions</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={tableTh}>Date</th>
                  <th style={tableTh}>Marché</th>
                  <th style={tableTh}>SL</th>
                  <th style={tableTh}>Risque</th>
                  <th style={tableTh}>RRR</th>
                  <th style={tableTh}>Statut</th>
                  <th style={tableTh}>Action</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? <tr><td colSpan={7} style={{textAlign:'center', padding:'20px', color:'#475569'}}>Aucun trade enregistré.</td></tr> : 
                  trades.map((trade) => (
                    <tr key={trade.id} style={tableRow}>
                      <td style={tableTd}>{trade.date}</td>
                      <td style={tableTd}><b>{trade.pair}</b></td>
                      <td style={tableTd}>{trade.sl}</td>
                      <td style={tableTd}>{trade.risk}%</td>
                      <td style={tableTd}>{trade.rrr}</td>
                      <td style={tableTd}>
                        <button 
                          onClick={() => toggleStatus(trade.id)}
                          style={{
                            background: trade.status === "Gagné" ? "#4ade80" : trade.status === "Perdu" ? "#ff4d4d" : "#facc15",
                            color: "black", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer", fontWeight: "bold"
                          }}
                        >
                          {trade.status}
                        </button>
                      </td>
                      <td style={tableTd}>
                        <button onClick={() => deleteTrade(trade.id)} style={deleteBtn}>🗑️</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. ÉVÉNEMENTS & NEWS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          <div style={card}>
            <h2 style={sectionTitle}>📅 Calendrier High Impact</h2>
            {calendar.filter(e => e.impact === "high").length === 0 ? <p style={emptyText}>Aucun événement critique</p> : 
              calendar.filter(e => e.impact === "high").slice(0, 3).map((e, i) => (
                <p key={i} style={listItem}>• {e.title} <span style={{ color: "#ff4d4d" }}>🔴</span></p>
              ))
            }
          </div>
          <div style={card}>
            <h2 style={sectionTitle}>📰 News Récentes</h2>
            {news.length === 0 ? <p style={emptyText}>En attente de news...</p> : 
              news.slice(0, 3).map((n, i) => <p key={i} style={listItem}>• {n.title}</p>)
            }
          </div>
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

const ctaContainer = { display: "flex", gap: "12px", flexWrap: "wrap" as const };
const cta = { padding: "10px 20px", background: "#facc15", color: "#000", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" };
const ctaSecondary = { padding: "10px 20px", background: "#1e293b", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px" };

const analysisGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "30px" };
const analysisCard = { background: "#0b1e3a", padding: "20px", borderRadius: "16px", border: "1px solid #1e293b" };

const analysisTitle = { color: "#94a3b8", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase" as const };
const cardValue = { fontSize: "20px", fontWeight: "bold", margin: "5px 0" };
const analysisDesc = { color: "#475569", fontSize: "11px" };

const priceRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px", marginBottom: "25px" };
const card = { background: "#0b1e3a", padding: "24px", borderRadius: "16px", border: "1px solid #1e293b", marginBottom: "20px" };

const sectionTitle = { fontSize: "16px", fontWeight: "bold", marginBottom: "15px" };
const listItem = { marginBottom: "10px", color: "#cbd5e1", fontSize: "13px" };
const emptyText = { color: "#475569", fontSize: "13px" };

const tableStyle = { width: "100%", borderCollapse: "collapse" as const, marginTop: "10px" };
const tableHeaderRow = { borderBottom: "2px solid #1e293b" };
const tableTh = { textAlign: "left" as const, padding: "12px", fontSize: "12px", color: "#94a3b8" };
const tableRow = { borderBottom: "1px solid #1e293b" };
const tableTd = { padding: "12px", fontSize: "14px", whiteSpace: "nowrap" as const };

const formGrid = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
  gap: "15px",
  marginBottom: "10px"
};

const inputStyle = { 
  background: "#1e293b", 
  border: "1px solid #334155", 
  borderRadius: "6px", 
  padding: "12px", 
  color: "white",
  fontSize: "13px",
  width: "100%",
  boxSizing: "border-box" as const
};

const addButton = { 
  background: "#facc15", 
  color: "black", 
  border: "none", 
  borderRadius: "6px", 
  padding: "12px",
  fontWeight: "bold", 
  cursor: "pointer",
  fontSize: "13px",
  transition: "background 0.2s"
};

const deleteBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  padding: "5px"
};