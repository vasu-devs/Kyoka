import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-hueco-white text-shinigami-black overflow-x-hidden selection:bg-hogyoku-purple selection:text-white">
      {/* Dynamic Background - The Void */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-hogyoku-purple/5 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-hogyoku-indigo/5 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-2s' }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        {/* Header - Shattered Glass */}
        <div className="flex items-center justify-between mb-16 px-6 py-6 shattered-glass border-b border-black/10">
          <div className="flex items-center space-x-6">
            <div className="p-3 bg-shinigami-black text-white rounded-none shadow-2xl shadow-hogyoku-purple/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-black tracking-tighter text-shinigami-black uppercase flex items-center gap-2">
                Kyoka Suigetsu
                <span className="text-[9px] font-bold px-2 py-0.5 bg-shinigami-black text-white border border-black uppercase tracking-[0.2em]">PRO</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1 ml-1">
                Complete Hypnosis Intelligence
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 px-6 py-3 border border-black/10 bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-hogyoku-purple opacity-75"></span>
                <span className="relative inline-flex rounded-none h-2 w-2 bg-hogyoku-purple rotate-45"></span>
              </span>
              <span className="text-[9px] font-bold text-shinigami-black uppercase tracking-[0.2em]">Awakened</span>
            </div>
            <div className="h-4 w-[1px] bg-black/10" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-hogyoku-purple" />
              <span className="text-[9px] font-bold text-shinigami-black uppercase tracking-[0.2em] leading-none">Hogyoku Core</span>
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
