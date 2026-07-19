import React, { useState } from 'react';
import { UserSetup, Stadium, Match } from '../types';
import Logo from './Logo';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  User, 
  Globe, 
  Accessibility, 
  Car, 
  Train, 
  Footprints, 
  Bus, 
  ChevronRight, 
  Sparkles,
  SearchCheck,
  FlameKindling,
  Smile,
  Eye,
  Ear,
  Heart,
  Sun,
  Moon
} from 'lucide-react';

interface SetupScreenProps {
  stadiums: Stadium[];
  matches: Match[];
  onComplete: (setup: UserSetup) => void;
  isLight: boolean;
  onToggleTheme: () => void;
}

export default function SetupScreen({ stadiums, matches, onComplete, isLight, onToggleTheme }: SetupScreenProps) {
  const [stadiumId, setStadiumId] = useState('metlife');
  
  // Filter matches based on selected stadium
  const availableMatches = matches.filter(m => m.stadiumId === stadiumId);
  const [matchId, setMatchId] = useState(availableMatches[0]?.id || 'match-1');
  const [seat, setSeat] = useState('112');
  const [language, setLanguage] = useState('English');
  const [accessibility, setAccessibility] = useState<UserSetup['accessibility']>('Standard');
  const [transport, setTransport] = useState<UserSetup['transport']>('Metro');

  // Handle stadium switch to auto-select first match in that stadium
  const handleStadiumChange = (id: string) => {
    setStadiumId(id);
    const related = matches.filter(m => m.stadiumId === id);
    if (related.length > 0) {
      setMatchId(related[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      stadiumId,
      matchId,
      seat,
      language,
      accessibility,
      transport
    });
  };

  const handleDirectEnter = () => {
    onComplete({
      stadiumId,
      matchId,
      seat,
      language,
      accessibility,
      transport
    });
  };

  const getAccessIcon = (id: string) => {
    switch (id) {
      case 'Standard': return <Smile className="w-4 h-4 shrink-0" />;
      case 'Wheelchair': return <Accessibility className="w-4 h-4 shrink-0" />;
      case 'Blind': return <Eye className="w-4 h-4 shrink-0" />;
      case 'Deaf': return <Ear className="w-4 h-4 shrink-0" />;
      case 'Elderly': return <Heart className="w-4 h-4 shrink-0" />;
      default: return <Smile className="w-4 h-4 shrink-0" />;
    }
  };

  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Español (Spanish)', flag: '🇪🇸' },
    { name: 'Português (Portuguese)', flag: '🇧🇷' },
    { name: 'Français (French)', flag: '🇫🇷' },
    { name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { name: 'Deutsch (German)', flag: '🇩🇪' }
  ];

  const accessibilityOptions: { id: UserSetup['accessibility']; label: string; desc: string }[] = [
    { id: 'Standard', label: 'Standard Access', desc: 'Standard pedestrian stairs and routes.' },
    { id: 'Wheelchair', label: 'Wheelchair / ADA', desc: 'Avoids stairs, prioritizes ramps, elevators, and ADA gates.' },
    { id: 'Blind', label: 'Visually Assisted', desc: 'Detailed spatial audio direction markers.' },
    { id: 'Deaf', label: 'Hearing Assisted', desc: 'Emphasizes visual indicators & safety captions.' },
    { id: 'Elderly', label: 'Elderly / Low-Mobility', desc: 'Minimizes walking distances & steep inclines.' }
  ];

  const transportOptions: { id: UserSetup['transport']; label: string; icon: typeof Train; desc: string }[] = [
    { id: 'Metro', label: 'Metro / Train', icon: Train, desc: 'Fast track lines' },
    { id: 'Car', label: 'Rideshare / Car', icon: Car, desc: 'Outer lane drop-off' },
    { id: 'Bus', label: 'Shuttle Bus', icon: Bus, desc: 'Direct gate service' },
    { id: 'Walking', label: 'Walking Only', icon: Footprints, desc: 'Pedestrian paths' }
  ];

  const seats = ['101', '104', '110', '112', '115', '124', '128', '130', '138', '140'];

  // Dynamic color state helpers for Accessibility and Transport modes (Matching World Cup Stripes)
  const getAccessColorClass = (id: string, active: boolean) => {
    if (!active) return 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300';
    switch (id) {
      case 'Standard': return 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.01]';
      case 'Wheelchair': return 'bg-sky-500/10 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.25)] scale-[1.01]';
      case 'Blind': return 'bg-yellow-500/10 border-yellow-500 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.25)] scale-[1.01]';
      case 'Deaf': return 'bg-orange-500/10 border-orange-500 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.25)] scale-[1.01]';
      case 'Elderly': return 'bg-purple-500/10 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] scale-[1.01]';
      default: return 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
    }
  };

  const getTransportColorClass = (id: string, active: boolean) => {
    if (!active) return 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300';
    switch (id) {
      case 'Metro': return 'bg-blue-500/10 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.25)] scale-[1.01]';
      case 'Car': return 'bg-orange-500/10 border-orange-400 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.25)] scale-[1.01]';
      case 'Bus': return 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.01]';
      case 'Walking': return 'bg-purple-500/10 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] scale-[1.01]';
      default: return 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'light bg-slate-50 text-slate-900' : 'dark bg-[#060814] text-slate-100'} flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans transition-colors duration-300`}>
      
      {/* Absolute theme toggle button */}
      <div className="absolute top-4 right-4 z-50">
        <button
          id="setup-theme-toggle"
          type="button"
          onClick={onToggleTheme}
          className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isLight 
              ? 'bg-white border-slate-300 text-slate-700 shadow-lg hover:bg-slate-50 hover:text-slate-900' 
              : 'bg-slate-900/90 border-white/10 text-slate-300 shadow-xl hover:border-white/20 hover:text-white'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-400" />}
        </button>
      </div>

      {/* -------------------- DYNAMIC WORLD CUP COLORFUL STRIPES (BACKGROUND) -------------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-25">
        {/* Top-Left Concentric Stripe Arch */}
        <div className="absolute -left-40 -top-40 w-[650px] h-[650px] rounded-full border-[18px] border-rose-600 flex items-center justify-center animate-[pulse_6s_infinite_ease-in-out]">
          <div className="w-[94%] h-[94%] rounded-full border-[18px] border-orange-500 flex items-center justify-center">
            <div className="w-[94%] h-[94%] rounded-full border-[18px] border-yellow-400 flex items-center justify-center">
              <div className="w-[94%] h-[94%] rounded-full border-[18px] border-lime-400 flex items-center justify-center">
                <div className="w-[94%] h-[94%] rounded-full border-[18px] border-emerald-500 flex items-center justify-center">
                  <div className="w-[94%] h-[94%] rounded-full border-[18px] border-sky-400 flex items-center justify-center">
                    <div className="w-[94%] h-[94%] rounded-full border-[18px] border-blue-600 flex items-center justify-center">
                      <div className="w-[94%] h-[94%] rounded-full border-[18px] border-indigo-700 flex items-center justify-center" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Right Concentric Stripe Arch */}
        <div className="absolute -right-40 -bottom-40 w-[650px] h-[650px] rounded-full border-[18px] border-indigo-700 flex items-center justify-center animate-[pulse_8s_infinite_ease-in-out]">
          <div className="w-[94%] h-[94%] rounded-full border-[18px] border-blue-600 flex items-center justify-center">
            <div className="w-[94%] h-[94%] rounded-full border-[18px] border-sky-400 flex items-center justify-center">
              <div className="w-[94%] h-[94%] rounded-full border-[18px] border-emerald-500 flex items-center justify-center">
                <div className="w-[94%] h-[94%] rounded-full border-[18px] border-lime-400 flex items-center justify-center">
                  <div className="w-[94%] h-[94%] rounded-full border-[18px] border-yellow-400 flex items-center justify-center">
                    <div className="w-[94%] h-[94%] rounded-full border-[18px] border-orange-500 flex items-center justify-center">
                      <div className="w-[94%] h-[94%] rounded-full border-[18px] border-rose-600 flex items-center justify-center" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background blur spots for glow depth */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-yellow-500/5 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
      </div>
      
      {/* Decorative World Cup Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1526_1px,transparent_1px),linear-gradient(to_bottom,#0e1526_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* -------------------- MAIN CONTAINER CARD -------------------- */}
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_60px_-15px_rgba(244,63,94,0.15)] relative z-10 grid grid-cols-1 md:grid-cols-12">
        
        {/* LEFT SIDE: BRAND, WORLD CUP 2026 POSTER & TROPHY EMBLEM */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#060814] to-[#11172a] p-8 flex flex-col justify-between border-r border-white/5 relative overflow-hidden">
          
          {/* Inner poster concentric striped graphic elements */}
          <div className="absolute inset-0 opacity-25 pointer-events-none select-none">
            <div className="absolute -left-16 -top-16 w-[300px] h-[300px] rounded-full border-[12px] border-rose-600 flex items-center justify-center">
              <div className="w-[94%] h-[94%] rounded-full border-[12px] border-orange-500 flex items-center justify-center">
                <div className="w-[94%] h-[94%] rounded-full border-[12px] border-yellow-400 flex items-center justify-center">
                  <div className="w-[94%] h-[94%] rounded-full border-[12px] border-emerald-500 flex items-center justify-center">
                    <div className="w-[94%] h-[94%] rounded-full border-[12px] border-sky-400 flex items-center justify-center" />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-16 -bottom-16 w-[300px] h-[300px] rounded-full border-[12px] border-sky-400 flex items-center justify-center">
              <div className="w-[94%] h-[94%] rounded-full border-[12px] border-emerald-500 flex items-center justify-center">
                <div className="w-[94%] h-[94%] rounded-full border-[12px] border-yellow-400 flex items-center justify-center">
                  <div className="w-[94%] h-[94%] rounded-full border-[12px] border-orange-500 flex items-center justify-center">
                    <div className="w-[94%] h-[94%] rounded-full border-[12px] border-rose-600 flex items-center justify-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Foreground content */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-5">
              
              {/* Official Host Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950/95 border border-yellow-400/30 text-yellow-300 text-[10px] font-black tracking-[0.2em] rounded-full uppercase">
                <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                FIFA WORLD CUP 2026
              </div>

              {/* Spectacular World Cup 2026 Logo Visual Box */}
              <div className="my-5 flex justify-center">
                <div className="relative bg-slate-950/40 border border-white/5 rounded-[28px] p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden group w-full">
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-yellow-400/5 to-indigo-500/10 opacity-80" />
                  <Logo size="lg" isLight={false} showText={true} className="relative z-10" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 id="brand-title" className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  Stadium Copilot AI
                </h1>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Experience a frictionless, colorful, and barrier-free journey. Our AI orchestrates live route directions, parking updates, queue lengths, and seat coordinates custom-tailored to your exact spectator profiles.
                </p>
              </div>

              {/* Immediate Quick Entry Button (Highly Visible on First Load) */}
              <div className="pt-2">
                <button
                  id="direct-enter-btn"
                  type="button"
                  onClick={handleDirectEnter}
                  className="w-full relative group overflow-hidden rounded-2xl p-[1px] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(244,63,94,0.4)]"
                >
                  {/* Glowing rainbow background */}
                  <div className="absolute inset-[-100%] bg-gradient-to-r from-rose-600 via-orange-500 via-yellow-400 via-emerald-500 via-sky-500 to-indigo-600 group-hover:animate-[spin_3s_linear_infinite] opacity-100 transition-all duration-500" />
                  
                  <div className="relative bg-[#060814]/90 text-white font-extrabold py-3.5 px-4 rounded-[15px] flex items-center justify-center gap-2.5 text-xs tracking-wider uppercase transition-colors group-hover:bg-[#060814]/70">
                    <span className="bg-gradient-to-r from-yellow-300 via-rose-400 to-sky-400 bg-clip-text text-transparent group-hover:text-white font-black">
                      ⚡ Quick Enter Arena
                    </span>
                    <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
                <p className="text-[9px] text-slate-400 text-center mt-1.5 font-mono">
                  Enter immediately with default settings, or customize on the right
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20 shrink-0">
                    <SearchCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-200">Zero Hallucination</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Wait times, gate statuses, and facility routes are verified with actual live databases.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20 shrink-0">
                    <Accessibility className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-slate-200">Adaptive Accessibility</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Personalized paths avoiding stairs or steep ramps based on your select profile.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Version / Powered Label */}
            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 font-mono pt-4 border-t border-white/5">
              <FlameKindling className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              FIFA FLOW • POWERED BY GEMINI 3.5 AI
            </div>

          </div>
        </div>

        {/* RIGHT SIDE: ATTRACTIVE CONFIGURATION FORM */}
        <form onSubmit={handleSubmit} className="md:col-span-7 p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[85vh]">
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-500" />
              Configure Matchday Profile
            </h2>

            {/* Stadium & Match Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="stadium-selector" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  Select Stadium
                </label>
                <select 
                  id="stadium-selector"
                  value={stadiumId}
                  onChange={(e) => handleStadiumChange(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 cursor-pointer transition-all"
                >
                  {stadiums.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="match-selector" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  Select Match
                </label>
                <select 
                  id="match-selector"
                  value={matchId}
                  onChange={(e) => setMatchId(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer transition-all"
                >
                  {availableMatches.map(m => (
                    <option key={m.id} value={m.id}>{m.teams}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seat & Preferred Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="seat-selector" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-yellow-400" />
                  Your Seat Section
                </label>
                <select 
                  id="seat-selector"
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 cursor-pointer transition-all"
                >
                  {seats.map(s => (
                    <option key={s} value={s}>Lower Section {s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="language-selector" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Language / अनुवाद
                </label>
                <select 
                  id="language-selector"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 cursor-pointer transition-all"
                >
                  {languages.map(l => (
                    <option key={l.name} value={l.name}>{l.flag} {l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Accessibility Preferences */}
            <div className="space-y-2.5">
              <label id="accessibility-options-label" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Accessibility className="w-3.5 h-3.5 text-sky-400" />
                Accessibility Assistance Mode
              </label>
              <div role="radiogroup" aria-labelledby="accessibility-options-label" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {accessibilityOptions.map(opt => (
                  <button
                    key={opt.id}
                    id={`access-btn-${opt.id}`}
                    type="button"
                    role="radio"
                    aria-checked={accessibility === opt.id}
                    onClick={() => setAccessibility(opt.id)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:outline-none cursor-pointer flex items-start gap-2.5 ${getAccessColorClass(opt.id, accessibility === opt.id)}`}
                  >
                    <div className="mt-0.5 text-inherit shrink-0">
                      {getAccessIcon(opt.id)}
                    </div>
                    <div>
                      <div className="font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-300 mt-0.5 leading-snug line-clamp-2">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Transport Mode */}
            <div className="space-y-2.5">
              <label id="transport-options-label" className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-indigo-400" />
                Preferred Transport Mode
              </label>
              <div role="radiogroup" aria-labelledby="transport-options-label" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {transportOptions.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      id={`transport-btn-${opt.id}`}
                      type="button"
                      role="radio"
                      aria-checked={transport === opt.id}
                      onClick={() => setTransport(opt.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center text-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer ${getTransportColorClass(opt.id, transport === opt.id)}`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <div>
                        <div className="text-[10px] font-bold leading-tight">{opt.label}</div>
                        <div className="text-[8px] text-slate-300 mt-0.5 leading-none">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Actions (Vibrant Official Rainbow Gradient Button) */}
          <button
            id="launch-copilot-button"
            type="submit"
            className="w-full relative group overflow-hidden rounded-2xl py-4 px-6 font-extrabold text-sm tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-[0_10px_30px_-5px_rgba(244,63,94,0.4)] text-white"
          >
            {/* Solid vibrant background from the official guidelines */}
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-orange-500 via-yellow-400 via-emerald-500 via-sky-500 to-indigo-600 opacity-100 transition-all duration-500 group-hover:opacity-95" />
            
            {/* Subtle glow layer */}
            <div className="absolute inset-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

            <div className="relative flex items-center justify-center gap-3 z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              <span className="font-black text-white">
                LAUNCH COPILOT DASHBOARD
              </span>
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
