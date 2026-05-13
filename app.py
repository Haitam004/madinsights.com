import os
import requests
import feedparser
import urllib3
import time #
from dotenv import load_dotenv
from supabase import create_client
from google import genai

# Désactive les avertissements SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv()

supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

SOURCES = {
    "MAP Économie": "https://www.mapnews.ma/fr/actualites/economie/rss",
    "AMMC Bourse": "https://www.ammc.ma/fr/rss/actualites",
    "Challenge.ma": "https://www.challenge.ma/categorie/economie/flux/"
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
}

def analyser_news(titre):
    prompt = f"Analyse cette actualité boursière/éco : '{titre}'. Réponds uniquement sous ce format : RÉSUMÉ: (max 12 mots) | SENTIMENT: (Positif/Négatif/Neutre)"
    try:
        response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        return response.text.strip()
    except:
        return "Analyse indisponible"

def recuperer_et_stocker():
    print(f"\n--- 🤖 Mise à jour : {time.strftime('%H:%M:%S')} ---") #
    
    for nom_source, url in SOURCES.items():
        try:
            response = requests.get(url, headers=HEADERS, timeout=15, verify=False)
            flux = feedparser.parse(response.content)
            
            if not flux.entries:
                continue

            for entry in flux.entries[:4]:
                titre = entry.title
                lien = entry.link
                analyse_complete = analyser_news(titre)
                
                parts = analyse_complete.split('|')
                resume = parts[0].replace('RÉSUMÉ:', '').strip() if len(parts) > 0 else analyse_complete
                sentiment = parts[1].replace('SENTIMENT:', '').strip() if len(parts) > 1 else "Neutre"

                data = {
                    "title": titre,
                    "source": nom_source,
                    "link": lien,
                    "analysis": resume,
                    "sentiment": sentiment
                }
                
                try:
                    supabase.table('maroc_pulse').insert(data).execute()
                    print(f"✅ Nouveau : {titre[:50]}...")
                except Exception as e:
                    if "duplicate key" not in str(e):
                        print(f"❌ Erreur SQL : {e}")

        except Exception as e:
            print(f"❌ Erreur sur {nom_source} : {e}")

# Boucle d'automatisation
if __name__ == "__main__":
    while True: #
        recuperer_et_stocker()
        print("\n😴 En attente pendant 30 minutes...") #
        time.sleep(1800) # 1800 secondes = 30 minutes