"""
app.py — Jeevam: Voice-Based Natural Farming Consultant
FastAPI backend serving the multi-page mobile platform.
Built for Connecting Dreams Foundation · AI for Rural Entrepreneurs
"""

import os
import json
import uuid
import logging
import tempfile
import shutil

from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from dotenv import load_dotenv

from stt import transcribe
from tts import synthesize
from llm import query_llm
from offline import get_offline_answer

# ━━━ Configuration ━━━
load_dotenv()
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s ┃ %(name)s ┃ %(levelname)s ┃ %(message)s",
)
logger = logging.getLogger("jeevam")

# Audio output directory (inside project, not /tmp)
AUDIO_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio_cache")
os.makedirs(AUDIO_DIR, exist_ok=True)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

# ━━━ App Setup ━━━
app = FastAPI(title="Jeevam", docs_url=None, redoc_url=None)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/audio_cache", StaticFiles(directory="audio_cache"), name="audio_cache")
templates = Jinja2Templates(directory="templates")


# ━━━ Pages ━━━

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Serve the SPA shell."""
    return templates.TemplateResponse(request=request, name="index.html")


# ━━━ API Endpoints ━━━

@app.post("/api/voice")
async def api_voice(
    audio: UploadFile = File(...),
    language: str = Form("hindi"),
    profile_context: str = Form("")
):
    """Process voice input: Audio → STT → LLM → TTS."""
    try:
        # Save uploaded audio to temp file
        suffix = os.path.splitext(audio.filename or ".webm")[1] or ".webm"
        tmp = tempfile.NamedTemporaryFile(suffix=suffix, delete=False)
        content = await audio.read()
        tmp.write(content)
        tmp.close()

        # Step 1: Transcribe
        logger.info("Voice API: Transcribing...")
        transcript = transcribe(tmp.name)
        os.unlink(tmp.name)

        if not transcript:
            return JSONResponse({
                "success": False,
                "error": "कुछ सुनाई नहीं दिया — फिर से बोलें"
                if language == "hindi"
                else "Couldn't hear clearly — please try again",
            })

        # Step 2: LLM with offline fallback
        answer, online = _get_answer(transcript, language, profile_context)

        # Step 3: TTS
        audio_url = _generate_audio(answer)

        return JSONResponse({
            "success": True,
            "transcript": transcript,
            "answer": answer,
            "audio_url": audio_url,
            "online": online,
        })

    except Exception as e:
        logger.error(f"Voice API error: {e}")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


@app.post("/api/text")
async def api_text(
    query: str = Form(...),
    language: str = Form("hindi"),
    profile_context: str = Form("")
):
    """Process text input: Text → LLM → TTS."""
    try:
        if not query.strip():
            return JSONResponse({"success": False, "error": "Empty query"})

        answer, online = _get_answer(query, language, profile_context)
        audio_url = _generate_audio(answer)

        return JSONResponse({
            "success": True,
            "answer": answer,
            "audio_url": audio_url,
            "online": online,
        })

    except Exception as e:
        logger.error(f"Text API error: {e}")
        return JSONResponse({"success": False, "error": str(e)}, status_code=500)


@app.get("/api/diseases")
async def api_diseases():
    """Return the disease knowledge base."""
    with open(os.path.join(DATA_DIR, "diseases.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(data)


@app.get("/api/education")
async def api_education():
    """Return the education knowledge base."""
    with open(os.path.join(DATA_DIR, "education.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(data)


@app.get("/api/calendar")
async def api_calendar():
    """Return the crop calendar knowledge base."""
    with open(os.path.join(DATA_DIR, "calendar.json"), "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(data)


@app.get("/api/status")
async def api_status():
    """Health check."""
    has_key = bool(os.getenv("GROQ_API_KEY", "").strip())
    return JSONResponse({"status": "ok", "llm_configured": has_key})


# ━━━ Helpers ━━━

def _get_answer(query: str, language: str, profile_context: str = "") -> tuple[str, bool]:
    """Get answer from LLM with offline fallback. Returns (answer, is_online)."""
    try:
        full_query = query
        if profile_context:
            full_query = f"[Farmer Profile: {profile_context}] {query}"
            
        answer = query_llm(full_query)
        return answer, True
    except Exception as e:
        logger.warning(f"LLM failed, trying offline: {e}")
        offline = get_offline_answer(query)
        if offline:
            return offline, False
        fallback = (
            "Internet nahi hai aur yeh sawal mere stored knowledge mein nahi mila. "
            "Jab signal aaye tab dobara poochein.\n\n"
            "Kisan Helpline: 1800-180-1551 (toll free, 24 ghante)"
            if language == "hindi"
            else "No internet and this question isn't in my offline cache. "
            "Please try again when you have signal.\n\n"
            "Kisan Helpline: 1800-180-1551 (toll free, 24 hrs)"
        )
        return fallback, False


def _generate_audio(text: str) -> str | None:
    """Generate TTS audio and return the URL path."""
    audio_path = synthesize(text)
    if not audio_path:
        return None

    # Copy to audio_cache with unique name
    filename = f"{uuid.uuid4().hex[:12]}.mp3"
    dest = os.path.join(AUDIO_DIR, filename)
    shutil.move(audio_path, dest)
    return f"/audio_cache/{filename}"


# ━━━ Launch ━━━

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
