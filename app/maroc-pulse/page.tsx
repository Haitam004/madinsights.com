"use client";

import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { TrendingUp, Info, Landmark, DollarSign, Globe, ExternalLink } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface NewsItem {
  id: number;
  title: string;
  analysis: string;
  sentiment: string;
  source: string;
  link: string;
}

interface StockItem {
  ticker: string;
  nom: string;
  prix: number;
  variation: string;
}

export default function MarocPulse() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 🕒 State pour le statut de la bourse
  const [marketStatus, setMarketStatus] = useState({ isOpen: false, text: "Calcul du statut..." });

  async function fetchData() {
    try {
      const { data: newsData } = await supabase
        .from('maroc_pulse')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: bourseData } = await supabase
        .from('maroc_bourse')
        .select('*')
        .order('nom', { ascending: true });

      if (newsData) setNews(newsData);
      if (bourseData) setStocks(bourseData);

    } catch (err) {
      console.error("Erreur de connexion:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // ⏱️ Horloge temps réel pour la Bourse de Casablanca
  useEffect(() => {
    function updateMarketStatus() {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Casablanca',
          hour12: false,
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const parts = formatter.formatToParts(new Date());
        const day = parts.find(p => p.type === 'weekday')?.value || '';
        const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        const isWeekend = day === 'Sat' || day === 'Sun';
        const currentMinutes = hour * 60 + minute;
        const openMinutes = 9 * 60 + 30;   // 09:30
        const closeMinutes = 15 * 60 + 30; // 15:30

        if (!isWeekend && currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
          const remainingMinutes = closeMinutes - currentMinutes;
          const remHours = Math.floor(remainingMinutes / 60);
          const remMins = remainingMinutes % 60;
          
          setMarketStatus({
            isOpen: true,
            text: `MARCHÉ OUVERT (Clôture dans ${remHours}h ${remMins}m)`
          });
        } else {
          setMarketStatus({
            isOpen: false,
            text: `MARCHÉ FERMÉ (Ouverture Lun-Ven à 09:30)`
          });
        }
      } catch (e) {
        console.error("Erreur de calcul horaire bourse:", e);
      }
    }

    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 30000);
    return () => clearInterval(statusInterval);
  }, []);

  // 🧠 ÉTAPE 2 : Calcul dynamique de la jauge de sentiment IA
  const totalNews = news.length;
  const positiveNews = news.filter(item => item.sentiment === 'Positif').length;
  const negativeNews = news.filter(item => item.sentiment === 'Négatif').length;
  const neutralNews = totalNews - positiveNews - negativeNews;

  const posPercent = totalNews > 0 ? (positiveNews / totalNews) * 100 : 0;
  const negPercent = totalNews > 0 ? (negativeNews / totalNews) * 100 : 0;
  const neuPercent = totalNews > 0 ? (neutralNews / totalNews) * 100 : 0;

  let sentimentVerdict = "Neutre ⚖️";
  if (totalNews > 0) {
    if (posPercent >= 60) sentimentVerdict = "Fortement Haussier 🚀";
    else if (posPercent > 30) sentimentVerdict = "Modérément Haussier 🐂";
    else if (negPercent >= 60) sentimentVerdict = "Fortement Baissier 📉";
    else if (negPercent > 30) sentimentVerdict = "Modérément Baissier 🐻";
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardStyle: React.CSSProperties = {
    background: "#111827",
    border: "1px solid #1e293b",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff",
  };

  const indicators = [
    { name: "Taux Directeur (BAM)", value: "2.25%", change: "Inchangé", icon: <Landmark size={20} color="#facc15" /> },
    { name: "Inflation (IPC)", value: "0.9%", change: "+1.2% (Mensuel)", icon: <Info size={20} color="#f87171" /> },
    { name: "Croissance PIB", value: "5.0%", change: "Q1 2026", icon: <TrendingUp size={20} color="#4ade80" /> },
    { name: "USD/MAD", value: "9.16", change: "-0.87%", icon: <DollarSign size={20} color="#facc15" /> },
  ];

  return (
    <div className="pulse-wrapper" style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", fontFamily: "sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .pulse-wrapper { padding: 40px; }
        .pulse-main-grid { display: grid; grid-template-columns: 1.5fr 1fr; }
        @keyframes marketPulse {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .live-dot { animation: marketPulse 1.8s infinite ease-in-out; }
        
        @media (max-width: 1024px) {
          .pulse-wrapper { padding: 15px; }
          .pulse-main-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ maxWidth: "1200px", margin: "0 auto 40px auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: "bold", borderLeft: "5px solid #16a34a", paddingLeft: "20px", margin: "0" }}>
              MAROC MARKET PULSE
            </h1>
            <p style={{ color: "#94a3b8", marginTop: "10px" }}>Données macro-économiques et IA-Analytics en temps réel.</p>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            padding: "8px 14px", 
            background: marketStatus.isOpen ? "#064e3b" : "#1e293b", 
            border: `1px solid ${marketStatus.isOpen ? "#0f766e" : "#334155"}`,
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "bold",
            color: marketStatus.isOpen ? "#4ade80" : "#94a3b8"
          }}>
            <span className="live-dot" style={{ width: "8px", height: "8px", backgroundColor: marketStatus.isOpen ? "#4ade80" : "#f87171", borderRadius: "50%" }} />
            {marketStatus.text}
          </div>
        </div>
      </motion.header>

      {/* Grid des indicateurs macro */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: "1200px", margin: "0 auto 40px auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}
      >
        {indicators.map((ind, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              {ind.icon}
              <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>{ind.name}</span>
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{ind.value}</div>
            <div style={{ fontSize: "12px", marginTop: "5px", color: ind.change.includes('+') ? "#4ade80" : "#94a3b8" }}>{ind.change}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="pulse-main-grid" style={{ maxWidth: "1200px", margin: "0 auto", gap: "30px" }}>
        
        {/* SECTION BOURSE DYNAMIQUE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h2 style={{ fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Globe size={24} color="#16a34a" /> Bourse de Casablanca
            </h2>
            <span style={{ padding: "5px 15px", background: "#064e3b", color: "#4ade80", borderRadius: "20px", fontSize: "14px" }}>
              Live Supabase
            </span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
            {stocks.length > 0 ? (
              stocks.map((stock) => {
                const isPositive = stock.variation.startsWith('+');
                return (
                  <div key={stock.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#1e293b", borderRadius: "8px" }}>
                    
                    <div style={{ flex: 1, minWidth: "110px" }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px" }}>{stock.nom}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>{stock.ticker}</div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "0 10px" }}>
                      <svg width="65" height="22" style={{ overflow: "visible" }}>
                        <polyline
                          fill="none"
                          stroke={isPositive ? "#4ade80" : "#f87171"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={isPositive ? "0,16 12,11 24,14 36,5 48,9 60,2" : "0,3 12,11 24,7 36,16 48,12 60,19"}
                        />
                      </svg>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "95px" }}>
                      <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>{stock.prix.toFixed(2)} MAD</div>
                      <div style={{ fontSize: "12px", color: isPositive ? "#4ade80" : "#f87171" }}>
                        {stock.variation}
                      </div>
                    </div>

                  </div>
                );
              })
            ) : (
              <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                Chargement des cours...
              </p>
            )}
          </div>
        </motion.div>

        {/* SECTION NEWS IA INSIGHTS AVEC JAUGE DE SENTIMENT */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={cardStyle}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />
            IA Insights (Live)
          </h2>

          {/* 📊 Jauge de Sentiment Visuelle */}
          {!loading && news.length > 0 && (
            <div style={{ background: "#1e293b", padding: "12px", borderRadius: "8px", marginBottom: "25px", border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>
                <span style={{ color: "#94a3b8" }}>Sentiment Général :</span>
                <span style={{ color: "#facc15" }}>{sentimentVerdict}</span>
              </div>
              
              {/* Barre segmentée multicolore */}
              <div style={{ display: "flex", width: "100%", height: "8px", borderRadius: "4px", overflow: "hidden", background: "#334155" }}>
                <div style={{ width: `${posPercent}%`, background: "#4ade80", transition: "width 0.5s ease" }} title={`Positif: ${Math.round(posPercent)}%`} />
                <div style={{ width: `${neuPercent}%`, background: "#64748b", transition: "width 0.5s ease" }} title={`Neutre: ${Math.round(neuPercent)}%`} />
                <div style={{ width: `${negPercent}%`, background: "#f87171", transition: "width 0.5s ease" }} title={`Négatif: ${Math.round(negPercent)}%`} />
              </div>

              {/* Légende en petits chiffres */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#64748b", marginTop: "6px", fontFamily: "monospace" }}>
                <span>Acheteurs: {Math.round(posPercent)}%</span>
                <span>Neutres: {Math.round(neuPercent)}%</span>
                <span>Vendeurs: {Math.round(negPercent)}%</span>
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {loading ? (
              <p style={{ color: "#64748b" }}>Analyse des marchés en cours...</p>
            ) : news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} style={{ borderLeft: "2px solid #16a34a", paddingLeft: "15px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "bold" }}>{item.source.toUpperCase()}</span>
                    <span style={{ fontSize: "10px", color: item.sentiment === "Positif" ? "#4ade80" : item.sentiment === "Négatif" ? "#f87171" : "#94a3b8" }}>
                      ● {item.sentiment}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", marginTop: "5px", fontWeight: "600" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", marginTop: "4px", color: "#94a3b8", fontStyle: "italic" }}>
                    🤖 {item.analysis}
                  </p>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#16a34a", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", marginTop: "5px" }}>
                    Source <ExternalLink size={10} />
                  </a>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b" }}>Aucune news analysée pour le moment.</p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}