import sys
import os
import io
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ProfileRequest, ProfileResponse, ChatRequest, ChatMessage
from .agents.researcher import DeepResearchAgent
from .agents.profiler import PsychProfiler
from .agents.strategist import MeetingStrategist
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

# Force UTF-8 encoding for stdout/stderr to prevent 'charmap' errors on Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Verify critical API keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("❌ WARNING: GOOGLE_API_KEY is missing in .env! Features will fail.")
elif len(GOOGLE_API_KEY) < 10:
    print("⚠️ WARNING: GOOGLE_API_KEY looks invalid (too short).")

app = FastAPI(title="The Mentalist API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import StreamingResponse
import json
import asyncio

async def analysis_generator(name: str, context: str):
    """Generator for streaming analysis progress and final result."""
    google_api_key = os.getenv("GOOGLE_API_KEY")
    tavily_api_key = os.getenv("TAVILY_API_KEY")
    
    queue = asyncio.Queue()

    def status_callback(msg):
        # We use a thread-safe way to put items into the queue
        loop.call_soon_threadsafe(queue.put_nowait, {"type": "status", "data": msg})

    loop = asyncio.get_event_loop()

    # 1. Start Research in a thread
    async def run_pipeline():
        try:
            status_callback("⚡ Initializing Deep Intelligence Scan...")
            researcher = DeepResearchAgent(tavily_api_key=tavily_api_key)
            
            # This is sync, so we run it in a thread
            research_results = await asyncio.to_thread(
                researcher.run_deep_search, 
                name=name, 
                context=context, 
                status_callback=status_callback
            )
            
            status_callback("🧠 Constructing Behavioral Neural Matrix...")
            profiler = PsychProfiler(api_key=google_api_key)
            analysis_result = await asyncio.to_thread(
                profiler.analyze_psychology, 
                text_data=research_results["text"],
                name=name,
                context=context
            )
            
            status_callback("🎯 Generating Strategic Tactical Protocol...")
            strategist = MeetingStrategist(api_key=google_api_key)
            strategy_doc = await asyncio.to_thread(
                strategist.generate_strategy,
                profile_data=analysis_result["profile"],
                meeting_purpose=context
            )
            
            final_data = {
                "type": "final",
                "data": {
                    "profile": analysis_result["profile"],
                    "thought_process": analysis_result.get("thought_process", ""),
                    "strategy": strategy_doc,
                    "sources": research_results.get("sources", [])
                }
            }
            await queue.put(final_data)
        except Exception as e:
            await queue.put({"type": "error", "data": str(e)})
        finally:
            await queue.put(None) # Signal end

    asyncio.create_task(run_pipeline())

    while True:
        item = await queue.get()
        if item is None:
            break
        yield f"data: {json.dumps(item)}\n\n"

@app.get("/analyze/stream")
async def analyze_profile_stream(name: str, context: str):
    return StreamingResponse(analysis_generator(name, context), media_type="text/event-stream")

@app.post("/analyze", response_model=ProfileResponse)
async def analyze_profile(req: ProfileRequest):
    # Keep legacy endpoint for compatibility if needed, but we'll use stream in frontend
    try:
        google_api_key = os.getenv("GOOGLE_API_KEY")
        tavily_api_key = os.getenv("TAVILY_API_KEY")
        
        researcher = DeepResearchAgent(tavily_api_key=tavily_api_key)
        research_results = researcher.run_deep_search(name=req.name, context=req.context)
        
        profiler = PsychProfiler(api_key=google_api_key)
        analysis_result = profiler.analyze_psychology(
            text_data=research_results["text"],
            name=req.name,
            context=req.context
        )
        
        strategist = MeetingStrategist(api_key=google_api_key)
        strategy_doc = strategist.generate_strategy(
            profile_data=analysis_result["profile"],
            meeting_purpose=req.context
        )
        
        return ProfileResponse(
            profile=analysis_result["profile"],
            thought_process=analysis_result.get("thought_process", ""),
            strategy=strategy_doc,
            sources=research_results.get("sources", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_simulation(req: ChatRequest):
    try:
        print(f"DEBUG: Chat simulation requested for {req.target_name}")
        groq_api_key = os.getenv("GROQ_API_KEY")
        google_api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        
        # Determine simulation prompt and persona
        profile = req.profile
        simulation_prompt = profile.get('simulation_prompt', "Act as the persona described in the psychology profile.")
        
        system_prompt = f"""
        KYOKA SIMULATION ACTIVE.
        
        {simulation_prompt}

        --- PSYCHOLOGICAL BASELINE ---
        {profile.get('profile_summary', '')}
        
        --- CONTEXT ---
        You are replying to a message regarding: {req.context}
        
        --- CRITICAL INSTRUCTIONS ---
        1. SUSTAIN THE PERSONA.
        2. Do not reveal you are an AI or part of KYOKA.
        """
        
        messages = [SystemMessage(content=system_prompt)]
        for msg in req.history:
            if msg.role == "user":
                messages.append(HumanMessage(content=msg.content))
            else:
                messages.append(HumanMessage(content=f"(You previously said): {msg.content}"))

        if groq_api_key:
            try:
                print("DEBUG: Using Groq (Llama 3.3) for simulation")
                sim_llm = ChatGroq(
                    model_name="llama-3.3-70b-versatile",
                    groq_api_key=groq_api_key,
                    temperature=0.8
                )
                response = sim_llm.invoke(messages)
                return {"content": response.content}
            except Exception as e:
                print(f"WARN: Groq failed: {e}. Falling back to Gemini.")
        
        if google_api_key:
            print("DEBUG: Using Gemini for simulation fallback")
            from langchain_google_genai import ChatGoogleGenerativeAI
            sim_llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=google_api_key,
                temperature=0.8
            )
            response = sim_llm.invoke(messages)
            return {"content": response.content}
            
        raise HTTPException(status_code=400, detail="No LLM provider available for chat.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
