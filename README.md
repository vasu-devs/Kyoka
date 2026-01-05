# KYOKA │ INTELLIGENCE
> **The unfair advantage in human interactions.**

![Kyoka Interface](https://via.placeholder.com/1200x600/121212/D4AF37?text=KYOKA+INTELLIGENCE)

**Kyoka** is an elite behavioral intelligence unit disguised as an application. It does not simply "scrape data"—it constructs deep psychological dossiers on any target, analyzing their digital footprint to generate actionable, high-leverage negotiation strategies ("Battle Cards").

Designed for high-stakes operators (Recruiters, VCs, Founders), Kyoka transforms raw OSINT (Open Source Intelligence) into a precise psychological matrix, telling you not just *who* someone is, but *how* to influence them.

---

## ⚡ The Philosophy: "Why"
In 90% of meetings, you are flying blind. You know their job title, but you don't know their:
*   **Core Drivers** (Do they value power, safety, or recognition?)
*   **Shadow Traits** (Are they neurotic? Narcissistic? Avoidant?)
*   **Communication Protocol** (Do they need data or stories?)

**Kyoka solves the "Translation Gap".**
It uses multi-agent AI to read between the lines of a target's LinkedIn posts, GitHub code, and Twitter rants, determining their **DISC profile** and **Big Five personality traits** before you even say "Hello."

---

## 🧠 The Architecture: Multi-Agent Neural Grid

Kyoka runs on a sophisticated tri-agent loop powered by **LangChain** and **FastAPI**.

### 1. The Deep Diver (Researcher)
*   **Engine**: Tavily Search API (Deep Research)
*   **Role**: Exhaustive OSINT extraction.
*   **Function**: Scours LinkedIn, GitHub, X (Twitter), YouTube, and personal portfolios. Performs "Gap Analysis" to find missing links (e.g., if a target is a dev, it hunts for their GitHub if not found initially).

### 2. The PsychProfiler (Analyst)
*   **Engine**: DeepSeek-V3 / Gemini 1.5 Flash
*   **Role**: Behavioral Matrix Construction.
*   **Function**: Ingests raw text and applies **Psycholinguistics**.
    *   Synthesizes a **DISC Assessment** (Dominance, Influence, Steadiness, Conscientiousness).
    *   Identifies **Psychological Triggers** and **Archetypes** (e.g., "The Resilient Operator").
    *   Detects **Ego Hooks** (what makes them feel important).

### 3. The Strategist (Tactician)
*   **Engine**: Gemini 2.0 / OpenAI GPT-4o
*   **Role**: Actionable Strategy Generation.
*   **Function**: Converts the psychological profile into a **Battle Card**.
    *   **"DOs"**: Exact phrases to use.
    *   **"DON'Ts"**: Red flags to avoid.
    *   **"Opening Line"**: A scientifically crafted icebreaker to bypass defenses.

---

## 💎 The Aesthetics (Frontend)

Built with **React**, **Vite**, and **Tailwind CSS**, the UI is designed to feel like a **luxury concierge tool**.

*   **Design System**: "Charcoal & Gold" (Premium, Dark Academia).
*   **Typography**: *Playfair Display* (Headings) + *Inter/Satoshi* (Data).
*   **Interactions**:
    *   **Magnetic Hover Effects**: Buttons feel physical.
    *   **Reveal Cards**: Data flows in with cinematic smooth-scroll animations.
    *   **Chat Simulator**: A "Concierge" mode to practice the negotiation before it happens.
*   **Visuals**:
    *   **Radar Charts**: Visualizing personality skew.
    *   **Custom Iconography**: `lucide-react` integration for a polished look.

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js 18+
*   API Keys:
    *   `GOOGLE_API_KEY` (Gemini)
    *   `TAVILY_API_KEY` (Research)

### Installation

1.  **Clone the Neural Grid**
    ```bash
    git clone https://github.com/Start-Kyoka.git
    cd kyoka
    ```

2.  **Initialize the System (One-Click)**
    We use a unified runner to handle both backend (Python) and frontend (Node) processes.
    ```powershell
    # Windows
    python run.py
    ```

    *The `run.py` script will automatically create a virtual environment, install python dependencies (`requirements.txt`), install frontend modules (`npm install`), and launch both servers in parallel.*

### Environment Config
Create a `.env` file in the root:
```env
GOOGLE_API_KEY=your_gemini_key
TAVILY_API_KEY=your_tavily_key
```

---

## 🛠 Tech Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Blazing fast HMR and component modularity. |
| **Styling** | Tailwind CSS | Utility-first precision for the custom luxury design system. |
| **Motion** | Framer Motion | Cinematic reveal animations and smooth transitions. |
| **Icons** | Lucide React | Clean, sharp, consistent SVG glyphs. |
| **Backend** | FastAPI | High-performance async python server. |
| **AI Orchestration** | LangChain | Managing agent chains and prompt contexts. |
| **LLMs** | Gemini 2.0 / DeepSeek | The "Brain" behind the analysis. |
| **Search** | Tavily API | specialized AI search engine for deep research. |

---

## 🔮 Roadmap

*   [ ] **Voice Mode**: Real-time analysis during a call (Whisper integration).
*   [ ] **LinkedIn Plugin**: Chrome extension to run Kyoka directly on a profile page.
*   [ ] **CRM Sync**: Push Battle Cards directly to Salesforce/HubSpot.

---

> *"If you know the enemy and know yourself, you need not fear the result of a hundred battles."* — Sun Tzu

**Built by Vasudev Siddh.**
