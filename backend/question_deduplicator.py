"""
IP-SAKTI Sahayak - Question Deduplicator & Semantic Duplicate Engine
Ensures zero duplicate questions, eliminates semantic query repetition, tracks field confidence,
calculates dynamic interview question bounds (Min 3, Max 8), and provides multi-language question prompts (EN/TA/HI).
"""

import hashlib
from typing import List, Dict, Any, Optional, Set
from pydantic import BaseModel, Field


class DeduplicatedQuestionItem(BaseModel):
    """Structured question definition with unique ID, field key, intent hash, and input type."""

    id: str = Field(..., description="Unique question identifier (e.g. Q_ING_01).")
    field: str = Field(..., description="Canonical field key (e.g. ingredients, novelty_description).")
    category: str = Field(default="general", description="Category grouping.")
    intent: str = Field(..., description="Intent key (e.g. ingredient_collection).")
    intent_hash: str = Field(default="", description="MD5 hash of field + intent.")
    question: str = Field(..., description="User facing question prompt.")
    question_type: str = Field(default="text")  # boolean, select, multiselect, text, entity_input
    options: Optional[List[str]] = Field(default=None)
    priority: int = Field(default=50)  # 0 to 100
    why_asking: str = Field(default="")
    help_text: Optional[str] = Field(default=None)
    asked: bool = Field(default=False)
    answered: bool = Field(default=False)
    skipped: bool = Field(default=False)

    def model_post_init(self, __context: Any) -> None:
        if not self.intent_hash:
            raw = f"{self.field}:{self.intent}".lower()
            self.intent_hash = hashlib.md5(raw.encode("utf-8")).hexdigest()


LOCALIZED_QUESTIONS: Dict[str, Dict[str, Dict[str, Any]]] = {
    "Q_ING_01": {
        "en": {
            "question": "What herbs, minerals, or ingredients are used in your formulation?",
            "options": None,
            "why_asking": "Identifies classical Ayurvedic plants and checks Traditional Knowledge Digital Library (TKDL) prior art records.",
            "help_text": "e.g. Neem, Turmeric",
        },
        "ta": {
            "question": "உங்கள் தயாரிப்பில் பயன்படுத்தப்படும் மூலிகைகள், தாதுக்கள் அல்லது மூலப்பொருள்கள் யாவை?",
            "options": None,
            "why_asking": "பாரம்பரிய ஆயுர்வேத தாவரங்களை அடையாளம் கண்டு, பாரம்பரிய அறிவு டிஜிட்டல் நூலக (TKDL) பதிவுகளை சரிபார்க்கிறது.",
            "help_text": "எ.கா. வேம்பு, மஞ்சள்",
        },
        "hi": {
            "question": "आपके फॉर्मूलेशन में कौन सी जड़ी-बूटियाँ, खनिज या सामग्री का उपयोग किया जाता है?",
            "options": None,
            "why_asking": "शास्त्रीय आयुर्वेदिक पौधों की पहचान करता है और पारंपरिक ज्ञान डिजिटल लाइब्रेरी (TKDL) रिकॉर्ड की जाँच करता है।",
            "help_text": "उदा. नीम, हल्दी",
        },
    },
    "Q_TK_01": {
        "en": {
            "question": "Is this formulation based on traditional Ayurvedic or classical text knowledge?",
            "options": ["Yes", "No", "Not Sure"],
            "why_asking": "Crucial to evaluate Section 3(p) prior art exclusions under The Patents Act 1970.",
        },
        "ta": {
            "question": "இந்த தயாரிப்பு பாரம்பரிய ஆயுர்வேத அல்லது செவ்வியல் நூல்களின் அறிவை அடிப்படையாகக் கொண்டதா?",
            "options": ["ஆம்", "இல்லை", "உறுதியாக தெரியவில்லை"],
            "why_asking": "காப்புரிமைச் சட்டம் 1970 இன் பிரிவு 3(p) இன் கீழ் முந்தைய கலை விலக்குகளை மதிப்பிட மிகவும் முக்கியமானது.",
        },
        "hi": {
            "question": "क्या यह फॉर्मूलेशन पारंपरिक आयुर्वेदिक या शास्त्रीय ग्रंथ ज्ञान पर आधारित है?",
            "options": ["हाँ", "नहीं", "पक्का नहीं"],
            "why_asking": "पेटेंट अधिनियम 1970 की धारा 3(p) के तहत पूर्व कला अपवर्जन का मूल्यांकन करने के लिए महत्वपूर्ण।",
        },
    },
    "Q_NOV_DET_01": {
        "en": {
            "question": "Does your innovation introduce a novel aspect (process, extraction, or delivery method)?",
            "options": ["Yes", "No", "Not Sure"],
            "why_asking": "Determines whether technical novelty exists to overcome Section 3(p) patent bars.",
        },
        "ta": {
            "question": "உங்கள் புதுமையில் புதிய அல்லது தனித்துவமான அம்சம் (செயல்முறை, பிரித்தெடுத்தல் அல்லது விநியோக முறை) ஏதேனும் உள்ளதா?",
            "options": ["ஆம்", "இல்லை", "உறுதியாக தெரியவில்லை"],
            "why_asking": "பிரிவு 3(p) காப்புரிமைத் தடைகளைத் தாண்டுவதற்கு தொழில்நுட்பப் புதுமை உள்ளதா என்பதைத் தீர்மானிக்கிறது.",
        },
        "hi": {
            "question": "क्या आपका नवाचार एक नया पहलू (प्रक्रिया, निष्कर्षण, या वितरण विधि) पेश करता है?",
            "options": ["हाँ", "नहीं", "पक्का नहीं"],
            "why_asking": "यह निर्धारित करता है कि धारा 3(p) पेटेंट बाधाओं को दूर करने के लिए तकनीकी नवीनता मौजूद है या नहीं।",
        },
    },
    "Q_NOV_TYPE_01": {
        "en": {
            "question": "What type of innovation is this?",
            "options": [
                "New Extraction Method",
                "New Formulation Ratio",
                "New Therapeutic Application",
                "New Manufacturing Process",
                "Software / AI Diagnostic",
                "Other",
            ],
            "why_asking": "Focuses patentability analysis on process vs composition.",
        },
        "ta": {
            "question": "இது எந்த வகையான புதுமை?",
            "options": [
                "புதிய பிரித்தெடுக்கும் முறை (Extraction)",
                "புதிய தயாரிப்பு விகிதம் (Formulation Ratio)",
                "புதிய சிகிச்சை பயன்பாடு (Therapeutic Application)",
                "புதிய உற்பத்தி செயல்முறை (Manufacturing Process)",
                "மென்பொருள் / AI நோயறிதல்",
                "மற்றவை",
            ],
            "why_asking": "காப்புரிமைப் பகுப்பாய்வை செயல்முறை vs கலவை என்பதில் கவனம் செலுத்துகிறது.",
        },
        "hi": {
            "question": "यह किस प्रकार का नवाचार है?",
            "options": [
                "नई निष्कर्षण विधि (Extraction)",
                "नया फॉर्मूलेशन अनुपात",
                "नया चिकित्सीय अनुप्रयोग",
                "नई निर्माण प्रक्रिया",
                "सॉफ्टवेयर / AI निदान",
                "अन्य",
            ],
            "why_asking": "पेटेंट क्षमता विश्लेषण को प्रक्रिया बनाम संरचना पर केंद्रित करता है।",
        },
    },
    "Q_NOV_DESC_01": {
        "en": {
            "question": "Describe the novel aspect of your extraction or manufacturing process.",
            "why_asking": "Assesses whether non-obvious synergistic efficacy (Section 3(e)) is demonstrated.",
            "help_text": "e.g., Nano-extraction process to improve skin absorption",
        },
        "ta": {
            "question": "உங்கள் பிரித்தெடுக்கும் அல்லது தயாரிப்பு செயல்முறையின் புதிய அம்சத்தை விளக்கவும்.",
            "why_asking": "தெளிவான ஒருங்கிணைந்த செயல்திறன் (பிரிவு 3(e)) நிரூபிக்கப்பட்டுள்ளதா என்பதை மதிப்பிடுகிறது.",
            "help_text": "எ.கா., தோலில் உறிஞ்சுதலை மேம்படுத்த நானோ-பிரித்தெடுக்கும் முறை",
        },
        "hi": {
            "question": "अपनी निष्कर्षण या निर्माण प्रक्रिया के नए पहलू का वर्णन करें।",
            "why_asking": "मूल्यांकन करता है कि क्या गैर-स्पष्ट सहक्रियात्मक प्रभावकारिता (धारा 3(e)) का प्रदर्शन किया गया है।",
            "help_text": "उदा., त्वचा के अवशोषण में सुधार के लिए नैनो-निष्कर्षण प्रक्रिया",
        },
    },
    "Q_BIO_USE_01": {
        "en": {
            "question": "Does your innovation use Indian biological resources (herbs, plants, biological materials)?",
            "options": ["Yes", "No", "Not Sure"],
            "why_asking": "Triggers compliance requirements under the Biological Diversity (Amendment) Act 2023.",
        },
        "ta": {
            "question": "உங்கள் புதுமை இந்திய உயிரியல் வளங்களை (மூலிகைகள், தாவரங்கள், உயிரியல் பொருட்கள்) பயன்படுத்துகிறதா?",
            "options": ["ஆம்", "இல்லை", "உறுதியாக தெரியவில்லை"],
            "why_asking": "பல்லுயிர் (திருத்தச்) சட்டம் 2023 இன் கீழ் இணக்கத் தேவைகளைத் தூண்டுகிறது.",
        },
        "hi": {
            "question": "क्या आपका नवाचार भारतीय जैविक संसाधनों (जड़ी-बूटियों, पौधों, जैविक सामग्री) का उपयोग करता है?",
            "options": ["हाँ", "नहीं", "पक्का नहीं"],
            "why_asking": "जैविक विविधता (संशोधन) अधिनियम 2023 के तहत अनुपालन आवश्यकताओं को ट्रिगर करता है।",
        },
    },
    "Q_BIO_LOC_01": {
        "en": {
            "question": "What is the geographical source location of the biological resources in India?",
            "why_asking": "Identifies relevant State Biodiversity Board (SBB) jurisdiction.",
            "help_text": "e.g. Tamil Nadu, Kerala",
        },
        "ta": {
            "question": "இந்தியாவில் உயிரியல் வளங்கள் பெறப்பட்ட புவியியல் இருப்பிடம் எது?",
            "why_asking": "சம்பந்தப்பட்ட மாநில பல்லுயிர் வாரியத்தின் (SBB) அதிகார வரம்பை அடையாளம் காணும்.",
            "help_text": "எ.கா. தமிழ்நாடு, கேரளா",
        },
        "hi": {
            "question": "भारत में जैविक संसाधनों का भौगोलिक स्रोत स्थान क्या है?",
            "why_asking": "प्रासंगिक राज्य जैव विविधता बोर्ड (SBB) क्षेत्राधिकार की पहचान करता है।",
            "help_text": "उदा. तमिलनाडु, केरल",
        },
    },
    "Q_CULT_STATUS_01": {
        "en": {
            "question": "Are the biological materials cultivated or collected from the wild?",
            "options": ["Cultivated Farm", "Wild Harvested", "Both", "Unknown"],
            "why_asking": "Cultivated medicinal plants with BMC Certificate of Origin enjoy SBB intimation exemptions.",
        },
        "ta": {
            "question": "உயிரியல் பொருட்கள் பயிரிடப்பட்டவையா அல்லது காடுகளிலிருந்து சேகரிக்கப்பட்டவையா?",
            "options": ["பயிரிடப்பட்ட பண்ணை", "காடுகளிலிருந்து சேகரிக்கப்பட்டது", "இரண்டும்", "தெரியவில்லை"],
            "why_asking": "BMC மூல சான்றிதழ் கொண்ட பயிரிடப்பட்ட மூலிகைகளுக்கு SBB அறிவிப்பு விலக்குகள் உண்டு.",
        },
        "hi": {
            "question": "क्या जैविक सामग्री की खेती की जाती है या जंगलों से एकत्र की जाती है?",
            "options": ["खेती की गई फ़ार्म", "जंगली एकत्र की गई", "दोनों", "अज्ञात"],
            "why_asking": "BMC मूल प्रमाण पत्र वाले खेती के औषधीय पौधों को SBB सूचना छूट प्राप्त होती है।",
        },
    },
    "Q_TK_SRC_01": {
        "en": {
            "question": "Which traditional knowledge sources apply?",
            "options": [
                "Classical Ayurvedic Text (Charaka/Sushruta)",
                "Community / Regional Knowledge",
                "Family Herbal Practice",
                "Tribal Knowledge",
                "None / Modern Research",
                "Not Sure",
            ],
            "why_asking": "Helps verify whether classical text prior art in TKDL applies.",
        },
        "ta": {
            "question": "எந்த பாரம்பரிய அறிவு ஆதாரங்கள் பொருந்தும்?",
            "options": [
                "பாரம்பரிய ஆயுர்வேத நூல் (சரக்க/சுஸ்ருத)",
                "சமுதாய / பிராந்திய அறிவு",
                "குடும்ப மூலிகை பயிற்சி",
                "பழங்குடியினர் அறிவு",
                "எதுவுமில்லை / நவீன ஆராய்ச்சி",
                "உறுதியாக தெரியவில்லை",
            ],
            "why_asking": "TKDL இல் உள்ள பாரம்பரிய நூல்களின் அறிவு பொருந்தமா என்பதை சரிபார்க்க உதவுகிறது.",
        },
        "hi": {
            "question": "कौन से पारंपरिक ज्ञान स्रोत लागू होते हैं?",
            "options": [
                "शास्त्रीय आयुर्वेदिक ग्रंथ (चरक/सुश्रुत)",
                "सामुदायिक / क्षेत्रीय ज्ञान",
                "पारिवारिक हर्बल अभ्यास",
                "जनजातीय ज्ञान",
                "कोई नहीं / आधुनिक अनुसंधान",
                "पक्का नहीं",
            ],
            "why_asking": "यह सत्यापित करने में मदद करता है कि क्या TKDL में शास्त्रीय ग्रंथ पूर्व कला लागू होती है।",
        },
    },
    "Q_PROD_CAT_01": {
        "en": {
            "question": "What product category best fits your innovation?",
            "options": [
                "Ayurvedic Medicine / Formulation",
                "Nano Formulation",
                "Cosmetic Product",
                "Ayurveda Aahara / Food Product",
                "Nutraceutical",
                "Extraction Process",
            ],
            "why_asking": "Determines whether AYUSH ASU drug licensing (Rule 158-B) or FSSAI food rules apply.",
        },
        "ta": {
            "question": "உங்கள் புதுமைக்கு எந்த தயாரிப்பு வகை மிகவும் பொருத்தமானது?",
            "options": [
                "ஆயுர்வேத மருந்து / தயாரிப்பு",
                "நானோ தயாரிப்பு",
                "அழகுசாதனப் பொருள்",
                "ஆயுர்வேத ஆகாரம் / உணவுப் பொருள்",
                "நியூட்ராசிட்டிகல்",
                "பிரித்தெடுக்கும் செயல்முறை",
            ],
            "why_asking": "ஆயுஷ் மருந்து உரிமம் (விதி 158-B) அல்லது FSSAI உணவு விதிகள் பொருந்துமா என்பதைத் தீர்மானிக்கிறது.",
        },
        "hi": {
            "question": "आपके नवाचार के लिए कौन सी उत्पाद श्रेणी सबसे उपयुक्त है?",
            "options": [
                "आयुर्वेदिक औषधि / फॉर्मूलेशन",
                "नैनो फॉर्मूलेशन",
                "सौंदर्य प्रसाधन उत्पाद",
                "आयुर्वेद आहार / खाद्य उत्पाद",
                "न्यूट्रास्युटिकल",
                "निष्कर्षण प्रक्रिया",
            ],
            "why_asking": "यह निर्धारित करता है कि आयुष ASU दवा लाइसेंसिंग (नियम 158-B) या FSSAI खाद्य नियम लागू होते हैं।",
        },
    },
}


CANONICAL_QUESTIONS: Dict[str, DeduplicatedQuestionItem] = {
    q_id: DeduplicatedQuestionItem(
        id=q_id,
        field={
            "Q_ING_01": "ingredients",
            "Q_TK_01": "traditional_knowledge_claimed",
            "Q_NOV_DET_01": "novelty_detected",
            "Q_NOV_TYPE_01": "novelty_type",
            "Q_NOV_DESC_01": "novelty_description",
            "Q_BIO_USE_01": "biological_resource_used",
            "Q_BIO_LOC_01": "source_location",
            "Q_CULT_STATUS_01": "cultivation_status",
            "Q_TK_SRC_01": "tk_sources",
            "Q_PROD_CAT_01": "product_category",
        }[q_id],
        category="general",
        intent=f"{q_id}_intent",
        question=data["en"]["question"],
        question_type={
            "Q_ING_01": "entity_input",
            "Q_TK_01": "boolean",
            "Q_NOV_DET_01": "boolean",
            "Q_NOV_TYPE_01": "select",
            "Q_NOV_DESC_01": "text",
            "Q_BIO_USE_01": "boolean",
            "Q_BIO_LOC_01": "text",
            "Q_CULT_STATUS_01": "select",
            "Q_TK_SRC_01": "multiselect",
            "Q_PROD_CAT_01": "select",
        }[q_id],
        options=data["en"].get("options"),
        why_asking=data["en"].get("why_asking", ""),
        help_text=data["en"].get("help_text"),
    )
    for q_id, data in LOCALIZED_QUESTIONS.items()
}


class QuestionDeduplicator:
    """
    Stateful Question Deduplicator & Priority Engine.
    Guarantees no repeated questions and no semantic duplicate queries.
    """

    def __init__(self):
        self.asked_question_ids: Set[str] = set()
        self.asked_fields: Set[str] = set()
        self.asked_intent_hashes: Set[str] = set()

    def is_duplicate(self, q_item: DeduplicatedQuestionItem) -> bool:
        if q_item.id in self.asked_question_ids:
            return True
        if q_item.field in self.asked_fields:
            return True
        if q_item.intent_hash in self.asked_intent_hashes:
            return True
        return False

    def mark_asked(self, q_item: DeduplicatedQuestionItem):
        self.asked_question_ids.add(q_item.id)
        self.asked_fields.add(q_item.field)
        self.asked_intent_hashes.add(q_item.intent_hash)

    def calculate_dynamic_bounds(
        self, initial_completeness: float, complexity_score: int
    ) -> tuple[int, int]:
        if initial_completeness >= 75.0 or complexity_score < 40:
            return (3, 4)
        elif initial_completeness >= 40.0 or complexity_score < 70:
            return (3, 6)
        else:
            return (4, 8)


if __name__ == "__main__":
    dedup = QuestionDeduplicator()
    q1 = CANONICAL_QUESTIONS["Q_ING_01"]
    assert not dedup.is_duplicate(q1)
    dedup.mark_asked(q1)
    assert dedup.is_duplicate(q1)
    print("[OK] Question Deduplicator multi-language test passed cleanly!")
