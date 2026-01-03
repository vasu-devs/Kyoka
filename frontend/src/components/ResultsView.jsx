import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Shield, Brain, MessageSquare, Zap, Target, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsView = ({ profile, strategy, thoughtProcess, sources = [] }) => {
    const [activeTab, setActiveTab] = React.useState('analysis');
    const discData = [
        { subject: 'Dominance', A: profile.disc_scores?.dominance || 50, fullMark: 100 },
        { subject: 'Influence', A: profile.disc_scores?.influence || 50, fullMark: 100 },
        { subject: 'Steadiness', A: profile.disc_scores?.steadiness || 50, fullMark: 100 },
        { subject: 'Conscientiousness', A: profile.disc_scores?.conscientiousness || 50, fullMark: 100 },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            <div className="flex items-center gap-1 p-1 bg-white border border-black/10 w-fit mb-4 rounded-none">
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-none ${activeTab === 'analysis' ? 'bg-shinigami-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                    Tactical Analysis
                </button>
                <button
                    onClick={() => setActiveTab('intelligence')}
                    className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-none ${activeTab === 'intelligence' ? 'bg-shinigami-black text-white' : 'text-gray-400 hover:text-black'}`}
                >
                    Deep Intelligence
                </button>
            </div>

            {activeTab === 'analysis' ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Profile Card */}
                        <motion.div variants={item} className="bg-hueco-white border border-black/10 p-8 shadow-xl shadow-black/5">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-shinigami-black flex items-center gap-3 uppercase tracking-tighter">
                                    <Brain className="w-6 h-6 text-shinigami-black" />
                                    Behavioral Profile
                                </h3>
                                <div className="px-3 py-1 bg-black/5 border border-black/10 text-[9px] font-bold text-shinigami-black uppercase tracking-widest">
                                    {profile.archetype}
                                </div>
                            </div>

                            <div className="h-[320px] w-full mb-8 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={discData}>
                                        <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(0,0,0,0.8)', fontSize: 10, fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="DISC"
                                            dataKey="A"
                                            stroke="#7C3AED"
                                            strokeWidth={2}
                                            fill="#7C3AED"
                                            fillOpacity={0.2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-auto space-y-6">
                                <div className="relative p-6 bg-white border border-black/5 shadow-inner">
                                    <Quote className="absolute -top-3 -left-1 w-8 h-8 text-black/5" />
                                    <p className="text-sm leading-relaxed text-shinigami-black font-serif italic relative z-10 pl-4 border-l-2 border-hogyoku-purple">
                                        "{profile.profile_summary}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 border-b border-black/10 group hover:bg-gray-50 transition-colors">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Negotiation Leverage</span>
                                        <p className="text-sm font-bold text-shinigami-black">
                                            {profile.negotiation_strategy?.leverage_point}
                                        </p>
                                    </div>
                                    <div className="p-4 border-b border-black/10 group hover:bg-gray-50 transition-colors">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Primary Archetype</span>
                                        <p className="text-sm font-bold text-shinigami-black">
                                            {profile.archetype}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Strategy Card */}
                        <motion.div variants={item} className="bg-hueco-white border border-black/10 p-8 shadow-xl shadow-black/5 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-shinigami-black flex items-center gap-3 uppercase tracking-tighter">
                                    <Shield className="w-6 h-6 text-shinigami-black" />
                                    Strategic Protocol
                                </h3>
                                <Target className="w-5 h-5 text-gray-300" />
                            </div>

                            <div className="p-6 border border-black/5 shadow-inner flex-grow overflow-hidden flex flex-col bg-gray-50/50">
                                <div className="custom-scrollbar overflow-y-auto pr-4 text-sm leading-relaxed text-shinigami-black selection:bg-black selection:text-white">
                                    <div className="prose prose-slate prose-sm max-w-none prose-headings:font-serif prose-headings:text-shinigami-black prose-headings:uppercase prose-headings:tracking-widest prose-p:font-sans prose-p:text-gray-700">
                                        <ReactMarkdown>{strategy}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Psychological Triggers */}
                    <motion.div variants={item} className="bg-hueco-white border border-black/10 p-8 shadow-xl shadow-black/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2.5 bg-black/5 border border-black/10 rounded-none">
                                <Zap className="w-6 h-6 text-shinigami-black" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-shinigami-black uppercase tracking-tighter">Cognitive Leverage</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Psychological Triggers Detected</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {profile.psychological_triggers?.map((trigger, idx) => (
                                <div key={idx} className="relative overflow-hidden p-6 border-l-2 border-black/10 hover:border-hogyoku-purple bg-white transition-all group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <span className="text-4xl font-black text-black">0{idx + 1}</span>
                                    </div>
                                    <p className="relative z-10 text-sm font-bold text-shinigami-black leading-snug">
                                        {trigger}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-shinigami-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-google-green rounded-none" />
                                    Tactical Dos
                                </h4>
                                <ul className="space-y-2">
                                    {profile.negotiation_strategy?.do.map((task, i) => (
                                        <li key={i} className="text-xs font-bold text-shinigami-black border-b border-black/5 pb-2">
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-shinigami-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-none" />
                                    Tactical Donts
                                </h4>
                                <ul className="space-y-2">
                                    {profile.negotiation_strategy?.dont.map((task, i) => (
                                        <li key={i} className="text-xs font-bold text-gray-500 border-b border-black/5 pb-2">
                                            {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Internal Monologue */}
                        <div className="lg:col-span-2 bg-hueco-white border border-black/10 p-8 shadow-xl shadow-black/5 flex flex-col">
                            <h3 className="text-xl font-black text-shinigami-black flex items-center gap-3 uppercase tracking-tighter mb-8">
                                <Sparkles className="w-6 h-6 text-hogyoku-purple" />
                                Deep Reasoning Intelligence
                            </h3>
                            <div className="bg-gray-50 p-6 border border-black/5 shadow-inner">
                                <div className="custom-scrollbar h-[500px] overflow-y-auto pr-4 text-xs font-mono text-gray-500 leading-relaxed">
                                    <ReactMarkdown>{thoughtProcess}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Research Sources */}
                        <div className="bg-hueco-white border border-black/10 p-8 shadow-xl shadow-black/5 flex flex-col">
                            <h3 className="text-xl font-black text-shinigami-black flex items-center gap-3 uppercase tracking-tighter mb-8">
                                <Target className="w-6 h-6 text-shinigami-black" />
                                Intelligence Sources
                            </h3>
                            <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[500px] pr-2">
                                {sources.length > 0 ? sources.map((source, idx) => (
                                    <a
                                        key={idx}
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 border border-black/5 hover:border-black hover:bg-black hover:text-white transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-black/5 text-black group-hover:bg-white/10 group-hover:text-white">
                                                <Target className="w-4 h-4" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-gray-300 transition-colors">
                                                    Source 0{idx + 1}
                                                </p>
                                                <p className="text-xs truncate font-bold">
                                                    {source.replace('https://', '')}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No external sources cached.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ResultsView;
