import React, { useState } from 'react';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import ChatSimulator from './components/ChatSimulator';
import RevealCard from './components/ui/RevealCard';
import { motion } from 'framer-motion';

function App() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [strategyDoc, setStrategyDoc] = useState('');
  const [thoughtProcess, setThoughtProcess] = useState('');
  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [targetName, setTargetName] = useState('');
  const [meetingContext, setMeetingContext] = useState('');

  // Scroll to top when results are loaded
  React.useEffect(() => {
    if (profileData) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [profileData]);

  const handleAnalysis = async ({ name, context }) => {
    setLoading(true);
    setLogs(["Initializing behavioral lexicon...", "Accessing open-source intelligence...", "Synthesizing psychological profile..."]);
    setTargetName(name);
    setMeetingContext(context);
    setProfileData(null);

    // Simulation of streaming for now or standard fetch structure, keeping consistent with logic
    // We will assume existing logic works, just replacing UI wrapper

    try {
      const url = `/api/analyze/stream?name=${encodeURIComponent(name)}&context=${encodeURIComponent(context)}`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.type === 'status') {
          setLogs(prev => [...prev.slice(-4), payload.data]); // Keep only last few logs
        } else if (payload.type === 'final') {
          const data = payload.data;
          setProfileData(data.profile);
          setStrategyDoc(data.strategy);
          setThoughtProcess(data.thought_process);
          setSources(data.sources || []);
          eventSource.close();
          setLoading(false);
        } else if (payload.type === 'error') {
          console.error("Stream error:", payload.data);
          eventSource.close();
          setLoading(false);
        }
      };
      eventSource.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.close();
        setLoading(false);
      };

    } catch (error) {
      console.error("Analysis failed:", error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      {!profileData ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full text-center">
          <RevealCard className="border-none shadow-none bg-transparent p-0 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-serif text-charcoal-900 mb-6 tracking-tight leading-[0.9]">
              The Art of <br />
              <span className="italic text-gold-400">Persuasion</span>
            </h1>
            <p className="text-sm md:text-base text-charcoal-900/60 max-w-lg mx-auto leading-relaxed mb-12">
              Advanced behavioral profiling and negotiation intelligence. <br />
              Understand your counterpart before you even say hello.
            </p>

            <div className="max-w-xl mx-auto w-full">
              <InputForm onSubmit={handleAnalysis} loading={loading} logs={logs} />
            </div>
          </RevealCard>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-24 py-12"
        >
          {/* Header Section for Results */}
          <div className="flex flex-col md:flex-row items-end justify-between border-b border-charcoal-900/10 pb-8">
            <div>
              <h2 className="text-4xl font-serif text-charcoal-900 mb-2">{targetName}</h2>
              <p className="text-xs uppercase tracking-[0.2em] text-charcoal-900/50">Comprehensive Behavioral Dossier</p>
            </div>
            <button
              onClick={() => setProfileData(null)}
              className="mt-6 md:mt-0 text-xs font-bold uppercase tracking-widest border-b border-transparent hover:border-charcoal-900 transition-all"
            >
              Start New Analysis
            </button>
          </div>

          <ResultsView
            profile={profileData}
            strategy={strategyDoc}
            thoughtProcess={thoughtProcess}
            sources={sources}
          />

          {/* Simulator Section */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-8">
              <div>
                <h3 className="font-serif text-2xl mb-4">Simulation</h3>
                <p className="text-sm text-charcoal-900/70 leading-relaxed">
                  Practice your approach in a safe, AI-driven environment configured to mimic {targetName}'s psychological profile.
                </p>
              </div>
              <div className="p-6 bg-white border border-charcoal-900/5">
                <h4 className="text-[10px] uppercase tracking-widest text-charcoal-900/40 mb-4">Context</h4>
                <p className="text-sm italic text-charcoal-900 font-serif">"{meetingContext}"</p>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ChatSimulator
                targetName={targetName}
                context={meetingContext}
                profile={profileData}
              />
            </div>
          </section>
        </motion.div>
      )}
    </Layout>
  );
}

export default App;
