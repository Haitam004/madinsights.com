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
          </nav>
        </div>
      </div>

      {/* CORPS DE LA PAGE */}
      <div style={bodyContent}>
        <h2 style={sectionTitle}>Actualités</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          <div style={newsList}>
            {news.map((n, i) => (
              <div key={i} style={newsCard}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES CORRIGÉS (STRICT MATCH) ---------------- */

const container = {
  background: "#020617",
  minHeight: "100vh",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

const headerWrapper = {
  borderBottom: "1px solid #1e293b", // La ligne qui définit la tête du corps
  padding: "20px 0",
  marginBottom: "30px"
};

const headerContent = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px"
};

const mainTitle = { 
  fontSize: "28px", 
  fontWeight: "bold", 
  margin: 0 
};

const subtitle = { 
  margin: 0, 
  color: "#94a3b8", 
  fontSize: "12px" 
};

const navLinks = {
  display: "flex",
  gap: "20px"
};

const link = { 
  color: "#facc15", 
  textDecoration: "none",
  fontSize: "14px"
};

const activeLink = { 
  color: "#fff", 
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: "14px"
};

const bodyContent = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 20px"
};

const sectionTitle = { 
  fontSize: "22px", 
  marginBottom: "20px" 
};

const newsList = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px"
};

const newsCard = {
  background: "#0b1e3a",
  padding: "20px",
  borderRadius: "8px",
  border: "1px solid #1e293b",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
};

const newsTitle = { 
  fontWeight: "bold", 
  fontSize: "16px",
  margin: 0,
  lineHeight: "1.5"
};

const sourceStyle = { 
  color: "#94a3b8", 
  fontSize: "13px",
  marginTop: "5px" 
};