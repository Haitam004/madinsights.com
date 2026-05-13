"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// --- CONFIGURATION SUPABASE SYNCHRONISÉE ---
const supabaseUrl = 'https://gifmemzibsdwcypnmqol.supabase.co'; 
const supabaseKey = 'sb_publishable_vhiSpPcbXaxGXQWzle9tOA_vpwWjKkg'; 
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [market, setMarket] = useState<any>({});
  const [news, setNews] = useState<any[]>([]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [balance, setBalance] = useState("1000");
  const [newTrade, setNewTrade] = useState({ pair: "GOLD", entry: "", sl: "", tp: "", risk: "1" });

  // 1. Initialisation
  useEffect(() => {
    setIsMounted(true);
    loadTrades(); // Chargement depuis le Cloud (Supabase)
    
    const savedBalance = localStorage.getItem("trading_balance");
    if (savedBalance) setBalance(savedBalance);

    fetch("/api/market").then(res => res.json()).then(setMarket).catch(() => setMarket({}));
    fetch("/api/news").then(res => res.json()).then(setNews).catch(() => setNews([]));
    fetch("/api/calendar").then(res => res.json()).then(setCalendar).catch(() => setCalendar([]));
  }, []);

  // Sauvegarde du capital en local
  useEffect(() => {
    if (isMounted) localStorage.setItem("trading_balance", balance);
  }, [balance, isMounted]);

  // --- LOGIQUE CLOUD (SUPABASE) ---
  async function loadTrades() {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTrades(data);
  }

  const addTrade = async () => {
    if (!newTrade.entry || !newTrade.sl || !newTrade.tp) return;
    
    const entry = parseFloat(newTrade.entry);
    const sl = parseFloat(newTrade.sl);
    const tp = parseFloat(newTrade.tp);
    const rrr = Math.abs((tp - entry) / (entry - sl)).toFixed(2);
    const lotSize = calculateLots();

    const tradeObj = {
      pair: newTrade.pair,
      entry, sl, tp,
      risk: parseFloat(newTrade.risk),
      rrr: `1:${rrr}`,
      lots: parseFloat(lotSize),
      status: "En cours",
      date: new Date().toLocaleDateString("fr-FR")
    };

    const { error } = await supabase.from('trades').insert([tradeObj]);
    if (!error) {
      loadTrades();
      setNewTrade({ pair: "GOLD", entry: "", sl: "", tp: "", risk: "1" });
    } else {
      console.error("Erreur d'insertion :", error);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const states = ["En cours", "Gagné", "Perdu"];
    const nextStatus = states[(states.indexOf(currentStatus) + 1) % states.length];
    await supabase.from('trades').update({ status: nextStatus }).eq('id', id);
    loadTrades();
  };

  const deleteTrade = async (id: number) => {
    if (confirm("Supprimer ce trade ?")) {
      await supabase.from('trades').delete().eq('id', id);
      loadTrades();
    }
  };

  // --- CALCULATEUR DE LOTS ---
  const calculateLots = () => {
    const entry = parseFloat(newTrade.entry);
    const sl = parseFloat(newTrade.sl);
    const riskPercent = parseFloat(newTrade.risk);
    const cap = parseFloat(balance);
    if (!entry || !sl || !cap || entry === sl) return "0.00";
    const amountToRisk = cap * (riskPercent / 100);
    const pipsRisk = Math.abs(entry - sl);
    let lots = newTrade.pair === "GOLD" ? amountToRisk / (pipsRisk * 100) : amountToRisk / (pipsRisk * 100000);
    return lots.toFixed(2);
  };

  // --- STATISTIQUES ---
  const getStats = () => {
    const ended = trades.filter(t => t.status !== "En cours");
    const wins = trades.filter(t => t.status === "Gagné").length;
    const winRate = ended.length > 0 ? Math.round((wins / ended.length) * 100) : 0;
    
    let profitTheo = 0;
    trades.forEach(t => {
      const riskAmount = parseFloat(balance) * (t.risk / 100);
      if (t.status === "Gagné") {
        const rValue = parseFloat(t.rrr.split(':')[1]) || 0;
        profitTheo += riskAmount * rValue;
      } else if (t.status === "Perdu") {
        profitTheo -= riskAmount;
      }
    });
    return { winRate, profitTheo, totalEnded: ended.length };
  };

  const stats = getStats();

  const getMarketDynamics = () => {
    const highImpact = calendar.filter(e => e.impact?.toLowerCase().includes("high") || e.impact?.toLowerCase().includes("élev")).length;
    const medImpact = calendar.filter(e => e.impact?.toLowerCase().includes("medium") || e.impact?.toLowerCase().includes("moy")).length;
    const newsScore = Math.min(news.length, 5);
    const totalScore = (highImpact * 5) + (medImpact * 2) + newsScore;

    let bias = "Neutre", color = "#94a3b8", riskZone = "Safe";
    if (totalScore >= 12) { bias = "Risk OFF"; color = "#ff4d4d"; riskZone = "⚠️ Éviter Trading"; }
    else if (totalScore >= 6) { bias = "Volatile"; color = "#facc15"; riskZone = "Prudence accrue"; }
    else if (isMounted) { bias = "Risk ON"; color = "#4ade80"; riskZone = "Conditions Calmes"; }
    return { totalScore, bias, color, riskZone };
  };

  const dynamics = getMarketDynamics();
  const nextEvent = calendar.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div style={container}>
      <div style={pageWrapper}>
        
        {/* HERO SECTION */}
        <div style={hero}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "20px" }}>
            <div>
              <h1 style={heroTitle}>Analyse économique Maroc 🇲🇦</h1>
              <p style={heroText}>Interface synchronisée (Cloud) et calcul de risque pro.</p>
            </div>
            <div style={balanceCard}>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 5px 0", fontWeight: "bold" }}>MON CAPITAL (USD)</p>
              <input style={balanceInput} type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
            </div>
          </div>
          <div style={ctaContainer}>
            <Link href="/calendar" style={cta}>📅 Calendrier</Link>
            <Link href="/news" style={ctaSecondary}>📰 Actualités</Link>
          </div>
        </div>

        {/* ANALYSE + STATS */}
        <div style={analysisGrid}>
          <div style={analysisCard}>
            <p style={analysisTitle}>🧠 Score Marché</p>
            <h2 style={cardValue}>{dynamics.totalScore}</h2>
            <p style={analysisDesc}>Pondération Events + News</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>📈 Win Rate</p>
            <h2 style={{...cardValue, color: stats.winRate > 50 ? '#4ade80' : '#facc15'}}>{stats.winRate}%</h2>
            <p style={analysisDesc}>{stats.totalEnded} positions fermées</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>💰 Profit/Perte</p>
            <h2 style={{...cardValue, color: stats.profitTheo >= 0 ? '#4ade80' : '#ff4d4d'}}>
              {stats.profitTheo >= 0 ? '+' : ''}{stats.profitTheo.toFixed(2)} $
            </h2>
            <p style={analysisDesc}>Basé sur le RRR</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>⏱️ Prochain Event</p>
            <h3 style={{fontSize: '14px', margin: '10px 0', color: '#facc15'}}>{nextEvent?.title || "Aucun"}</h3>
            <p style={analysisDesc}>Impact imminent</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>📊 Biais Global</p>
            <h2 style={{ ...cardValue, color: dynamics.color }}>{dynamics.bias}</h2>
            <p style={analysisDesc}>Sentiment actuel</p>
          </div>
          <div style={analysisCard}>
            <p style={analysisTitle}>🚨 Zone Trading</p>
            <h2 style={{ ...cardValue, color: dynamics.color }}>{dynamics.riskZone}</h2>
            <p style={analysisDesc}>Sécurité opérationnelle</p>
          </div>
        </div>

        {/* PRIX DU MARCHÉ */}
        <div style={priceRow}>
          <div style={card}>
            <p style={analysisTitle}>GOLD (XAU/USD)</p>
            <h2 style={{ color: "#facc15", fontSize: '24px', margin: "10px 0 0 0" }}>{market.gold || "..."}</h2>
          </div>
          <div style={card}>
            <p style={analysisTitle}>USD/MAD (Spot)</p>
            <h2 style={{ fontSize: '24px', margin: "10px 0 0 0" }}>{market.usdmad || "..."}</h2>
          </div>
        </div>

        {/* FORMULAIRE TRADE */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>📓 Nouveau Trade</h2>
            <div style={lotBadge}>Volume suggéré : <b>{calculateLots()} Lots</b></div>
          </div>
          <div style={formGrid}>
            <select style={inputStyle} value={newTrade.pair} onChange={(e) => setNewTrade({...newTrade, pair: e.target.value})}>
              <option value="GOLD">GOLD</option>
              <option value="USD/MAD">USD/MAD</option>
              <option value="EUR/USD">EUR/USD</option>
            </select>
            <input style={inputStyle} type="number" placeholder="Entrée" value={newTrade.entry} onChange={(e) => setNewTrade({...newTrade, entry: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="SL" value={newTrade.sl} onChange={(e) => setNewTrade({...newTrade, sl: e.target.value})} />
            <input style={inputStyle} type="number" placeholder="TP" value={newTrade.tp} onChange={(e) => setNewTrade({...newTrade, tp: e.target.value})} />
            <select style={inputStyle} value={newTrade.risk} onChange={(e) => setNewTrade({...newTrade, risk: e.target.value})}>
              <option value="0.5">Risque 0.5%</option>
              <option value="1">Risque 1%</option>
              <option value="2">Risque 2%</option>
            </select>
            <button style={addButton} onClick={addTrade}>Ajouter au Cloud</button>
          </div>
        </div>

        {/* TABLEAU DES TRADES */}
        <div style={card}>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px" }}>📜 Historique Cloud</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={tableHeaderRow}>
                  <th style={tableTh}>Date</th>
                  <th style={tableTh}>Marché</th>
                  <th style={tableTh}>Lots</th>
                  <th style={tableTh}>RRR</th>
                  <th style={tableTh}>Statut</th>
                  <th style={tableTh}>Action</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? <tr><td colSpan={6} style={{textAlign:'center', padding:'20px', color:'#475569'}}>Aucun trade en ligne.</td></tr> :
                  trades.map((trade) => (
                    <tr key={trade.id} style={tableRow}>
                      <td style={tableTd}>{trade.date}</td>
                      <td style={tableTd}><b>{trade.pair}</b></td>
                      <td style={tableTd}>{trade.lots}</td>
                      <td style={tableTd}>{trade.rrr}</td>
                      <td style={tableTd}>
                        <button onClick={() => toggleStatus(trade.id, trade.status)} style={{ background: trade.status === "Gagné" ? "#4ade80" : trade.status === "Perdu" ? "#ff4d4d" : "#facc15", color: "black", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", cursor: "pointer", fontWeight: "bold" }}>
                          {trade.status}
                        </button>
                      </td>
                      <td style={tableTd}><button onClick={() => deleteTrade(trade.id)} style={deleteBtn}>🗑️</button></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// STYLES
const container = { background: "#020617", minHeight: "100vh", color: "white", padding: "20px" };
const pageWrapper = { maxWidth: "1200px", margin: "0 auto" };
const hero = { background: "#0b1e3a", padding: "30px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #1e293b" };
const heroTitle = { fontSize: "28px", fontWeight: "bold", margin: 0 };
const heroText = { color: "#94a3b8", fontSize: "14px" };
const balanceCard = { background: "#1e293b", padding: "12px 15px", borderRadius: "8px", border: "1px solid #334155" };
const balanceInput = { background: "transparent", border: "none", color: "#facc15", fontSize: "22px", fontWeight: "bold", width: "120px", outline: "none" };
const analysisGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginBottom: "30px" };
const analysisCard = { background: "#0b1e3a", padding: "20px", borderRadius: "16px", border: "1px solid #1e293b" };
const analysisTitle = { color: "#94a3b8", fontSize: "11px", textTransform: "uppercase" as const, marginBottom: "8px" };
const cardValue = { fontSize: "20px", fontWeight: "bold", margin: "5px 0" };
const analysisDesc = { color: "#475569", fontSize: "11px" };
const priceRow = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px", marginBottom: "25px" };
const card = { background: "#0b1e3a", padding: "24px", borderRadius: "16px", border: "1px solid #1e293b", marginBottom: "20px" };
const inputStyle = { background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "12px", color: "white", fontSize: "13px", width: "100%" };
const addButton = { background: "#facc15", color: "black", border: "none", borderRadius: "6px", padding: "12px", fontWeight: "bold", cursor: "pointer" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const };
const tableHeaderRow = { borderBottom: "2px solid #1e293b" };
const tableTh = { textAlign: "left" as const, padding: "12px", fontSize: "12px", color: "#94a3b8" };
const tableRow = { borderBottom: "1px solid #1e293b" };
const tableTd = { padding: "12px", fontSize: "14px" };
const deleteBtn = { background: "transparent", border: "none", cursor: "pointer" };
const lotBadge = { background: "#0ea5e9", color: "white", padding: "6px 12px", borderRadius: "20px", fontSize: "13px" };
const ctaContainer = { display: "flex", gap: "12px", marginTop: "20px" };
const cta = { padding: "10px 20px", background: "#facc15", color: "#000", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" };
const ctaSecondary = { padding: "10px 20px", background: "#1e293b", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "13px" };
const formGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px" };