import React from 'react';
import { UserSetup, ChatMessage } from '../types';
import CopilotChat from './CopilotChat';
import { Sparkles, HelpCircle, ShieldAlert, FileText, Compass, AlertCircle } from 'lucide-react';

interface AIAssistantSectionProps {
  setup: UserSetup;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function AIAssistantSection({
  setup,
  messages,
  onSendMessage,
  isLoading
}: AIAssistantSectionProps) {
  
  // Custom quick football questions recommended for the "AI Football Expert" Mode
  const expertQueries = [
    { text: "Why is Argentina favored?", label: "Argentina Form" },
    { text: "Explain the offside rule simply.", label: "Offside Rule" },
    { text: "Who should I captain in Fantasy?", label: "Fantasy Captain" },
    { text: "Which player is in the best form?", label: "Best Form Player" },
    { text: "Compare France and Spain tactically.", label: "Tactical Comparison" }
  ];

  return (
    <div id="ai-assistant-section-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      
      {/* Left Column: Full Copilot Chatbot (lg:col-span-8) */}
      <div className="lg:col-span-8">
        <CopilotChat 
          messages={messages}
          setup={setup}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Right Column: AI Football Expert quick links & Stadium Rules (lg:col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Panel A: AI Football Expert Quick Chips */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Football Expert Queries</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            The Stadium Assistant doubles as an official football encyclopedia. Click any preset below to submit the prompt:
          </p>

          <div className="space-y-2">
            {expertQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(q.text)}
                disabled={isLoading}
                className="w-full text-left p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/30 text-xs font-medium text-slate-200 transition-all hover:text-emerald-400 cursor-pointer disabled:opacity-55"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Panel B: Critical Emergency Support & First Aid Help */}
        <div className="bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/20 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Emergency & Aid Assist</h4>
          </div>
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Lost your group, or experiencing minor trauma? Immediate physical personnel are stationed directly near security perimeters.
          </p>

          <div className="p-3 bg-slate-950/80 border border-rose-500/15 rounded-xl space-y-1.5">
            <div className="text-[10px] font-bold text-slate-300">Primary Medical Post Section 110:</div>
            <p className="text-[9px] text-slate-400 leading-relaxed font-sans">
              Paramedics, visual aids support, cardiac response, and climate-controlled resting areas are fully accessible at Section 110 (near Gate B).
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
