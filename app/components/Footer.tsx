import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ 
      borderTop: "1px solid #1e293b", 
      padding: "30px 20px", 
      marginTop: "50px",
      background: "#020617" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "15px" 
      }}>
        <div style={{ display: "flex", gap: "25px" }}>
          <Link href="/about" style={footerLink}>À Propos</Link>
          <Link href="/privacy" style={footerLink}>Confidentialité</Link>
          <Link href="/news" style={footerLink}>Actualités</Link>
        </div>
        
        <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>
          © 2026 MAD Insights • Simplifier l'économie pour les traders marocains
        </p>
      </div>
    </footer>
  );
}

const footerLink = {
  color: "#94a3b8",
  fontSize: "13px",
  textDecoration: "none",
  transition: "0.3s",
};