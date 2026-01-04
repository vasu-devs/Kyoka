import requests
import json
import sys

url = "http://localhost:8000/chat"

payload = {
    "target_name": "Test Target",
    "context": "Negotiation",
    "profile": {
        "simulation_prompt": "You are a helpful assistant.",
        "profile_summary": "Summary of the person.",
        "psychological_triggers": ["Politeness"],
        "archetype": "Helper"
    },
    "history": [
        {"role": "user", "content": "Hello"}
    ]
}

try:
    print(f"📡 sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Chat success")
    else:
        print("❌ Chat failed")
        sys.exit(1)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
