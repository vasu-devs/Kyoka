import os
from dotenv import load_dotenv

# Load explicitly from the path we know
load_dotenv(r"e:\FoodNestt\kyoka\.env")

groq = os.getenv("GROQ_API_KEY")
google = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

print(f"GROQ_API_KEY present: {bool(groq)}")
if groq:
    print(f"GROQ_API_KEY length: {len(groq)}")
    # Print first few chars to verify it's not "None" string
    print(f"GROQ_API_KEY prefix: {groq[:4]}...")

print(f"GOOGLE_API_KEY present: {bool(google)}")
if google:
    print(f"GOOGLE_API_KEY length: {len(google)}")

# Check what main.py sees
import sys
# sys.path.append("e:\\FoodNestt\\kyoka")
# from backend.main import GOOGLE_API_KEY as MAIN_GOOGLE, app
# actually, better to just check env var reading 
