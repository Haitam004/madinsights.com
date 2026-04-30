"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function News() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const link = { marginRight: "15px", color: "#facc15" };
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

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        borderBottom: "1px solid #1f3a5f",
        paddingBottom: "10px"
      }}>
        <div>
          <h1 style={{ margin: 0 }}>MAD Insights</h1>
          <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>
            Market Analytics • Morocco
          </p>
        </div>

       <div>
  <Link href="/" style={link}>Accueil</Link>
  <Link href="/news" style={link}>Actualités</Link>
  <Link href="/calendar" style={link}>Calendrier</Link>
</div>
      </div>

      <h2>Actualités</h2>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        news.map((n, i) => (
          <div key={i} style={{
            background: "#0b1e3a",
            padding: "20px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
          }}>
            <p style={{ fontWeight: "bold" }}>{n.title}</p>

            <p style={{ color: "#aaa" }}>
              Source: {n.source}
            </p>

            <p style={{
              color:
                n.impact === "Haut" ? "#ff4d4d" :
                n.impact === "Moyen" ? "#facc15" :
                "#4ade80",
              fontWeight: "bold"
            }}>
              Impact : {n.impact}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
const container = {
  padding: "30px",
  background: "#020617", // ✅ fond dark global
  minHeight: "100vh",
  color: "white", // ✅ texte blanc
  fontFamily: "Arial, sans-serif" // ✅ fix police
};
const card = {
  background: "#0b1e3a",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  color: "white", // ✅ important
  boxShadow: "0 5px 20px rgba(0,0,0,0.3)"
};
const title = {
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "10px",
  lineHeight: "1.4"
};

const source = {
  color: "#aaa",
  fontSize: "13px"
};