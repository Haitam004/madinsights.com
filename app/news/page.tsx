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

      {/* HEADER FLEXIBLE (Empêche l'accumulation) */}
      <div style={header}>
        <div>
          <h1 style={{ margin: 0 }}>MAD Insights</h1>
          <p style={subtitle}>
            Market Analytics • Morocco
          </p>
        </div>

        <nav style={navLinks}>
          <Link href="/" style={link}>Accueil</Link>
          <Link href="/news" style={activeLink}>Actualités</Link>
          <Link href="/calendar" style={link}>Calendrier</Link>
        </nav>
      </div>

      <h2 style={{ marginBottom: "20px" }}>Actualités</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        news.map((n, i) => (
          <div key={i} style={newsCard}>
            <p style={newsTitle}>{n.title}</p>

            <p style={sourceStyle}>
              Source: {n.source}
            </p>

            <p style={{
              color:
                n.impact === "Haut" ? "#ff4d4d" :
                n.impact === "Moyen" ? "#facc15" :
                "#4ade80",
              fontWeight: "bold",
              fontSize: "14px",
              marginTop: "10px"
            }}>
              Impact : {n.impact}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  padding: "20px",
  background: "#020617",
  minHeight: "100vh",
  color: "white",
  fontFamily: "Arial, sans-serif"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap" as const, // ✅ Permet de passer à la ligne sur mobile
  gap: "20px",               // ✅ Espace de sécurité entre titre et menu
  marginBottom: "30px",
  borderBottom: "1px solid #1f3a5f",
  paddingBottom: "15px"
};

const navLinks = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap" as const
};

const subtitle = { 
  margin: 0, 
  color: "#aaa", 
  fontSize: "12px" 
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

const newsCard = {
  background: "#0b1e3a",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  border: "1px solid #1e293b"
};

const newsTitle = { 
  fontWeight: "bold", 
  fontSize: "16px",
  lineHeight: "1.4",
  margin: 0
};

const sourceStyle = { 
  color: "#aaa", 
  fontSize: "13px",
  marginTop: "5px" 
};