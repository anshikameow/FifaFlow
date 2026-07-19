import React, { useState } from 'react';
import { UserSetup, ChatMessage } from '../types';
import CopilotChat from './CopilotChat';
import { 
  Sparkles, 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  Compass, 
  AlertCircle,
  CloudRain,
  Users,
  Train,
  Wrench,
  RotateCcw,
  Sliders,
  ChevronRight,
  TrendingUp,
  Activity,
  Trophy,
  ArrowRight,
  Gauge,
  HelpCircle as HelpIcon,
  CheckCircle,
  HeartPulse,
  Loader2
} from 'lucide-react';

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
  
  // Real-time Simulation / Re-recommendation state
  const [activeSimulation, setActiveSimulation] = useState<null | 'rain' | 'gate_jam' | 'metro_delay' | 'restroom_close'>(null);
  
  // What-If Slider Evacuation countdown minutes
  const [evacMinutes, setEvacMinutes] = useState<number>(10);
  
  // Custom What-If Scenario State
  const [activeWhatIf, setActiveWhatIf] = useState<null | 'penalties' | 'leave_early' | 'accessibility' | 'parking'>(null);

  // Personalized Match Story generation state
  const [matchStory, setMatchStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  // Pre-configured "What-If" scenarios
  const whatIfScenarios = {
    penalties: {
      title: "What if match goes to Penalties?",
      impact: "Post-match evacuation crowds will compress into a 15-minute window instead of standard 45-minute dispersal. Transit platforms will face 300% surge capacity.",
      waitMultiplier: "Wait Time: +35 mins",
      safety: "Congestion Index: CRITICAL",
      color: "border-amber-500 bg-amber-950/20",
      gaugeColor: "bg-amber-500",
      stats: { queue: 85, crowd: 94, transit: 12, safety: 40 }
    },
    leave_early: {
      title: "What if I leave 15 mins before whistle?",
      impact: "You beat 90% of the stadium egress. Queue wait times at Metro transit drops to near-zero. Highly recommended if you have strict flight/bus departures.",
      waitMultiplier: "Wait Time: -25 mins",
      safety: "Congestion Index: COMFORTABLE",
      color: "border-emerald-500 bg-emerald-950/20",
      gaugeColor: "bg-emerald-500",
      stats: { queue: 10, crowd: 25, transit: 95, safety: 98 }
    },
    accessibility: {
      title: "What if I request sensory-room access mid-match?",
      impact: "Sensory calming suites are fully operational at MetLife Suite Tier 1-A. Access paths from Section " + setup.seat + " have flat elevators with zero steps.",
      waitMultiplier: "ADA Path Clear",
      safety: "Accessibility Rating: EXCELLENT",
      color: "border-indigo-500 bg-indigo-950/20",
      gaugeColor: "bg-indigo-500",
      stats: { queue: 5, crowd: 15, transit: 88, safety: 95 }
    },
    parking: {
      title: "What if Parking Lot Hub C is locked?",
      impact: "Traffic flow is diverted toward Hub F and North Perimeter expressway. Walking distance from Section " + setup.seat + " increases by 180 meters.",
      waitMultiplier: "Walk Distance: +180m",
      safety: "Congestion Index: MODERATE",
      color: "border-rose-500 bg-rose-950/20",
      gaugeColor: "bg-rose-500",
      stats: { queue: 45, crowd: 60, transit: 40, safety: 70 }
    }
  };

  // Quick football expert questions
  const expertQueries = [
    { text: "Why is Argentina favored?", label: "Argentina Form" },
    { text: "Explain the offside rule simply.", label: "Offside Rule" },
    { text: "Who should I captain in Fantasy?", label: "Fantasy Captain" },
    { text: "Which player is in the best form?", label: "Best Form Player" },
    { text: "Compare France and Spain tactically.", label: "Tactical Comparison" }
  ];

  // Logic to simulate recalculation outcomes for Stadium Shifts
  const getSimulationOutput = () => {
    switch (activeSimulation) {
      case 'rain':
        return {
          title: "🌧️ Sudden Heavy Downpour Triggered",
          previous: "Gate A (Main plaza, uncovered walkway)",
          updated: "Gate E (Covered ramp, direct shelter)",
          reason: "Rain sensors report 8mm/hr downpour. Gate A walkways are fully exposed. Gate E is 100% concrete-covered, keeping wheelchair or standard pedestrians dry while maintaining high turnstile throughput.",
          metrics: { crowdSaved: "70%", drynessRating: "10/10", timeDiff: "Saves 4 min walk" }
        };
      case 'gate_jam':
        return {
          title: "⚠️ Gate B Turnstile Sensor Jam (Congestion Peak)",
          previous: "Gate B (Wait time: 35 minutes)",
          updated: "Gate D (Wait time: 4 minutes)",
          reason: "Live telemetry shows a temporary card-reader sensor failure at Gate B, causing a 350-meter line backlog. AI automatically redirects Section " + setup.seat + " egress toward Gate D, bypassing the jam entirely.",
          metrics: { crowdSaved: "85%", drynessRating: "9.5/10", timeDiff: "Saves 31 mins wait" }
        };
      case 'metro_delay':
        return {
          title: "🚇 Metro Transit Line Delays (+25 mins)",
          previous: "Metro Train Service (Section Transit Hub)",
          updated: "Rapid Shuttle Bus Express (Bay 4)",
          reason: "Track electrical diagnostics report a 25-minute delay on the northbound trains. AI shifts your transit recommendation to the rapid-frequency shuttle buses departing from West Bus Plaza Bay 4.",
          metrics: { crowdSaved: "60%", drynessRating: "8.8/10", timeDiff: "Saves 19 mins delay" }
        };
      case 'restroom_close':
        return {
          title: "🔧 Restroom 4B Closure (Maintenance Halt)",
          previous: "Washroom 4B (adjacent to section)",
          updated: "Washroom 3C (70m North-East)",
          reason: "Emergency water valve repair initiated. Restroom 4B is closed for the next 45 minutes. Rerouting to Washroom 3C which is currently under 1.5-minute wait time with a cleanliness rating of 9.2/10.",
          metrics: { crowdSaved: "95%", drynessRating: "9.2/10", timeDiff: "Saves 12 mins search" }
        };
      default:
        return null;
    }
  };

  // Generates a highly personalized dramatic match story based on active profile
  const generatePersonalizedStory = () => {
    setIsGeneratingStory(true);
    setMatchStory(null);

    setTimeout(() => {
      let opponent = setup.matchId.includes('arg') ? 'France' : 'Spain';
      let languagePrompt = setup.language.includes('Spanish') ? 'Spanish' : 'English';
      
      let story = "";
      if (languagePrompt === 'Spanish') {
        story = `✨ PERSPECTIVA TÁCTICA PERSONALIZADA (SECCIÓN ${setup.seat}) ✨\n\nDesde su ubicación privilegiada en la Sección ${setup.seat}, tendrá una vista en ángulo perfecto de la defensa baja de Argentina frente a los extremos veloces de su oponente. Las transiciones de Messi se gestarán exactamente en su línea visual del mediocampo.\n\n• Clave del Partido: Dado que seleccionó preferencia ${setup.accessibility}, recuerde que las rutas más despejadas de vuelta a su transporte (${setup.transport}) estarán habilitadas con acompañamiento visual. ¡Disfrute del drama táctico con la máxima comodidad y seguridad garantizada por nuestra IA!`;
      } else {
        story = `✨ PERSONALIZED TACTICAL MATCH NARRATIVE (SECTION ${setup.seat}) ✨\n\nFrom your premium tactical vantage point in Section ${setup.seat}, you will have a direct view of the final third where the high-press transitional game will unfold. The strategic overload on the right flank will develop directly in your field of vision.\n\n• Seat Insight: Positioned near Section ${setup.seat}, you bypass the main congested concourses. With your ${setup.accessibility} accessibility profile, our AI reasoning engine has mapped all proximity elevators so you can track the tactical momentum from kickoff to final whistle without steps or navigation friction.`;
      }
      
      setMatchStory(story);
      setIsGeneratingStory(false);
    }, 900);
  };

  const simOutput = getSimulationOutput();

  return (
    <div id="ai-assistant-section-container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      
      {/* Left Column: Full Copilot Chatbot (lg:col-span-7) */}
      <div className="lg:col-span-7">
        <CopilotChat 
          messages={messages}
          setup={setup}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      </div>

      {/* Right Column: Dynamic What-If Engine & Simulation Console (lg:col-span-5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* PANEL 1: STADIUM LIVE SIMULATION CENTRE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">Live Simulation Centre</h4>
            </div>
            {activeSimulation && (
              <button 
                onClick={() => setActiveSimulation(null)}
                className="text-[9px] flex items-center gap-1 font-mono font-bold text-slate-400 hover:text-slate-200 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Shift
              </button>
            )}
          </div>
          
          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            FIFA Flow reacts dynamically to stadium shifts. Trigger a simulated live shift below to see how the AI reasoning engine immediately <strong>re-calculates your path recommendations</strong>:
          </p>

          {/* Trigger grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveSimulation('rain')}
              className={`p-2.5 rounded-2xl border text-left text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSimulation === 'rain'
                  ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <CloudRain className="w-4 h-4 shrink-0" />
              Sudden Rain 8mm/h
            </button>

            <button
              onClick={() => setActiveSimulation('gate_jam')}
              className={`p-2.5 rounded-2xl border text-left text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSimulation === 'gate_jam'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              Gate B Crowd Jam
            </button>

            <button
              onClick={() => setActiveSimulation('metro_delay')}
              className={`p-2.5 rounded-2xl border text-left text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSimulation === 'metro_delay'
                  ? 'bg-purple-500/10 border-purple-500 text-purple-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Train className="w-4 h-4 shrink-0" />
              Metro delay +25m
            </button>

            <button
              onClick={() => setActiveSimulation('restroom_close')}
              className={`p-2.5 rounded-2xl border text-left text-[10px] font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSimulation === 'restroom_close'
                  ? 'bg-rose-500/10 border-rose-500 text-rose-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              Restroom 4B Closed
            </button>
          </div>

          {/* SIMULATION VISUAL OUTCOME CARD */}
          {simOutput ? (
            <div className="p-4 bg-slate-950 border border-indigo-500/30 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[10px] font-black text-slate-200">{simOutput.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 p-2 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">PREVIOUS RECOMMENDATION:</span>
                  <p className="text-[10px] text-slate-400 line-through font-mono">{simOutput.previous}</p>
                </div>
                
                <div className="space-y-1 p-2 bg-emerald-950/15 rounded-xl border border-emerald-500/20">
                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                    RE-CALCULATED ADVICE:
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  </span>
                  <p className="text-[10px] text-emerald-400 font-extrabold font-sans flex items-center gap-1">
                    {simOutput.updated}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                  🧠 Why the AI pivoted:
                </span>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  {simOutput.reason}
                </p>
              </div>

              {/* Mini visual metrics badge */}
              <div className="flex items-center gap-2 justify-between">
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-indigo-400">
                  {simOutput.metrics.timeDiff}
                </div>
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-emerald-400">
                  Crowd Avoided: {simOutput.metrics.crowdSaved}
                </div>
                <div className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-yellow-400">
                  Reliability: {simOutput.metrics.drynessRating}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center py-6 text-slate-500 bg-slate-950/20">
              <Compass className="w-6 h-6 text-slate-600 mb-1.5 animate-pulse" />
              <span className="text-[10px] font-mono">No active stadium shift. All turnstiles running optimally.</span>
            </div>
          )}
        </div>

        {/* PANEL 2: WHAT-IF HYPOTHETICAL ENGINE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">What-If Scenario Engine</h4>
          </div>

          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Select a hypothetical scenario to visualize how stadium crowd densities and egress safety projection models respond instantly:
          </p>

          {/* Scenario Grid */}
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(whatIfScenarios).map((key) => {
              const item = whatIfScenarios[key as keyof typeof whatIfScenarios];
              const isSelected = activeWhatIf === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveWhatIf(isSelected ? null : key as any)}
                  className={`p-2.5 rounded-2xl border text-left text-[10px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/15 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>

          {/* Scenario visual output card with gauges */}
          {activeWhatIf ? (
            <div className={`p-4 border rounded-2xl space-y-3.5 animate-in slide-in-from-bottom-2 duration-150 ${whatIfScenarios[activeWhatIf].color}`}>
              <div>
                <span className="text-[10px] font-black text-slate-100 uppercase block mb-1">
                  🔍 Hypothetical Impact: {whatIfScenarios[activeWhatIf].title}
                </span>
                <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                  {whatIfScenarios[activeWhatIf].impact}
                </p>
              </div>

              {/* Visual Bars for projection parameters */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-slate-400">Queue Wait Times (m)</span>
                    <span className="text-slate-200">{whatIfScenarios[activeWhatIf].stats.queue} min delay</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${whatIfScenarios[activeWhatIf].gaugeColor}`} style={{ width: `${whatIfScenarios[activeWhatIf].stats.queue}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-slate-400">Crowd Density Index</span>
                    <span className="text-slate-200">{whatIfScenarios[activeWhatIf].stats.crowd}% Capacity</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${whatIfScenarios[activeWhatIf].gaugeColor}`} style={{ width: `${whatIfScenarios[activeWhatIf].stats.crowd}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-slate-400">Transit Seat Availability</span>
                    <span className="text-slate-200">{whatIfScenarios[activeWhatIf].stats.transit}% Free Seats</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${whatIfScenarios[activeWhatIf].gaugeColor}`} style={{ width: `${whatIfScenarios[activeWhatIf].stats.transit}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                    <span className="text-slate-400">Egress Safety Score</span>
                    <span className="text-slate-200">{whatIfScenarios[activeWhatIf].stats.safety}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${whatIfScenarios[activeWhatIf].gaugeColor}`} style={{ width: `${whatIfScenarios[activeWhatIf].stats.safety}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-between pt-1 border-t border-slate-800/40 text-[9px] font-mono font-black">
                <span className="text-slate-300">{whatIfScenarios[activeWhatIf].waitMultiplier}</span>
                <span className="text-indigo-400">{whatIfScenarios[activeWhatIf].safety}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400">Evacuation countdown slider:</span>
                <span className="text-emerald-400 font-bold">Leave {evacMinutes} mins early</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={evacMinutes}
                onChange={(e) => setEvacMinutes(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>0 mins (whistle peak)</span>
                <span>30 mins early</span>
              </div>

              {/* Dynamic feedback indicator based on slider value */}
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2 animate-in fade-in duration-200">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                <p className="text-[9px] text-slate-300 leading-snug font-sans">
                  {evacMinutes >= 20 ? (
                    <span className="text-emerald-400 font-bold">Perfect choice! Leaving {evacMinutes} mins early avoids turnstile backup completely. Queue Wait: under 2 mins. Transit seats 85% free.</span>
                  ) : evacMinutes >= 10 ? (
                    <span className="text-slate-200">Moderate choice. Leaving {evacMinutes} mins early bypasses about 60% of crowd waves. Queue Wait: 8 mins. Transit seats 40% free.</span>
                  ) : (
                    <span className="text-rose-400 font-semibold">Peak Egress. Leaving at final whistle packs concourses to 98% density. Queue Wait: 45 mins. Transit seats completely full.</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* PANEL 3: PERSONALIZED AI MATCH DAY NARRATIVE */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100">AI Match Storyteller</h4>
          </div>

          <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Generate a personalized tactical match narrative based on your seat perspective at <strong>Section {setup.seat}</strong> and accessibility profile:
          </p>

          <button
            onClick={generatePersonalizedStory}
            disabled={isGeneratingStory}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            {isGeneratingStory ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Drafting Tactical Perspective...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                Generate Match Story
              </>
            )}
          </button>

          {matchStory && (
            <div className="p-3.5 bg-slate-950 border border-amber-500/20 rounded-2xl space-y-2 text-slate-300 font-sans text-[10px] leading-relaxed animate-in zoom-in-95 duration-200 whitespace-pre-wrap">
              {matchStory}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
