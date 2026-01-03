import React, { useState } from 'react';
import Layout from './components/Layout';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import ChatSimulator from './components/ChatSimulator';
import { analyzeProfile } from './lib/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [strategyDoc, setStrategyDoc] = useState('');
  const [thoughtProcess, setThoughtProcess] = useState('');
  const [logs, setLogs] = useState([]);
  const [sources, setSources] = useState([]);
  const [targetName, setTargetName] = useState('');
  const [meetingContext, setMeetingContext] = useState('');

  const handleAnalysis = async ({ name, context }) => {
    setLoading(true);
    setLogs(["📡 Establishing connection to intelligence core..."]);
    setTargetName(name);
    setMeetingContext(context);
    setProfileData(null);
    
    try {
      // Use EventSource for real-time streaming
      const url = `/api/analyze/stream?name=${encodeURIComponent(name)}&context=${encodeURIComponent(context)}`;
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        
        if (payload.type === 'status') {
          setLogs(prev => [...prev, payload.data]);
        } else if (payload.type === 'final') {
          const data = payload.data;
          setProfileData(data.profile);
          setStrategyDoc(data.strategy);
          setThoughtProcess(data.thought_process);
          setSources(data.sources || []);
          eventSource.close();
          setLoading(false);
        } else if (payload.type === 'error') {
          console.error("Analysis stream error:", payload.data);
          alert(`Analysis failed: ${payload.data}`);
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
      alert("Failed to connect to the intelligence server.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      {!profileData ? (
        <div className="py-10">
           <div className="text-center mb-10 space-y-4">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                Decode Psychology. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue to-purple-500">
                  Win Every Interaction.
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Stop guessing. Start knowing who you're dealing with using advanced AI behavioral profiling and real-time conversation simulation.
              </p>
           </div>
           
           <InputForm onSubmit={handleAnalysis} loading={loading} logs={logs} />
        </div>
      ) : (
        <div className="space-y-12 pb-20">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold border-l-4 border-google-green pl-4">
               Analysis Results: <span className="text-google-blue">{targetName}</span>
             </h2>
             <button 
                onClick={() => setProfileData(null)}
                className="text-sm text-gray-400 hover:text-white transition-colors underline"
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

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-l-4 border-purple-500 pl-4">
               <span className="text-purple-400">Live Simulator</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 space-y-4">
                  <div className="glass-card p-6">
                     <h4 className="font-semibold text-white mb-2">Simulation Context</h4>
                     <p className="text-sm text-gray-400">{meetingContext}</p>
                  </div>
                  <div className="glass-card p-6 border-l-2 border-google-yellow">
                     <h4 className="font-semibold text-white mb-2">Pro Tip</h4>
                     <p className="text-sm text-gray-400">
                       Use the psychological triggers found in the profile to steer the conversation.
                     </p>
                  </div>
               </div>
               <div className="lg:col-span-2">
                  <ChatSimulator 
                    targetName={targetName} 
                    context={meetingContext} 
                    profile={profileData} 
                  />
               </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;
