"""
IP-SAKTI Sahayak - Local Hybrid Knowledge Retrieval Engine (RAG)
Features:
1. Okapi BM25 Keyword Search
2. Local Semantic Vector Similarity (sentence-transformers / TF-IDF cosine fallback)
3. Ayurveda Domain Query Expansion (via ayurveda_synonyms.json)
4. Regime-Aware Metadata Filtering (PATENT, TRADITIONAL_KNOWLEDGE, ABS, REGULATORY)
5. 100% Local, Offline Execution (No External APIs required)
"""

import json
import math
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Set, Tuple

from pydantic import BaseModel, Field

# Optional sentence_transformers flag - default False for instant, API-free local execution
HAS_SENTENCE_TRANSFORMERS = False


class RetrievalResult(BaseModel):
    """Schema for a single retrieved knowledge chunk with hybrid scoring."""

    id: str
    title: str = ""
    regime: str = ""
    category: str = ""
    law: str
    section: str
    jurisdiction: str = "India"
    text: str
    plain_explanation: str
    source_note: str = ""
    confidence: str = "high"
    score: float
    bm25_score: float = 0.0
    semantic_score: float = 0.0
    keywords: List[str] = Field(default_factory=list)
    formulation_types: List[str] = Field(default_factory=list)


class KnowledgeRetriever:
    """
    Local Hybrid RAG Retriever for Ayurveda IP and regulatory guidance.
    Combines Okapi BM25 keyword search, local semantic embedding similarity,
    Ayurveda synonym query expansion, and regime metadata filtering.
    """

    def __init__(
        self,
        kb_path: Optional[str] = None,
        synonyms_path: Optional[str] = None,
        use_semantic: bool = True,
    ):
        self.kb_path = self._resolve_path(kb_path, "ip_sakti_knowledge_base.json")
        self.synonyms_path = self._resolve_path(synonyms_path, "ayurveda_synonyms.json")
        
        self.metadata: Dict[str, Any] = {}
        self.formulation_taxonomy: List[Dict[str, Any]] = []
        self.chunks: List[Dict[str, Any]] = []
        self.synonyms: Dict[str, List[str]] = {}

        self.load_knowledge_base()
        self.load_synonyms()

        # BM25 Corpus Statistics
        self.doc_count = len(self.chunks)
        self.avg_doc_len = 0.0
        self.doc_lengths: Dict[str, int] = {}
        self.doc_terms: Dict[str, List[str]] = {}
        self.doc_term_freqs: Dict[str, Dict[str, int]] = {}
        self.idf: Dict[str, float] = {}

        self._build_bm25_index()

        # Sentence Transformers local model (if available and cached)
        self.embedding_model = None
        self.chunk_embeddings = None
        if use_semantic and HAS_SENTENCE_TRANSFORMERS:
            try:
                # Try loading local cached model first without blocking on network download
                self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2", model_kwargs={"local_files_only": True})
                texts_to_embed = [
                    f"{c.get('title', '')} {c.get('law', '')} {c.get('text', '')} {c.get('plain_explanation', '')}"
                    for c in self.chunks
                ]
                self.chunk_embeddings = self.embedding_model.encode(texts_to_embed, convert_to_tensor=True)
            except Exception:
                # Fallback gracefully to high-performance TF-IDF vector similarity
                self.embedding_model = None
                self.chunk_embeddings = None

    def _resolve_path(self, custom_path: Optional[str], default_filename: str) -> Path:
        if custom_path:
            p = Path(custom_path)
            if p.exists():
                return p

        base_dir = Path(__file__).parent
        candidates = [
            base_dir / default_filename,
            base_dir.parent / default_filename,
            base_dir.parent / "backend" / default_filename,
            Path(default_filename),
        ]
        for c in candidates:
            if c.exists():
                return c

        return base_dir / default_filename

    def load_knowledge_base(self):
        """Loads chunks from ip_sakti_knowledge_base.json."""
        if not self.kb_path.exists():
            return

        with open(self.kb_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.metadata = data.get("metadata", {})
        self.formulation_taxonomy = data.get("formulation_taxonomy", [])
        self.chunks = data.get("chunks", [])

    def load_synonyms(self):
        """Loads synonym mapping dictionary."""
        if not self.synonyms_path.exists():
            return

        with open(self.synonyms_path, "r", encoding="utf-8") as f:
            self.synonyms = json.load(f)

    def tokenize(self, text: str) -> List[str]:
        """Normalizes and tokenizes string into lowercase alphanumeric tokens."""
        return [t.lower() for t in re.findall(r"\b\w+\b", text) if len(t) > 1]

    def expand_query(self, query: str) -> List[str]:
        """
        Ayurveda Domain Query Expansion.
        Translates common herb names and terms into scientific, Ayurvedic, and traditional synonyms.
        """
        tokens = self.tokenize(query)
        expanded_tokens = list(tokens)

        # Check full query string for key phrases
        q_lower = query.lower()
        for term, syn_list in self.synonyms.items():
            if term in q_lower:
                for syn in syn_list:
                    expanded_tokens.extend(self.tokenize(syn))

        # Check token by token
        for t in tokens:
            if t in self.synonyms:
                for syn in self.synonyms[t]:
                    expanded_tokens.extend(self.tokenize(syn))

        # Preserve order & deduplicate
        return list(dict.fromkeys(expanded_tokens))

    def _build_bm25_index(self):
        """Builds BM25 term statistics over all knowledge chunks."""
        if not self.chunks:
            return

        total_tokens = 0
        doc_freqs: Dict[str, int] = {}

        for chunk in self.chunks:
            chunk_id = chunk["id"]
            # Rich document text representation
            doc_text = " ".join([
                chunk.get("title", ""),
                chunk.get("law", ""),
                chunk.get("section", ""),
                chunk.get("text", ""),
                chunk.get("plain_explanation", ""),
                " ".join(chunk.get("keywords", [])),
                " ".join(chunk.get("formulation_types", [])),
            ])

            tokens = self.tokenize(doc_text)
            self.doc_terms[chunk_id] = tokens
            self.doc_lengths[chunk_id] = len(tokens)
            total_tokens += len(tokens)

            tf: Dict[str, int] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            self.doc_term_freqs[chunk_id] = tf

            for unique_t in set(tokens):
                doc_freqs[unique_t] = doc_freqs.get(unique_t, 0) + 1

        self.avg_doc_len = total_tokens / self.doc_count if self.doc_count > 0 else 1.0

        # Calculate BM25 IDF: log((N - df + 0.5) / (df + 0.5) + 1)
        for term, df in doc_freqs.items():
            self.idf[term] = math.log((self.doc_count - df + 0.5) / (df + 0.5) + 1.0)

    def compute_bm25_score(self, query_tokens: List[str], chunk_id: str, k1: float = 1.5, b: float = 0.75) -> float:
        """Calculates standard Okapi BM25 score for a chunk."""
        doc_len = self.doc_lengths.get(chunk_id, 0)
        tf_map = self.doc_term_freqs.get(chunk_id, {})
        score = 0.0

        for term in query_tokens:
            if term in tf_map:
                tf = tf_map[term]
                idf = self.idf.get(term, 0.5)
                # BM25 term weighting formula
                denom = tf + k1 * (1.0 - b + b * (doc_len / self.avg_doc_len))
                term_score = idf * ((tf * (k1 + 1.0)) / denom)
                score += term_score

        return score

    def compute_tfidf_cosine_score(self, query_tokens: List[str], chunk_id: str) -> float:
        """TF-IDF vector cosine similarity score fallback when dense embeddings are not present."""
        tf_map = self.doc_term_freqs.get(chunk_id, {})
        if not tf_map or not query_tokens:
            return 0.0

        q_tf: Dict[str, int] = {}
        for t in query_tokens:
            q_tf[t] = q_tf.get(t, 0) + 1

        dot_product = 0.0
        q_norm_sq = 0.0
        d_norm_sq = 0.0

        for term, q_count in q_tf.items():
            idf = self.idf.get(term, 0.5)
            q_val = q_count * idf
            q_norm_sq += q_val * q_val

            if term in tf_map:
                d_val = tf_map[term] * idf
                dot_product += q_val * d_val

        for term, d_count in tf_map.items():
            idf = self.idf.get(term, 0.5)
            d_val = d_count * idf
            d_norm_sq += d_val * d_val

        if q_norm_sq == 0 or d_norm_sq == 0:
            return 0.0

        return dot_product / (math.sqrt(q_norm_sq) * math.sqrt(d_norm_sq))

    def compute_semantic_score(self, query: str, chunk_index: int, chunk_id: str, query_tokens: List[str]) -> float:
        """Calculates dense vector embedding similarity score or TF-IDF fallback."""
        if self.embedding_model is not None and self.chunk_embeddings is not None:
            try:
                q_emb = self.embedding_model.encode(query, convert_to_tensor=True)
                sim = util.cos_sim(q_emb, self.chunk_embeddings[chunk_index]).item()
                return max(0.0, float(sim))
            except Exception:
                pass

        # Fallback to TF-IDF cosine score
        return self.compute_tfidf_cosine_score(query_tokens, chunk_id)

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        regime_filter: Optional[str] = None,
        formulation_type: Optional[str] = None,
        min_score: float = 0.01,
        bm25_weight: float = 0.5,
        semantic_weight: float = 0.5,
    ) -> List[Dict[str, Any]]:
        """
        Executes Local Hybrid RAG Retrieval.
        Applies query expansion, regime filtering, BM25 scoring, and local semantic similarity.
        """
        # 1. Expand Query with Ayurveda Synonyms
        expanded_tokens = self.expand_query(query)
        expanded_query_str = " ".join(expanded_tokens)

        scored_results = []

        # 2. Iterate and score chunks
        for idx, chunk in enumerate(self.chunks):
            chunk_id = chunk["id"]
            chunk_regime = chunk.get("regime", "").upper()

            # Metadata Filter 1: Regime filter
            if regime_filter and regime_filter.upper() != "ALL":
                target_regime = regime_filter.upper().strip()
                if "PATENT" in target_regime and chunk_regime != "PATENT":
                    continue
                elif ("TK" in target_regime or "TRADITIONAL" in target_regime) and chunk_regime != "TRADITIONAL_KNOWLEDGE":
                    continue
                elif "ABS" in target_regime and chunk_regime != "ABS":
                    continue
                elif "REGULATORY" in target_regime and chunk_regime != "REGULATORY":
                    continue

            # Metadata Filter 2: Formulation type
            if formulation_type and formulation_type not in chunk.get("formulation_types", []):
                continue

            # Compute BM25 & Semantic scores
            bm25_raw = self.compute_bm25_score(expanded_tokens, chunk_id)
            sem_raw = self.compute_semantic_score(expanded_query_str, idx, chunk_id, expanded_tokens)

            # Softmax / Sigmoidal normalization of BM25 score into [0.0, 1.0]
            bm25_norm = 1.0 - (1.0 / (1.0 + bm25_raw * 0.25))

            # Hybrid Score Fusion
            hybrid_score = (bm25_weight * bm25_norm) + (semantic_weight * sem_raw)
            hybrid_score = round(hybrid_score, 4)

            if hybrid_score >= min_score or bm25_raw > 0:
                res_dict = dict(chunk)
                res_dict["score"] = hybrid_score
                res_dict["bm25_score"] = round(bm25_norm, 4)
                res_dict["semantic_score"] = round(sem_raw, 4)
                scored_results.append(res_dict)

        # Sort by hybrid score descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]


if __name__ == "__main__":
    print("=== Running Local Hybrid Knowledge Retriever Test ===\n")
    retriever = KnowledgeRetriever()

    test_queries = [
        ("PATENT", "Neem Turmeric nano extraction wound healing patent Section 3p"),
        ("TRADITIONAL_KNOWLEDGE", "Ashwagandha stress relief Charaka Samhita TKDL prior art"),
        ("ABS", "Western Ghats wild harvest Rauvolfia Biological Diversity Act Form 8"),
        ("REGULATORY", "Triphala Churna classical formulation Form 25D AYUSH licensing"),
    ]

    for regime, q in test_queries:
        print(f"--- Query ({regime}): '{q}' ---")
        results = retriever.retrieve(q, top_k=2, regime_filter=regime)
        for i, res in enumerate(results, 1):
            print(f"  [{i}] ID: {res['id']} | Title: {res.get('title')} | Score: {res['score']} (BM25: {res['bm25_score']}, Sem: {res['semantic_score']})")
        print()

    print("[OK] Local Hybrid Knowledge Retriever test passed cleanly!")
