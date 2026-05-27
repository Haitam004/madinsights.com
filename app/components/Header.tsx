"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, Activity, Calendar, LayoutDashboard } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  // Style d'origine pour la version Desktop
  const linkStyle = (path: string) => ({
    color: pathname === path ? "#fff" : "#facc15",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: pathname === path ? "bold" : "normal"
  });

  return (
    <>
      {/* Injection du comportement responsive fluide */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* --- DESIGN DESKTOP (Par défaut) --- */
        .main-header {
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: 20px 40px; 
          background: #020617; 
          border-bottom: 1px solid #1e293b;
          position: sticky;
          top: 0;
          z-index: 999;
        }
        .desktop-nav { 
          display: flex; 
          gap: 25px; 
          align-items: center; 
        }
        .mobile-bottom-nav { 
          display: none; 
        }

        /* --- MODE APP MOBILE (Écrans < 768px) --- */
        @media (max-width: 768px) {
          .main-header {
            padding: 15px 20px !important;
          }
          
          /* On cache la navigation textuelle du haut pour éviter l'effet entassé */
          .desktop-nav { 
            display: none !important; 
          }
          
          /* On fait apparaître la barre Binance fixe tout en bas */
          .mobile-bottom-nav {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 65px;
            background: #020617;
            border-top: 1px solid #1e293b;
            justify-content: space-around;
            align-items: center;
            z-index: 1000;
            padding: 0 5px;
          }
          
          .mobile-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 10px;
            gap: 4px;
            color: #facc15;
            flex: 1;
            transition: 0.2s;
          }
          
          .mobile-link.active {
            color: #fff !important;
            font-weight: bold;
          }

          /* Empêche le contenu de se cacher derrière la barre du bas */
          body {
            padding-bottom: 75px !important;
          }
        }
      `}} />

      {/* BARRE DU HAUT : Complète sur PC, épurée sur Mobile */}
      <nav className="main-header">
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
          MAD Insights
        </div>
        
        {/* Navigation classique PC */}
        <div className="desktop-nav">
          <Link href="/" style={linkStyle("/")}>Accueil</Link>
          <Link href="/news" style={linkStyle("/news")}>Actualités</Link>
          <Link href="/maroc-pulse" style={linkStyle("/maroc-pulse")}>Maroc Pulse 🇲🇦</Link>
          <Link href="/calendar" style={linkStyle("/calendar")}>Calendrier</Link>
          <Link href="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
          <a 
            href="https://one.exnessonelink.com/a/o9d6u5m1ye" 
            target="_blank" 
            style={{ 
              background: "#facc15", 
              color: "#000", 
              padding: "6px 15px", 
              borderRadius: "6px", 
              fontWeight: "bold", 
              textDecoration: "none", 
              fontSize: "13px" 
            }}
          >
            Exness
          </a>
        </div>
      </nav>

      {/* BARRE DU BAS : Style Application Pro (Uniquement visible sur Mobile) */}
      <div className="mobile-bottom-nav">
        <Link href="/" className={`mobile-link ${pathname === "/" ? "active" : ""}`}>
          <Home size={20} color={pathname === "/" ? "#fff" : "#facc15"} />
          <span>Accueil</span>
        </Link>
        
        <Link href="/news" className={`mobile-link ${pathname === "/news" ? "active" : ""}`}>
          <Newspaper size={20} color={pathname === "/news" ? "#fff" : "#facc15"} />
          <span>Actualités</span>
        </Link>
        
        <Link href="/maroc-pulse" className={`mobile-link ${pathname === "/maroc-pulse" ? "active" : ""}`}>
          <Activity size={20} color={pathname === "/maroc-pulse" ? "#fff" : "#facc15"} />
          <span>Pulse</span>
        </Link>
        
        <Link href="/calendar" className={`mobile-link ${pathname === "/calendar" ? "active" : ""}`}>
          <Calendar size={20} color={pathname === "/calendar" ? "#fff" : "#facc15"} />
          <span>Calendrier</span>
        </Link>
        
        <Link href="/dashboard" className={`mobile-link ${pathname === "/dashboard" ? "active" : ""}`}>
          <LayoutDashboard size={20} color={pathname === "/dashboard" ? "#fff" : "#facc15"} />
          <span>Journal</span>
        </Link>
      </div>
    </>
  );
}