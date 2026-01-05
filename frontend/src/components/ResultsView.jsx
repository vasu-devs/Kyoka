import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import RevealCard from './ui/RevealCard';
import { motion } from 'framer-motion';
import { ArrowUpRight, Dot, BookOpen, Link as LinkIcon, Target, Linkedin, Github, Twitter, Globe, Instagram, Youtube } from 'lucide-react';

const getPlatformIcon = (platform) => {
    if (!platform) return <Globe className="w-4 h-4" />;
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('github')) return <Github className="w-4 h-4" />;
    if (p.includes('twitter') || p.includes('x.com')) return <Twitter className="w-4 h-4" />;
    if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
};

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-10">
        <h3 className="text-2xl font-serif text-charcoal-900 mb-2">{title}</h3>
        {subtitle && <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal-900/40">{subtitle}</p>}
        <div className="w-12 h-[1px] bg-gold-400 mt-4" />
    </div>
);

const ResultsView = ({ profile, strategy, thoughtProcess, sources = [] }) => {
    if (!profile) return null;

    const discData = [
        { subject: 'Dominance', A: profile.disc_scores?.dominance || 50, fullMark: 100 },
        { subject: 'Influence', A: profile.disc_scores?.influence || 50, fullMark: 100 },
        { subject: 'Steadiness', A: profile.disc_scores?.steadiness || 50, fullMark: 100 },
        { subject: 'Conscientiousness', A: profile.disc_scores?.conscientiousness || 50, fullMark: 100 },
    ];

    return (
        <div className="space-y-32">
            {/* Executive Summary & DISC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                <RevealCard className="border-none shadow-none p-0 bg-transparent">
                    <SectionHeader title="Behavioral Archetype" subtitle={profile.archetype} />
                    <p className="text-lg leading-relaxed text-charcoal-900/80 font-serif italic border-l-2 border-charcoal-900/10 pl-6 py-2">
                        "{profile.profile_summary}"
                    </p>

                    <div className="mt-12 space-y-6">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-charcoal-900">Psychological Triggers</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {profile.psychological_triggers?.map((trigger, idx) => (
                                <div key={idx} className="p-4 border border-charcoal-900/10 text-sm text-charcoal-900/70 hover:bg-white hover:shadow-lg transition-all duration-500">
                                    0{idx + 1}. {trigger}
                                </div>
                            ))}
                        </div>
                    </div>
                </RevealCard>

                <RevealCard className="flex items-center justify-center bg-cream-100/50 rounded-full">
                    <div className="w-full h-[400px] relative p-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={discData}>
                                <PolarGrid stroke="#e5e5e5" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: '#121212', fontSize: 10, fontFamily: 'Satoshi, sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="DISC"
                                    dataKey="A"
                                    stroke="#121212"
                                    strokeWidth={1}
                                    fill="#121212"
                                    fillOpacity={0.05}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </RevealCard>
            </div>

            {/* Strategic Protocol */}
            <RevealCard>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4">
                        <SectionHeader title="Strategic Protocol" subtitle="Recommended Approach" />
                        <div className="space-y-8 mt-12">
                            <div>
                                <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-forest-900 mb-4 border-b border-forest-900/10 pb-2">Imperatives (Do)</h5>
                                <ul className="space-y-3">
                                    {profile.negotiation_strategy?.do?.map((task, i) => (
                                        <li key={i} className="text-sm text-charcoal-900/70 flex gap-3 items-start">
                                            <Dot className="w-4 h-4 text-forest-900 mt-0.5 shrink-0" /> {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-900 mb-4 border-b border-red-900/10 pb-2">Avoidance (Don't)</h5>
                                <ul className="space-y-3">
                                    {profile.negotiation_strategy?.dont?.map((task, i) => (
                                        <li key={i} className="text-sm text-charcoal-900/70 flex gap-3 items-start">
                                            <Dot className="w-4 h-4 text-red-900 mt-0.5 shrink-0" /> {task}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-8">
                        <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-normal prose-p:text-charcoal-900/70 prose-li:text-charcoal-900/70">
                            <ReactMarkdown>{strategy}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </RevealCard>

            {/* Socials & Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <RevealCard>
                    <SectionHeader title="Digital Footprint" subtitle="Identified Profiles" />
                    <div className="space-y-4">
                        {(profile.social_links || []).length > 0 ? (profile.social_links || []).map((link, idx) => (
                            <a
                                key={idx}
                                href={link?.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 border border-charcoal-900/10 hover:bg-cream-100 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-charcoal-900 group-hover:text-gold-400 transition-colors">
                                        {getPlatformIcon(link?.platform || 'Unknown')}
                                    </span>
                                    <span className="text-sm font-medium text-charcoal-900 uppercase tracking-wider">{link?.platform || 'Website'}</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-charcoal-900/40 group-hover:text-gold-400 transition-colors" />
                            </a>
                        )) : (
                            <div className="p-8 text-center border border-dashed border-charcoal-900/10">
                                <p className="text-xs text-charcoal-900/40 uppercase tracking-widest">No digital footprint detected.</p>
                            </div>
                        )}
                    </div>
                </RevealCard>

                <RevealCard>
                    <SectionHeader title="Intelligence Sources" subtitle="Raw Data Scraped" />
                    <div className="space-y-3 h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {(sources || []).length > 0 ? (sources || []).map((source, idx) => (
                            <a
                                key={idx}
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 border-b border-charcoal-900/5 hover:bg-cream-100 transition-colors"
                            >
                                <p className="text-xs text-charcoal-900 truncate font-mono opacity-70 hover:opacity-100 hover:text-gold-500 transition-all">
                                    {source}
                                </p>
                            </a>
                        )) : (
                            <div className="p-8 text-center border border-dashed border-charcoal-900/10">
                                <p className="text-xs text-charcoal-900/40 uppercase tracking-widest">No sources indexed.</p>
                            </div>
                        )}
                    </div>
                </RevealCard>
            </div>

            {/* Deep Reasoning */}
            <RevealCard className="bg-charcoal-900 text-cream-50">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-3">
                        <h3 className="text-2xl font-serif text-white mb-2">Deep Intelligence</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Raw Processing Log</p>
                        <div className="w-12 h-[1px] bg-white/20 mt-4" />
                    </div>
                    <div className="lg:col-span-9">
                        <div className="font-mono text-xs leading-relaxed text-white/60 h-[300px] overflow-y-auto custom-scrollbar pr-4">
                            <ReactMarkdown>{thoughtProcess}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            </RevealCard>
        </div>
    );
};

export default ResultsView;
