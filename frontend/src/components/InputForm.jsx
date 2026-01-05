import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Activity } from 'lucide-react';
import Button from './ui/Button';

const InputForm = ({ onSubmit, loading, logs }) => {
    const [name, setName] = useState('');
    const [context, setContext] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !context.trim()) return;
        onSubmit({ name, context });
    };

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {!loading ? (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="space-y-12"
                    >
                        <div className="space-y-8">
                            <div className="relative group">
                                <input
                                    type="text"
                                    id="target-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Target Name"
                                    className="input-luxury text-2xl md:text-3xl py-6 font-serif tracking-tight"
                                    required
                                />
                                <label
                                    htmlFor="target-name"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.2em] text-charcoal-900/30 group-focus-within:text-gold-400 transition-colors pointer-events-none"
                                >
                                    Subject Identity
                                </label>
                            </div>

                            <div className="relative group">
                                <textarea
                                    id="context"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Describe the upcoming interaction context..."
                                    className="input-luxury text-lg md:text-xl py-6 min-h-[120px] resize-none"
                                    required
                                />
                                <label
                                    htmlFor="context"
                                    className="absolute right-0 top-6 text-[10px] uppercase tracking-[0.2em] text-charcoal-900/30 group-focus-within:text-gold-400 transition-colors pointer-events-none"
                                >
                                    Scenario Parameters
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto min-w-[200px]">
                                <span className="flex items-center justify-center gap-4">
                                    Initiate Analysis
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </Button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col items-center justify-center py-12 space-y-8"
                    >
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border border-charcoal-900/10 rounded-full" />
                            <div className="absolute inset-0 border-t border-gold-400 rounded-full animate-spin duration-[3s]" />
                            <span className="font-serif font-bold text-2xl text-charcoal-900">K</span>
                        </div>

                        <div className="text-center space-y-2">
                            <p className="text-xs uppercase tracking-[0.3em] text-charcoal-900 font-bold">Processing Intelligence</p>
                            <div className="h-6 overflow-hidden relative">
                                <AnimatePresence mode="popLayout">
                                    {logs.slice(-1).map((log, i) => (
                                        <motion.p
                                            key={log + i}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            className="text-sm text-charcoal-900/50 font-serif italic flex items-center justify-center gap-2"
                                        >
                                            <Activity className="w-3 h-3 text-gold-400 animate-pulse" />
                                            {log}
                                        </motion.p>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InputForm;
