import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Shield, Brain, MessageSquare, Zap, Target, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultsView = ({ profile, strategy, thoughtProcess, sources = [] }) => {
    const [activeTab, setActiveTab] = React.useState('analysis');
    const discData = [
        { subject: 'Dominance', A: profile.disc_scores?.D || 5, fullMark: 10 },
        { subject: 'Influence', A: profile.disc_scores?.I || 5, fullMark: 10 },
        { subject: 'Steadiness', A: profile.disc_scores?.S || 5, fullMark: 10 },
        { subject: 'Conscientiousness', A: profile.disc_scores?.C || 5, fullMark: 10 },
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
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-2xl w-fit mb-4">
                <button
                    onClick={() => setActiveTab('analysis')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'analysis' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Tactical Analysis
                </button>
                <button
                    onClick={() => setActiveTab('intelligence')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'intelligence' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    Deep Intelligence
                </button>
            </div>

            {activeTab === 'analysis' ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Profile Card */}
                        <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-google-blue shadow-google-blue/5 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                    <Brain className="w-6 h-6 text-google-blue" />
                                    Behavioral Profile
                                </h3>
                                <div className="px-3 py-1 rounded-full bg-google-blue/10 border border-google-blue/20 text-[10px] font-black text-google-blue uppercase tracking-widest">
                                    {profile.disc_type} Persona
                                </div>
                            </div>

                            <div className="h-[320px] w-full mb-8 relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-google-blue/5 to-transparent rounded-full blur-3xl opacity-30" />
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={discData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 800 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                        <Radar
                                            name="DISC"
                                            dataKey="A"
                                            stroke="var(--google-blue)"
                                            strokeWidth={3}
                                            fill="var(--google-blue)"
                                            fillOpacity={0.2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-auto space-y-6">
                                <div className="relative p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                                    <Quote className="absolute -top-3 -left-1 w-8 h-8 text-google-blue/20" />
                                    <p className="text-sm leading-relaxed text-gray-300 font-medium italic">
                                        "{profile.summary}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-colors">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Communication</span>
                                        <p className="text-sm font-bold text-white group-hover:text-google-blue transition-colors">
                                            {profile.communication_style}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.05] transition-colors">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1.5">Primary Archetype</span>
                                        <p className="text-sm font-bold text-white group-hover:text-google-blue transition-colors">
                                            {profile.disc_type}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Strategy Card */}
                        <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-google-red shadow-google-red/5 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                    <Shield className="w-6 h-6 text-google-red" />
                                    Strategic Protocol
                                </h3>
                                <Target className="w-5 h-5 text-google-red/40" />
                            </div>

                            <div className="p-6 rounded-2xl bg-[#080A0E] border border-white/5 shadow-inner flex-grow overflow-hidden flex flex-col">
                                <div className="custom-scrollbar overflow-y-auto pr-4 text-sm leading-relaxed text-gray-300 selection:bg-google-red/20">
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: strategy.replace(/\n/g, '<br/>') }} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Psychological Triggers */}
                    <motion.div variants={item} className="glass-card p-8 border-t-4 border-t-google-yellow shadow-google-yellow/5">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-2.5 rounded-xl bg-google-yellow/10 border border-google-yellow/20">
                                <Zap className="w-6 h-6 text-google-yellow" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Cognitive Leverage</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Psychological Triggers Detected</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.psychological_triggers?.map((trigger, idx) => (
                                <div key={idx} className="relative overflow-hidden p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-google-yellow/30 hover:bg-white/[0.04] transition-all group">
                                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                                        <span className="text-4xl font-black text-google-yellow">0{idx + 1}</span>
                                    </div>
                                    <p className="relative z-10 text-sm font-bold text-gray-200 leading-snug">
                                        {trigger}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Internal Monologue */}
                        <div className="lg:col-span-2 glass-card p-8 border-t-4 border-t-purple-500 flex flex-col">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter mb-8">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                Deep Reasoning Intelligence
                            </h3>
                            <div className="bg-[#080A0E] rounded-2xl p-6 border border-white/5 shadow-inner">
                                <div className="custom-scrollbar h-[500px] overflow-y-auto pr-4 text-sm font-mono text-purple-200/70 leading-relaxed whitespace-pre-wrap">
                                    {thoughtProcess}
                                </div>
                            </div>
                        </div>

                        {/* Research Sources */}
                        <div className="glass-card p-8 border-t-4 border-t-google-green flex flex-col">
                            <h3 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter mb-8">
                                <Target className="w-6 h-6 text-google-green" />
                                Intelligence Sources
                            </h3>
                            <div className="space-y-4 custom-scrollbar overflow-y-auto max-h-[500px] pr-2">
                                {sources.length > 0 ? sources.map((source, idx) => (
                                    <a
                                        key={idx}
                                        href={source}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-google-green/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-google-green/10 text-google-green">
                                                <Target className="w-4 h-4" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-google-green transition-colors">
                                                    Source 0{idx + 1}
                                                </p>
                                                <p className="text-xs text-white truncate font-medium">
                                                    {source.replace('https://', '')}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-sm text-gray-500">No external sources cached.</p>
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
