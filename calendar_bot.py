import feedparser
import os
from supabase import create_client

# Configuration Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def get_live_events():
    # On utilise le flux RSS de ForexFactory ou Investing (ici un exemple stable)
    feed_url = "https://www.forexfactory.com/ff_calendar_thisweek.xml"
    feed = feedparser.parse(feed_url)
    
    live_data = []
    
    # On prend les 5 derniers événements importants
    for entry in feed.entries[:5]:
        live_data.append({
            "date": entry.get('date', 'Aujourd\'hui'),
            "heure": entry.get('time', '--:--'),
            "pays": entry.get('country', 'USD'),
            "impact": entry.get('impact', 'Moyen'),
            "evenement": entry.get('title', 'Événement Économique'),
            "actuel": entry.get('actual', '-'),
            "prevision": entry.get('forecast', '-'),
            "precedent": entry.get('previous', '-')
        })
    return live_data

def update_calendar():
    print("--- 📡 Récupération des vraies données en cours ---")
    
    events = get_live_events()
    
    if events:
        # 1. On vide l'ancienne table pour éviter les doublons
        supabase.table('economic_calendar').delete().neq('id', 0).execute()
        
        # 2. On insère les nouvelles données scrapées
        supabase.table('economic_calendar').insert(events).execute()
        print(f"✅ {len(events)} événements réels mis à jour avec succès !")
    else:
        print("⚠️ Aucune donnée récupérée.")

if __name__ == "__main__":
    update_calendar()