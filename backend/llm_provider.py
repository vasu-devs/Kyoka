"""
Unified LLM Provider Module

Supports:
- DeepSeek-V3 via OpenAI SDK (for superior reasoning)
- Google Gemini 1.5 Flash (reliable free tier, 1M context)
"""

import os
import re
import json
from enum import Enum
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()


class LLMProvider(Enum):
    DEEPSEEK = "deepseek"
    GOOGLE = "google"


def extract_json(text: str) -> Dict[str, Any]:
    """
    Robustly extract JSON from LLM response using brace counting.
    Handles markdown code blocks, raw JSON, and text noise.
    """
    # Try to find a JSON block starting with {
    start_idx = text.find('{')
    if start_idx == -1:
        return {}

    # Balanced brace counting
    brace_count = 0
    json_str = ""
    for i in range(start_idx, len(text)):
        char = text[i]
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
        
        json_str += char
        
        if brace_count == 0:
            # Found the end of the JSON object
            try:
                # Clean up potential markdown noise like ```json or whitespace
                cleaned_json = json_str.strip()
                return json.loads(cleaned_json)
            except json.JSONDecodeError:
                # If this specific block failed, keep searching for another candidate
                pass
    
    # Final fallback attempt if brace counting logic was somehow skipped or failed partially
    try:
        # Try finding markdown block as secondary
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
    except:
        pass

    return {}


def extract_think_block(text: str) -> tuple[str, str]:
    """
    Extract <think> block from response.
    Returns (thought_process, remaining_text)
    """
    think_start = text.find('<think>')
    think_end = text.find('</think>')
    
    if think_start != -1 and think_end != -1:
        thought = text[think_start + 7:think_end].strip()
        remaining = text[:think_start] + text[think_end + 8:]
        return thought, remaining
    elif think_start != -1:
        # Truncated think block
        thought = text[think_start + 7:].strip()
        return thought, ""
    
    return "", text


def get_deepseek_response(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: float = 0.0
) -> str:
    """Get response from DeepSeek-V3 via OpenAI SDK."""
    from openai import OpenAI
    
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise ValueError("DEEPSEEK_API_KEY not set in environment")
    
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com"
    )
    
    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})
    
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=messages,
        temperature=temperature,
        max_tokens=8192
    )
    
    return response.choices[0].message.content


def get_google_response(
    prompt: str,
    system_prompt: Optional[str] = None,
    temperature: float = 0.0
) -> str:
    """Get response from Google Gemini 1.5 Flash."""
    import google.generativeai as genai
    
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY not set in environment")
    
    genai.configure(api_key=api_key)
    
    # Safety settings - allow all content for profiling
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]
    
    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",  # Stable alias - always works
        safety_settings=safety_settings,
        generation_config={"temperature": temperature}
    )
    
    full_prompt = prompt
    if system_prompt:
        full_prompt = f"{system_prompt}\n\n{prompt}"
    
    response = model.generate_content(full_prompt)
    return response.text


def get_llm_response(
    prompt: str,
    provider: LLMProvider = LLMProvider.GOOGLE,
    temperature: float = 0.0,
    system_prompt: Optional[str] = None,
    fallback: bool = True
) -> str:
    """
    Unified LLM response function.
    
    Args:
        prompt: The user prompt
        provider: Which LLM provider to use
        temperature: Sampling temperature
        system_prompt: Optional system prompt
        fallback: If True, fall back to Google if DeepSeek fails
    
    Returns:
        LLM response text
    """
    try:
        if provider == LLMProvider.DEEPSEEK:
            print(f"INFO: Using DeepSeek-V3 for inference...")
            return get_deepseek_response(prompt, system_prompt, temperature)
        else:
            print(f"INFO: Using Gemini Flash (latest) for inference...")
            return get_google_response(prompt, system_prompt, temperature)
    
    except Exception as e:
        print(f"WARN: {provider.value} failed: {e}")
        
        if fallback and provider == LLMProvider.DEEPSEEK:
            print("INFO: Falling back to Gemini 1.5 Flash...")
            return get_google_response(prompt, system_prompt, temperature)
        
        raise
