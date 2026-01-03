import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatSimulation } from '../lib/api';

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
            // Optional: Add error toast here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-hueco-white border border-black/10 shadow-2xl shadow-black/5 h-[700px] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-black/5 bg-white/80 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-shinigami-black text-white flex items-center justify-center shadow-lg shadow-hogyoku-purple/20 border border-white/10">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-serif font-black text-shinigami-black text-sm uppercase tracking-wide">Target: {targetName}</h3>
                        <p className="text-[9px] text-hogyoku-purple font-black flex items-center gap-2 uppercase tracking-[0.2em] mt-1">
                            <span className="w-1.5 h-1.5 bg-hogyoku-purple animate-pulse-slow rotate-45" />
                            Reiatsu Active
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-hueco-white">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40">
                        <div className="p-6 border border-black/10 transition-transform duration-700 hover:rotate-180">
                            <Bot className="w-8 h-8 text-shinigami-black" />
                        </div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] max-w-[250px] leading-relaxed">
                            Projection Initialized. <br /> Do not avert your eyes.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-6 py-4 shadow-sm border border-black/5 ${msg.role === 'user'
                                ? 'bg-shinigami-black text-white'
                                : 'bg-white text-shinigami-black border-black/10'
                                }`}
                        >
                            <p className="text-xs font-bold leading-loose tracking-wide">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-hogyoku-purple/30 text-hogyoku-purple px-6 py-3 flex items-center gap-3 shadow-[0_0_15px_-5px_rgba(124,58,237,0.2)]">
                            <Loader2 className="w-3 h-3 animate-spin text-hogyoku-purple" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Calculating...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 border-t border-black/5 bg-white">
                <div className="relative flex items-center group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Speak..."
                        className="w-full bg-gray-50/50 border-b border-black/10 text-shinigami-black text-sm pr-14 py-4 focus:outline-none focus:border-hogyoku-purple focus:bg-white transition-all placeholder:text-gray-300 font-bold tracking-wide rounded-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-0 p-3 bg-white hover:bg-shinigami-black hover:text-white disabled:opacity-0 transition-all text-shinigami-black border border-transparent hover:border-black active:scale-95 duration-500"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatSimulator;
