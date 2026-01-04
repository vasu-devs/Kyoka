import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("❌ No API Key")
    exit(1)

model_names = ["gemini-1.5-flash", "models/gemini-1.5-flash", "gemini-flash-latest", "models/gemini-flash-latest"]

for model in model_names:
    print(f"Testing model: {model}")
    try:
        llm = ChatGoogleGenerativeAI(model=model, google_api_key=api_key)
        res = llm.invoke([HumanMessage(content="Hello")])
        print(f"✅ Success with {model}: {res.content}")
        break
    except Exception as e:
        print(f"❌ Failed with {model}: {e}")
