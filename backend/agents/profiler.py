import os
import re
import json
from typing import Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI, HarmBlockThreshold, HarmCategory
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field

import time
from google.api_core.exceptions import ResourceExhausted

# --- Pydantic Models for Structured Output (Keep for reference/parsing) ---
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
        Initialize the PsychProfiler with a Google API key.
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        
        # Safety Settings: BLOCK_NONE as requested
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        }

        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash-lite",
                google_api_key=self.api_key,
                temperature=0.0,
                safety_settings=self.safety_settings
            )
        else:
            self.llm = None

    def analyze_psychology(self, text_data: str) -> Dict[str, Any]:
        """
        Analyzes the provided text data to build a psychological profile using Gemini 2.0 Flash.
        """
        if not self.llm:
            raise ValueError("Google API key is not set. Please provide it.")

        template = """
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
            "communication_style": "...",  # Descriptive string
            "psychological_triggers": ["...", "...", "..."],
            "speaking_style_guidelines": ["...", "...", "...", "...", "..."], # 5 rules
            "summary": "..."
        }}
        ```

        --- RAW DATA START ---
        {text_data}
        --- RAW DATA END ---
        """
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["text_data"]
        )
        
        chain = prompt | self.llm | StrOutputParser()
        
        try:
            full_response = ""
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    full_response = chain.invoke({"text_data": text_data})
                    break
                except ResourceExhausted:
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(5 * (attempt + 1))  # Exponential backoff

            
            # 1. Extract and Remove Thought Process first
            thought_process = "No thoughts captured."
            
            # Try to find the think block
            think_start = full_response.find('<think>')
            think_end = full_response.find('</think>')
            
            if think_start != -1:
                if think_end != -1:
                    # Valid block found
                    thought_process = full_response[think_start+7:think_end].strip()
                    full_response = full_response.replace(full_response[think_start:think_end+8], "")
                else:
                    # Truncated think block? If so, we probably don't have JSON.
                    # But let's try to see if JSON block started anyway (unlikely if strictly sequential).
                    # We will capture what we have as thought process.
                    thought_process = full_response[think_start+7:].strip()
            
            
            # 2. Extract JSON
            json_str = "{}"
            # Pattern 1: Markdown code block
            json_match = re.search(r'```json\s*(\{.*?\})\s*```', full_response, re.DOTALL)
            if not json_match:
                # Pattern 2: Just look for the first { and the last } in the remaining text
                # We use a non-greedy approach for the content but ensure we find the outer braces
                try:
                    start_idx = full_response.find('{')
                    end_idx = full_response.rfind('}')
                    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                        json_str = full_response[start_idx:end_idx+1]
                except Exception:
                    pass
            else:
                json_str = json_match.group(1)

            
            try:
                profile_json = json.loads(json_str)
                # If valid JSON but empty (e.g. from default "{}" or model output "{}"), treat as error
                if not profile_json:
                     raise ValueError("Empty JSON extracted")
            except (json.JSONDecodeError, ValueError):
                # Fallback structure
                profile_json = {
                    "disc_type": "Error Parse",
                    "disc_scores": {"D": 5, "I": 5, "S": 5, "C": 5},
                    "communication_style": "Review Raw Output",
                    "psychological_triggers": ["JSON Parsing Failed", "Check Deep Report"],
                    "speaking_style_guidelines": ["Speak normally.", "Avoid jargon."],
                    "summary": f"Could not parse JSON profile. Raw response length: {len(full_response)}"
                }
            
            # Inject raw response into profile for debugging
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
                    "summary": "Could not generate profile.",
                    "raw_response": f"Error during execution: {str(e)}"
                },
                "thought_process": f"Error: {str(e)}"
            }
