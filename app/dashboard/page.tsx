"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Données fictives pour l'instant (on les connectera à ton API plus tard)
const data = [
  { date: '24/04', price: 10.02 },
  { date: '25/04', price: 10.05 },
  { date: '26/04', price: 10.03 },
  { date: '27/04', price: 10.08 },
  { date: '28/04', price: 10.06 },
  { date: '29/04', price: 10.12 },
  { date: '30/04', price: 10.10 },
];

export default function Dashboard() {
  return (
    <div style={{ padding: "20px", background: "#020617", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Tableau de Bord Analytique</h1>
      
      <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        
        {/* CARTE GRAPHIQUE USD/MAD */}
        <div style={{ background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h3 style={{ marginBottom: "15px", color: "#facc15" }}>Évolution USD/MAD</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 0.05', 'dataMax + 0.05']} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#facc15' }}
                />
                <Area type="monotone" dataKey="price" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* STATISTIQUES RAPIDES */}
        <div style={{ background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
          <h3 style={{ marginBottom: "15px" }}>Indicateurs Clés</h3>
          <div style={statRow}>
            <span>Volatilité Hebdo</span>
            <span style={{ color: "#4ade80" }}>1.2%</span>
          </div>
          <div style={statRow}>
            <span>Tendance MAD</span>
            <span style={{ color: "#ff4d4d" }}>Baissière</span>
          </div>
          <div style={statRow}>
            <span>Volume estimé</span>
            <span>Low</span>
          </div>
        </div>

      </div>
    </div>
  );
}

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #1e293b",
  fontSize: "14px"
};