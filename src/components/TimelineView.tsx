import React from 'react';
import { TimelineStep, UserSetup } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  MapPin, 
  Navigation, 
  Activity, 
  ChevronRight, 
  Train, 
  HeartHandshake, 
  Clock, 
  Compass, 
  ShoppingBag, 
  Utensils, 
  ArrowRightLeft, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface TimelineViewProps {
  setup: UserSetup;
  activeStepIndex: number;
  onStepClick: (index: number, routeKey: string | null) => void;
}

export default function TimelineView({ setup, activeStepIndex, onStepClick }: TimelineViewProps) {
  
  // Custom timeline steps generated dynamically based on transport mode and accessibility
  const steps: { title: string; time: string; desc: string; routeKey: string | null; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      title: 'Leave Hotel',
      time: '16:00',
      desc: `Prepare your mobile ticket and clear bag. Make sure your power bank is fully charged (<20,000mAh).`,
      routeKey: null,
      icon: Clock
    },
    {
      title: `Board Transit (${setup.transport})`,
      time: '16:30',
      desc: setup.transport === 'Metro' 
        ? 'Hop on Stadium Express Metro Link at Central Hub. Standard headways are 4 minutes.'
        : setup.transport === 'Car' 
          ? 'Rideshare pickup. Head to the outer perimeter drop-off lane to avoid bottlenecks.'
          : setup.transport === 'Bus' 
            ? 'FIFA Shuttle bus boarding. Expect direct gate drop-off.'
            : 'Walk along the dedicated lit pedestrian promenade.',
      routeKey: null,
      icon: setup.transport === 'Metro' ? Train : Navigation
    },
    {
      title: `Arrive & Enter Stadium`,
      time: '17:15',
      desc: setup.accessibility === 'Wheelchair'
        ? 'Head directly to Gate E (ADA prioritized). Real-time ingress wait time: ~4 mins.'
        : 'Head to Gate A (Main Ingress). Real-time ingress wait time: ~5 mins.',
      routeKey: 'to-seat',
      icon: Compass
    },
    {
      title: 'Buy Merchandise',
      time: '17:35',
      desc: 'Visit the Superstore Mega Pavilion near Section 101 for World Cup souvenirs.',
      routeKey: null,
      icon: ShoppingBag
    },
    {
      title: 'Grab Pre-Match Food',
      time: '18:10',
      desc: setup.accessibility === 'Wheelchair'
        ? 'Grab vegetarian dishes from Greens & Grains Co at Section 130 (zero stairs/ramps).'
        : 'Get premium bowls at World Cup Eats near Section 112 or tacos at Section 104.',
      routeKey: 'to-food',
      icon: Utensils
    },
    {
      title: `Navigate to Seat`,
      time: '18:40',
      desc: `Reach Section ${setup.seat}. Check the live map to locate the designated elevator or ramp.`,
      routeKey: 'to-seat',
      icon: MapPin
    },
    {
      title: 'Kickoff Match',
      time: '19:00',
      desc: 'Matches cease alcohol sales at the 75th minute. Cheer loud!',
      routeKey: null,
      icon: Calendar
    },
    {
      title: 'Suggested Smart Exit',
      time: '21:00',
      desc: setup.accessibility === 'Wheelchair'
        ? 'Depart via Gate E (ADA) to board the accessible Shuttle buses directly.'
        : 'Depart through Gate A to access Metro Line 1. Avoid Gate B due to heavy congestion.',
      routeKey: 'to-seat',
      icon: ArrowRightLeft
    }
  ];

  return (
    <div id="timeline-itinerary-card" className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Personalized Matchday Timeline
          </h3>
          <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            Itinerary Active
          </div>
        </div>
        <p className="text-[10px] text-slate-400">Click steps below to highlight the path on the Live Map</p>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent max-h-[420px]">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;
          const isUpcoming = idx > activeStepIndex;

          return (
            <div
              key={idx}
              id={`timeline-step-${idx}`}
              onClick={() => onStepClick(idx, step.routeKey)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900/60 border-emerald-500 shadow-md shadow-emerald-500/5' 
                  : isCompleted 
                    ? 'bg-slate-950/25 border-slate-800/60 hover:border-slate-700/80 text-slate-400' 
                    : 'bg-slate-950/40 border-slate-900 hover:border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                
                {/* Check/State indicator icon */}
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500/10 shrink-0" />
                  ) : isActive ? (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-emerald-400 flex items-center justify-center shrink-0 animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                  ) : (
                    <Circle className="w-4.5 h-4.5 text-slate-600 shrink-0" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold leading-none ${isActive ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/50">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{step.desc}</p>
                </div>

                {/* Trigger map navigation indicator */}
                {step.routeKey && (
                  <div className="self-center shrink-0 pl-1">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Help banner */}
      <div className="mt-4 bg-slate-950 border border-slate-800/80 rounded-xl p-2.5 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="text-[10px] text-slate-400">
          <span className="font-semibold text-slate-300">Match Countdown: </span>
          Stadium gates open at 17:00, kickoff begins at 19:00 sharp. Please leave early.
        </div>
      </div>
    </div>
  );
}
