"use client";

import { useEffect, useState, useRef } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/calendar")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // 🔥 ALERTES HIGH IMPACT (Correction des clés de données)
  useEffect(() => {
    if (typeof window === "undefined" || events.length === 0) return;

    const STORAGE_KEY = "notifiedEventsFINAL";
    const stored = localStorage.getItem(STORAGE_KEY);
    const notified = stored ? new Set(JSON.parse(stored)) : new Set();

    events.forEach(e => {
      // On utilise "Fort" car c'est ce que ton script Python envoie
      if (e.impact !== "Fort") return;

      const eventId = (e.evenement || "").trim().toLowerCase();
      if (!eventId || notified.has(eventId)) return;

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🚨 HIGH IMPACT EVENT", { body: e.evenement });
      }
      notified.add(eventId);
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify([...notified]));
  }, [events]);

  return (
    <div style={container}>
      <p style={{ color: "#aaa", marginBottom: "10px" }}>
        ⚠️ Les événements HIGH impact déclenchent une alerte automatique
      </p>

      {/* FILTRES MIS À JOUR */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("ALL")} style={filterBtn(filter === "ALL")}>ALL</button>
        <button onClick={() => setFilter("US")} style={filterBtn(filter === "US")}>USD 🇺🇸</button>
        <button onClick={() => setFilter("MA")} style={filterBtn(filter === "MA")}>MAD 🇲🇦</button>
      </div>

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
          <p style={{ padding: "20px" }}>Chargement des données...</p>
        ) : (
          events
            .filter(e => filter === "ALL" || e.pays === filter) // Filtre sur 'pays' (US/MA)
            .map((e, i) => (
              <div
                key={i}
                style={row(e.impact)}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = "#0f2a44")}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = e.impact === "Fort" ? "#071a2f" : "transparent")}
              >
                {/* Affichage direct des cordonnées texte de ta DB */}
                <span>{e.date}</span>
                <span>{e.heure}</span>

                <span style={countryStyle(e.pays)}>
                  {e.pays === "US" && "🇺🇸 "}
                  {e.pays === "MA" && "🇲🇦 "}
                  {e.pays}
                </span>

                <span style={impactStyle(e.impact)}>
                  {formatImpact(e.impact)}
                </span>

                <span style={{ fontWeight: "bold" }}>{e.evenement}</span>
                <span style={valueStyle(e.actuel)}>{e.actuel || "-"}</span>
                <span>{e.prevision || "-"}</span>
                <span>{e.precedent || "-"}</span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

/* ---------------- LOGIC UI (Synchronisée avec Python) ---------------- */

const impactStyle = (lvl: string) => ({
  color: lvl === "Fort" ? "#ff4d4d" : lvl === "Moyen" ? "#facc15" : "#4ade80",
  fontWeight: "bold" as const
});

const formatImpact = (lvl: string) => {
  if (lvl === "Fort") return "🔴 Fort";
  if (lvl === "Moyen") return "🟡 Moyen";
  return "🟢 Faible";
};

const countryStyle = (c: string) => ({
  color: c === "US" ? "#4ade80" : c === "MA" ? "#facc15" : "#aaa",
  fontWeight: "bold" as const
});

const valueStyle = (val: string) => ({
  color: val && val.includes('%') ? "#4ade80" : "#fff",
  fontWeight: "bold" as const
});

/* ---------------- STYLES ---------------- */

const container = { padding: "30px", background: "#020617", minHeight: "100vh", color: "white" };
const table = { background: "#0b1e3a", borderRadius: "12px", overflowX: "auto" as const, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" };
const rowHeader = { display: "grid", gridTemplateColumns: "120px 80px 80px 100px 250px 100px 100px 100px", minWidth: "900px", background: "#071530", padding: "12px", fontWeight: "bold", fontSize: "13px" };
const row = (impact: string) => ({ display: "grid", gridTemplateColumns: "120px 80px 80px 100px 250px 100px 100px 100px", minWidth: "900px", padding: "12px", borderTop: "1px solid #1f3a5f", fontSize: "13px", alignItems: "center", background: impact === "Fort" ? "#071a2f" : "transparent", transition: "0.2s" });
const filterBtn = (active: boolean) => ({ marginRight: "10px", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", background: active ? "#facc15" : "#071530", color: active ? "#000" : "#fff", fontWeight: "bold" as const });