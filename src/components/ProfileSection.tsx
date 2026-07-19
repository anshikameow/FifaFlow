import React, { useState } from 'react';
import { UserSetup, Stadium, Match } from '../types';
import { 
  User, 
  Accessibility, 
  Globe2, 
  Navigation, 
  Ticket, 
  Save, 
  Sparkles, 
  Check, 
  TrendingUp, 
  Activity,
  BellRing,
  Award
} from 'lucide-react';

interface ProfileSectionProps {
  setup: UserSetup;
  stadiums: Stadium[];
  matches: Match[];
  onUpdateSetup: (newSetup: UserSetup) => void;
}

export default function ProfileSection({
  setup,
  stadiums,
  matches,
  onUpdateSetup
}: ProfileSectionProps) {
  
  // Local state copy to modify settings cleanly
  const [localSeat, setLocalSeat] = useState(setup.seat);
  const [localLanguage, setLocalLanguage] = useState(setup.language);
  const [localAccess, setLocalAccess] = useState(setup.accessibility);
  const [localTransport, setLocalTransport] = useState(setup.transport);
  const [localStadiumId, setLocalStadiumId] = useState(setup.stadiumId);
  const [localMatchId, setLocalMatchId] = useState(setup.matchId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    onUpdateSetup({
      stadiumId: localStadiumId,
      matchId: localMatchId,
      seat: localSeat,
      language: localLanguage,
      accessibility: localAccess,
      transport: localTransport
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const selectedStadium = stadiums.find(s => s.id === localStadiumId) || stadiums[0];
  const selectedMatch = matches.find(m => m.id === localMatchId) || matches[0];

  return (
    <section id="profile-section-container" aria-label="Spectator Profile Customization" className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      
      {/* Left Column: Visual Ticket Pass & Stats card (lg:col-span-5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Visual Ticket card with high-contrast rainbow gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6 text-white border border-indigo-700/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/15 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-pink-300">Official Spectator Pass</span>
              <Award className="w-6 h-6 text-yellow-300" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-indigo-200 uppercase font-mono">STADIUM HOST</span>
              <h3 className="text-lg font-black text-white">{selectedStadium.name}</h3>
              <p className="text-xs text-indigo-100">{selectedStadium.city}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-[9px] text-pink-300 uppercase font-mono block">MATCH FIXTURE</span>
                <span className="text-xs font-black text-white">{selectedMatch.teams}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-pink-300 uppercase font-mono block">STAGE</span>
                <span className="text-xs font-black text-white">{selectedMatch.group.split(' ')[0]}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-white/10 flex items-center justify-between text-center">
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Section</span>
                <div className="text-sm font-black text-yellow-300 mt-0.5">{localSeat}</div>
              </div>
              <div className="h-6 w-[1px] bg-slate-800" />
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Row</span>
                <div className="text-sm font-black text-white mt-0.5">ADA-A</div>
              </div>
              <div className="h-6 w-[1px] bg-slate-800" />
              <div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">Gate Entrance</span>
                <div className="text-sm font-black text-emerald-400 mt-0.5">Gate E</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fan achievements / credentials block */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            Matchday Activity Health Score
          </span>

          <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Ingress Line Speed</span>
              <span className="text-sm font-black text-emerald-400 mt-1 block">Excellent</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Transit delay</span>
              <span className="text-sm font-black text-rose-400 mt-1 block">None</span>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Preferences Settings Panel (lg:col-span-7) */}
      <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <User className="w-4.5 h-4.5 text-indigo-400" />
          Edit My Spectator Preferences
        </h3>

        <div className="space-y-4 font-sans text-xs">
          {/* Seating Sector Input */}
          <div>
            <label htmlFor="profile-seat-input" className="block text-slate-400 font-bold mb-1.5">Sector Seat Assignment</label>
            <input
              id="profile-seat-input"
              type="text"
              value={localSeat}
              onChange={(e) => setLocalSeat(e.target.value)}
              placeholder="e.g. 130"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Language selection drop */}
          <div>
            <label htmlFor="profile-language-select" className="block text-slate-400 font-bold mb-1.5">Assistant language</label>
            <select
              id="profile-language-select"
              value={localLanguage}
              onChange={(e) => setLocalLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <option value="English (US)">English (US)</option>
              <option value="Spanish (ES)">Español (ES)</option>
              <option value="Portuguese (BR)">Português (BR)</option>
              <option value="French (FR)">Français (FR)</option>
              <option value="Hindi (IN)">Hindi (IN)</option>
            </select>
          </div>

          {/* Accessibility mode checklist */}
          <div>
            <label id="profile-accessibility-label" className="block text-slate-400 font-bold mb-1.5">Accessibility profile mode</label>
            <div role="radiogroup" aria-labelledby="profile-accessibility-label" className="grid grid-cols-2 gap-2">
              {[
                { id: 'Standard', label: 'Standard Access' },
                { id: 'Wheelchair', label: 'Wheelchair (Elevator/Ramps)' },
                { id: 'Blind', label: 'Blind Support (Read Aloud)' },
                { id: 'Deaf', label: 'Deaf (High flash notifications)' },
                { id: 'Elderly', label: 'Elderly Support' }
              ].map((acc) => (
                <button
                  key={acc.id}
                  role="radio"
                  aria-checked={localAccess === acc.id}
                  onClick={() => setLocalAccess(acc.id as any)}
                  className={`p-2.5 rounded-xl border text-left font-medium transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer ${
                    localAccess === acc.id 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commute option selection */}
          <div>
            <label id="profile-transport-label" className="block text-slate-400 font-bold mb-1.5">Transportation mode</label>
            <div role="radiogroup" aria-labelledby="profile-transport-label" className="grid grid-cols-4 gap-2">
              {[
                { id: 'Metro', label: 'Metro' },
                { id: 'Car', label: 'Rideshare' },
                { id: 'Bus', label: 'Bus' },
                { id: 'Walking', label: 'Walk' }
              ].map((trans) => (
                <button
                  key={trans.id}
                  role="radio"
                  aria-checked={localTransport === trans.id}
                  onClick={() => setLocalTransport(trans.id as any)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-none cursor-pointer text-[11px] ${
                    localTransport === trans.id 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-black' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {trans.label}
                </button>
              ))}
            </div>
          </div>

          {/* Save trigger */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-extrabold rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:outline-none hover:opacity-90 transition-all uppercase tracking-wider shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4.5 h-4.5" />
            Save Profile Customizations
          </button>

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <Check className="w-4 h-4 shrink-0" />
              <span>Spectator profile updated. Changes fully synced to navigation map and assistant!</span>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
