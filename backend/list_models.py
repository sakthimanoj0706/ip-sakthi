import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
key = os.getenv("GEMINI_API_KEY")

from google import genai
client = genai.Client(api_key=key)

try:
    models = list(client.models.list())
    print("Available Gemini Models:")
    for m in models:
        print(" -", m.name)
except Exception as e:
    print("List Models Error:", e)
