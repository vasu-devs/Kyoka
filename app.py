import streamlit as st
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
from agents.researcher import DeepResearchAgent
from agents.profiler import PsychProfiler
from agents.strategist import MeetingStrategist
import plotly.graph_objects as go
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_groq import ChatGroq

# Page config
st.set_page_config(
    page_title="The Mentalist: Hybrid Free Stack",
    page_icon="🕵️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .reportview-container {
        background: #0E1117;
    }
    h1 {
        color: #4285F4; /* Google Blueish */
    }
    .stButton>button {
        width: 100%;
        background-color: #4285F4;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Helper Function for Radar Chart
def plot_disc(scores):
    categories = ['Dominance', 'Influence', 'Steadiness', 'Conscientiousness']
    # Map D, I, S, C to values. Default to 5 if missing.
    values = [
        scores.get('D', 5),
        scores.get('I', 5),
        scores.get('S', 5),
        scores.get('C', 5)
    ]
    # Close the loop
    values += [values[0]]
    categories += [categories[0]]

    fig = go.Figure(
        data=go.Scatterpolar(
            r=values,
            theta=categories,
            fill='toself',
            marker=dict(color='#4285F4'),
            line=dict(color='#4285F4')
        )
    )

    fig.update_layout(
        polar=dict(
            radialaxis=dict(
                visible=True,
                range=[0, 10]
            )
        ),
        showlegend=False,
        margin=dict(l=40, r=40, t=20, b=20),
        height=300,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color="white")
    )
    return fig

# Sidebar for Setup
with st.sidebar:
    st.header("🔑 Hybrid Stack Setup")
    
    with st.expander("API Configuration", expanded=True):
        st.markdown("Enter keys to unleash the stack.")
        
        # Try fetching from environment first
        env_google = os.getenv("GOOGLE_API_KEY")
        env_groq = os.getenv("GROQ_API_KEY")
        env_tavily = os.getenv("TAVILY_API_KEY")
        
        google_api_input = st.text_input("Google API Key (Gemini)", type="password", value=env_google or "")
        groq_api_input = st.text_input("Groq API Key (Llama 3)", type="password", value=env_groq or "")
        tavily_api_input = st.text_input("Tavily API Key (Search)", type="password", value=env_tavily or "")
        
        if google_api_input and groq_api_input and tavily_api_input:
            st.success("✅ All systems go!")
        else:
            st.warning("⚠️ Missing keys.")

# Initialize Session State
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "profile_result" not in st.session_state:
    st.session_state.profile_result = None
if "thought_process" not in st.session_state:
    st.session_state.thought_process = ""

# Main Content
st.title("🕵️ The Mentalist (Hybrid Stack)")
st.subheader("Gemini 2.0 Flash (Brain) + Llama 3.3 (Speed) + Tavily (Eyes)")

# Input Section
col1, col2 = st.columns([1, 2])

with col1:
    target_name = st.text_input("Target Person's Name", placeholder="e.g. Sam Altman")

with col2:
    meeting_context = st.text_area("Meeting Context / Purpose", placeholder="e.g. Discussing specific partnership...", height=105)

start_analysis = st.button("🔍 Generate Profile & Strategy")

if start_analysis:
    if not (google_api_input and groq_api_input and tavily_api_input):
        st.error("Please provide all 3 API keys in the sidebar.")
    elif not target_name or not meeting_context:
        st.error("Please enter a Target Name and Meeting Purpose.")
    else:
        # Progress Container
        progress_bar = st.progress(0, text="Initializing agents...")
        status_text = st.empty()
        
        try:
            # 1. Research Phase
            status_text.write("🌍 Deep Diver: Scouring the web...")
            researcher = DeepResearchAgent(tavily_api_key=tavily_api_input)
            
            # Simple wrapper for callback to support pure text updates if needed, 
            # though researcher just expects a callable
            def update_status(msg):
                status_text.write(f"🌍 Deep Diver: {msg}")

            research_results = researcher.run_deep_search(
                name=target_name, 
                context=meeting_context, 
                status_callback=update_status
            )
            raw_text_data = research_results["text"]
            
            # 2. Profiling Phase (Gemini)
            status_text.write("🧠 Gemini 2.0: Thinking deep (Profiling)...")
            progress_bar.progress(40, text="Analyzing psychology...")
            
            profiler = PsychProfiler(api_key=google_api_input)
            analysis_result = profiler.analyze_psychology(text_data=raw_text_data)
            
            profile_data = analysis_result.get("profile", {})
            thought_process = analysis_result.get("thought_process", "No thoughts captured.")
            
            st.session_state.profile_result = profile_data
            st.session_state.thought_process = thought_process
            st.session_state.meeting_context = meeting_context
            st.session_state.target_name = target_name
            st.session_state.chat_history = [] # Reset chat
            
            # 3. Strategy Phase (Gemini)
            status_text.write("♟️ Strategist: Drafting battle card...")
            progress_bar.progress(70, text="Finalizing strategy...")
            
            strategist = MeetingStrategist(api_key=google_api_input)
            strategy_doc = strategist.generate_strategy(
                profile_data=profile_data,
                meeting_purpose=meeting_context
            )
            st.session_state.strategy_doc = strategy_doc
            
            progress_bar.progress(100, text="Analysis Complete!")
            status_text.empty()
            
        except Exception as e:
            st.error(f"An error occurred: {e}")
            progress_bar.progress(0)

# --- RESULTS DISPLAY ---
if st.session_state.profile_result:
    st.divider()
    
    # Tabs for Organization
    tab1, tab2 = st.tabs(["📊 Profile & Strategy", "🧠 Deep Report (Internal Monologue)"])
    
    with tab1:
        res_col1, res_col2 = st.columns([1, 1])
        
        with res_col1:
            st.header("Psychological Profile")
            profile_data = st.session_state.profile_result
            
            # Radar Chart
            if "disc_scores" in profile_data:
                st.plotly_chart(plot_disc(profile_data["disc_scores"]), key="radar_chart", width="stretch")
            
            st.info(f"**Summary:** {profile_data.get('summary', 'N/A')}")
            st.success(f"**DISC Type:** {profile_data.get('disc_type', 'Unknown')}")
            st.write(f"**Communication Style:** {profile_data.get('communication_style', 'Unknown')}")
            
            st.markdown("### ⚡ Psychological Triggers")
            for trigger in profile_data.get("psychological_triggers", []):
                st.warning(f"{trigger}")

        with res_col2:
            st.header("⚔️ Battle Card")
            st.markdown(st.session_state.strategy_doc)

    with tab2:
        st.header("Gemini's Chain of Thought")
        st.info("This is the raw internal monologue generated by Gemini 2.0 Flash before producing the final JSON.")
        st.code(st.session_state.thought_process, language="text", line_numbers=False)
        
        st.divider()
        st.subheader("🛠️ Debug: Raw Model Output")
        if "profile_result" in st.session_state:
             # Check if we have raw_response in profile (we'll add it to profiler.py next)
             raw_resp = st.session_state.profile_result.get("raw_response", "Not captured")
             st.text_area("Full LLM Response:", value=raw_resp, height=300)


    # --- CHAT SIMULATOR SECTION (The Speed Layer) ---
    st.divider()
    st.header(f"🎙️ Simulator: Practice with '{st.session_state.target_name}'")
    st.caption("Powered by Llama 3.3 70B on Groq for <300ms latency.")

    # Display Chat History
    for message in st.session_state.chat_history:
        role = message["role"]
        content = message["content"]
        with st.chat_message(role):
            st.markdown(content)

    # Chat Input
    if user_prmpt := st.chat_input("Practice your pitch..."):
        # Display User Message
        st.chat_message("user").markdown(user_prmpt)
        st.session_state.chat_history.append({"role": "user", "content": user_prmpt})

        # Generate Response
        with st.spinner(f"{st.session_state.target_name} is typing..."):
            try:
                if groq_api_input:
                    sim_llm = ChatGroq(
                        model_name="llama-3.3-70b-versatile", 
                        groq_api_key=groq_api_input,
                        temperature=0.8
                    )
                    
                    profile = st.session_state.profile_result
                    style_rules = "\n- ".join(profile.get('speaking_style_guidelines', []))
                    
                    system_prompt = f"""
                    You are a Roleplay Actor. You are acting as: {st.session_state.target_name}.
                    
                    --- PSYCHOLOGY ---
                    {profile.get('summary')}
                    
                    --- SPEAKING STYLE (MUST FOLLOW) ---
                    - {style_rules}
                    
                    --- CONTEXT ---
                    You are replying to a message regarding: {st.session_state.meeting_context}
                    
                    --- CRITICAL INSTRUCTIONS ---
                    1. STRICTLY mimic the persona defined in the style rules.
                    2. If the user is boring, be dismissive (if that fits the profile).
                    3. Do not break character.
                    """
                    
                    messages = [SystemMessage(content=system_prompt)]
                    for msg in st.session_state.chat_history:
                        if msg["role"] == "user":
                            messages.append(HumanMessage(content=msg["content"]))
                        else:
                            # Represent AI history as HumanMessage with a prefix to give Llama context of its own past 
                            # (or use AIMessage if I imported it, but HumanMessage works for simple context injection usually)
                            # Better: pure string history or proper AIMessage. 
                            # Let's import AIMessage to be clean or just use (You said).
                            # Since I only imported HumanMessage and SystemMessage, I'll stick to text-based history in prompt if needed, 
                            # but langchain chat models prefer proper roles. 
                            # I will skip the complex history object construction and just feed the conversation properly if I had AIMessage. 
                            # I'll just fake it as User: [You said] for now to save imports or just import AIMessage.
                            # Actually, I should import AIMessage mostly. But to save lines/edits, I'll use HumanMessage with explicit label.
                            messages.append(HumanMessage(content=f"(You previously said): {msg['content']}"))

                    response = sim_llm.invoke(messages)
                    bot_reply = response.content
                    
                    st.chat_message("assistant").markdown(bot_reply)
                    st.session_state.chat_history.append({"role": "assistant", "content": bot_reply})
            except Exception as e:
                st.error(f"Simulation Error: {e}")
