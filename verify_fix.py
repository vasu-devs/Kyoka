import sys
import os
import json
from dotenv import load_dotenv

# Add current directory to path so we can import backend
sys.path.append(os.getcwd())

# Load env vars
load_dotenv()

try:
    from backend.llm_provider import get_google_response
    print("✅ Successfully imported backend.llm_provider")
except ImportError as e:
    print(f"❌ Failed to import backend: {e}")
    sys.exit(1)

def test_json_mode():
    print("🧪 Testing Gemini JSON Mode...")
    
    prompt = """
    Generate a JSON object describing a fictional character.
    Schema:
    {
        "name": "string",
        "role": "string",
        "attributes": ["string"]
    }
    """
    
    try:
        response = get_google_response(prompt, temperature=0.7)
        print(f"📄 Raw Response: {response}")
        
        # Try validation
        data = json.loads(response)
        print("✅ Response is valid JSON!")
        print(json.dumps(data, indent=2))
        return True
    except json.JSONDecodeError:
        print("❌ Response is NOT valid JSON.")
        return False
    except Exception as e:
        print(f"❌ API Call failed: {e}")
        return False

if __name__ == "__main__":
    if test_json_mode():
        print("\n🎉 Verification SUCCESS")
        sys.exit(0)
    else:
        print("\n💥 Verification FAILED")
        sys.exit(1)
