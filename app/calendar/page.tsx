"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");
  const notified = useRef(new Set());

  useEffect(() => {
    fetch("/api/calendar")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));

    // ✅ FIX : On vérifie si l'iPhone supporte les notifications
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

 // 🔥 ALERTES HIGH IMPACT FIXED (ANTI-SPAM PRO)
useEffect(() => {
  if (typeof window === "undefined") return;

  const STORAGE_KEY = "notifiedEventsFINAL";
  const COOLDOWN_KEY = "lastNotifTime";

  const stored = localStorage.getItem(STORAGE_KEY);
  const notified = stored ? new Set(JSON.parse(stored)) : new Set();

  const lastNotif = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
  const now = Date.now();

  // ⛔ cooldown global
  if (now - lastNotif < 20000) return; // 20 sec

  let sent = false;

  events.forEach(e => {
    if (e.impact !== "high") return;

    // ✅ ID STABLE (clé du fix)
    const eventId = (e.title || "").trim().toLowerCase();

    if (!eventId) return;

    // ⛔ déjà notifié
    if (notified.has(eventId)) return;

    // ✅ FIX : On vérifie encore ici avant d'envoyer
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("🚨 HIGH IMPACT EVENT", {
        body: e.title
      });
    }

    notified.add(eventId);
    sent = true;
  });

  if (sent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...notified]));
    localStorage.setItem(COOLDOWN_KEY, now.toString());
  }

}, [events]);
  return (
    <div style={container}>
      
      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={{ margin: 0 }}>📅 Calendrier Économique</h1>
          <p style={{ color: "#aaa", fontSize: "13px" }}>
            Impact des news sur le marché marocain
          </p>
        </div>

        <div>
          <Link href="/" style={link}>Accueil</Link>
          <Link href="/news" style={link}>Actualités</Link>
          <Link href="/calendar" style={activeLink}>Calendrier</Link>
        </div>
      </div>

      {/* ⚠️ INFO ALERT */}
      <p style={{ color: "#aaa", marginBottom: "10px" }}>
        ⚠️ Les événements HIGH impact déclenchent une alerte automatique
      </p>

      {/* FILTRE */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("ALL")} style={filterBtn(filter === "ALL")}>
          ALL
        </button>

        <button onClick={() => setFilter("USD")} style={filterBtn(filter === "USD")}>
          USD 🇺🇸
        </button>

        <button onClick={() => setFilter("EUR")} style={filterBtn(filter === "EUR")}>
          EUR 🇪🇺
        </button>
      </div>

      {/* TABLE */}
      <div style={table}>

        <div style={rowHeader}>
          <span>Date</span>
          <span>Heure</span>
          <span>Pays</span>
          <span>Impact</span>
          <span>Événement</span>
          <span>Actuel</span>
          <span>Prévision</span>
          <span>Précédent</span>
        </div>

        {events.length === 0 ? (
          <p style={{ padding: "20px" }}>Aucun événement</p>
        ) : (
          [...events]
            .filter(e => filter === "ALL" || e.country === filter) // ✅ FIX IMPORTANT
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((e, i) => {
              const d = e.date ? new Date(e.date) : null;

              return (
                <div
                  key={i}
                  style={row(e.impact)}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "#0f2a44")}
                  onMouseLeave={(ev) =>
                    (ev.currentTarget.style.background =
                      e.impact === "high" ? "#071a2f" : "transparent")
                  }
                >
                  <span>{d ? d.toLocaleDateString("fr-FR") : "-"}</span>

                  <span>
                    {d
                      ? d.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "-"}
                  </span>

                  <span style={countryStyle(e.country)}>
                    {e.country === "USD" && "🇺🇸 "}
                    {e.country === "EUR" && "🇪🇺 "}
                    {e.country === "MAD" && "🇲🇦 "}
                    {e.country || "USD"}
                  </span>

                  <span style={impactStyle(e.impact)}>
                    {formatImpact(e.impact)}
                  </span>

                  <span style={{ fontWeight: "bold" }}>
                    {e.title || "Event"}
                  </span>

                  <span style={valueStyle(e.actual)}>
                    {e.actual || "-"}
                  </span>

                  <span>{e.forecast || "-"}</span>

                  <span>{e.previous || "-"}</span>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const container = {
  padding: "30px",
  background: "#020617",
  minHeight: "100vh",
  color: "white"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  borderBottom: "1px solid #1f3a5f",
  paddingBottom: "15px"
};

const link = {
  marginRight: "15px",
  color: "#facc15",
  textDecoration: "none"
};

const activeLink = {
  marginRight: "15px",
  color: "#fff",
  fontWeight: "bold"
};

const table = {
  background: "#0b1e3a",
  borderRadius: "12px",
  overflow: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
};

const rowHeader = {
  display: "grid",
  gridTemplateColumns: "120px 80px 80px 100px 250px 100px 100px 100px",
  minWidth: "900px", // ✅ MOBILE FIX
  background: "#071530",
  padding: "12px",
  fontWeight: "bold",
  fontSize: "13px"
};

const row = (impact: string) => ({
  display: "grid",
  gridTemplateColumns: "120px 80px 80px 100px 250px 100px 100px 100px",
  minWidth: "900px", // ✅ MOBILE FIX
  padding: "12px",
  borderTop: "1px solid #1f3a5f",
  fontSize: "13px",
  alignItems: "center",
  background: impact === "high" ? "#071a2f" : "transparent",
  transition: "0.2s"
});

/* 🔥 FILTER BUTTON */
const filterBtn = (active: boolean) => ({
  marginRight: "10px",
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  background: active ? "#facc15" : "#071530",
  color: active ? "#000" : "#fff",
  fontWeight: "bold"
});

/* ---------------- LOGIC UI ---------------- */

const impactStyle = (lvl: string) => ({
  color:
    lvl === "high" ? "#ff4d4d" :
    lvl === "medium" ? "#facc15" :
    "#4ade80",
  fontWeight: "bold"
});

const formatImpact = (lvl: string) => {
  if (lvl === "high") return "🔴 Fort";
  if (lvl === "medium") return "🟡 Moyen";
  return "🟢 Faible";
};

const countryStyle = (c: string) => ({
  color:
    c === "USD" ? "#4ade80" :
    c === "EUR" ? "#60a5fa" :
    c === "MAD" ? "#facc15" :
    "#aaa",
  fontWeight: "bold"
});

const valueStyle = (val: string) => ({
  color: val ? "#4ade80" : "#aaa",
  fontWeight: val ? "bold" : "normal"
});