import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 🔥 fallback data propre
    const data = [
      {
        title: "US CPI Inflation",
        date: new Date().toISOString(),
        country: "USD",
        impact: "high",
        actual: "3.2%",
        forecast: "3.0%",
        previous: "2.9%"
      },
      {
        title: "ECB Interest Rate Decision",
        date: new Date(Date.now() + 3600000).toISOString(),
        country: "EUR",
        impact: "high",
        actual: "3.5%",
        forecast: "3.5%",
        previous: "3.25%"
      }
    ];

    return NextResponse.json(data);

  } catch {
    return NextResponse.json([]);
  }
}