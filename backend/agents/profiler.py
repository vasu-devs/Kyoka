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
    D: int = Field(description="Dominance score (1-10)")
    I: int = Field(description="Influence score (1-10)")
    S: int = Field(description="Steadiness score (1-10)")
    C: int = Field(description="Conscientiousness score (1-10)")


class PersonalityProfile(BaseModel):
    disc_type: str = Field(description="The primary DISC personality type")
    disc_scores: DiscScores
    communication_style: str = Field(description="Detailed analysis of their communication style")
    psychological_triggers: list[str] = Field(description="List of 3 key psychological triggers")
    speaking_style_guidelines: list[str] = Field(description="List of 5 strict speaking style rules")
    summary: str = Field(description="A comprehensive psychological summary")


class PsychProfiler:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the PsychProfiler.
        Uses DeepSeek-V3 for profiling (superior reasoning).
        """
        # API keys are loaded from environment by llm_provider
        self.primary_provider = LLMProvider.DEEPSEEK
        self.fallback_provider = LLMProvider.GOOGLE

    def analyze_psychology(self, text_data: str) -> Dict[str, Any]:
        """
        Analyzes the provided text data to build a psychological profile.
        Uses DeepSeek-V3 for superior reasoning, with Gemini fallback.
        """
        prompt = f"""
You are an expert profiler.

Task: Analyze the provided raw data to build a deep psychological profile.

Step 1: <think> 
- Analyze the raw data. Look for specific project names, coding patterns, and tone contradictions. 
- Determine the DISC type with evidence.
- Identify 3 key triggers.
- CRITICAL: Keep this internal monologue brief (max 500 words) to ensure you have space for the JSON.
</think>

Step 2: Extract a 'Style Guide' (e.g., 'uses lowercase', 'hates jargon', 'direct').

Step 3: Generate the DISC Profile JSON with numerical scores (1-10).

OUTPUT FORMAT:
<think>
[Concise internal monologue]
</think>

```json
{{
    "disc_type": "...",
    "disc_scores": {{"D": int, "I": int, "S": int, "C": int}},
    "communication_style": "...",
    "psychological_triggers": ["...", "...", "..."],
    "speaking_style_guidelines": ["...", "...", "...", "...", "..."],
    "summary": "..."
}}
```

--- RAW DATA START ---
{text_data}
--- RAW DATA END ---
"""

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
                        fallback=True  # Will fall back to Google if DeepSeek fails
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    print(f"⚠️ Attempt {attempt + 1} failed, retrying in {5 * (attempt + 1)}s...")
                    time.sleep(5 * (attempt + 1))

            # Extract thought process
            thought_process, remaining_text = extract_think_block(full_response)
            if not thought_process:
                thought_process = "No thoughts captured."

            # Extract JSON profile
            profile_json = extract_json(remaining_text or full_response)
            
            if not profile_json:
                # Fallback structure
                profile_json = {
                    "disc_type": "Error Parse",
                    "disc_scores": {"D": 5, "I": 5, "S": 5, "C": 5},
                    "communication_style": "Review Raw Output",
                    "psychological_triggers": ["JSON Parsing Failed", "Check Deep Report"],
                    "speaking_style_guidelines": ["Speak normally.", "Avoid jargon."],
                    "summary": f"Could not parse JSON profile. Raw response length: {len(full_response)}"
                }

            # Inject raw response for debugging
            if isinstance(profile_json, dict):
                profile_json["raw_response"] = full_response

            return {
                "profile": profile_json,
                "thought_process": thought_process
            }

        except Exception as e:
            return {
                "profile": {
                    "disc_type": "Error",
                    "disc_scores": {"D": 5, "I": 5, "S": 5, "C": 5},
                    "communication_style": "Error",
                    "psychological_triggers": [f"Analysis Failed: {str(e)}"],
                    "speaking_style_guidelines": ["Speak normally."],
                    "summary": "Could not generate profile.",
                    "raw_response": f"Error during execution: {str(e)}"
                },
                "thought_process": f"Error: {str(e)}"
            }
