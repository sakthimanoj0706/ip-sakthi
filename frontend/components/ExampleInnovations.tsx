'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, Beaker, Leaf, Shield, Cpu, Flame, Layers } from 'lucide-react';
import { useTranslation, SupportedLanguage } from '../context/LanguageContext';

export interface ExampleScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  ingredients: string;
  novelty: string;
  location: string;
  icon: React.ReactNode;
  tag: string;
}

export const PRESET_EXAMPLES_MAP: Record<SupportedLanguage, ExampleScenario[]> = {
  en: [
    {
      id: 'ex1',
      title: 'Neem & Turmeric Nano-Gel',
      category: 'Nano Formulation',
      description: 'Topical wound healing formulation using Neem and Turmeric with a nano-extraction process to improve dermal absorption.',
      ingredients: 'Neem, Turmeric',
      novelty: 'Nano-extraction process to enhance bioavailability',
      location: 'Tamil Nadu',
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
      tag: 'Section 3(p) Process Novelty',
    },
    {
      id: 'ex2',
      title: 'Ashwagandha & Brahmi Liposomal Syrup',
      category: 'Drug Delivery System',
      description: 'Controlled-release liposomal memory booster syrup combining Ashwagandha and Brahmi sourced from Kerala.',
      ingredients: 'Ashwagandha, Brahmi',
      novelty: 'Liposomal micro-encapsulation delivery system',
      location: 'Kerala',
      icon: <Beaker className="h-5 w-5 text-blue-400" />,
      tag: 'Form 8 NBA Compliance',
    },
    {
      id: 'ex3',
      title: 'Supercritical CO2 Withanolide Extract',
      category: 'Extraction Process',
      description: 'Standardized phytopharmaceutical extract of Withania somnifera using green supercritical CO2 solventless extraction.',
      ingredients: 'Ashwagandha',
      novelty: 'Supercritical CO2 solvent-free extraction process',
      location: 'Madhya Pradesh',
      icon: <Leaf className="h-5 w-5 text-purple-400" />,
      tag: 'Phytopharmaceutical Rule 158-B',
    },
    {
      id: 'ex4',
      title: 'Ayurveda Aahara Chyawanprash Energy Bar',
      category: 'Ayurveda Aahara / Food Product',
      description: 'Nutritional food supplement bar incorporating classical Chyawanprash herbs for immunity without therapeutic claims.',
      ingredients: 'Amla, Guduchi, Pippali',
      novelty: 'Edible food format combining classical rasayana herbs',
      location: 'Uttarakhand',
      icon: <Flame className="h-5 w-5 text-amber-400" />,
      tag: 'FSSAI Food Regulation 2022',
    },
    {
      id: 'ex5',
      title: 'Traditional Siddha Nilavembu Decoction',
      category: 'Classical Ayurvedic Formulation',
      description: 'Traditional polyherbal Kudineer powder formulation prepared following classical Siddha text recipes.',
      ingredients: 'Nilavembu, Pepper, Ginger',
      novelty: 'Classical textual recipe without process modification',
      location: 'Tamil Nadu',
      icon: <Shield className="h-5 w-5 text-teal-400" />,
      tag: 'TKDL Defensive Prior Art',
    },
    {
      id: 'ex6',
      title: 'AI-Driven Prakriti Diagnostic Sensor',
      category: 'Medical Device',
      description: 'Non-invasive biometric wrist transducer and AI algorithm for digital Nadi Pariksha and Prakriti assessment.',
      ingredients: 'Hardware Sensor & AI Model',
      novelty: 'Machine learning algorithm for Ayurvedic pulse diagnosis',
      location: 'Karnataka',
      icon: <Cpu className="h-5 w-5 text-rose-400" />,
      tag: 'Software / Medical Device Patent',
    },
  ],
  ta: [
    {
      id: 'ex1',
      title: 'வேம்பு & மஞ்சள் நானோ-ஜெல்',
      category: 'நானோ சூத்திரமாக்கம்',
      description: 'தோல் உறிஞ்சுதலை மேம்படுத்த நானோ-பிரித்தெடுத்தல் செயல்முறையுடன் கூடிய வேம்பு மற்றும் மஞ்சளைப் பயன்படுத்தும் காயம் குணப்படுத்தும் தயாரிப்பு.',
      ingredients: 'வேம்பு, மஞ்சள்',
      novelty: 'உயிரியல் பயன்பாட்டை அதிகரிக்கும் நானோ-பிரித்தெடுத்தல் செயல்முறை',
      location: 'தமிழ்நாடு',
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
      tag: 'பிரிவு 3(p) செயல்முறை புதுமை',
    },
    {
      id: 'ex2',
      title: 'அஸ்வகந்தா & பிராமி லிபோசோமல் சிரப்',
      category: 'மருந்து விநியோக முறை',
      description: 'கேரளாவிலிருந்து பெறப்பட்ட அஸ்வகந்தா மற்றும் பிராமியை இணைக்கும் கட்டுப்படுத்தப்பட்ட-வெளியீட்டு நினைவாற்றல் அதிகரிக்கும் சிரப்.',
      ingredients: 'அஸ்வகந்தா, பிராமி',
      novelty: 'லிபோசோமல் மைக்ரோ-என்காப்சுலேஷன் விநியோக முறை',
      location: 'கேரளா',
      icon: <Beaker className="h-5 w-5 text-blue-400" />,
      tag: 'படிவம் 8 NBA இணக்கம்',
    },
    {
      id: 'ex3',
      title: 'சூப்பர் கிரிட்டிகல் CO2 விதானோலைடு சாறு',
      category: 'பிரித்தெடுக்கும் செயல்முறை',
      description: 'கரைப்பான் இல்லாத பச்சை சூப்பர் கிரிட்டிகல் CO2 முறையைப் பயன்படுத்தி அஸ்வகந்தா தாவரவியல் சாறு.',
      ingredients: 'அஸ்வகந்தா',
      novelty: 'சூப்பர் கிரிட்டிகல் CO2 கரைப்பான் இல்லாத பிரித்தெடுக்கும் செயல்முறை',
      location: 'மத்திய பிரதேசம்',
      icon: <Leaf className="h-5 w-5 text-purple-400" />,
      tag: 'பைட்டோஃபார்மாசூட்டிகல் விதி 158-B',
    },
    {
      id: 'ex4',
      title: 'ஆயுர்வேத ஆகார சியவன்பிராஷ் எனர்ஜி பார்',
      category: 'ஆயுர்வேத ஆகார / உணவுப் பொருள்',
      description: 'சிகிச்சை உரிமைகோரல்கள் இல்லாமல் நோய் எதிர்ப்பு சக்திக்கு பாரம்பரிய சியவன்பிராஷ் மூலிகைகளை உள்ளடக்கிய ஊட்டச்சத்து உணவுப் பட்டி.',
      ingredients: 'நெல்லி, சீந்தில், திப்பிலி',
      novelty: 'பாரம்பரிய ரசாயன மூலிகைகளை இணைக்கும் உணவு வடிவம்',
      location: 'உத்தரகாண்ட்',
      icon: <Flame className="h-5 w-5 text-amber-400" />,
      tag: 'FSSAI உணவு கட்டுப்பாடு 2022',
    },
    {
      id: 'ex5',
      title: 'பாரம்பரிய சித்த நிலவேம்பு குடிநீர்',
      category: 'பாரம்பரிய ஆயுர்வேத சூத்திரம்',
      description: 'பாரம்பரிய சித்த மருத்துவ நூல்களின் படி தயாரிக்கப்பட்ட பல மூலிகை நிலவேம்பு குடிநீர் பொடி.',
      ingredients: 'நிலவேம்பு, மிளகு, சுக்கு',
      novelty: 'செயல்முறை மாற்றமில்லாத பாரம்பரிய உரை செய்முறை',
      location: 'தமிழ்நாடு',
      icon: <Shield className="h-5 w-5 text-teal-400" />,
      tag: 'TKDL தற்காப்பு முந்தைய கலை',
    },
    {
      id: 'ex6',
      title: 'AI-இயங்கும் பிரகிருதி கண்டறிதல் சென்சார்',
      category: 'மருத்துவ சாதனம்',
      description: 'டிஜிட்டல் நாடி பரிட்சை மற்றும் பிரகிருதி மதிப்பீட்டிற்கான பயோமெட்ரிக் மணிக்கட்டு சென்சார் மற்றும் AI அல்காரிதம்.',
      ingredients: 'ஹார்டுவேர் சென்சார் & AI மாடல்',
      novelty: 'ஆயுர்வேத நாடி கண்டறிதலுக்கான இயந்திர கற்றல் அல்காரிதம்',
      location: 'கர்நாடகா',
      icon: <Cpu className="h-5 w-5 text-rose-400" />,
      tag: 'மென்பொருள் / மருத்துவ சாதன காப்புரிமை',
    },
  ],
  hi: [
    {
      id: 'ex1',
      title: 'नीम और हल्दी नैनो-जैल',
      category: 'नैनो फॉर्मूलेशन',
      description: 'त्वचा में अवशोषण सुधारने के लिए नैनो-निष्कर्षण प्रक्रिया के साथ नीम और हल्दी का उपयोग करने वाला सामयिक घाव भरने वाला फॉर्मूलेशन।',
      ingredients: 'नीम, हल्दी',
      novelty: 'बायोउपलब्धता बढ़ाने के लिए नैनो-निष्कर्षण प्रक्रिया',
      location: 'तमिलनाडु',
      icon: <Sparkles className="h-5 w-5 text-emerald-400" />,
      tag: 'धारा 3(p) प्रक्रिया नवीनता',
    },
    {
      id: 'ex2',
      title: 'अश्वगंधा और ब्राह्मी लाइपोसोमल सिरप',
      category: 'ड्रग डिलीवरी सिस्टम',
      description: 'केरल से प्राप्त अश्वगंधा और ब्राह्मी को मिलाने वाला नियंत्रित-रिलीज़ लाइपोसोमल मेमोरी बूस्टर सिरप।',
      ingredients: 'अश्वगंधा, ब्राह्मी',
      novelty: 'लाइपोसोमल माइक्रो-एनकैप्सुलेशन डिलीवरी सिस्टम',
      location: 'केरल',
      icon: <Beaker className="h-5 w-5 text-blue-400" />,
      tag: 'फॉर्म 8 NBA अनुपालन',
    },
    {
      id: 'ex3',
      title: 'सुपरक्रिटिकल CO2 विथानोलाइड अर्क',
      category: 'निष्कर्षण प्रक्रिया',
      description: 'सॉल्वेंटलेस सुपरक्रिटिकल CO2 निष्कर्षण का उपयोग करके अस्वगंधा का मानकीकृत अर्क।',
      ingredients: 'अश्वगंधा',
      novelty: 'सुपरक्रिटिकल CO2 विलायक-मुक्त निष्कर्षण प्रक्रिया',
      location: 'मध्य प्रदेश',
      icon: <Leaf className="h-5 w-5 text-purple-400" />,
      tag: 'फाइटोफार्मास्युटिकल नियम 158-B',
    },
    {
      id: 'ex4',
      title: 'आयुर्वेद आहार च्यवनप्राश एनर्जी बार',
      category: 'आयुर्वेद आहार / खाद्य उत्पाद',
      description: 'चिकित्सीय दावों के बिना प्रतिरक्षा के लिए शास्त्रीय च्यवनप्राश जड़ी बूटियों को शामिल करने वाला पोषण संबंधी पूरक बार।',
      ingredients: 'आंवला, गिलोय, पिप्पली',
      novelty: 'शास्त्रीय रसायन जड़ी बूटियों का खाद्य रूप',
      location: 'उत्तराखंड',
      icon: <Flame className="h-5 w-5 text-amber-400" />,
      tag: 'FSSAI खाद्य विनियमन 2022',
    },
    {
      id: 'ex5',
      title: 'पारंपरिक सिद्ध निलवेम्बु काढ़ा',
      category: 'शास्त्रीय आयुर्वेदिक फॉर्मूलेशन',
      description: 'शास्त्रीय सिद्ध ग्रंथों के व्यंजनों के अनुसार तैयार बहु-जड़ी-बूटी कुडीनीर पाउडर।',
      ingredients: 'निलवेम्बु, काली मिर्च, सोंठ',
      novelty: 'प्रक्रिया संशोधन के बिना शास्त्रीय पाठ्य नुस्खा',
      location: 'तमिलनाडु',
      icon: <Shield className="h-5 w-5 text-teal-400" />,
      tag: 'TKDL रक्षात्मक पूर्व कला',
    },
    {
      id: 'ex6',
      title: 'AI-संचालित प्रकृति नैदानिक सेंसर',
      category: 'चिकित्सा उपकरण',
      description: 'डिजिटल नाड़ी परीक्षा और प्रकृति मूल्यांकन के लिए गैर-आक्रामक बायोमेट्रिक रिस्ट ट्रांसड्यूसर और AI एल्गोरिदम।',
      ingredients: 'हार्डवेयर सेंसर और AI मॉडल',
      novelty: 'आयुर्वेदिक नाड़ी निदान के लिए मशीन लर्निंग एल्गोरिदम',
      location: 'कर्नाटक',
      icon: <Cpu className="h-5 w-5 text-rose-400" />,
      tag: 'सॉफ्टवेयर / मेडिकल डिवाइस पेटेंट',
    },
  ],
};

export const PRESET_EXAMPLES = PRESET_EXAMPLES_MAP.en;

interface ExampleInnovationsProps {
  onSelectExample: (scenario: ExampleScenario) => void;
}

export const ExampleInnovations: React.FC<ExampleInnovationsProps> = ({ onSelectExample }) => {
  const { t, language } = useTranslation();
  const scenarios = PRESET_EXAMPLES_MAP[language] || PRESET_EXAMPLES_MAP.en;

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-400" />
            {t('presets.title', 'Preset Test Scenarios')}
          </h3>
          <p className="text-xs text-slate-400">{t('presets.subtitle', 'Click any scenario to instantly test the pipeline')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            type="button"
            onClick={() => onSelectExample(sc)}
            className="group text-left rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900/90 shadow-md backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 group-hover:border-emerald-500/30">
                  {sc.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">
                    {sc.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{sc.category}</span>
                </div>
              </div>

              <ArrowUpRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <p className="mt-2.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {sc.description}
            </p>

            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="rounded bg-emerald-950/60 px-2 py-0.5 font-mono text-emerald-300 border border-emerald-500/30">
                {sc.tag}
              </span>
              <span className="text-slate-400 font-mono">Src: {sc.location}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
