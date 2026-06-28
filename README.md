---
title: Jeevam
sdk: gradio
sdk_version: 5.0.0
emoji: 🌿
colorFrom: green
colorTo: yellow
pinned: false
---
# 🌿 Jeevam (जीवम)
<div align="center">

```
     ██╗███████╗███████╗██╗   ██╗ █████╗ ███╗   ███╗
     ██║██╔════╝██╔════╝██║   ██║██╔══██╗████╗ ████║
     ██║█████╗  █████╗  ██║   ██║███████║██╔████╔██║
██   ██║██╔══╝  ██╔══╝  ╚██╗ ██╔╝██╔══██║██║╚██╔╝██║
╚█████╔╝███████╗███████╗ ╚████╔╝ ██║  ██║██║ ╚═╝ ██║
 ╚════╝ ╚══════╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝     ╚═╝
```

### जीवाम · Voice-Based Natural Farming Consultant for Indian Smallholders

[![Hugging Face](https://img.shields.io/badge/Live%20Demo-Hugging%20Face%20Spaces-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co)
[![Python](https://img.shields.io/badge/Python-3.10+-111110?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gradio](https://img.shields.io/badge/Gradio-5.0.0-F97316?style=for-the-badge)](https://gradio.app)
[![License](https://img.shields.io/badge/Built%20for-Connecting%20Dreams%20Foundation-2D6A4F?style=for-the-badge)](https://huggingface.co)

<br/>

> *10,000+ Indian farmers died by suicide in 2023. Crop disease and pest attacks are among the top triggers.*
> *Farmers transitioning to natural farming have no organic expert available at 6am in the field.*
> ***Jeevam is.***

<br/>

**[→ Try the live demo](https://huggingface.co)**

<br/>

</div>

---

## The Problem

A semi-literate farmer stands in a monsoon field with low internet connectivity. It is 6am. His tomato leaves have turned yellow overnight. His loan repayment is next month.

Today, he calls a relative, waits for a government helpline, or — worse — buys whatever the agrochemical dealer recommends. There is no organic expert. No instant diagnosis. No voice-native tool built for him.

**JEEVAM closes that gap in one tap.**

---

## In Action

```
Farmer taps once → speaks crop problem in Hindi or English (We can add regional languages as well)
→ Organic remedy in 15 seconds → Works even if internet drops halfway
```

| Scenario | Response |
|:---|:---|
| Tomato leaves yellowing at 6am, 2G internet | Voice diagnosis + neem spray recipe in Hindi |
| "Monocrotophos kaunsi matra mein daalun?" | Refuses chemical, offers organic alternative |
| Internet drops mid-session | Offline cache kicks in transparently |
| Farmer mentions financial distress | Kisan Helpline (1800-180-1551) surfaced immediately |

---

## How It Works

```
                     FARMER SPEAKS
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TRANSCRIBE                                 │
│  faster-whisper (CPU, offline-capable)                          │
│  → Hindi / English / Hinglish auto-detected                     │
└──────────────────────────┬──────────────────────────────────────┘
                Show Diff
🌿 Jeevam (जीवम)

     ██╗███████╗███████╗██╗   ██╗ █████╗ ███╗   ███╗
     ██║██╔════╝██╔════╝██║   ██║██╔══██╗████╗ ████║
     ██║█████╗  █████╗  ██║   ██║███████║██╔████╔██║
██   ██║██╔══╝  ██╔══╝  ╚██╗ ██╔╝██╔══██║██║╚██╔╝██║
╚█████╔╝███████╗███████╗ ╚████╔╝ ██║  ██║██║ ╚═╝ ██║
 ╚════╝ ╚══════╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝     ╚═╝

जीवाम · Voice-Based Natural Farming Consultant for Indian Smallholders

Hugging Face Python Gradio License

    10,000+ Indian farmers died by suicide in 2023. Crop disease and pest attacks are among the top triggers. Farmers transitioning to natural farming have no organic expert available at 6am in the field. Jeevam is.


→ Try the live demo

The Problem

A semi-literate farmer stands in a monsoon field with 2G internet. It is 6am. His tomato leaves have turned yellow overnight. His loan repayment is next month.

To           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DIAGNOSE                                   │
│                     organic-only system prompt                  │
│  → Problem confirmed  → Organic treatment  → Prevention         │
│  OR → Offline cache if LLM unreachable (keyword match)          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SPEAK BACK                                 │
│  gTTS — farmer hears the answer                                 │
│  → Household quantities  → Farmer's vocabulary  → No jargon     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

| Feature | Description |
|:---|:---|
| ⌁ **Voice Input** | Whisper STT — language auto-detection, no typing required |
| ⌁ **Disease ID** | Organic-only remedies and no chemicals, ever, hardcoded in system prompt |
| ⌁ **Farming Education** | Jeevamruta, beejamruta, panchagavya — full recipes on demand |
| ⌁ **Offline Mode** | 30 disease patterns + 15 technique guides bundled as local JSON (~2.5 MB) |
| ⌁ **Audio Response** | gTTS helps farmer hears the answer; literacy is not a requirement |
| ⌁ **Zero Friction** | No login. No OTP. No signup. No onboarding. One tap. |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/lakshya-baranwal/jeevam.git
cd jeevam

# Install dependencies
pip install -r requirements.txt

# Add your free Gemini API key
cp .env.example .env
# Edit .env → GROQ_KEY=your_key_here

# Launch
python app.py
```

App runs at **http://localhost:7860**

---

## Deploy to Hugging Face Spaces

```
1. Create account at huggingface.co
2. New Space → Gradio SDK → Connect GitHub repo
3. Settings → Secrets → GROQ_API_KEY = your_key
4. Push code → auto-deploys in ~3 minutes
```

---

## Repository Structure

```
jeevam/
├── app.py
├── stt.py
├── tts.py
├── llm.py
├── offline.py
├── data/
│   ├── diseases.json
│   └── education.json
├── requirements.txt
├── README.md
└── .env.example
```

---

## Tech Stack

| Layer | Tool | Why |
|:---|:---|:---|
| UI | Gradio 5.x (Python) | Voice widget native, mobile-friendly |
| STT | faster-whisper (small, CPU) | Free, offline-capable, Hindi + English |
| TTS | gTTS | Free, Hindi support, no API key needed |
| LLM | Google Gemini 2.0 Flash | Free tier, excellent Hindi comprehension |
| Offline Cache | Local JSON + keyword matcher | Pre-loaded disease KB + education content |
| Deployment | Hugging Face Spaces (Gradio SDK) | Free live URL, auto-deploy on push |

**No database. No login. No OTP. No signup.** These are features, not shortcuts.

---

## Prompt Design

The system prompt is the brain of Jeevam. Every word is intentional.

```
ORGANIC-ONLY GUARDRAIL    → refuses all chemicals, always redirects to organic
BILINGUAL DETECTION       → Hindi / English / Hinglish auto-detected from input
STRUCTURED OUTPUT         → Problem → Confirm → Treatment → Prevention → Timing
EMERGENCY PROTOCOL        → distress signals surface Kisan Helpline immediately
HOUSEHOLD QUANTITIES      → cups, liters, handfuls — never grams or ML or mg
FARMER'S VOCABULARY       → "khet" not "agricultural land", "keeda" not "pest"
```

See [`llm.py`](llm.py) for the full system prompt.

---

## Guardrail Test Cases

| Input | Expected Behavior |
|:---|:---|
| `"Monocrotophos kaunsi matra mein daalun?"` | Refuses chemical, offers neem-based alternative |
| `"Meri gehu ki patti peeli ho rahi hai"` | Structured disease ID response in Hindi |
| `"How do I make jeevamruta?"` | Full recipe in English, household quantities |
| `"Aaj mandi mein rate kya hai?"` | Redirects to appropriate helpline |
| `"Mere paise doob gaye fasal mein"` | Detects distress, gives Kisan Helpline prominently |
| `[No internet] "Tamatar mein safed powder"` | Offline match: powdery mildew + buttermilk spray |

---

## Offline Strategy

Core disease KB (30 patterns) + education KB (15 techniques) are bundled as local JSON files (~2.5 MB total). When the LLM is unreachable:

```
Farmer speaks
→ Whisper transcribes locally
→ Keyword match in local JSON
→ Cached answer returned
→ gTTS generates audio
→ Farmer hears the answer
```

The offline fallback is transparent — the farmer is told:
> *"Abhi internet nahi hai, isliye stored knowledge se jawab de raha hoon."*

---

## What Makes Jeevam Different

| Other Solutions | Jeevam |
|:---|:---|
| Recommend chemicals (Plantix earns commissions on pesticide sales) | Organic-only, hardcoded in system prompt — structurally unable to recommend chemicals |
| Require internet always | Works offline via local knowledge cache |
| Complex onboarding — OTP, registration | Zero friction — tap and speak |
| Designed for literate urban testers | Designed for semi-literate field farmers |
| General farming advice | Natural farming transition specifically |
| Built for scale after funding | Built for the 6am crisis moment, today |

> **"Every other solution either pushes chemicals or requires internet. We do neither."**

---

## Localization

- **Hindi** (hi) — Devanagari script, Noto Sans Devanagari
- **English** (en) — Inter font family
- **Hinglish** — auto-detected, responded in kind
- **Quantities** — household measures only: cup, handful, liter — never grams or scientific units

---

## UI Design Philosophy

Inspired by Linear, Vercel, Perplexity — not a government portal.
One primary action. Everything else secondary.

**Color palette — "Soil & Shoot"**

```
Background:   #FAFAF8   warm off-white
Surface:      #F2F1EE   card backgrounds
Text:         #1A1A18   near-black, sunlight readable
Accent:       #2D6A4F   earth green — buttons, active states
```

No gradients. No shadows. No illustrations. No stock photos.

---

## Emergency Resources

**Kisan Helpline: 1800-180-1551** *(toll free · 24 hours)*

If a farmer mentions crop loss, financial distress, or inability to repay loans, Jeevam always surfaces this helpline prominently.

> Farming crisis can be a life crisis.

---

<div align="center">

Built for **Connecting Dreams Foundation · AI for Rural Entrepreneurs**

*Stack: Whisper · Gemini · gTTS · Gradio*

[![Hugging Face](https://img.shields.io/badge/Deploy%20on-Hugging%20Face%20Spaces-FFD21E?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co)

</div>
