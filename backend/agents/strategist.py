import os
from typing import Dict, Any, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import time
from google.api_core.exceptions import ResourceExhausted

class MeetingStrategist:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the MeetingStrategist with a Google API key.
        """
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            # Using standard Gemini Pro or Flash as Strategist
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash-lite", 
                google_api_key=self.api_key,
                temperature=0.7
            )
        else:
            self.llm = None

    def generate_strategy(self, profile_data: Dict[str, Any], meeting_purpose: str) -> str:
        """
        Generates a strategic 'Battle Card'.
        """
        if not self.llm:
            raise ValueError("Google API key is not set. Please provide it.")

        template = """
        You are a Headhunter. Write a 'Battle Card'.
        
        TONE: Ruthless, Direct, Anti-Fluff.
        RULE: If the user is an Engineer, do NOT say 'Thank you for this opportunity'. Say 'Saw your repo, X is broken'.
        
        TARGET PROFILE:
        - DISC Type: {disc_type}
        - Communication Style: {communication_style}
        - Triggers: {triggers}
        - Summary: {summary}
        
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
        
        prompt = PromptTemplate(
            template=template,
            input_variables=["disc_type", "communication_style", "triggers", "summary", "meeting_purpose"]
        )
        
        chain = prompt | self.llm | StrOutputParser()
        
        try:
            strategy = ""
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    strategy = chain.invoke({
                        "disc_type": profile_data.get("disc_type", "Unknown"),
                        "communication_style": profile_data.get("communication_style", "Unknown"),
                        "triggers": ", ".join(profile_data.get("psychological_triggers", [])),
                        "summary": profile_data.get("summary", ""),
                        "meeting_purpose": meeting_purpose
                    })
                    break
                except ResourceExhausted:
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(5 * (attempt + 1))
            return strategy
        except Exception as e:
            return f"Error generating strategy: {e}"
