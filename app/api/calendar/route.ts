import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // On teste la récupération
    const { data, error } = await supabase
      .from('economic_calendar')
      .select('*');

    if (error) {
      console.error("Erreur Supabase détaillée:", error);
      return NextResponse.json({ error: error.message, hint: error.hint }, { status: 500 });
    }

    console.log("Données récupérées :", data);
    return NextResponse.json(data || []);

  } catch (err: any) {
    return NextResponse.json({ error: "Erreur serveur", details: err.message }, { status: 500 });
  }
}