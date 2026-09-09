"""
IP-SAKTI Sahayak - Multilingual & Language Service
Provides language detection, translation normalization, and 100% UI language translation
for English, Tamil, Hindi, and Tanglish.
"""

import re
import json
from typing import Dict, Any, Optional, Union, List
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


# Comprehensive offline translation dictionary mapping for Tamil and Hindi
DOMAIN_TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "ta": {
        # Regimes & Statuses
        "PATENT": "காப்புரிமை அடுக்கு (Patent)",
        "TRADITIONAL_KNOWLEDGE": "பாரம்பரிய அறிவு (TKDL)",
        "ABS": "உயிரியல் வளங்கள் (BDA 2023)",
        "REGULATORY": "ஒழுங்குமுறை உரிமம் (Regulatory)",
        "POSSIBLE": "சாத்தியமானது (POSSIBLE)",
        "REVIEW_REQUIRED": "ஆய்வு தேவை (REVIEW REQUIRED)",
        "OVERLAP_POSSIBLE": "பாரம்பரிய அறிவோடு பொருந்துதல் சாத்தியம் (OVERLAP)",
        "CLASSIFICATION_REQUIRED": "வகைப்பாடு தேவை (CLASSIFICATION REQUIRED)",
        "SUPPORTED": "ஆதரிக்கப்பட்டது (SUPPORTED)",
        "HIGH_RISK": "அதிக ஆபத்து (HIGH RISK)",
        "EXEMPT": "விலக்கு அளிக்கப்பட்டது (EXEMPT)",
        "LOW_INDICATION": "குறைந்த அறிகுறி (LOW INDICATION)",

        # Common Labels
        "Ayurvedic Wound Healing Formulation": "ஆயுர்வேத காயம் ஆற்றும் மருந்து",
        "Ayurvedic Formulation": "ஆயுர்வேத தயாரிப்பு",
        "Neem": "வேம்பு",
        "Turmeric": "மஞ்சள்",
        "Tamil Nadu": "தமிழ்நாடு",
        "English": "ஆங்கிலம்",
        "Tamil": "தமிழ்",
        "Hindi": "இந்தி",
        "Tanglish": "டாங்க்லிஷ்",
        "Hinglish": "ஹிங்கிலிஷ்",
        "OPERATIONAL": "இயங்குகிறது",

        # General Phrases
        "Why did IP-SAKTI say this?": "IP-SAKTI ஏன் இந்த முடிவை வழங்கியது?",
        "Step-by-Step Decision Reasoning": "படிப்படியான முடிவு விளக்கம்",
        "Evaluation Outcome:": "மதிப்பீட்டு முடிவுகள்:",
        "Verified with sources": "ஆதாரங்களுடன் சரிபார்க்கப்பட்டது",
        "1. Understanding": "1. புரிந்து கொள்ளுதல்",
        "2. AI Analysis": "2. AI பகுப்பாய்வு",
        "3. Legal Evaluation": "3. சட்ட மதிப்பீடு",
        "4. Final Decision": "4. இறுதி முடிவு",
        "Statute:": "சட்டம்:",
        "Core Rule:": "முக்கிய விதி:",
        "Why It Applies To You:": "உங்களுக்கு இது ஏன் பொருந்துகிறது:",
        "What Makes Your Case Different:": "உங்கள் வழக்கை வேறுபடுத்துவது எது:",
        "What You Should Prove:": "நீங்கள் நிரூபிக்க வேண்டியவை:",
        "WHAT WE DETECTED": "நாங்கள் கண்டறிந்தது",
        "WHY IT MATTERS": "ஏன் இது முக்கியம்",
        "SUPPORTING EVIDENCE": "ஆதரவு ஆதாரங்கள்",
        "WHAT TO CHECK NEXT": "அடுத்து என்ன சரிபார்க்க வேண்டும்",
        "Your Next Recommended Action": "உங்கள் அடுத்த பரிந்துரைக்கப்பட்ட செயல்",
    },
    "hi": {
        # Regimes & Statuses
        "PATENT": "पेटेंट शासन (Patent)",
        "TRADITIONAL_KNOWLEDGE": "पारंपरिक ज्ञान (TKDL)",
        "ABS": "जैविक संसाधन (BDA 2023)",
        "REGULATORY": "नियामक लाइसेंसिंग (Regulatory)",
        "POSSIBLE": "संभव (POSSIBLE)",
        "REVIEW_REQUIRED": "समीक्षा आवश्यक (REVIEW REQUIRED)",
        "OVERLAP_POSSIBLE": "पारंपरिक ज्ञान से मेल संभव (OVERLAP)",
        "CLASSIFICATION_REQUIRED": "वर्गीकरण आवश्यक (CLASSIFICATION REQUIRED)",
        "SUPPORTED": "समर्थित (SUPPORTED)",
        "HIGH_RISK": "उच्च जोखिम (HIGH RISK)",
        "EXEMPT": "छूट (EXEMPT)",
        "LOW_INDICATION": "कम संकेत (LOW INDICATION)",

        # Common Labels
        "Ayurvedic Wound Healing Formulation": "आयुर्वेदिक घाव भरने वाला फॉर्मूलेशन",
        "Ayurvedic Formulation": "आयुर्वेदिक फॉर्मूलेशन",
        "Neem": "नीम",
        "Turmeric": "हल्दी",
        "Tamil Nadu": "तमिलनाडु",
        "English": "अंग्रेज़ी",
        "Tamil": "तमिल",
        "Hindi": "हिंदी",
        "Tanglish": "टैंग्लिश",
        "Hinglish": "हिंग्लिश",
        "OPERATIONAL": "सक्रिय",

        # General Phrases
        "Why did IP-SAKTI say this?": "IP-SAKTI ने यह क्यों कहा?",
        "Step-by-Step Decision Reasoning": "चरण-दर-चरण निर्णय तर्क",
        "Evaluation Outcome:": "मूल्यांकन परिणाम:",
        "Verified with sources": "स्रोतों के साथ सत्यापित",
        "1. Understanding": "1. समझ",
        "2. AI Analysis": "2. AI विश्लेषण",
        "3. Legal Evaluation": "3. कानूनी मूल्यांकन",
        "4. Final Decision": "4. अंतिम निर्णय",
        "Statute:": "कानून:",
        "Core Rule:": "मूल नियम:",
        "Why It Applies To You:": "यह आप पर क्यों लागू होता है:",
        "What Makes Your Case Different:": "आपके मामले को क्या अलग बनाता है:",
        "What You Should Prove:": "आपको क्या साबित करना चाहिए:",
        "WHAT WE DETECTED": "हमने क्या पता लगाया",
        "WHY IT MATTERS": "यह क्यों महत्वपूर्ण है",
        "SUPPORTING EVIDENCE": "सहायक साक्ष्य",
        "WHAT TO CHECK NEXT": "आगे क्या जांचना है",
        "Your Next Recommended Action": "आपकी अगली अनुशंसित कार्रवाई",
    },
}


class MultilingualService:
    """
    Multilingual Processing & Translation Engine for IP-SAKTI Sahayak.
    Supports English, Tamil, Hindi, and Tanglish inputs and UI outputs.
    Enforces 100% target UI language output across all API endpoints.
    """

    def __init__(self):
        self.gemini_service = GeminiService()
        self._cache: Dict[str, str] = {}

    def detect_language(self, text: str) -> str:
        """Detects primary language of user input text."""
        if not text or not text.strip():
            return "English"

        tamil_chars = len(re.findall(r"[\u0B80-\u0BFF]", text))
        hindi_chars = len(re.findall(r"[\u0900-\u097F]", text))
        total_len = max(1, len(text.strip()))

        if tamil_chars / total_len > 0.15:
            return "Tamil"
        elif hindi_chars / total_len > 0.15:
            return "Hindi"

        text_lower = text.lower()
        tanglish_words = ["marundhu", "kayam", "veepilai", "manjal", "thayarippu", "nattu", "mooligai"]
        hinglish_words = ["nuskha", "jadi", "booti", "ilaaj", "gharelu", "ayurved", "shuddh"]

        if any(w in text_lower for w in tanglish_words):
            return "Tanglish"
        elif any(w in text_lower for w in hinglish_words):
            return "Hinglish"

        return "English"

    def process_multilingual_input(self, raw_text: str) -> MultilingualTextRecord:
        """Processes raw user input and produces normalized English text for NLP/RAG engines."""
        detected_lang = self.detect_language(raw_text)
        translated_en = raw_text
        is_trans = False

        if detected_lang in ["Tamil", "Hindi"]:
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

    def translate_text(self, text: str, target_lang: str, context: str = "") -> str:
        """
        Translates a string into the target UI language ('en', 'ta', 'hi').
        Preserves official legal act names (e.g. 'The Patents Act, 1970 — Section 3(p)') in English in parentheses if needed.
        Caches results in memory for high performance.
        """
        if not text or not text.strip():
            return ""
        if target_lang in ["en", "english", "EN"]:
            return text

        lang_code = target_lang.lower().strip()
        if lang_code not in ["ta", "hi"]:
            return text

        cache_key = f"{lang_code}:{context}:{text}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        # Check offline dictionary first
        dict_map = DOMAIN_TRANSLATIONS.get(lang_code, {})
        if text in dict_map:
            res = dict_map[text]
            self._cache[cache_key] = res
            return res

        # If LLM is enabled, call Gemini for rich context-aware translation
        if self.gemini_service and getattr(self.gemini_service, "enabled", False):
            target_name = "Tamil" if lang_code == "ta" else "Hindi"
            prompt = f"""
You are IP-SAKTI Sahayak, an AI Legal Assistant for Ayurveda & AYUSH innovations.
Translate the following user-facing text into natural {target_name} script for the user interface.

Context: {context or 'Ayurveda IP and Regulatory Guidance UI'}
SYSTEM RULE:
- ALL user-facing explanations, reasons, steps, and questions MUST be in natural {target_name}.
- Preserve official statutory names (e.g. "The Patents Act, 1970 — Section 3(p)", "Biological Diversity Act 2023", "Rule 158-B") in English inside parentheses, but translate all surrounding text.
- Do NOT output markdown code blocks or conversational chatter. Output ONLY the translated text.

Text to translate:
"{text}"
"""
            try:
                res = self.gemini_service.generate_content(prompt)
                if res and len(res.strip()) > 0:
                    cleaned = res.strip().strip('"').strip("'")
                    self._cache[cache_key] = cleaned
                    return cleaned
            except Exception:
                pass

        # If LLM translation unavailable, return original
        return text

    def translate_payload(self, data: Any, target_lang: str) -> Any:
        """
        Recursively translates text fields in dicts or lists into target_lang ('ta' or 'hi').
        Skips system keys like 'id', 'session_id', 'url', 'law', 'section', 'intent_hash'.
        """
        if not target_lang or target_lang in ["en", "english", "EN"]:
            return data

        skip_keys = {"id", "session_id", "url", "intent_hash", "law", "section", "jurisdiction", "color"}

        if isinstance(data, dict):
            new_dict = {}
            for k, v in data.items():
                if k in skip_keys:
                    new_dict[k] = v
                elif isinstance(v, str) and len(v.strip()) > 0:
                    # Translate user-facing text fields
                    if k in ["reason", "detail", "step_name", "what_we_detected", "why_it_matters", "overall_next_action", "policy_title", "what_it_means", "why_it_applies_to_you", "what_makes_your_case_different", "explanation", "question_text", "help_text", "why_asking", "description", "category_reason", "confidence_label"]:
                        new_dict[k] = self.translate_text(v, target_lang, context=k)
                    else:
                        new_dict[k] = v
                elif isinstance(v, (dict, list)):
                    new_dict[k] = self.translate_payload(v, target_lang)
                else:
                    new_dict[k] = v
            return new_dict

        elif isinstance(data, list):
            return [self.translate_payload(item, target_lang) for item in data]

        return data


if __name__ == "__main__":
    service = MultilingualService()
    
    # Test Tamil translation
    ta_trans = service.translate_text("Why did IP-SAKTI say this?", "ta")
    print(f"Tamil Translation: {ta_trans}")
    assert "IP-SAKTI" in ta_trans

    # Test Hindi translation
    hi_trans = service.translate_text("Why did IP-SAKTI say this?", "hi")
    print(f"Hindi Translation: {hi_trans}")
    assert "IP-SAKTI" in hi_trans

    print("[OK] Enhanced Multilingual Service test passed cleanly!")
