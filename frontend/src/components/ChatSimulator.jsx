import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, Loader2, Sparkles, Terminal } from 'lucide-react';
import { chatSimulation } from '../lib/api';
import { twMerge } from 'tailwind-merge';

const ChatSimulator = ({ targetName, context, profile }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const newHistory = [...messages, userMsg];

        setMessages(newHistory);
        setInput('');
        setLoading(true);

        try {
            const result = await chatSimulation(targetName, context, profile, newHistory);
            setMessages([...newHistory, { role: 'assistant', content: result.content }]);
        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-charcoal-900/5 h-[700px] flex flex-col relative overflow-hidden shadow-2xl shadow-charcoal-900/5">
            {/* Header */}
            <div className="p-8 border-b border-charcoal-900/5 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-charcoal-900/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-charcoal-900" />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-charcoal-900 text-lg">{targetName}</h3>
                        <p className="text-[10px] text-charcoal-900/40 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            Active Stimulation
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-cream-50/30">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                        <div className="p-6 border border-dashed border-charcoal-900/20 rounded-full">
                            <Sparkles className="w-6 h-6 text-charcoal-900" />
                        </div>
                        <p className="text-charcoal-900 text-xs uppercase tracking-[0.2em] max-w-[250px] leading-relaxed">
                            Simulation Environment Ready. <br /> Begin Interaction.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={twMerge(
                                "max-w-[80%] px-8 py-5 text-sm leading-relaxed shadow-sm",
                                msg.role === 'user'
                                    ? 'bg-charcoal-900 text-cream-50 rounded-2xl rounded-tr-none'
                                    : 'bg-white border border-charcoal-900/5 text-charcoal-900 rounded-2xl rounded-tl-none'
                            )}
                        >
                            <p className="font-sans">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-charcoal-900/5 px-6 py-3 flex items-center gap-3 rounded-full shadow-sm">
                            <Loader2 className="w-3 h-3 animate-spin text-charcoal-900" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-900/50">Processing Response...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-8 border-t border-charcoal-900/5 bg-white">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-transparent border-b border-charcoal-900/10 py-4 pr-12 text-charcoal-900 placeholder:text-charcoal-900/30 focus:border-gold-400 focus:outline-none transition-colors font-sans"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-0 p-2 text-charcoal-900/40 hover:text-charcoal-900 disabled:opacity-0 transition-all hover:scale-110 active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatSimulator;
