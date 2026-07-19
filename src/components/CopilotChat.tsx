import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserSetup } from '../types';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  ArrowRight, 
  Database, 
  Volume2, 
  Check, 
  Globe,
  CircleAlert,
  Loader2
} from 'lucide-react';

interface CopilotChatProps {
  messages: ChatMessage[];
  setup: UserSetup;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function CopilotChat({ messages, setup, onSendMessage, isLoading }: CopilotChatProps) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips for the user
  const suggestions = [
    { text: "Guide me to my seat.", label: "Seat Directions" },
    { text: "Where is the nearest washroom?", label: "Cleanest Washroom" },
    { text: "Which food stall has the shortest queue?", label: "Shortest Queue Food" },
    { text: "What should I eat if I'm vegetarian?", label: "Vegetarian Foods" },
    { text: "Which exit should I use after the match?", label: "Optimal Exit" },
    { text: "Where can I charge my phone?", label: "Charging Ports" },
    { text: "Translate this announcement into Hindi.", label: "Announcement Translate" },
    { text: "I lost my friend. Where's first aid?", label: "First Aid / Emergency" }
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice synthesis fallback for "Blind" accessibility mode
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Strip markdown syntax
      const cleanText = text.replace(/[*#`_\-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Attempt to map language
      if (setup.language.includes('Spanish')) utterance.lang = 'es-ES';
      else if (setup.language.includes('Portuguese')) utterance.lang = 'pt-BR';
      else if (setup.language.includes('French')) utterance.lang = 'fr-FR';
      else if (setup.language.includes('German')) utterance.lang = 'de-DE';
      else if (setup.language.includes('Hindi')) utterance.lang = 'hi-IN';
      else utterance.lang = 'en-US';

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported on this browser context.");
    }
  };

  return (
    <div id="ai-copilot-panel" className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl flex flex-col h-[580px] justify-between relative overflow-hidden">
      
      {/* Background glassmorphism accents */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 rounded-full bg-blue-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              AI Copilot Assistant
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-400">Verifying live World Cup 2026 data</p>
          </div>
        </div>

        {/* Display profile flags */}
        <div className="flex items-center gap-1.5">
          <div className="px-2 py-1 rounded bg-slate-800 text-[9px] font-mono font-semibold text-slate-300 border border-slate-700/60 flex items-center gap-1">
            <Globe className="w-3 h-3 text-emerald-400" />
            {setup.language}
          </div>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.map((msg) => {
          const isModel = msg.role === 'model';
          return (
            <div 
              key={msg.id} 
              id={`chat-msg-${msg.id}`}
              className={`flex items-start gap-2.5 max-w-[85%] ${isModel ? 'self-start' : 'self-end ml-auto flex-row-reverse'}`}
            >
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isModel 
                  ? 'bg-slate-950 border-emerald-500/30 text-emerald-400' 
                  : 'bg-emerald-500 text-slate-950 border-emerald-400/20'
              }`}>
                {isModel ? <Bot className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Text Bubble */}
              <div className="space-y-1.5">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-md ${
                  isModel 
                    ? 'bg-slate-950/80 border border-slate-800/80 text-slate-100 rounded-tl-sm' 
                    : 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm'
                }`}>
                  {msg.text}

                  {/* Read Aloud accessibility trigger for Blind users */}
                  {isModel && setup.accessibility === 'Blind' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="mt-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Speak Aloud (Accessibility)
                    </button>
                  )}
                </div>

                {/* DB Verified Tool Badge (If function calling was triggered) */}
                {isModel && msg.toolCalls && msg.toolCalls.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center mt-1">
                    {msg.toolCalls.map((tool, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950 border border-emerald-500/20 text-emerald-400 text-[8px] font-mono tracking-wider uppercase font-bold"
                      >
                        <Database className="w-2.5 h-2.5 text-emerald-400" />
                        RAG VERIFIED: {tool}
                      </span>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className={`text-[8px] font-mono text-slate-500 ${isModel ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 max-w-[80%] self-start animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="space-y-1.5">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs flex items-center gap-2 rounded-tl-sm">
                <Loader2 className="w-4.5 h-4.5 text-emerald-400 animate-spin" />
                <span>AI is reasoning over World Cup JSON datasets...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/40 bg-slate-950/20 relative z-10">
        <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Quick Inquiries:</div>
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              id={`chat-sug-${idx}`}
              onClick={() => handleSuggestionClick(sug.text)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300 text-[10px] hover:border-emerald-500/40 hover:text-emerald-400 transition-all shrink-0 cursor-pointer snap-start"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/60 relative z-10">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={`Ask anything in ${setup.language}...`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
        <button
          id="chat-send-btn"
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center font-bold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-emerald-500/5"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
