"use client";
import Link from "next/link";

export default function Header() {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "20px", 
      borderBottom: "1px solid #1e293b",
      background: "#020617" 
    }}>
      <div style={{ fontWeight: "bold", fontSize: "20px", color: "#fff" }}>MAD Insights</div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/" style={linkStyle}>Accueil</Link>
        <Link href="/news" style={linkStyle}>Actualités</Link>
        <Link href="/calendar" style={linkStyle}>Calendrier</Link>
        <Link href="/dashboard" style={linkStyle}>Dashboard</Link>
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#facc15",
  textDecoration: "none",
  fontSize: "14px"
};