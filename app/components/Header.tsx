"use client";
import Link from "next/link";

export default function Header() {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <Link href="/">Accueil</Link>
      <Link href="/news">Actualités</Link>
      <Link href="/calendar">Calendrier</Link>
    </div>
  );
}