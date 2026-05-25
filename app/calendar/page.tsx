"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filter, setFilter] = useState("ALL");

  // 🔄 Fonction pour récupérer les données
  const fetchEvents = () => {
    fetch("/api/calendar")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(() => setEvents([]));
  };

  useEffect(() => {
    fetchEvents(); // Chargement immédiat à l'ouverture

    // ⏱️ ACTUALISATION AUTOMATIQUE : Rafraîchit les données toutes les 60 secondes en arrière-plan
    const interval = setInterval(fetchEvents, 60000);

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => clearInterval(interval); // Nettoyage propre
  }, []);

  // 🔥 ALERTES HIGH IMPACT
  useEffect(() => {
    if (typeof window === "undefined" || events.length === 0) return;

    const STORAGE_KEY = "notifiedEventsFINAL";
    const stored = localStorage.getItem(STORAGE_KEY);
    const notified = stored ? new Set(JSON.parse(stored)) : new Set();

    events.forEach(e => {
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
    <div className="calendar-container">
      {/* 🎨 CSS RESPONSIVE INTÉGRÉ (Tableau sur PC, Cartes sur Mobile) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .calendar-container { padding: 20px; background: #020617; min-height: 100vh; color: white; }
        .filters { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
        .table-box { background: #0b1e3a; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        
        /* 💻 DESIGN PC : Grille horizontale classique */
        .row-header { display: grid; grid-template-columns: 90px 60px 80px 100px 1fr 80px 80px 80px; background: #071530; padding: 15px; font-weight: bold; font-size: 13px; color: #aaa; }
        .row-data { display: grid; grid-template-columns: 90px 60px 80px 100px 1fr 80px 80px 80px; padding: 15px; border-top: 1px solid #1f3a5f; font-size: 13px; align-items: center; transition: background 0.2s; }
        .row-data:hover { background: #0f2a44 !important; }
        .mobile-label { display: none; } /* Caché sur PC */

        /* 📱 DESIGN MOBILE : Transformation en Cartes (Cards) */
        @media (max-width: 768px) {
          .calendar-container { padding: 10px; }
          .row-header { display: none; } /* On cache l'en-tête du tableau */
          
          .row-data { 
            display: grid; 
            grid-template-areas: 
              "date heure pays impact"
              "event event event event"
              "actuel prevision precedent precedent";
            grid-template-columns: auto auto auto 1fr;
            gap: 12px;
            border-top: 6px solid #020617; 
            padding: 15px;
          }
          
          .col-date { grid-area: date; color: #aaa; }
          .col-heure { grid-area: heure; color: #aaa; }
          .col-pays { grid-area: pays; }
          .col-impact { grid-area: impact; text-align: right; }
          .col-event { grid-area: event; font-size: 15px; margin: 5px 0; line-height: 1.4; }
          
          /* Blocs de statistiques en bas de la carte */
          .col-actuel, .col-prevision, .col-precedent { background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; text-align: center; }
          .col-actuel { grid-area: actuel; }
          .col-prevision { grid-area: prevision; }
          .col-precedent { grid-area: precedent; }
          
          .mobile-label { display: block; font-size: 10px; color: #aaa; text-transform: uppercase; margin-bottom: 4px; }
        }
      `}} />

      <p style={{ color: "#aaa", marginBottom: "15px", fontSize: "14px" }}>
        ⚠️ Les événements HIGH impact déclenchent une alerte automatique.<br/>
        🔄 <i>Données actualisées automatiquement en temps réel.</i>
      </p>

      <div className="filters">
        <button onClick={() => setFilter("ALL")} style={filterBtn(filter === "ALL")}>ALL</button>
        <button onClick={() => setFilter("US")} style={filterBtn(filter === "US")}>USD 🇺🇸</button>
        <button onClick={() => setFilter("MA")} style={filterBtn(filter === "MA")}>MAD 🇲🇦</button>
      </div>

      <div className="table-box">
        <div className="row-header">
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
          <p style={{ padding: "20px", textAlign: "center", color: "#aaa" }}>Chargement des données...</p>
        ) : (
          events
            .filter(e => filter === "ALL" || e.pays === filter)
            .map((e, i) => (
              <div 
                key={i} 
                className="row-data"
                style={{ background: e.impact === "Fort" ? "#071a2f" : "transparent" }}
              >
                <div className="col-date">{e.date}</div>
                <div className="col-heure">{e.heure}</div>
                
                <div className="col-pays" style={countryStyle(e.pays)}>
                  {e.pays === "US" && "🇺🇸 "}{e.pays === "MA" && "🇲🇦 "}{e.pays}
                </div>
                
                <div className="col-impact" style={impactStyle(e.impact)}>
                  {formatImpact(e.impact)}
                </div>
                
                <div className="col-event" style={{ fontWeight: "bold" }}>
                  {e.evenement}
                </div>
                
                <div className="col-actuel">
                  <div className="mobile-label">Actuel</div>
                  <div style={valueStyle(e.actuel)}>{e.actuel || "-"}</div>
                </div>
                
                <div className="col-prevision">
                  <div className="mobile-label">Prévision</div>
                  <div>{e.prevision || "-"}</div>
                </div>
                
                <div className="col-precedent">
                  <div className="mobile-label">Précédent</div>
                  <div>{e.precedent || "-"}</div>
                </div>
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

const filterBtn = (active: boolean) => ({
  padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", 
  background: active ? "#facc15" : "#071530", color: active ? "#000" : "#fff", 
  fontWeight: "bold" as const, transition: "0.2s"
});