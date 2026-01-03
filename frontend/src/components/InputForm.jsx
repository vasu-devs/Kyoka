import React, { useState } from 'react';
import { Search, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputForm = ({ onSubmit, loading, logs = [] }) => {
    const [name, setName] = useState('');
    const [context, setContext] = useState('');
    const terminalRef = React.useRef(null);

    React.useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && context) {
            onSubmit({ name, context });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto"
        >
            <div className="glass-card p-10 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/10 blur-3xl -mr-16 -mt-16 group-hover:bg-google-blue/20 transition-colors" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-google-red/10 blur-3xl -ml-16 -mb-16 group-hover:bg-google-red/20 transition-colors" />

                <div className="relative flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                        <Search className="w-8 h-8 text-google-blue" />
                        <span>Intelligence Input</span>
                    </h2>
                    <Sparkles className="w-5 h-5 text-google-yellow/40" />
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="terminal"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-[#080A0E] rounded-2xl p-6 border border-white/10 shadow-inner overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-google-blue via-google-red to-google-yellow" />
                                <div
                                    ref={terminalRef}
                                    className="h-[300px] overflow-y-auto custom-scrollbar font-mono text-[11px] space-y-2"
                                >
                                    {logs.map((log, i) => (
                                        <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                            <span className="text-google-blue font-black shrink-0">[PRO-SYS]</span>
                                            <span className={log.includes('error') ? 'text-google-red' : 'text-gray-400'}>
                                                {log}
                                            </span>
                                        </div>
                                    ))}
                                    <div className="flex gap-3 animate-pulse">
                                        <span className="text-google-blue font-black shrink-0">[SCANNING]</span>
                                        <span className="text-google-blue/50">_</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-3 py-4 text-xs font-black text-google-blue uppercase tracking-widest animate-pulse">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing Collective Intelligence...
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">
                                    Target Identity
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sam Altman"
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-700 focus:ring-2 focus:ring-google-blue/50 focus:bg-white/[0.04] focus:border-google-blue/50 outline-none transition-all"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">
                                    Strategic Context
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Describe the nature of your interaction..."
                                    rows={4}
                                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-700 focus:ring-2 focus:ring-google-blue/50 focus:bg-white/[0.04] focus:border-google-blue/50 outline-none transition-all resize-none shadow-inner"
                                />
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || !name || !context}
                                className="w-full group relative overflow-hidden bg-white text-black font-black uppercase text-sm tracking-widest py-5 rounded-2xl shadow-xl hover:bg-google-blue hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span>Initiate Deep Scan</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                            </motion.button>
                        </form>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                Secure Connection · Behavioral Encryption Enabled
            </p>
        </motion.div>
    );
};

export default InputForm;
