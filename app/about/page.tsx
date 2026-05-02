import Link from 'next/link';

export default function About() {
  return (
    <div style={{ background: "#020617", minHeight: "100vh", color: "white", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/news" style={{ color: "#facc15", textDecoration: "none" }}>← Retour aux news</Link>
        
        <h1 style={{ fontSize: "32px", marginTop: "20px", color: "#facc15" }}>À Propos de MAD Insights</h1>
        
        <section style={{ marginTop: "30px" }}>
          <h2>Notre Mission</h2>
          <p>MAD Insights est une plateforme dédiée à l'actualité économique marocaine, conçue spécifiquement pour simplifier l'information financière pour les traders.</p>
        </section>

        <section style={{ marginTop: "30px" }}>
          <h2>Le Problème</h2>
          <p>Au Maroc, l'information économique est souvent dispersée et complexe, ce qui la rend difficilement exploitable pour les traders actifs.</p>
        </section>

        <section style={{ marginTop: "30px" }}>
          <h2>Notre Solution</h2>
          <p>Nous offrons une plateforme centralisée proposant un calendrier économique simplifié, des résumés d'actualités et des analyses d'impact sur le marché[cite: 1]. Nous visons à devenir la référence pour les traders de Forex, d'Or et les investisseurs marocains[cite: 1].</p>
        </section>
      </div>
    </div>
  );
}