import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
key = os.getenv("GEMINI_API_KEY")

from google import genai
client = genai.Client(api_key=key)

try:
    res = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Respond in JSON: {\"status\": \"ok\"}"
    )
    print("SUCCESS with model 'gemini-3.6-flash':", res.text)
except Exception as e:
    print("Error:", e)
