"""
MeetingStrategist Agent

Uses Gemini 1.5 Flash for strategy generation.
Leverages the reliable free tier and 1M token context window.
"""

import os
import time
from typing import Dict, Any, Optional

from ..llm_provider import get_llm_response, LLMProvider


class MeetingStrategist:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the MeetingStrategist.
        Uses Gemini 1.5 Flash for reliable strategy generation.
        """
        # API keys are loaded from environment by llm_provider
        self.provider = LLMProvider.GOOGLE

    def generate_strategy(self, profile_data: Dict[str, Any], meeting_purpose: str) -> str:
        """
        Generates a strategic 'Battle Card' using Gemini 1.5 Flash.
        """
        prompt = f"""
You are a Headhunter. Write a 'Battle Card'.

TONE: Ruthless, Direct, Anti-Fluff.
RULE: If the user is an Engineer, do NOT say 'Thank you for this opportunity'. Say 'Saw your repo, X is broken'.

TARGET PROFILE:
- Archetype: {profile_data.get("archetype", "Unknown")}
- Triggers: {", ".join(profile_data.get("psychological_triggers", []))}
- Summary: {profile_data.get("profile_summary", "")}

MEETING CONTEXT:
{meeting_purpose}

Task: Create a strategic "Battle Card" for this meeting.
Structure your response exactly as follows:

### 🛡️ Strategic Approach
(1-2 sentences on the overall vibe)

### ✅ DOs
- (Bullet point)
- (Bullet point)
- (Bullet point)

### ❌ DON'Ts
- (Bullet point)
- (Bullet point)
- (Bullet point)

### 🗣️ Suggested Opening Line
"(Write a distinct opening line)"
"""

        try:
            max_retries = 3
            strategy = ""
            
            for attempt in range(max_retries):
                try:
                    strategy = get_llm_response(
                        prompt=prompt,
                        provider=self.provider,
                        temperature=0.7,
                        fallback=False  # No fallback needed, Gemini is already the reliable option
                    )
                    break
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    print(f"⚠️ Strategy attempt {attempt + 1} failed, retrying...")
                    time.sleep(5 * (attempt + 1))
            
            return strategy
            
        except Exception as e:
            return f"Error generating strategy: {e}"
