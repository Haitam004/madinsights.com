"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Exemple de données pour le graphique (à remplacer plus tard par ton API)
const data = [
  { name: 'Lun', price: 10.05 },
  { name: 'Mar', price: 10.08 },
  { name: 'Mer', price: 10.04 },
  { name: 'Jeu', price: 10.12 },
  { name: 'Ven', price: 10.10 },
];

export default function Dashboard() {
  return (
    <div style={container}>
      <div style={content}>
        <h1 style={title}>Tableau de Bord Marché</h1>
        
        {/* 1. MINI CARTES DE PRIX (Forex & Or) */}
        <div style={statsGrid}>
          <div style={statCard}>
            <p style={statLabel}>USD / MAD</p>
            <p style={statValue}>10.10 <span style={{fontSize: '12px', color: '#4ade80'}}>+0.2%</span></p>
          </div>
          <div style={statCard}>
            <p style={statLabel}>EUR / MAD</p>
            <p style={statValue}>10.85 <span style={{fontSize: '12px', color: '#ff4d4d'}}>-0.1%</span></p>
          </div>
          <div style={statCard}>
            <p style={statLabel}>Or (g)</p>
            <p style={statValue}>745.20 MAD</p>
          </div>
        </div>

        {/* 2. GRAPHIQUE PRINCIPAL */}
        <div style={chartSection}>
          <h2 style={sectionTitle}>Évolution USD/MAD (7 derniers jours)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={['auto', 'auto']} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                <Line type="monotone" dataKey="price" stroke="#facc15" strokeWidth={3} dot={{ fill: '#facc15' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. APPEL À L'ACTION STRATÉGIQUE */}
        <div style={ctaBox}>
          <p>Maximisez vos profits sur le Forex et l'Or avec <strong>Exness</strong>.</p>
          <a href="https://one.exnessonelink.com/a/o9d6u5m1ye" target="_blank" style={ctaButton}>Démarrer le Trading</a>
        </div>
      </div>
    </div>
  );
}

/* Styles */
const container = { background: "#020617", minHeight: "100vh", color: "white", padding: "20px" };
const content = { maxWidth: "1000px", margin: "0 auto" };
const title = { fontSize: "24px", marginBottom: "30px", fontWeight: "bold" };
const statsGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" };
const statCard = { background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" };
const statLabel = { color: "#94a3b8", fontSize: "14px", margin: 0 };
const statValue = { fontSize: "22px", fontWeight: "bold", margin: "5px 0 0 0" };
const chartSection = { background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b", marginBottom: "30px" };
const sectionTitle = { fontSize: "18px", marginBottom: "20px", color: "#facc15" };
const ctaBox = { background: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" as const, display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "15px" };
const ctaButton = { background: "#facc15", color: "#000", padding: "10px 25px", borderRadius: "8px", fontWeight: "bold", textDecoration: "none" };