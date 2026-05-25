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

  // 🔄 Fonction isolée pour permettre l'auto-refresh
  async function fetchData() {
    try {
      // 1. Récupération des News
      const { data: newsData } = await supabase
        .from('maroc_pulse')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // 2. Récupération de la Bourse
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
    fetchData(); // Chargement initial au montage de la page

    // ⏱️ AUTOMATISATION : Rafraîchissement automatique toutes les 60 secondes
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval); // Nettoyage propre du timer
  }, []);

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
      
      {/* 🎨 CSS RESPONSIVE INTERNE (Préserve ton design à 100% sur PC) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pulse-wrapper { padding: 40px; }
        .pulse-main-grid { display: grid; grid-template-columns: 1.5fr 1fr; }
        
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
        <h1 style={{ fontSize: "32px", fontWeight: "bold", borderLeft: "5px solid #16a34a", paddingLeft: "20px", margin: "0" }}>
          MAROC MARKET PULSE
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "10px" }}>Données macro-économiques et IA-Analytics en temps réel (mise à jour automatique).</p>
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

      {/* Changement ici : Application de la classe pulse-main-grid pour gérer le mobile */}
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
              stocks.map((stock) => (
                <div key={stock.ticker} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "#1e293b", borderRadius: "8px" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px" }}>{stock.nom}</div>
                    <div style={{ fontSize: "11px", color: "#64748b" }}>{stock.ticker}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>{stock.prix.toFixed(2)} MAD</div>
                    <div style={{ fontSize: "12px", color: stock.variation.startsWith('+') ? "#4ade80" : "#f87171" }}>
                      {stock.variation}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "20px" }}>
                Chargement des cours...
              </p>
            )}
          </div>
        </motion.div>

        {/* SECTION NEWS IA INSIGHTS */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={cardStyle}>
          <h2 style={{ fontSize: "18px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%" }} />
            IA Insights (Live)
          </h2>

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