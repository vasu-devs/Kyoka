import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-google-blue/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-google-red/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-google-yellow/5 blur-[80px] rounded-full animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-16 px-4 py-6 glass-card border-white/5 bg-white/5 shadow-none">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-google-blue via-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-google-blue/20 ring-1 ring-white/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                The Mentalist
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-google-blue/20 text-google-blue border border-google-blue/30 uppercase">PRO</span>
              </h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">
                Deep Psychology Profiler & Strategist
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 shadow-inner">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-google-green"></span>
              </span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">System Active</span>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-google-yellow" />
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-none">Gemini 1.5 Flash</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
