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
            <div className="bg-hueco-white border border-black/10 p-10 relative overflow-hidden group shadow-2xl shadow-black/5">
                {/* Decorative Elements - Spiritual Pressure */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-hogyoku-indigo/5 blur-[100px] -mr-20 -mt-20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-hogyoku-purple/5 blur-[100px] -ml-20 -mb-20 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <div className="relative flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-serif font-black text-shinigami-black flex items-center gap-4 tracking-tighter">
                        <span className="w-1 h-8 bg-hogyoku-purple" />
                        <span>Intelligence Input</span>
                    </h2>
                    <Sparkles className="w-5 h-5 text-hogyoku-purple opacity-50" />
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="hogyoku"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-10 space-y-8"
                        >
                            {/* Hogyoku Awakening Animation */}
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 bg-hogyoku-purple blur-xl opacity-50 animate-pulse-slow"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-hogyoku-indigo to-hogyoku-purple rounded-full shadow-2xl shadow-hogyoku-purple/50 border border-white/20 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]"></div>
                                    <Sparkles className="w-8 h-8 text-white animate-spin-slow opacity-80" />
                                </div>
                            </div>

                            <div className="space-y-4 w-full max-w-md">
                                <div className="h-[150px] overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-hueco-white z-10" />
                                    <div ref={terminalRef} className="h-full overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1.5 text-center">
                                        {logs.map((log, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`tracking-widest ${log.includes('error') ? 'text-red-600' : 'text-gray-400'}`}
                                            >
                                                {log.toLowerCase()}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-hogyoku-purple animate-pulse">
                                        Breaking Barriers...
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label className="block text-[10px] font-black text-shinigami-black uppercase tracking-[0.2em] mb-2 ml-1">
                                    Target Identity
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sosuke Aizen"
                                    className="w-full bg-transparent border-b-2 border-black/10 px-4 py-4 text-xl font-serif text-shinigami-black placeholder:text-gray-300 focus:border-hogyoku-purple focus:bg-gray-50/50 outline-none transition-all rounded-none"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-[10px] font-black text-shinigami-black uppercase tracking-[0.2em] mb-2 ml-1">
                                    Strategic Context
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Define the battlefield..."
                                    rows={3}
                                    className="w-full bg-transparent border-b-2 border-black/10 px-4 py-4 text-sm font-medium text-shinigami-black placeholder:text-gray-300 focus:border-hogyoku-purple focus:bg-gray-50/50 outline-none transition-all resize-none rounded-none"
                                />
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || !name || !context}
                                className="w-full btn-shinigami py-5 mt-4"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span>Shatter, Kyoka Suigetsu</span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.button>
                        </form>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-8 text-center text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                Since when were you under the impression that I wasn't using Logic?
            </p>
        </motion.div>
    );
};

export default InputForm;
