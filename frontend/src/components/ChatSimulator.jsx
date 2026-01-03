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
        <div className="glass-card h-[600px] flex flex-col border border-white/10 shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-dark-bg/50 backdrop-blur-md rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Simulated: {targetName}</h3>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Online • Llama 3.3 70B
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dark-bg/20">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <Bot className="w-12 h-12 text-gray-500" />
                        <p className="text-gray-400 text-sm max-w-xs">
                            Start practicing your pitch. The AI will respond exactly how {targetName} would.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                    ? 'bg-google-blue text-white rounded-br-none'
                                    : 'bg-dark-card border border-white/10 text-gray-100 rounded-bl-none'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-dark-card border border-white/10 text-gray-100 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                            <span className="text-xs text-gray-400">Typing...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-dark-bg/50 backdrop-blur-md rounded-b-xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-[#161B22] border border-gray-700 text-white rounded-full pl-6 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent transition-all placeholder:text-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 p-2 bg-google-blue hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-google-blue rounded-full transition-colors text-white shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatSimulator;
