"""
tts.py — Text-to-Speech using gTTS (free, Hindi support, no API key)
Generates audio responses for the farmer.
"""

import os
import tempfile
import logging
import re

from gtts import gTTS

logger = logging.getLogger(__name__)


def _detect_language(text: str) -> str:
    """
    Detect whether text is primarily Hindi (Devanagari) or English.

    Returns:
        'hi' for Hindi/Devanagari, 'en' for English/Latin.
    """
    devanagari_count = len(re.findall(r'[\u0900-\u097F]', text))
    latin_count = len(re.findall(r'[a-zA-Z]', text))

    if devanagari_count > latin_count:
        return "hi"
    return "en"


def _clean_for_speech(text: str) -> str:
    """Strip markdown formatting that sounds bad when read aloud."""
    # Remove markdown bold/italic markers
    text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
    text = re.sub(r'\*(.+?)\*', r'\1', text)
    # Remove emoji-like symbols but keep Devanagari
    text = re.sub(r'[◈◆►▸●○■□▪▫✦✧⟐⟡🌾]', '', text)
    # Remove section headers formatting
    text = re.sub(r'#+\s*', '', text)
    # Collapse multiple spaces/newlines
    text = re.sub(r'\n+', '. ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def synthesize(text: str) -> str | None:
    """
    Convert text to speech audio file.

    Args:
        text: The text to convert to speech.

    Returns:
        Path to the generated .mp3 audio file, or None on failure.
    """
    if not text or not text.strip():
        return None

    try:
        lang = _detect_language(text)
        clean_text = _clean_for_speech(text)

        if not clean_text:
            return None

        tts = gTTS(text=clean_text, lang=lang, slow=False)

        # Save to temp file
        tmp = tempfile.NamedTemporaryFile(
            suffix=".mp3",
            delete=False,
            dir=tempfile.gettempdir(),
        )
        tts.save(tmp.name)
        tmp.close()

        logger.info(f"TTS generated ({lang}): {tmp.name}")
        return tmp.name

    except Exception as e:
        logger.error(f"TTS synthesis failed: {e}")
        return None
