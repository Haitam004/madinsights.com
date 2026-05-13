import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

# Données réelles approximatives pour débloquer ton site
actions_data = [
    {"ticker": "IAM.MA", "nom": "Maroc Telecom", "prix": 92.50, "variation": "+0.45%"},
    {"ticker": "ATW.MA", "nom": "Attijariwafa Bank", "prix": 540.00, "variation": "-1.20%"},
    {"ticker": "ADH.MA", "nom": "Addoha", "prix": 32.15, "variation": "+2.10%"},
    {"ticker": "MNG.MA", "nom": "Managem", "prix": 2850.00, "variation": "+0.80%"},
    {"ticker": "BCP.MA", "nom": "BCP", "prix": 305.00, "variation": "-0.15%"}
]

def update_bourse_simulee():
    print("--- 🚀 Injection des données Bourse (Mode Stable) ---")
    for data in actions_data:
        try:
            supabase.table('maroc_bourse').upsert(data, on_conflict='ticker').execute()
            print(f"✅ {data['nom']} mis à jour dans Supabase")
        except Exception as e:
            print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    update_bourse_simulee()