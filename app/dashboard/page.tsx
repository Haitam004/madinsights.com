"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'un chargement de données
    const fetchData = async () => {
      const fakeData = [
        { date: '24/04', price: 10.02 },
        { date: '25/04', price: 10.05 },
        { date: '26/04', price: 10.03 },
        { date: '27/04', price: 10.08 },
        { date: '28/04', price: 10.06 },
        { date: '29/04', price: 10.12 },
        { date: '30/04', price: 10.10 },
      ];
      setTimeout(() => {
        setChartData(fakeData);
        setLoading(false);
      }, 800);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", background: "#020617", minHeight: "100vh", color: "white" }}>
        <p>Chargement des analyses financières en cours...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#020617", minHeight: "100vh", color: "white" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "bold" }}>Tableau de Bord Analytique</h1>
        
        <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          
          {/* CARTE GRAPHIQUE USD/MAD MODIFIÉE */}
          <div style={{ background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ marginBottom: "15px", color: "#facc15", fontWeight: "600" }}>Évolution USD/MAD</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={['dataMin - 0.02', 'dataMax + 0.02']} 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(tick) => Number(tick).toFixed(2)} /* 🛠️ Fix des décimales sur l'axe */
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#facc15' }}
                    formatter={(value) => [`${Number(value).toFixed(2)} MAD`, "Prix"]} /* 🛠️ Fix des décimales au survol */
                  />
                  <Area type="monotone" dataKey="price" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* STATISTIQUES RAPIDES */}
          <div style={{ background: "#0b1e3a", padding: "20px", borderRadius: "12px", border: "1px solid #1e293b" }}>
            <h3 style={{ marginBottom: "15px", fontWeight: "600" }}>Indicateurs Clés</h3>
            <div style={statRow}>
              <span>Volatilité Hebdo</span>
              <span style={{ color: "#4ade80", fontWeight: "bold" }}>1.2%</span>
            </div>
            <div style={statRow}>
              <span>Tendance MAD</span>
              <span style={{ color: "#ff4d4d", fontWeight: "bold" }}>Baissière</span>
            </div>
            <div style={statRow}>
              <span>Volume estimé</span>
              <span style={{ fontWeight: "bold", color: "#94a3b8" }}>Faible</span>
            </div>
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