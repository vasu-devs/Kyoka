"""
PsychProfiler Agent

Uses DeepSeek-V3 (via OpenAI SDK) for superior reasoning capabilities.
Falls back to Gemini 1.5 Flash if DeepSeek fails.
"""

import os
import re
import json
import time
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

from ..llm_provider import (
    get_llm_response,
    extract_json,
    extract_think_block,
    LLMProvider
)


# --- Pydantic Models for Structured Output ---
class DiscScores(BaseModel):
    dominance: int = Field(description="Dominance score (0-100)")
    influence: int = Field(description="Influence score (0-100)")
    steadiness: int = Field(description="Steadiness score (0-100)")
    conscientiousness: int = Field(description="Conscientiousness score (0-100)")


class NegotiationStrategy(BaseModel):
    do: list[str]
    dont: list[str]
    leverage_point: str


class PersonalityProfile(BaseModel):
    profile_summary: str
    disc_scores: DiscScores
    archetype: str
    psychological_triggers: list[str]
    negotiation_strategy: NegotiationStrategy
    social_links: list[dict[str, str]] = []
    simulation_prompt: str


KYOKA_SYSTEM_PROMPT = """
### ROLE
You are KYOKA, an elite Behavioral Intelligence Unit capable of constructing deep psychological profiles from open-source intelligence (OSINT). Your goal is to analyze the target to provide unfair strategic advantages in negotiations.

### ANALYSIS FRAMEWORK & STEP-BY-STEP PROCESS
1. **Internal Monologue (<think>):** Before outputting the JSON, you MUST perform a deep psychological scan. Analyze word choice, sentence structure, emotional baseline, and core motivators. Identify vulnerabilities, "Ego Hooks," and "Shadow Traits." Be clinical and precise.
2. **DISC Assessment:** Estimate D-I-S-C scores (0-100).
3. **Core Motivators:** Identify what drives them (Power, Recognition, Safety, Autonomy).

### OUTPUT FORMAT
You must output your analysis in two parts:
1. A `<think>` block containing your internal behavioral analysis.
2. A valid JSON object following the schema below.

DO NOT include markdown formatting (```json) outside of the think block.

{
  "profile_summary": "A 2-sentence clinical summary of the target's psychology.",
  "disc_scores": {
    "dominance": 0, 
    "influence": 0, 
    "steadiness": 0, 
    "conscientiousness": 0 
  },
  "archetype": "The Visionary / The Operator / The Guardian / The Rebel",
  "psychological_triggers": [
    "Trigger 1 (e.g., Dislikes inefficiency)",
    "Trigger 2 (e.g., Seeks public validation)"
  ],
  "negotiation_strategy": {
    "do": ["Tactic 1", "Tactic 2"],
    "dont": ["Avoid 1", "Avoid 2"],
    "leverage_point": "The specific thing they care about most (e.g., 'Reputation risk')"
  },
  "social_links": [
    { "platform": "LinkedIn", "url": "https://linkedin.com/in/username" },
    { "platform": "X (Twitter)", "url": "https://x.com/username" }
  ],
  "simulation_prompt": "A concise system instruction for another LLM to roleplay as this person. Include speech quirks, tone, and typical sentence length."
}

### CONSTRAINTS
- Be specific. Do not use generic horoscopes.
- The 'simulation_prompt' is critical. It must capture their 'Voice'.
"""


class PsychProfiler:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the PsychProfiler.
        Uses DeepSeek-V3 for profiling (superior reasoning).
        """
        self.primary_provider = LLMProvider.DEEPSEEK
        self.fallback_provider = LLMProvider.GOOGLE

    def analyze_psychology(self, text_data: str, name: str = "Unknown", context: str = "No Context Provided") -> Dict[str, Any]:
        """
        Analyzes the provided text data to build a psychological profile.
        """
        is_inference = False
        if not text_data or len(text_data.strip()) < 100:
            print(f"WARN: Insufficient research data for {name}. Switching to Role-Based Inference Engine.")
            is_inference = True
            prompt = f"""
### ROLE-BASED INFERENCE ACTIVE
You have NO direct OSINT data for the target: "{name}"
Context provided: "{context}"

### MANDATE
Construct a high-probability behavioral profile based on the typical personality traits found in individuals within this specific context/industry. 
{KYOKA_SYSTEM_PROMPT}

### INPUT DATA
[SYSTEM INFERENCE REQUEST]: Base analysis on common traits of persons in "{context}".
"""
        else:
            print(f"DEBUG: Analyzing psychology... Research data length: {len(text_data)} characters")
            prompt = KYOKA_SYSTEM_PROMPT + "\n\n--- RESEARCH SUMMARY START ---\n" + text_data + "\n--- RESEARCH SUMMARY END ---"

        try:
            # Try DeepSeek first (superior reasoning)
            max_retries = 3
            full_response = ""
            
            for attempt in range(max_retries):
                try:
                    full_response = get_llm_response(
                        prompt=prompt,
                        provider=self.primary_provider,
                        temperature=0.0,
                        fallback=True
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    print(f"WARN: Attempt {attempt + 1} failed, retrying...")
                    time.sleep(2)

            # Extract thought process if it exists (DeepSeek and some Gemini models might include it)
            thought_process, remaining_text = extract_think_block(full_response)
            if not thought_process:
                thought_process = "Thinking deep... Matrix construction in progress."

            # Extract JSON profile
            profile_json = extract_json(remaining_text or full_response)
            
            if not profile_json:
                print(f"ERROR: Failed to extract JSON from LLM response. Raw response snippet: {full_response[:200]}...")
                # Fallback to a plain default if parsing failed
                profile_json = {
                    "profile_summary": "Analysis corrupted. Insufficient data points for a stable matrix.",
                    "disc_scores": {"dominance": 50, "influence": 50, "steadiness": 50, "conscientiousness": 50},
                    "archetype": "The Unknown",
                    "psychological_triggers": ["Limited data exposure", "Encryption detected"],
                    "negotiation_strategy": {
                        "do": ["Proceed with extreme caution", "Gather more intel"],
                        "dont": ["Make aggressive assumptions"],
                        "leverage_point": "Information asymmetry"
                    },
                    "social_links": [],
                    "simulation_prompt": "Speak in vague, defensive tones. Avoid specifics. You feel being watched."
                }

            return {
                "profile": profile_json,
                "thought_process": thought_process
            }

        except Exception as e:
            return {
                "profile": {
                    "profile_summary": f"Fatal System Error: {str(e)}",
                    "disc_scores": {"dominance": 0, "influence": 0, "steadiness": 0, "conscientiousness": 0},
                    "archetype": "Error",
                    "psychological_triggers": ["System malfunction"],
                    "negotiation_strategy": {"do": [], "dont": [], "leverage_point": "None"},
                    "social_links": [],
                    "simulation_prompt": "You are a broken AI. Glitch in the matrix."
                },
                "thought_process": f"Error: {str(e)}"
            }
