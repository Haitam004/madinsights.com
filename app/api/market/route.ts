import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API_KEY = "3cc5d833f152488fa5fe1e81ad80e5bd"; // remplace par ta clé après

    // GOLD
    const goldRes = await fetch(
      `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`
    );
    const goldData = await goldRes.json();

    // USD/MAD
    const usdRes = await fetch(
      `https://api.twelvedata.com/price?symbol=USD/MAD&apikey=${API_KEY}`
    );
    const usdData = await usdRes.json();

    return NextResponse.json({
      gold: goldData.price ? parseFloat(goldData.price) : null,
      usdmad: usdData.price ? parseFloat(usdData.price) : null
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({
      gold: null,
      usdmad: null
    });
  }
}