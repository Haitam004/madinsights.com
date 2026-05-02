"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const linkStyle = (path: string) => ({
    color: pathname === path ? "#fff" : "#facc15",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: pathname === path ? "bold" : "normal"
  });

  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "20px 40px", 
      background: "#020617", 
      borderBottom: "1px solid #1e293b" 
    }}>
      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>MAD Insights</div>
      <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link href="/" style={linkStyle("/")}>Accueil</Link>
        <Link href="/news" style={linkStyle("/news")}>Actualités</Link>
        <Link href="/calendar" style={linkStyle("/calendar")}>Calendrier</Link>
        <Link href="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
        <a 
          href="https://one.exnessonelink.com/a/o9d6u5m1ye" 
          target="_blank" 
          style={{ background: "#facc15", color: "#000", padding: "6px 15px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", fontSize: "13px" }}
        >
          Exness
        </a>
      </div>
    </nav>
  );
}