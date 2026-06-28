"""
stt.py — Speech-to-Text using faster-whisper (free, offline-capable, CPU)
Handles Hindi + English transcription from audio input.
"""

import os
import tempfile
import logging

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    """Lazy-load the Whisper model (small — balanced speed/accuracy on CPU)."""
    global _model
    if _model is None:
        from faster_whisper import WhisperModel
        model_size = os.getenv("WHISPER_MODEL", "small")
        logger.info(f"Loading Whisper model: {model_size}")
        _model = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
        )
        logger.info("Whisper model loaded successfully")
    return _model


def transcribe(audio_path: str) -> str:
    """
    Transcribe an audio file to text.

    Args:
        audio_path: Path to the audio file (wav/mp3/ogg).

    Returns:
        Transcribed text string. Empty string if transcription fails.
    """
    if not audio_path or not os.path.exists(audio_path):
        logger.warning(f"Audio file not found: {audio_path}")
        return ""

    try:
        model = _get_model()
        segments, info = model.transcribe(
            audio_path,
            language=None,       # Auto-detect Hindi/English
            beam_size=5,
            vad_filter=True,     # Filter silence — saves processing
            vad_parameters=dict(
                min_silence_duration_ms=500,
            ),
        )

        text = " ".join(seg.text.strip() for seg in segments)
        detected_lang = info.language
        logger.info(f"Transcribed ({detected_lang}): {text[:80]}...")
        return text.strip()

    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        return ""
