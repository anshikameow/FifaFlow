import React, { useState, useEffect } from 'react';
import { UserSetup, Match, Stadium, TransportOption } from '../types';
import { 
  Sparkles, 
  Clock, 
  CloudSun, 
  Compass, 
  MapPin,
  Flame, 
  BellRing, 
  TrendingUp, 
  HelpCircle, 
  QrCode, 
  ChevronRight, 
  Activity, 
  HeartHandshake, 
  Ticket, 
  Navigation,
  Globe2
} from 'lucide-react';

interface HomeSectionProps {
  setup: UserSetup;
  match: Match;
  stadium: Stadium;
  transport: TransportOption;
  onNavigateToSection: (section: string) => void;
}

export default function HomeSection({ setup, match, stadium, transport, onNavigateToSection }: HomeSectionProps) {
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 21, seconds: 48 });

  // Real-time Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="home-section-container" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      
      {/* 1. Hero Welcomer Greeting - Dynamic Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-pink-600 to-indigo-800 p-6 md:p-8 text-white shadow-xl shadow-red-500/10">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-yellow-400/20 blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-blue-500/20 blur-[50px] pointer-events-none" />
        
        {/* Decorative Stadium Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-bold tracking-wide">
              <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" />
              FIFA World Cup 2026 • Live Matchday
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Good Evening, <span className="text-yellow-300">Anshika!</span> 👋
            </h2>
            <p className="text-white/80 text-sm max-w-md font-medium leading-relaxed">
              Your personalized AI itinerary is fully primed for <span className="text-white font-bold">{match.teams}</span>. Ready for an unforgettable football spectacle?
            </p>
          </div>

          {/* Premium Countdown Clock Card */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[200px] shadow-lg">
            <span className="text-[10px] font-mono tracking-wider uppercase text-white/60 mb-2 block">Kickoff Countdown</span>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-yellow-300">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono text-white/50 uppercase">Hours</span>
              </div>
              <span className="text-xl font-black text-yellow-300 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-yellow-300">{String(countdown.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono text-white/50 uppercase">Mins</span>
              </div>
              <span className="text-xl font-black text-yellow-300 animate-pulse">:</span>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-yellow-300">{String(countdown.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] font-mono text-white/50 uppercase">Secs</span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gates are Open
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Access Colorful Tiles Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Tile 1: Navigate */}
        <button
          onClick={() => onNavigateToSection('stadium')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-left text-slate-950 shadow-lg shadow-emerald-500/5 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-slate-950/10 flex items-center justify-center mb-3">
            <Compass className="w-5.5 h-5.5 text-slate-950" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-950/60 leading-none">Find Seat</span>
          <span className="block text-base font-extrabold text-slate-950 mt-1">Navigate Map</span>
        </button>

        {/* Tile 2: Food & Eats */}
        <button
          onClick={() => onNavigateToSection('stadium')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-4 text-left text-slate-950 shadow-lg shadow-orange-500/5 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-slate-950/10 flex items-center justify-center mb-3">
            <Flame className="w-5.5 h-5.5 text-slate-950" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-950/60 leading-none">Short Queues</span>
          <span className="block text-base font-extrabold text-slate-950 mt-1">Order Food</span>
        </button>

        {/* Tile 3: AI Match predictions */}
        <button
          onClick={() => onNavigateToSection('match-center')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 p-4 text-left text-white shadow-lg shadow-pink-500/5 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-wider text-white/60 leading-none">AI Predicts</span>
          <span className="block text-base font-extrabold text-white mt-1">Match Center</span>
        </button>

        {/* Tile 4: Smart Assistant */}
        <button
          onClick={() => onNavigateToSection('assistant')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 text-left text-white shadow-lg shadow-indigo-500/5 hover:scale-[1.02] transition-all cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="block text-xs font-bold uppercase tracking-wider text-white/60 leading-none">Expert Bot</span>
          <span className="block text-base font-extrabold text-white mt-1">AI Copilot</span>
        </button>

      </div>

      {/* 3. Bento Grid - Active Smart Context Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card A: Real-time Ticket info & Gate QR */}
        <div className="md:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Ticket className="w-4 h-4 text-emerald-400" />
                Digital Ticket Pass
              </span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="bg-white p-1 rounded-lg shrink-0">
                {/* Simulated high contrast QR Code */}
                <QrCode className="w-16 h-16 text-slate-950" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-mono">SEAT GATE ACCESS</div>
                <div className="text-sm font-extrabold text-slate-200">Section {setup.seat}</div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase">Gate E (ADA Prioritized)</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Section</div>
              <div className="text-xs font-black text-slate-200 mt-0.5">{setup.seat}</div>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Row</div>
              <div className="text-xs font-black text-slate-200 mt-0.5">ADA-A</div>
            </div>
            <div className="bg-slate-950/40 p-2 rounded-xl">
              <div className="text-[9px] text-slate-500 font-bold uppercase">Seat</div>
              <div className="text-xs font-black text-slate-200 mt-0.5">WC-04</div>
            </div>
          </div>
        </div>

        {/* Card B: Live Match Weather & Commute Status */}
        <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Activity className="w-4 h-4 text-blue-400" />
              Live Environment Diagnostics
            </span>
            <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
              Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Weather Module */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <CloudSun className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] text-slate-500 uppercase font-mono">Stadium Climate</div>
                <div className="text-xs font-black text-slate-200">{match.temperature}</div>
                <div className="text-[9px] text-slate-400">{match.weatherCondition}</div>
              </div>
            </div>

            {/* Commute Option Module */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Navigation className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] text-slate-500 uppercase font-mono">Transport: {setup.transport}</div>
                <div className="text-xs font-black text-slate-200">{transport.name}</div>
                <div className="text-[9px] font-bold text-emerald-400">{transport.status} Operations</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 flex items-start gap-2.5">
            <BellRing className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-200">Smart Transit Recommendation:</div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Since you chose <span className="text-slate-200 font-semibold">{setup.transport}</span>, the platform has calculated an optimal hotel departure time at <span className="text-emerald-400 font-bold">16:30</span> to avoid crowd bottlenecks at the main access gates.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Active Stadium Map Preview Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-sm font-bold text-slate-100 flex items-center justify-center md:justify-start gap-1.5">
            <MapPin className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            Stadium Navigation Ready
          </h3>
          <p className="text-[11px] text-slate-400 max-w-md">
            Click step icons in the menu to track interactive paths, check live elevator lineups, or generate safe ADA wheelchair-compliant ramps.
          </p>
        </div>
        <button
          onClick={() => onNavigateToSection('stadium')}
          className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl hover:opacity-90 transition-all shadow-md shadow-emerald-500/10 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
        >
          Open Live Map
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
