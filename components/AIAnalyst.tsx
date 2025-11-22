import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { Message, TrendItem } from '../types';
import { analyzeTrendsWithAI } from '../services/geminiService';

interface AIAnalystProps {
    trends: TrendItem[];
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ trends }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Douyin Trend Analyst. I have access to the current top 50 hot search list. \n\nAsk me to:\n- Summarize the current top topics\n- Find marketing opportunities for your brand\n- Explain why a specific topic is viral',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await analyzeTrendsWithAI(trends, userMsg.text);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-20 pb-4 px-4 h-screen flex flex-col items-center justify-center max-w-5xl mx-auto">
       <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="text-douyin-cyan w-6 h-6" />
                AI Insight Engine
            </h2>
       </div>
      
      <div className="w-full flex-1 bg-douyin-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-5 ${
                  msg.role === 'user'
                    ? 'bg-douyin-red text-white rounded-tr-none'
                    : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/10'
                }`}
              >
                {msg.role === 'model' && (
                   <div className="flex items-center mb-3 opacity-50 text-xs font-bold uppercase tracking-wide text-douyin-cyan">
                     <Bot className="w-3 h-3 mr-2" />
                     Analyst
                   </div>
                )}
                <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start w-full">
               <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/10 flex items-center space-x-3">
                 <Loader2 className="w-5 h-5 text-douyin-cyan animate-spin" />
                 <span className="text-slate-400 text-sm">Analyzing live data patterns...</span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-sm">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for a weekly summary, viral factors, or content ideas..."
              className="w-full bg-black/50 text-white placeholder-slate-500 border border-white/10 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-douyin-cyan/50 focus:border-transparent transition-all shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2.5 bg-douyin-cyan text-black rounded-full hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyst;