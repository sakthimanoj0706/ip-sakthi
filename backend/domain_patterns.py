"""
IP-SAKTI Sahayak - Ayurveda Domain Patterns & Synonym Dictionary
Provides pattern definitions, botanical scientific names, Sanskrit synonyms, and process terms.
Includes English, Tamil (Script & Transliterated), Hindi, and Latin terms.
"""

from typing import Dict, List, Any


AYURVEDA_HERB_MAP: Dict[str, Dict[str, Any]] = {
    "neem": {
        "common_name": "Neem",
        "scientific_name": "Azadirachta indica",
        "ayurvedic_name": "Nimba",
        "synonyms": ["neem", "vempu", "vembu", "nimba", "azadirachta indica", "vembam", "veppam", "veppu", "வேம்பு", "வேப்பம்"],
    },
    "turmeric": {
        "common_name": "Turmeric",
        "scientific_name": "Curcuma longa",
        "ayurvedic_name": "Haridra",
        "synonyms": ["turmeric", "haldi", "manjal", "haridra", "curcuma longa", "curcumin", "மஞ்சள்", "மஞ்சள் தூள்"],
    },
    "ashwagandha": {
        "common_name": "Ashwagandha",
        "scientific_name": "Withania somnifera",
        "ayurvedic_name": "Ashwagandha",
        "synonyms": ["ashwagandha", "indian ginseng", "withania somnifera", "withanolide", "அமுக்கரா", "அஸ்வகந்தா"],
    },
    "guduchi": {
        "common_name": "Guduchi",
        "scientific_name": "Tinospora cordifolia",
        "ayurvedic_name": "Amrita",
        "synonyms": ["guduchi", "giloy", "tinospora cordifolia", "amrita", "seenthil", "சீந்தில்"],
    },
    "triphala": {
        "common_name": "Triphala",
        "scientific_name": "Terminalia chebula / Terminalia bellirica / Phyllanthus emblica",
        "ayurvedic_name": "Triphala",
        "synonyms": ["triphala", "amla", "haritaki", "bibhitaki", "thiriphala", "திரிபலா"],
    },
    "tulsi": {
        "common_name": "Tulsi",
        "scientific_name": "Ocimum sanctum",
        "ayurvedic_name": "Tulasi",
        "synonyms": ["tulsi", "holy basil", "ocimum sanctum", "tulasi", "thulasi", "துளசி"],
    },
    "brahmi": {
        "common_name": "Brahmi",
        "scientific_name": "Bacopa monnieri",
        "ayurvedic_name": "Brahmi",
        "synonyms": ["brahmi", "bacopa monnieri", "vallarai", "வல்லாரை"],
    },
    "shatavari": {
        "common_name": "Shatavari",
        "scientific_name": "Asparagus racemosus",
        "ayurvedic_name": "Shatavari",
        "synonyms": ["shatavari", "asparagus racemosus", "thannirvittan", "தண்ணீர்விட்டான்"],
    },
    "guggulu": {
        "common_name": "Guggulu",
        "scientific_name": "Commiphora mukul",
        "ayurvedic_name": "Guggulu",
        "synonyms": ["guggulu", "guggul", "commiphora mukul", "shuddha guggulu", "குக்குலு"],
    },
    "pippali": {
        "common_name": "Pippali",
        "scientific_name": "Piper longum",
        "ayurvedic_name": "Pippali",
        "synonyms": ["pippali", "long pepper", "piper longum", "thippili", "திப்பிலி"],
    },
}

PROCESS_PATTERNS: List[str] = [
    "extraction",
    "nano extraction",
    "nano-extraction",
    "nano emulsion",
    "nano-emulsification",
    "fermentation",
    "vacuum fermentation",
    "encapsulation",
    "microencapsulation",
    "liposomal",
    "supercritical co2",
    "ultrasound extraction",
    "ultrasonic extraction",
    "cold pressed",
    "cold extraction",
    "decoction",
    "purification",
    "shodhana",
]

INTENDED_USE_PATTERNS: List[str] = [
    "wound healing",
    "healing",
    "treatment",
    "skin care",
    "dermal",
    "topical",
    "stress relief",
    "diabetes",
    "anti-diabetic",
    "immunity",
    "immune booster",
    "cosmetic",
    "oral care",
    "memory booster",
    "gastro-retentive",
    "anti-microbial",
]

INDIAN_STATES_LOCATIONS: List[str] = [
    "tamil nadu",
    "kerala",
    "karnataka",
    "western ghats",
    "himalayas",
    "andhra pradesh",
    "telangana",
    "maharashtra",
    "gujarat",
    "uttarakhand",
    "assam",
    "madhya pradesh",
    "rajasthan",
]
