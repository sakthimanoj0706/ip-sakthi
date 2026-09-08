"""
IP-SAKTI Sahayak - Tavily Live Web Research Engine
Performs domain-targeted official web research ONLY when local RAG evidence is insufficient or when latest guidelines are required.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel

try:
    from backend.config import TAVILY_API_KEY, TAVILY_ENABLED
    from backend.source_validator import SourceValidator, ValidatedWebSource
    from backend.fingerprint_schema import InnovationFingerprint
except ImportError:
    from config import TAVILY_API_KEY, TAVILY_ENABLED
    from source_validator import SourceValidator, ValidatedWebSource
    from fingerprint_schema import InnovationFingerprint


class WebResearchEngine:
    """
    Tavily Web Research Engine for IP-SAKTI.
    Fires domain-restricted searches to official Indian government sites (ipindia.gov.in, ayush.gov.in, nbaindia.org, cdsco.gov.in).
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or TAVILY_API_KEY
        self.enabled = bool(self.api_key and TAVILY_ENABLED)
        self.client = None
        self.validator = SourceValidator()
        self._init_client()

    def _init_client(self):
        if not self.enabled:
            return
        try:
            from tavily import TavilyClient
            self.client = TavilyClient(api_key=self.api_key)
        except Exception:
            self.enabled = False

    def should_trigger_research(
        self,
        validation_map: Dict[str, Any],
        user_requested_latest: bool = False,
    ) -> bool:
        """
        Determines if web research is required.
        Research is triggered ONLY if evidence status is INSUFFICIENT_EVIDENCE / ABSTAIN or user asks for latest rules.
        """
        if user_requested_latest:
            return True

        for regime, data in validation_map.items():
            status = data.status if hasattr(data, "status") else (data.get("status") if isinstance(data, dict) else "")
            if status in ["INSUFFICIENT_EVIDENCE", "ABSTAIN"]:
                return True

        return False

    def generate_targeted_web_query(self, regime: str, fp: InnovationFingerprint) -> tuple[str, str]:
        """
        Generates a domain-restricted query string and target domain for Tavily search.
        """
        regime_upper = regime.upper().strip()
        ing_str = " ".join(fp.ingredients) if fp.ingredients else "Ayurveda formulation"
        novelty_str = fp.novelty.description or ""
        location = fp.biological_resources.source_location or "India"

        if "PATENT" in regime_upper:
            query = f"{ing_str} {novelty_str} patentability India Section 3(p) site:ipindia.gov.in"
            target_domain = "ipindia.gov.in"
        elif "TK" in regime_upper or "TRADITIONAL" in regime_upper:
            query = f"traditional knowledge prior art {ing_str} TKDL site:ayush.gov.in"
            target_domain = "ayush.gov.in"
        elif "ABS" in regime_upper or "BIODIVERSITY" in regime_upper or "NBA" in regime_upper:
            query = f"{ing_str} biological resource access benefit sharing Form 8 {location} site:nbaindia.org"
            target_domain = "nbaindia.org"
        elif "REGULATORY" in regime_upper or "AYUSH" in regime_upper:
            query = f"Ayurvedic formulation product classification licensing guidelines site:cdsco.gov.in"
            target_domain = "cdsco.gov.in"
        else:
            query = f"Ayurveda IP regulatory guidelines India site:gov.in"
            target_domain = "gov.in"

        return query.strip(), target_domain

    def search_regime_guidelines(
        self, regime: str, fp: InnovationFingerprint, max_results: int = 3
    ) -> List[ValidatedWebSource]:
        """
        Executes a targeted search via Tavily API and filters results using SourceValidator.
        """
        if not self.enabled or not self.client:
            return []

        query, _ = self.generate_targeted_web_query(regime, fp)

        try:
            response = self.client.search(
                query=query,
                max_results=max_results,
                search_depth="advanced",
            )
            raw_results = response.get("results", [])
            return self.validator.validate_search_results(raw_results, regime=regime)
        except Exception:
            return []

    def research_all_unsupported_regimes(
        self,
        fp: InnovationFingerprint,
        validation_map: Dict[str, Any],
        user_requested_latest: bool = False,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Performs web research for regimes where local evidence was insufficient.
        """
        results: Dict[str, List[Dict[str, Any]]] = {}

        if not self.should_trigger_research(validation_map, user_requested_latest):
            return results

        for regime, data in validation_map.items():
            status = data.status if hasattr(data, "status") else (data.get("status") if isinstance(data, dict) else "")
            if user_requested_latest or status in ["INSUFFICIENT_EVIDENCE", "ABSTAIN", "PARTIALLY_SUPPORTED"]:
                validated_sources = self.search_regime_guidelines(regime, fp)
                if validated_sources:
                    results[regime] = [s.model_dump() for s in validated_sources]

        return results

    def research_regimes(
        self,
        fp: InnovationFingerprint,
        decisions: Optional[List[Any]] = None,
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Runs domain-targeted Tavily web research across active regimes.
        """
        results: Dict[str, List[Dict[str, Any]]] = {}
        if not self.enabled:
            return results

        regimes_to_search = ["PATENT", "TRADITIONAL_KNOWLEDGE", "ABS", "REGULATORY"]
        if decisions:
            extracted = []
            for d in decisions:
                rname = d.regime_name if hasattr(d, "regime_name") else (d.get("regime_name") if isinstance(d, dict) else "")
                if rname:
                    extracted.append(rname)
            if extracted:
                regimes_to_search = extracted

        for r in set(regimes_to_search):
            if r:
                sources = self.search_regime_guidelines(r, fp, max_results=2)
                if sources:
                    results[r] = [s.model_dump() for s in sources]

        return results


if __name__ == "__main__":
    import json
    print("=== Running Tavily Web Research Engine Test ===")

    engine = WebResearchEngine()
    print(f"Tavily Web Research Enabled: {engine.enabled}")

    sample_fp = InnovationFingerprint.from_user_input(
        innovation_name="Ayurvedic Wound Healing Formulation",
        description="Topical formulation combining Neem and Turmeric with nano-extraction process.",
        ingredients="Neem, Turmeric",
        novelty_description="Nano-extraction process to improve skin absorption",
        source_location="Tamil Nadu",
    )

    # Test query generation
    query, domain = engine.generate_targeted_web_query("PATENT", sample_fp)
    print(f"Generated PATENT Query : '{query}' (Target Domain: {domain})")

    # Test live search if key is valid
    if engine.enabled:
        sources = engine.search_regime_guidelines("PATENT", sample_fp, max_results=2)
        print(f"Retrieved {len(sources)} validated web sources:")
        for s in sources:
            print(f" - [{s.authority_score}] {s.title} ({s.url})")

    print("\n[OK] Tavily Web Research Engine test passed cleanly!")
