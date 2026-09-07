"""
IP-SAKTI Sahayak - Web Source Validator
Evaluates and scores retrieved web search results based on domain authority, official status, and legal relevance.
"""

from urllib.parse import urlparse
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ValidatedWebSource(BaseModel):
    """Schema for a scored and validated web search source."""

    title: str = Field(..., description="Document or webpage title.")
    url: str = Field(..., description="Full source URL.")
    domain: str = Field(..., description="Normalized domain name.")
    authority_score: float = Field(..., description="Domain authority rating (0.0 to 1.0).")
    is_official: bool = Field(default=False, description="True if official government domain.")
    retrieved_date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    relevant_regime: str = Field(default="GENERAL")
    snippet: str = Field(default="")


class SourceValidator:
    """
    Validates web search results from Tavily to filter out unreliable or unverified sources.
    """

    OFFICIAL_DOMAINS = [
        "ipindia.gov.in",
        "ayush.gov.in",
        "cdsco.gov.in",
        "nbaindia.org",
        "egazette.gov.in",
        "indiacode.nic.in",
        "gov.in",
        "nic.in",
    ]

    ACADEMIC_DOMAINS = [
        "ncbi.nlm.nih.gov",
        "sciencedirect.com",
        "researchgate.net",
        "icar.org.in",
        "csir.res.in",
        "ac.in",
        "edu",
    ]

    RECOGNIZED_LEGAL_DOMAINS = [
        "lexology.com",
        "mondaq.com",
        "wipo.int",
        "patenevo.com",
        "barandbench.com",
        "livelaw.in",
    ]

    def evaluate_source(
        self, url: str, title: str, snippet: str, regime: str = "GENERAL"
    ) -> Optional[ValidatedWebSource]:
        """
        Calculates domain authority score and validates whether a source is trusted.
        Returns ValidatedWebSource object or None if rejected.
        """
        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower().replace("www.", "")
        except Exception:
            return None

        authority_score = 0.4
        is_official = False

        # Check official government status
        if any(domain.endswith(d) or d in domain for d in self.OFFICIAL_DOMAINS):
            authority_score = 1.0
            is_official = True
        # Check academic / research status
        elif any(domain.endswith(d) or d in domain for d in self.ACADEMIC_DOMAINS):
            authority_score = 0.8
        # Check recognized legal status
        elif any(domain.endswith(d) or d in domain for d in self.RECOGNIZED_LEGAL_DOMAINS):
            authority_score = 0.7
        else:
            # Reject untrusted / low-authority random blogs or SEO sites
            if "blog" in domain or "wordpress" in domain or authority_score < 0.5:
                return None

        return ValidatedWebSource(
            title=title or domain,
            url=url,
            domain=domain,
            authority_score=authority_score,
            is_official=is_official,
            relevant_regime=regime,
            snippet=snippet,
        )

    def validate_search_results(
        self, raw_results: List[Dict[str, Any]], regime: str = "GENERAL"
    ) -> List[ValidatedWebSource]:
        """
        Filters and ranks raw search engine output list.
        """
        validated = []
        for item in raw_results:
            url = item.get("url", "")
            title = item.get("title", "")
            snippet = item.get("content", item.get("snippet", ""))

            res = self.evaluate_source(url, title, snippet, regime=regime)
            if res:
                validated.append(res)

        # Sort descending by authority score
        validated.sort(key=lambda x: x.authority_score, reverse=True)
        return validated


if __name__ == "__main__":
    print("=== Testing Web Source Validator ===")
    validator = SourceValidator()

    sample_results = [
        {"url": "https://ipindia.gov.in/patents-guidelines.htm", "title": "IPO Patent Guidelines", "snippet": "Section 3(p) guidelines"},
        {"url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC123456", "title": "Curcumin Phytopharmaceutical Study", "snippet": "Clinical study"},
        {"url": "https://randomherbalblog.wordpress.com/cure-everything", "title": "Herbal Remedies Blog", "snippet": "Unverified claims"},
    ]

    evaluated = validator.validate_search_results(sample_results, regime="PATENT")
    print(f"Validated {len(evaluated)} of {len(sample_results)} sources:")
    for s in evaluated:
        print(f" - [{s.authority_score}] {s.title} ({s.domain})")

    assert len(evaluated) == 2
    assert evaluated[0].is_official is True
    print("\n[OK] Web Source Validator test passed cleanly!")
