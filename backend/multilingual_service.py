"""
IP-SAKTI Sahayak - Multilingual & Language Service
Provides language detection, translation normalization, and i18n support
for English, Tamil, Hindi, and Tanglish.
"""

import re
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from backend.gemini_service import GeminiService
except ImportError:
    from gemini_service import GeminiService


class MultilingualTextRecord(BaseModel):
    """Stores raw, normalized, and translated text representations."""

    original_text: str
    original_language: str = "English"  # English, Tamil, Hindi, Tanglish
    normalized_text: str = ""
    translated_english: str = ""
    is_translated: bool = False


# Simple dictionary fallback for Tamil and Hindi phrase translations
COMMON_TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "ta": {
        "Ayurvedic Wound Healing Formulation": "ஆயுர்வேத காயம் ஆற்றும் மருந்து",
        "Neem": "வேம்பு / வேப்பிலை",
        "Turmeric": "மஞ்சள்",
        "Tamil Nadu": "தமிழ்நாடு",
        "POSSIBLE": "சாத்தியமானது",
        "REVIEW_REQUIRED": "ஆய்வு தேவை",
        "OVERLAP_POSSIBLE": "பாரம்பரிய அறிவோடு பொருந்துதல் சாத்தியம்",
        "CLASSIFICATION_REQUIRED": "வகைப்பாடு தேவை",
        "SUPPORTED": "ஆதரிக்கப்பட்டது",
    },
    "hi": {
        "Ayurvedic Wound Healing Formulation": "आयुर्वेदिक घाव भरने वाला फॉर्मूलेशन",
        "Neem": "नीम",
        "Turmeric": "हल्दी",
        "Tamil Nadu": "तमिलनाडु",
        "POSSIBLE": "संभव",
        "REVIEW_REQUIRED": "समीक्षा आवश्यक",
        "OVERLAP_POSSIBLE": "पारंपरिक ज्ञान से मेल संभव",
        "CLASSIFICATION_REQUIRED": "वर्गीकरण आवश्यक",
        "SUPPORTED": "समर्थित",
    },
}


class MultilingualService:
    """
    Multilingual Processing & Translation Engine for IP-SAKTI Sahayak.
    Supports English, Tamil, Hindi, and Tanglish inputs and UI outputs.
    """

    def __init__(self):
        self.gemini_service = GeminiService()

    def detect_language(self, text: str) -> str:
        """
        Detects primary language of user input text.
        """
        if not text or not text.strip():
            return "English"

        # Unicode ranges
        # Tamil: U+0B80 - U+0BFF
        # Devanagari (Hindi): U+0900 - U+097F
        tamil_chars = len(re.findall(r"[\u0B80-\u0BFF]", text))
        hindi_chars = len(re.findall(r"[\u0900-\u097F]", text))
        total_len = max(1, len(text.strip()))

        if tamil_chars / total_len > 0.15:
            return "Tamil"
        elif hindi_chars / total_len > 0.15:
            return "Hindi"

        # Check for Tanglish / Hinglish signals in Latin text
        text_lower = text.lower()
        tanglish_words = ["marundhu", "kayam", "veepilai", "manjal", "thayarippu", "nattu", "mooligai"]
        hinglish_words = ["nuskha", "jadi", "booti", "ilaaj", "gharelu", "ayurved", "shuddh"]

        if any(w in text_lower for w in tanglish_words):
            return "Tanglish"
        elif any(w in text_lower for w in hinglish_words):
            return "Hinglish"

        return "English"

    def process_multilingual_input(self, raw_text: str) -> MultilingualTextRecord:
        """
        Processes raw user input, detects language, and produces normalized English text for NLP/RAG engines.
        """
        detected_lang = self.detect_language(raw_text)
        translated_en = raw_text
        is_trans = False

        if detected_lang in ["Tamil", "Hindi"]:
            # If Gemini is available, use LLM for translation, otherwise apply keyword mapping
            try:
                prompt = (
                    f"Translate the following {detected_lang} innovation text into clear English for patent and regulatory analysis.\n"
                    f"Preserve herb names, process details, and locations accurately.\n\n"
                    f"Text: \"{raw_text}\""
                )
                res = self.gemini_service.generate_content(prompt)
                if res and len(res.strip()) > 5:
                    translated_en = res.strip()
                    is_trans = True
            except Exception:
                translated_en = raw_text

        return MultilingualTextRecord(
            original_text=raw_text,
            original_language=detected_lang,
            normalized_text=raw_text.strip(),
            translated_english=translated_en,
            is_translated=is_trans,
        )

    def translate_phrase(self, text: str, target_lang: str) -> str:
        """
        Translates a phrase or label into target UI language ('en', 'ta', 'hi').
        """
        if not text or target_lang == "en":
            return text

        lang_code = target_lang.lower().strip()
        if lang_code in COMMON_TRANSLATIONS:
            if text in COMMON_TRANSLATIONS[lang_code]:
                return COMMON_TRANSLATIONS[lang_code][text]

        return text


if __name__ == "__main__":
    service = MultilingualService()
    
    # Test Tamil input
    ta_input = "வேப்பிலை மற்றும் மஞ்சள் பயன்படுத்தி காயம் ஆற்றும் மருந்து தயாரித்தேன்"
    rec = service.process_multilingual_input(ta_input)
    print("Multilingual Service Test Result:")
    print(f"  Detected Language: {rec.original_language}")
    print(f"  Original Text: {rec.original_text}")
    print(f"  Translated English: {rec.translated_english}")
    assert rec.original_language == "Tamil"
    print("[OK] Multilingual Service test passed cleanly!")
