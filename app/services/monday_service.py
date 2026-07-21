import os
from pathlib import Path

import requests
from dotenv import load_dotenv

# ---------------------------------------
# Load Environment Variables
# ---------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

MONDAY_API_TOKEN = os.getenv("MONDAY_API_TOKEN")
MONDAY_API_URL = os.getenv("MONDAY_API_URL")

print("=" * 60)
print("MONDAY_API_URL:", MONDAY_API_URL)
print("TOKEN LOADED:", "YES" if MONDAY_API_TOKEN else "NO")
print("=" * 60)

# ---------------------------------------
# Request Headers
# ---------------------------------------
HEADERS = {
    "Authorization": MONDAY_API_TOKEN,
    "Content-Type": "application/json",
    "Accept": "application/json",
    "API-Version": "2025-04",
}


class MondayService:

    @staticmethod
    def execute_query(query: str, variables: dict = None):

        if not MONDAY_API_URL:
            raise Exception("MONDAY_API_URL not found in .env")

        if not MONDAY_API_TOKEN:
            raise Exception("MONDAY_API_TOKEN not found in .env")

        payload = {
            "query": query,
            "variables": variables or {}
        }

        print("\n================ REQUEST ================")
        print("URL:", MONDAY_API_URL)
        print("HEADERS:", HEADERS)
        print("PAYLOAD:")
        print(payload)
        print("=========================================\n")

        response = requests.post(
            MONDAY_API_URL,
            headers=HEADERS,
            json=payload,
            timeout=30,
        )

        print("\n================ RESPONSE ===============")
        print("STATUS:", response.status_code)
        try:
            print(response.text.encode('utf-8', errors='replace').decode('cp1252', errors='replace'))
        except Exception:
            print("[Response content omitted due to encoding restrictions]")
        print("=========================================\n")

        response.raise_for_status()

        result = response.json()

        if "errors" in result:
            raise Exception(result["errors"])

        return result