import os
import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

load_dotenv(r"e:\FoodNestt\kyoka\.env")

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    print("❌ No GROQ_API_KEY")
    exit(1)

print("⚡ Testing Groq (llama-3.3-70b-versatile)...")
start = time.time()
try:
    chat = ChatGroq(
        model_name="llama-3.3-70b-versatile",
        groq_api_key=api_key,
        temperature=0.7
    )
    response = chat.invoke([HumanMessage(content="Say 'Groq is active' in 3 words.")])
    end = time.time()
    print(f"✅ Response: {response.content}")
    print(f"⏱️ Time taken: {end - start:.2f}s")
except Exception as e:
    print(f"❌ Groq Failed: {e}")
