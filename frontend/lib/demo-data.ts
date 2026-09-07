import { FullAnalysisResponse, InnovationFingerprint, DecisionMapData, FullActionRoadmap } from './types';

export const DEMO_FINGERPRINT: InnovationFingerprint = {
  innovation_name: "Ayurvedic Wound Healing Formulation",
  description: "A topical Ayurvedic formulation combining Neem and Turmeric with an advanced nano-extraction process to enhance skin penetration and bio-availability.",
  ingredients: ["Neem (Azadirachta indica)", "Turmeric (Curcuma longa)"],
  intended_use: "Topical Wound Healing",
  product_category: "Ayurvedic Medicine / Formulation",
  traditional_knowledge_claimed: true,
  novelty: {
    novelty_detected: true,
    novelty_type: ["extraction_method", "process"],
    description: "New nano-extraction process to improve skin absorption",
  },
  biological_resources: {
    biological_resource_used: true,
    resources: ["Neem", "Turmeric"],
    source_location: "Tamil Nadu",
    source_known: true,
  },
  manufacturing_process: "Cold extraction followed by nano-emulsification",
  target_users: "Patients with topical wounds or skin lesions",
};

export const DEMO_DECISION_MAP: DecisionMapData = {
  overall_summary: "Multi-regime evaluation completed. Preliminary attention required across: PATENT, TRADITIONAL KNOWLEDGE, BIOLOGICAL RESOURCES, and REGULATORY.",
  regimes: [
    {
      name: "PATENT",
      status: "POSSIBLE",
      color: "yellow",
      reason: "Claimed novelty in nano-extraction process may overcome Section 3(p) Traditional Knowledge patent exclusion if non-obvious synergistic efficacy is established under Section 3(e).",
      triggered_by: ["nano-extraction process", "increased absorption"],
    },
    {
      name: "TRADITIONAL KNOWLEDGE",
      status: "OVERLAP_POSSIBLE",
      color: "orange",
      reason: "Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical literature (Charaka Samhita, Sushruta Samhita) and TKDL prior art records.",
      triggered_by: ["Neem", "Turmeric", "Wound healing"],
    },
    {
      name: "BIOLOGICAL RESOURCES",
      status: "REVIEW_REQUIRED",
      color: "yellow",
      reason: "Use of Indian biological resources sourced from Tamil Nadu triggers compliance under the Biological Diversity (Amendment) Act 2023. Domestic entities must complete Form 8 NBA registration prior to patent grant.",
      triggered_by: ["Tamil Nadu", "Neem", "Turmeric"],
    },
    {
      name: "REGULATORY",
      status: "CLASSIFICATION_REQUIRED",
      color: "blue",
      reason: "Product category requires classification under the Drugs and Cosmetics Act 1940 (Rule 158-B for Proprietary ASU vs Form 25D for Classical ASU) or FSSAI Ayurveda Aahara food rules.",
      triggered_by: ["Ayurvedic Medicine / Formulation", "Topical use"],
    },
  ],
};

export const DEMO_ROADMAP: FullActionRoadmap = {
  innovation_summary: {
    innovation_name: "Ayurvedic Wound Healing Formulation",
    ingredients: ["Neem (Azadirachta indica)", "Turmeric (Curcuma longa)"],
    intended_use: "Topical Wound Healing",
    novelty_claimed: "New nano-extraction process to improve absorption",
    biological_resources_used: true,
    source_location: "Tamil Nadu",
  },
  regime_roadmaps: [
    {
      regime: "PATENT",
      status: "POSSIBLE",
      reason: "Claimed novelty in nano-extraction process may overcome Section 3(p) TK bar if synergy is established.",
      evidence_status: "SUPPORTED",
      what_we_detected: "Preliminary analysis detects claimed novelty in 'Nano-extraction process' involving classical herbs Neem and Turmeric.",
      why_it_matters: "Under Section 3(p) of the Indian Patents Act 1970, traditional Ayurvedic knowledge is non-patentable per se. However, preliminary review suggests that establishing genuine non-obvious synergistic efficacy may allow patentability.",
      what_to_check_next: [
        "Consider conducting comparative bio-availability and synergy studies against classical formulations.",
        "Verify prior art filings in the Indian Patent Office (IPO) database.",
        "Consult a registered Patent Agent to assess whether Section 3(e) mere-admixture objections apply.",
      ],
      sources: [
        {
          id: "PA-3P-001",
          law: "The Patents Act, 1970",
          section: "Section 3(p)",
          excerpt: "If your formulation is essentially traditional knowledge, it cannot be patented under Indian law unless genuine non-obvious modification is established.",
        },
      ],
    },
    {
      regime: "TRADITIONAL KNOWLEDGE",
      status: "OVERLAP_POSSIBLE",
      reason: "Ingredients Neem and Turmeric are cited extensively in Ayurvedic classical literature.",
      evidence_status: "SUPPORTED",
      what_we_detected: "Preliminary analysis indicates traditional knowledge usage involving classical herbs (Neem, Turmeric).",
      why_it_matters: "Inventions drawing on codified Ayurvedic texts (e.g. Charaka Samhita) may face Section 3(p) prior art objections if cited in the Traditional Knowledge Digital Library (TKDL).",
      what_to_check_next: [
        "Consider searching the public TKDL metadata catalog for listed ingredient combinations.",
        "Verify classical textual citations to establish degree of modification from classical recipes.",
      ],
      sources: [
        {
          id: "TKDL-001",
          law: "Traditional Knowledge Digital Library (TKDL) - Administrative Framework",
          section: "Purpose and Function",
          excerpt: "TKDL is a defensive prior art database used by patent examiners worldwide to prevent wrongful patenting of traditional knowledge.",
        },
      ],
    },
    {
      regime: "BIOLOGICAL RESOURCES",
      status: "REVIEW_REQUIRED",
      reason: "Biological resources sourced from Tamil Nadu require NBA registration under BDA 2023.",
      evidence_status: "SUPPORTED",
      what_we_detected: "Preliminary analysis indicates use of Indian biological resources (Neem, Turmeric) sourced from Tamil Nadu.",
      why_it_matters: "Under the Biological Diversity (Amendment) Act 2023, domestic entities must complete mandatory Form 8 registration with the National Biodiversity Authority (NBA) prior to patent grant.",
      what_to_check_next: [
        "Determine whether biological raw materials are certified-cultivated or wild-harvested.",
        "If cultivated, consider obtaining a BMC Certificate of Origin to evaluate Section 7 State Biodiversity Board intimation exemptions.",
        "Prepare Form 8 registration filing for the NBA portal before patent grant.",
      ],
      sources: [
        {
          id: "BDA-2023-003",
          law: "Biological Diversity (Amendment) Act, 2023",
          section: "Section 6(1A)",
          excerpt: "Domestic Indian applicants must complete Form 8 registration with NBA before patent grant.",
        },
      ],
    },
    {
      regime: "REGULATORY",
      status: "CLASSIFICATION_REQUIRED",
      reason: "ASU drug licensing required under Rule 158-B of Drugs and Cosmetics Rules.",
      evidence_status: "SUPPORTED",
      what_we_detected: "Preliminary analysis detects a product category of 'Ayurvedic Medicine / Formulation' intended for 'Wound healing'.",
      why_it_matters: "Commercial manufacturing may require ASU drug licensing under the Drugs and Cosmetics Act 1940 (Form 25D for classical or Rule 158-B for proprietary ASU formulations).",
      what_to_check_next: [
        "Verify whether product positioning is proprietary drug (Rule 158-B), classical drug (Form 25D), or FSSAI Ayurveda Aahara food.",
        "Consult the State AYUSH Licensing Authority regarding required pilot safety observational studies.",
      ],
      sources: [
        {
          id: "DCA-3H-001",
          law: "Drugs and Cosmetics Rules, 1945",
          section: "Rule 158-B",
          excerpt: "Proprietary ASU medicines require safety studies under Rule 158-B of the Drugs & Cosmetics Rules 1945.",
        },
      ],
    },
  ],
  overall_next_action: "Recommended Immediate Action Roadmap:\n1. [PATENT] Consider conducting comparative bio-availability and synergy studies against classical formulations.\n2. [TRADITIONAL KNOWLEDGE] Consider searching the public TKDL metadata catalog for listed ingredient combinations.\n3. [BIOLOGICAL RESOURCES] Determine whether biological raw materials are certified-cultivated or wild-harvested.",
  disclaimer: "INFORMATIONAL GUIDANCE ONLY: This output is produced for preliminary informational and academic guidance regarding Ayurveda IP and regulatory pathways under Indian law. It does not constitute professional legal advice. Always consult a qualified patent agent, IP attorney, or regulatory consultant before taking legal or commercial actions.",
};

export const DEMO_FULL_ANALYSIS: FullAnalysisResponse = {
  fingerprint: DEMO_FINGERPRINT,
  decision_map: DEMO_DECISION_MAP,
  retrieved_evidence: {
    PATENT: {
      query: "novel process extraction method patent Ayurveda India 3p 3e",
      evidence: [
        {
          id: "PA-3P-001",
          law: "The Patents Act, 1970",
          section: "Section 3(p)",
          plain_explanation: "If your formulation is essentially traditional knowledge, it cannot be patented under Indian law unless genuine non-obvious modification is established.",
          confidence: "high",
          score: 0.75,
        },
      ],
    },
    TRADITIONAL_KNOWLEDGE: {
      query: "traditional knowledge prior art neem turmeric Ayurveda TKDL",
      evidence: [
        {
          id: "TKDL-001",
          law: "Traditional Knowledge Digital Library (TKDL) - Administrative Framework",
          section: "Purpose and Function",
          plain_explanation: "TKDL is a defensive prior art database used by patent examiners worldwide.",
          confidence: "high",
          score: 0.83,
        },
      ],
    },
    BIOLOGICAL_RESOURCES: {
      query: "biological resource access benefit sharing compliance India Tamil Nadu Neem Turmeric",
      evidence: [
        {
          id: "BDA-2023-003",
          law: "Biological Diversity (Amendment) Act, 2023",
          section: "Section 6(1A)",
          plain_explanation: "Domestic Indian applicants must complete Form 8 registration with NBA before patent grant.",
          confidence: "high",
          score: 0.78,
        },
      ],
    },
    REGULATORY: {
      query: "Ayurvedic formulation product classification regulation India Ayurvedic Medicine / Formulation DCA FSSAI",
      evidence: [
        {
          id: "DCA-3H-001",
          law: "Drugs and Cosmetics Rules, 1945",
          section: "Rule 158-B",
          plain_explanation: "Proprietary ASU medicines require safety studies under Rule 158-B.",
          confidence: "high",
          score: 0.71,
        },
      ],
    },
  },
  evidence_validation: {
    PATENT: {
      regime: "PATENT",
      status: "SUPPORTED",
      confidence: "high",
      evidence_count: 1,
      top_score: 0.75,
      citations: ["The Patents Act, 1970 (Section 3(p)) [ID: PA-3P-001]"],
    },
    TRADITIONAL_KNOWLEDGE: {
      regime: "TRADITIONAL KNOWLEDGE",
      status: "SUPPORTED",
      confidence: "high",
      evidence_count: 1,
      top_score: 0.83,
      citations: ["TKDL Framework [ID: TKDL-001]"],
    },
    BIOLOGICAL_RESOURCES: {
      regime: "BIOLOGICAL RESOURCES",
      status: "SUPPORTED",
      confidence: "high",
      evidence_count: 1,
      top_score: 0.78,
      citations: ["Biological Diversity Act 2023 [ID: BDA-2023-003]"],
    },
    REGULATORY: {
      regime: "REGULATORY",
      status: "SUPPORTED",
      confidence: "high",
      evidence_count: 1,
      top_score: 0.71,
      citations: ["Drugs & Cosmetics Rules 1945 [ID: DCA-3H-001]"],
    },
  },
  roadmap: DEMO_ROADMAP,
};
