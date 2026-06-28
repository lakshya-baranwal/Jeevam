"""
offline.py — Offline keyword matcher for disease + education knowledge base.
Provides answers when LLM is unreachable using local JSON data.
"""

import json
import os
import logging
import re

logger = logging.getLogger(__name__)

_diseases = None
_education = None

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


def _load_data():
    """Load disease and education JSON databases."""
    global _diseases, _education

    if _diseases is None:
        path = os.path.join(DATA_DIR, "diseases.json")
        with open(path, "r", encoding="utf-8") as f:
            _diseases = json.load(f)
        logger.info(f"Loaded {len(_diseases)} disease entries")

    if _education is None:
        path = os.path.join(DATA_DIR, "education.json")
        with open(path, "r", encoding="utf-8") as f:
            _education = json.load(f)
        logger.info(f"Loaded {len(_education)} education entries")


def _tokenize(text: str) -> set:
    """Simple tokenizer — lowercase, split on non-alpha."""
    text = text.lower().strip()
    # Keep Devanagari and Latin characters
    tokens = re.findall(r'[\u0900-\u097F]+|[a-z]+', text)
    return set(tokens)


def _score_match(query_tokens: set, keywords: list) -> int:
    """Count how many query tokens match the keyword list."""
    keyword_tokens = set()
    for kw in keywords:
        keyword_tokens.update(_tokenize(kw))
    return len(query_tokens & keyword_tokens)


def search_disease(query: str) -> dict | None:
    """
    Search the disease database for a keyword match.

    Returns:
        Matching disease entry dict, or None if no match found.
    """
    _load_data()
    query_tokens = _tokenize(query)

    best_match = None
    best_score = 0

    for entry in _diseases:
        score = _score_match(query_tokens, entry["keywords"])
        if score > best_score:
            best_score = score
            best_match = entry

    if best_score >= 1:
        return best_match
    return None


def search_education(query: str) -> dict | None:
    """
    Search the education database for a keyword match.

    Returns:
        Matching education entry dict, or None if no match found.
    """
    _load_data()
    query_tokens = _tokenize(query)

    best_match = None
    best_score = 0

    for entry in _education:
        score = _score_match(query_tokens, entry["keywords"])
        if score > best_score:
            best_score = score
            best_match = entry

    if best_score >= 1:
        return best_match
    return None


def format_disease_response(entry: dict) -> str:
    """Format a disease entry into the structured response format."""
    return f"""⚠ Abhi internet nahi hai, isliye stored knowledge se jawab de raha hoon.
Jab signal aaye, ek baar phir poochna — aur detail de sakta hoon.

◈ Samasya (Problem)
{entry['problem']}

◈ Pehchan (How to confirm)
{entry['confirm']}

◈ Ilaj (Treatment)
{entry['treatment']}

◈ Bachav (Prevention)
{entry['prevention']}

◈ Kab lagayen (When to apply)
{entry['timing']}

Himmat rakhein — natural farming mein time lagta hai par nateeja pakka hota hai."""


def format_education_response(entry: dict) -> str:
    """Format an education entry into the structured response format."""
    return f"""⚠ Abhi internet nahi hai, isliye stored knowledge se jawab de raha hoon.
Jab signal aaye, ek baar phir poochna — aur detail de sakta hoon.

◈ Kya hai (What it is)
{entry['what']}

◈ Kya chahiye (Ingredients)
{entry['ingredients']}

◈ Kaise banaye (How to make)
{entry['steps']}

◈ Kitne din mein tayar (Ready in)
{entry['ready_in']}

◈ Kaise use karein (How to use)
{entry['usage']}

Himmat rakhein — natural farming mein time lagta hai par nateeja pakka hota hai."""


def get_offline_answer(query: str) -> str | None:
    """
    Try to answer a query from offline cache.

    Returns:
        Formatted answer string, or None if no match found.
    """
    # Try education first (recipe queries)
    edu_match = search_education(query)
    if edu_match:
        return format_education_response(edu_match)

    # Then try disease
    disease_match = search_disease(query)
    if disease_match:
        return format_disease_response(disease_match)

    return None
