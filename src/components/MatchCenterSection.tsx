import React, { useState, useEffect } from 'react';
import { UserSetup, Match } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  User, 
  Layers, 
  Swords, 
  Users, 
  Vote, 
  Play, 
  Flame, 
  MessageSquare, 
  Clock, 
  BarChart4, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Plus, 
  X, 
  RotateCcw,
  Activity,
  Smile,
  Shield,
  Coins,
  Send,
  Sliders
} from 'lucide-react';

interface MatchCenterSectionProps {
  setup: UserSetup;
  match: Match;
  onSendMessage: (text: string) => void;
}

// Full fidelity Player Dataset for lineup, comparisons, and Dream Team builder
interface Player {
  id: string;
  name: string;
  country: string;
  flag: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
  club: string;
  rating: number;
  goals: number;
  assists: number;
  passingAccuracy: number;
  speed: number;
  dribbling: number;
  defense: number;
  currentForm: string; // "A+", "A", "B+", etc.
  fitness: number; // Percentage
  strength: string;
  weakness: string;
  formSummary: string;
}

const WORLD_CUP_PLAYERS: Player[] = [
  { id: 'messi', name: 'Lionel Messi', country: 'Argentina', flag: '🇦🇷', position: 'FWD', club: 'Inter Miami', rating: 93, goals: 5, assists: 4, passingAccuracy: 91, speed: 82, dribbling: 96, defense: 38, currentForm: 'A+', fitness: 95, strength: 'Creative vision, dribbling in tight pockets, clinical set-pieces', weakness: 'Low defensive work-rate, physical duels', formSummary: 'Messi continues to operate as Argentina\'s primary offensive engine, generating 12 key chances in his last three matches.' },
  { id: 'mbappe', name: 'Kylian Mbappé', country: 'France', flag: '🇫🇷', position: 'FWD', club: 'Real Madrid', rating: 92, goals: 6, assists: 2, passingAccuracy: 84, speed: 97, dribbling: 92, defense: 36, currentForm: 'A+', fitness: 100, strength: 'Incredible acceleration, counter-attacking runs, lethal inside box', weakness: 'Tracking back, aerial duels', formSummary: 'Mbappé has scored in four consecutive matches and remains France\'s biggest attacking threat.' },
  { id: 'vinicius', name: 'Vinícius Júnior', country: 'Brazil', flag: '🇧🇷', position: 'FWD', club: 'Real Madrid', rating: 90, goals: 4, assists: 3, passingAccuracy: 81, speed: 95, dribbling: 94, defense: 32, currentForm: 'A', fitness: 98, strength: '1v1 take-ons, ball carries, lightning cutbacks', weakness: 'Defensive tracking, occasional composure lapses', formSummary: 'Vini has been in sparkling form for Brazil, terrorizing fullbacks down the left flank.' },
  { id: 'saka', name: 'Bukayo Saka', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'FWD', club: 'Arsenal', rating: 88, goals: 3, assists: 4, passingAccuracy: 86, speed: 89, dribbling: 89, defense: 55, currentForm: 'A', fitness: 96, strength: 'Ball retention, tactical discipline, high crossing accuracy', weakness: 'Physical strength in hold-up play', formSummary: 'Saka is England\'s most consistent progressive passer, heavily active in final-third build-ups.' },
  { id: 'haaland', name: 'Erling Haaland', country: 'Norway', flag: '🇳🇴', position: 'FWD', club: 'Manchester City', rating: 91, goals: 7, assists: 1, passingAccuracy: 77, speed: 90, dribbling: 80, defense: 30, currentForm: 'A+', fitness: 100, strength: 'Savage acceleration, physical shielding, unstoppable finishing', weakness: 'Creative playmaking, aerial contribution to midfield', formSummary: 'Haaland has a phenomenal 1.4 goals-per-game average this season, absolutely lethal inside the 18-yard box.' },
  { id: 'kane', name: 'Harry Kane', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'FWD', club: 'Bayern Munich', rating: 90, goals: 5, assists: 3, passingAccuracy: 88, speed: 78, dribbling: 83, defense: 42, currentForm: 'A', fitness: 94, strength: 'Playmaking from deep, world-class long-range finishing, penalty conversion', weakness: 'Vulnerability to high-speed counters', formSummary: 'Kane plays a hybrid false-nine role beautifully, bringing Saka and other wingers directly into scoring lanes.' },
  { id: 'debruyne', name: 'Kevin De Bruyne', country: 'Belgium', flag: '🇧🇪', position: 'MID', club: 'Manchester City', rating: 91, goals: 2, assists: 6, passingAccuracy: 93, speed: 76, dribbling: 87, defense: 64, currentForm: 'A', fitness: 92, strength: 'Laser cross field passing, deadball delivery, distance shooting', weakness: 'Sprint speed recovery', formSummary: 'De Bruyne has recovered his full peak athletic form, leading Belgium with 6 direct assists in tournament warmups.' },
  { id: 'bellingham', name: 'Jude Bellingham', country: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', position: 'MID', club: 'Real Madrid', rating: 89, goals: 4, assists: 2, passingAccuracy: 88, speed: 84, dribbling: 88, defense: 78, currentForm: 'A+', fitness: 97, strength: 'Late runs into penalty box, box-to-box duel rates, high leadership factor', weakness: 'Aggressive tackling card risk', formSummary: 'Bellingham continues to surprise defenders with deep runs from midfield, scoring 4 times already.' },
  { id: 'rodri', name: 'Rodri', country: 'Spain', flag: '🇪🇸', position: 'MID', club: 'Manchester City', rating: 92, goals: 2, assists: 3, passingAccuracy: 95, speed: 74, dribbling: 83, defense: 89, currentForm: 'A+', fitness: 99, strength: 'Tactical positioning, clean tackles, tempo control, passing under pressure', weakness: 'High-speed acceleration duels', formSummary: 'The midfielder controls the tempo of the game completely, with a massive 95% pass completion rate.' },
  { id: 'marquinhos', name: 'Marquinhos', country: 'Brazil', flag: '🇧🇷', position: 'DEF', club: 'PSG', rating: 87, goals: 1, assists: 0, passingAccuracy: 90, speed: 81, dribbling: 72, defense: 88, currentForm: 'B+', fitness: 96, strength: 'Aerial blocks, defensive leadership, tactical recovery lines', weakness: 'Tackling physically larger targets', formSummary: 'Solid in defense, ensuring Brazil maintains a tidy sheet count in their South American campaign.' },
  { id: 'hakimi', name: 'Achraf Hakimi', country: 'Morocco', flag: '🇲🇦', position: 'DEF', club: 'PSG', rating: 86, goals: 2, assists: 4, passingAccuracy: 85, speed: 94, dribbling: 84, defense: 75, currentForm: 'A', fitness: 98, strength: 'Overlap speed, offensive stamina, crossing under pressure', weakness: 'Over-commitment in winger duels', formSummary: 'Morocco\'s primary counter threat down the right wing, providing stellar service into the final third.' },
  { id: 'courtois', name: 'Thibaut Courtois', country: 'Belgium', flag: '🇧🇪', position: 'GK', club: 'Real Madrid', rating: 90, goals: 0, assists: 0, passingAccuracy: 72, speed: 52, dribbling: 50, defense: 91, currentForm: 'A', fitness: 95, strength: 'Incredible wingspan reach, 1v1 shot stopping, cross collections', weakness: 'Slower reactions on ground low-drills', formSummary: 'Remains an immovable object in goal, conceding only 2 goals in his last 5 matches.' }
];

export default function MatchCenterSection({ setup, match, onSendMessage }: MatchCenterSectionProps) {
  // Navigation tabs inside Match Center
  const [subTab, setSubTab] = useState<'predictor' | 'lineups' | 'live' | 'fan'>('predictor');
  
  // States for interactive components
  const [selectedMatchId, setSelectedMatchId] = useState<string>(setup.matchId);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>(WORLD_CUP_PLAYERS[0]);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  // Player comparison states
  const [compareLeft, setCompareLeft] = useState<Player>(WORLD_CUP_PLAYERS[0]);
  const [compareRight, setCompareRight] = useState<Player>(WORLD_CUP_PLAYERS[1]);

  // AI Match Simulator state
  const [simScenario, setSimScenario] = useState<string>('');
  const [simResults, setSimResults] = useState<{
    scenario: string;
    leftProb: number;
    rightProb: number;
    drawProb: number;
    explanation: string;
  } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Predict the score inputs
  const [predictedScoreHome, setPredictedScoreHome] = useState('2');
  const [predictedScoreAway, setPredictedScoreAway] = useState('1');
  const [predictedScorer, setPredictedScorer] = useState('Kylian Mbappé');
  const [predictedPOTM, setPredictedPOTM] = useState('Lionel Messi');
  const [hasPredicted, setHasPredicted] = useState(false);

  // Dream Team Builder XI state
  const [dreamTeam, setDreamTeam] = useState<{ [pos: string]: Player | null }>({
    'GK': WORLD_CUP_PLAYERS.find(p => p.position === 'GK') || null,
    'LCB': WORLD_CUP_PLAYERS.find(p => p.position === 'DEF') || null,
    'RCB': WORLD_CUP_PLAYERS.find(p => p.position === 'DEF') || null,
    'LWB': null,
    'RWB': null,
    'LDM': WORLD_CUP_PLAYERS.find(p => p.name === 'Rodri') || null,
    'RCM': WORLD_CUP_PLAYERS.find(p => p.name === 'Kevin De Bruyne') || null,
    'CAM': WORLD_CUP_PLAYERS.find(p => p.name === 'Jude Bellingham') || null,
    'LW': WORLD_CUP_PLAYERS.find(p => p.name === 'Vinícius Júnior') || null,
    'ST': WORLD_CUP_PLAYERS.find(p => p.name === 'Erling Haaland') || null,
    'RW': WORLD_CUP_PLAYERS.find(p => p.name === 'Lionel Messi') || null
  });
  const [aiTeamCritique, setAiTeamCritique] = useState<string>(
    "ℹ️ Select players to occupy vacant spots. Current critique: Your squad is balanced, but adding a specialized defensive wingback could offer stronger recovery speed."
  );

  // Interactive Live Commentary logs
  const [liveCommentary, setLiveCommentary] = useState<any[]>([
    { min: '45+1\'', event: 'Half Time', text: 'Halftime whistle! A breathless first half concludes. Both sides exchanging relentless blows.', type: 'whistle' },
    { min: '38\'', event: 'Yellow Card', text: 'Rodri is cautioned after a tactical foul halting a fast counter-attack.', type: 'card' },
    { min: '21\'', event: 'GOAL!', text: 'GOAL! Alvarez finishes brilliantly after a perfectly timed through ball.', type: 'goal' },
    { min: '12\'', event: 'Shot Saved', text: 'Courtois makes a spectacular fingertip save to deny Mbappe\'s curling effort!', type: 'save' },
    { min: '1\'', event: 'Kickoff', text: 'We are underway in front of 82,500 roaring fans at the stadium!', type: 'kickoff' }
  ]);
  const [newCommentaryInput, setNewCommentaryInput] = useState('');

  // Daily Quiz state
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Fan Poll states
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState({
    'Lionel Messi': 48,
    'Kylian Mbappé': 35,
    'Erling Haaland': 11,
    'Vinícius Júnior': 6
  });

  // Expandable cards for Pre-match preview
  const [previewExpanded, setPreviewExpanded] = useState<string | null>(null);

  const togglePreview = (cardKey: string) => {
    setPreviewExpanded(previewExpanded === cardKey ? null : cardKey);
  };

  // Triggering the Match Simulator
  const triggerSimulation = (scenario: string) => {
    setIsSimulating(true);
    setSimScenario(scenario);
    
    setTimeout(() => {
      let leftProb = 55;
      let rightProb = 30;
      let drawProb = 15;
      let explanation = "";

      if (scenario.includes("Messi doesn't play")) {
        leftProb = 42;
        rightProb = 40;
        drawProb = 18;
        explanation = "Without Messi as the primary playmaking hub, Argentina's win chance drops by 13%. Brazil's tactical block gains better security, making a tight draw or narrow Brazil win highly likely.";
      } else if (scenario.includes("Brazil scores first")) {
        leftProb = 28;
        rightProb = 58;
        drawProb = 14;
        explanation = "Brazil's conversion rate when leading is 84%. An early goal enables them to drop into their favored mid-block, exposing Argentina's backline to lethal speed counters from Vinicius.";
      } else if (scenario.includes("red card")) {
        leftProb = 74;
        rightProb = 14;
        drawProb = 12;
        explanation = "Going down to 10 men drastically impacts spatial coverage. France's possession probability drops to 31%, allowing opponent overloads on the halfspaces.";
      } else {
        leftProb = 48;
        rightProb = 38;
        drawProb = 14;
        explanation = "Custom Scenario: Midfield dominance shifts dramatically. Standard margins decrease.";
      }

      setSimResults({
        scenario,
        leftProb,
        rightProb,
        drawProb,
        explanation
      });
      setIsSimulating(false);
    }, 1200);
  };

  // Custom player selection into Dream Team builder
  const handleSelectDreamPlayer = (positionKey: string, player: Player) => {
    setDreamTeam(prev => {
      const updated = { ...prev, [positionKey]: player };
      
      // Calculate dynamic critique
      const playerList = Object.values(updated) as (Player | null)[];
      const fwds = playerList.filter(p => p?.position === 'FWD').length;
      const mids = playerList.filter(p => p?.position === 'MID').length;
      const defs = playerList.filter(p => p?.position === 'DEF').length;

      let critique = "ℹ️ Team Saved! ";
      if (fwds > 4) {
        critique += "Warning: You have too many attacking players and no defensive midfielder. Opponent transitions will shred your defensive block!";
      } else if (defs < 3) {
        critique += "Warning: Understaffed defensive wall. Consider adding a center back to safeguard against crossing overloads.";
      } else {
        critique += "Symmetric balance achieved! The AI approves this starting XI. Highly cohesive spacing.";
      }
      setAiTeamCritique(critique);

      return updated;
    });
  };

  // Cast Fan Poll Vote
  const handlePollVote = (player: string) => {
    if (pollVoted) return;
    setPollVoted(player);
    setPollVotes(prev => ({
      ...prev,
      [player]: prev[player as keyof typeof prev] + 1
    }));
  };

  // Submit Predicted Score
  const handlePredictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasPredicted(true);
  };

  // Add Live Commentary Action
  const handleAddCommentary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentaryInput.trim()) return;
    
    const newEvent = {
      min: '48\'',
      event: newCommentaryInput.toLowerCase().includes('goal') ? 'GOAL!' : 'Live Action',
      text: newCommentaryInput,
      type: newCommentaryInput.toLowerCase().includes('goal') ? 'goal' : 'live'
    };

    setLiveCommentary(prev => [newEvent, ...prev]);
    setNewCommentaryInput('');
  };

  return (
    <div id="match-center-container" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Premium Match Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 border border-indigo-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/10">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Flame className="w-6 h-6 text-pink-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">
              FIFA World Cup 2026 Matchday Arena
            </h2>
            <p className="text-xs text-indigo-200">The Ultimate Hub: Real-time projections, lineups, simulator & fan voting</p>
          </div>
        </div>

        {/* Dynamic subtabs menu navigation - Spotify style */}
        <div className="flex bg-slate-950/60 p-1 rounded-2xl border border-slate-800 self-start md:self-center">
          <button
            onClick={() => setSubTab('predictor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'predictor' 
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Projections
          </button>
          <button
            onClick={() => setSubTab('lineups')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'lineups' 
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Tactics
          </button>
          <button
            onClick={() => setSubTab('live')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'live' 
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Live & Stats
          </button>
          <button
            onClick={() => setSubTab('fan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'fan' 
                ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            Fan Zone
          </button>
        </div>
      </div>

      {/* ==================== SUB-TAB 1: PREDICTOR & PREVIEW ==================== */}
      {subTab === 'predictor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 1: AI Match Predictor (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-yellow-300" />
                    AI Match Predictor Pro
                  </h3>
                  <p className="text-[11px] text-slate-400">Deep neural probability metrics & conversational justifications</p>
                </div>
                <div className="text-[10px] font-mono font-bold bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                  92% Match Accuracy
                </div>
              </div>

              {/* Predictor Card Display */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Team Left */}
                <div className="flex flex-col items-center text-center space-y-3 flex-1">
                  <div className="text-4xl">🇦🇷</div>
                  <div>
                    <h4 className="text-sm font-black text-slate-100">Argentina</h4>
                    <span className="text-[10px] font-mono text-slate-400">Group Stage Favorite</span>
                  </div>
                  {/* Probability Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke="#34d399" strokeWidth="6" fill="transparent" strokeDasharray="201" strokeDashoffset="64" />
                    </svg>
                    <span className="absolute text-sm font-mono font-black text-emerald-400">68%</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Win Chance</span>
                </div>

                {/* Match Center Divider / Score */}
                <div className="flex flex-col items-center justify-center space-y-2 min-w-[120px] py-4 px-2 border-y md:border-y-0 md:border-x border-slate-800">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">PREDICTED SCORE</span>
                  <div className="text-3xl font-black bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">2 - 1</div>
                  <div className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded text-slate-300">
                    Confidence: <span className="text-yellow-400 font-bold">HIGH</span>
                  </div>
                </div>

                {/* Team Right */}
                <div className="flex flex-col items-center text-center space-y-3 flex-1">
                  <div className="text-4xl">🇧🇷</div>
                  <div>
                    <h4 className="text-sm font-black text-slate-100">Brazil</h4>
                    <span className="text-[10px] font-mono text-slate-400">Continental Challenger</span>
                  </div>
                  {/* Probability Ring */}
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke="#f43f5e" strokeWidth="6" fill="transparent" strokeDasharray="201" strokeDashoffset="136" />
                    </svg>
                    <span className="absolute text-sm font-mono font-black text-rose-400">32%</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Win Chance</span>
                </div>
              </div>

              {/* Conversational Explanation */}
              <div className="mt-5 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  AI Predictor Summary Insight:
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Argentina is favored in this historic matchday because they exhibit a <span className="text-yellow-300 font-semibold">superior recent form curve</span>, maintaining higher average possession (58%) and a stronger defensive record with 4 clean sheets. Conversely, Brazil is suffering from two injured key starting defenders, exposing structural transition weaknesses which Lionel Messi can readily exploit.
                </p>
              </div>
            </div>

            {/* AI Match Simulator Section */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
              <div className="space-y-1 mb-5">
                <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                  <Play className="w-4.5 h-4.5 text-pink-500" />
                  AI Match Scenario Simulator
                </h3>
                <p className="text-[11px] text-slate-400">Pose tactical "What-If" queries and witness how probabilities fluctuate dynamically</p>
              </div>

              {/* Sim prompt choices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => triggerSimulation("What if Messi doesn't play?")}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs hover:border-pink-500/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-slate-300 font-medium">What if Messi doesn't play?</span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => triggerSimulation("What if Brazil scores first?")}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs hover:border-pink-500/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-slate-300 font-medium">What if Brazil scores first?</span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => triggerSimulation("What if France gets a red card?")}
                  className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs hover:border-pink-500/50 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-slate-300 font-medium">What if France gets a red card?</span>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Simulating Loading or Results rendering */}
              {isSimulating && (
                <div className="mt-4 p-6 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <span className="w-8 h-8 rounded-full border-4 border-t-pink-500 border-slate-800 animate-spin" />
                  <span className="text-xs font-mono text-slate-400">AI recalculating possession density indices...</span>
                </div>
              )}

              {simResults && !isSimulating && (
                <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-pink-500/20 space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-pink-400">Simulation Target: {simResults.scenario}</span>
                    <button onClick={() => setSimResults(null)} className="text-slate-500 hover:text-slate-300 text-xs font-bold">Clear</button>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">Argentina Win</div>
                      <div className="text-base font-black text-emerald-400 mt-0.5">{simResults.leftProb}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">Draw Prob</div>
                      <div className="text-base font-black text-slate-400 mt-0.5">{simResults.drawProb}%</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">Brazil Win</div>
                      <div className="text-base font-black text-rose-400 mt-0.5">{simResults.rightProb}%</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{simResults.explanation}</p>
                </div>
              )}
            </div>

          </div>

          {/* Panel 2: AI Match Preview (lg:col-span-4) - Expandable tactical cards */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Swords className="w-4.5 h-4.5 text-yellow-400" />
                AI Match Preview Guide
              </h3>
              <p className="text-[11px] text-slate-400">Click headers to expand key tactical comparisons</p>

              <div className="space-y-2.5">
                {/* Expandable Card 1 */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => togglePreview('strengths')}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-900/40 text-left cursor-pointer"
                  >
                    <span className="text-xs font-bold text-emerald-400">Argentina Key Strengths</span>
                    {previewExpanded === 'strengths' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {previewExpanded === 'strengths' && (
                    <div className="p-3 pt-0 text-[10px] text-slate-400 space-y-1.5 border-t border-slate-900">
                      <div>⚽ <strong>Elite Playmaking:</strong> Messi & Mac Allister control the halfspaces flawlessly.</div>
                      <div>🛡️ <strong>Transition Locks:</strong> High defensive safety structure prevents counters.</div>
                    </div>
                  )}
                </div>

                {/* Expandable Card 2 */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => togglePreview('weaknesses')}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-900/40 text-left cursor-pointer"
                  >
                    <span className="text-xs font-bold text-rose-400">Brazil Key Weaknesses</span>
                    {previewExpanded === 'weaknesses' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {previewExpanded === 'weaknesses' && (
                    <div className="p-3 pt-0 text-[10px] text-slate-400 space-y-1.5 border-t border-slate-900">
                      <div>🚨 <strong>Winger Coverage:</strong> Injured wingbacks create vulnerability against overloads.</div>
                      <div>⚠️ <strong>Yellow Risk:</strong> Aggressive mid-block tackling leads to costly cards.</div>
                    </div>
                  )}
                </div>

                {/* Expandable Card 3 */}
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => togglePreview('tactical')}
                    className="w-full p-3 flex items-center justify-between hover:bg-slate-900/40 text-left cursor-pointer"
                  >
                    <span className="text-xs font-bold text-indigo-400">Tactical Duel Comparison</span>
                    {previewExpanded === 'tactical' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {previewExpanded === 'tactical' && (
                    <div className="p-3 pt-0 text-[10px] text-slate-400 space-y-1.5 border-t border-slate-900">
                      <p>Argentina maintains slow tempo, possession-oriented passing patterns. Brazil leverages rapid, direct, direct transitions targeting space behind wingbacks.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 2: LINEUPS & COMPARISONS ==================== */}
      {subTab === 'lineups' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 1: Predicted Lineups & Visual Pitch (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-indigo-400" />
                    Starting XI & Lineup Projections
                  </h3>
                  <p className="text-[11px] text-slate-400">Tap any player below to inspect deep AI Form summaries & heatmaps</p>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Confirmed Lineup
                </div>
              </div>

              {/* Grid of Players */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WORLD_CUP_PLAYERS.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      setSelectedPlayer(player);
                      setIsPlayerModalOpen(true);
                    }}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{player.flag}</span>
                        <h4 className="text-xs font-black text-slate-100 group-hover:text-indigo-400 transition-colors">
                          {player.name}
                        </h4>
                      </div>
                      <div className="text-[9px] text-slate-500 font-medium">
                        {player.position} • {player.club}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-1 py-0.2 rounded">
                          Form: <span className="text-emerald-400">{player.currentForm}</span>
                        </span>
                        <span className="text-[9px] text-slate-500">Fit: {player.fitness}%</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-1 rounded">
                      {player.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Player Comparison Widget */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Swords className="w-4.5 h-4.5 text-pink-500" />
                Player Head-to-Head Comparison
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Select Left */}
                <div className="w-full sm:w-auto flex-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Compare Player A</label>
                  <select
                    value={compareLeft.id}
                    onChange={(e) => setCompareLeft(WORLD_CUP_PLAYERS.find(p => p.id === e.target.value) || WORLD_CUP_PLAYERS[0])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                  >
                    {WORLD_CUP_PLAYERS.map(p => <option key={p.id} value={p.id}>{p.flag} {p.name} ({p.position})</option>)}
                  </select>
                </div>

                <div className="text-xs font-bold text-slate-500">VS</div>

                {/* Select Right */}
                <div className="w-full sm:w-auto flex-1">
                  <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Compare Player B</label>
                  <select
                    value={compareRight.id}
                    onChange={(e) => setCompareRight(WORLD_CUP_PLAYERS.find(p => p.id === e.target.value) || WORLD_CUP_PLAYERS[1])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                  >
                    {WORLD_CUP_PLAYERS.map(p => <option key={p.id} value={p.id}>{p.flag} {p.name} ({p.position})</option>)}
                  </select>
                </div>
              </div>

              {/* Graphical Attribute slider stats comparison */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3.5">
                {/* Stat Row 1: Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{compareLeft.speed} - {compareLeft.name}</span>
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Speed</span>
                    <span className="text-pink-400 font-bold">{compareRight.name} - {compareRight.speed}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: `${(compareLeft.speed / (compareLeft.speed + compareRight.speed)) * 100}%` }} className="bg-emerald-400 h-full" />
                    <div style={{ width: `${(compareRight.speed / (compareLeft.speed + compareRight.speed)) * 100}%` }} className="bg-pink-400 h-full" />
                  </div>
                </div>

                {/* Stat Row 2: Goals */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{compareLeft.goals}</span>
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Goals Scored</span>
                    <span className="text-pink-400 font-bold">{compareRight.goals}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: `${compareLeft.goals === 0 && compareRight.goals === 0 ? 50 : (compareLeft.goals / (compareLeft.goals + compareRight.goals)) * 100}%` }} className="bg-emerald-400 h-full" />
                    <div style={{ width: `${compareLeft.goals === 0 && compareRight.goals === 0 ? 50 : (compareRight.goals / (compareLeft.goals + compareRight.goals)) * 100}%` }} className="bg-pink-400 h-full" />
                  </div>
                </div>

                {/* Stat Row 3: Dribbling */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{compareLeft.dribbling}</span>
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Dribbling</span>
                    <span className="text-pink-400 font-bold">{compareRight.dribbling}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: `${(compareLeft.dribbling / (compareLeft.dribbling + compareRight.dribbling)) * 100}%` }} className="bg-emerald-400 h-full" />
                    <div style={{ width: `${(compareRight.dribbling / (compareLeft.dribbling + compareRight.dribbling)) * 100}%` }} className="bg-pink-400 h-full" />
                  </div>
                </div>

                {/* Stat Row 4: Passing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{compareLeft.passingAccuracy}%</span>
                    <span className="text-slate-500 uppercase tracking-wider font-bold">Passing Accuracy</span>
                    <span className="text-pink-400 font-bold">{compareRight.passingAccuracy}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 flex overflow-hidden">
                    <div style={{ width: `${(compareLeft.passingAccuracy / (compareLeft.passingAccuracy + compareRight.passingAccuracy)) * 100}%` }} className="bg-emerald-400 h-full" />
                    <div style={{ width: `${(compareRight.passingAccuracy / (compareLeft.passingAccuracy + compareRight.passingAccuracy)) * 100}%` }} className="bg-pink-400 h-full" />
                  </div>
                </div>
              </div>

              {/* Smart AI Comparative Commentary sentence */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[9px] block mb-1">AI Tactical Comparative Report</span>
                "{compareLeft.name} tends to operate with a high creative footprint, maintaining {compareLeft.passingAccuracy}% passing efficiency in the final third. In contrast, {compareRight.name} contributes superior speed metrics ({compareRight.speed} speed ranking), which translates into significantly faster counter-attack progression."
              </div>
            </div>

          </div>

          {/* Panel 2: AI Player Analysis Modal popup simulation (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <User className="w-4.5 h-4.5 text-yellow-400" />
                Selected Player Inspect
              </h3>

              {selectedPlayer ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl shrink-0">
                      {selectedPlayer.flag}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-100">{selectedPlayer.name}</h4>
                      <p className="text-[10px] text-slate-400">{selectedPlayer.position} • {selectedPlayer.club}</p>
                    </div>
                  </div>

                  {/* Stats card */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block">GOALS</span>
                      <span className="text-sm font-black text-slate-200">{selectedPlayer.goals}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ASSISTS</span>
                      <span className="text-sm font-black text-slate-200">{selectedPlayer.assists}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">RATING</span>
                      <span className="text-sm font-black text-emerald-400">★ {selectedPlayer.rating}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PASS ACCURACY</span>
                      <span className="text-sm font-black text-slate-200">{selectedPlayer.passingAccuracy}%</span>
                    </div>
                  </div>

                  {/* Heatmap Placeholder visual */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">AI Match Heatmap Tracker</span>
                    <div className="h-24 rounded-xl bg-gradient-to-br from-emerald-950 via-slate-950 to-rose-950 border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
                      {/* Fake football pitch outlines */}
                      <div className="absolute inset-x-0 h-[1px] bg-white/5 top-1/2" />
                      <div className="absolute w-12 h-12 rounded-full border border-white/5" />
                      {/* Thermal hot glow spots */}
                      <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-rose-500/40 blur-xl animate-pulse" />
                      <div className="absolute top-1/2 left-2/3 w-6 h-6 rounded-full bg-emerald-500/30 blur-lg" />
                      <div className="absolute top-1/3 left-1/2 w-4 h-4 rounded-full bg-amber-400/30 blur-md" />
                      
                      <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider uppercase z-10 bg-slate-950/80 border border-slate-800/50 px-2 py-0.5 rounded">
                        High activity: Left Wing
                      </span>
                    </div>
                  </div>

                  {/* Strengths / Weaknesses */}
                  <div className="space-y-2 text-[10px]">
                    <div>
                      <span className="text-emerald-400 font-bold block mb-0.5">💪 Tactical Strengths:</span>
                      <p className="text-slate-400 leading-relaxed font-sans">{selectedPlayer.strength}</p>
                    </div>
                    <div>
                      <span className="text-rose-400 font-bold block mb-0.5">⚠️ Tactical Weaknesses:</span>
                      <p className="text-slate-400 leading-relaxed font-sans">{selectedPlayer.weakness}</p>
                    </div>
                  </div>

                  {/* Live form quote */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] text-slate-300">
                    <span className="font-bold text-yellow-400">AI Form Commentary:</span>
                    <p className="mt-1 font-sans">"{selectedPlayer.formSummary}"</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">Select a player from the lineup sheet to inspect analytics.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 3: LIVE RE-TIME COMMENTARY & STATISTICS ==================== */}
      {subTab === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 1: Live AI Commentary feed ticker (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                    Live AI Commentary Feed
                  </h3>
                  <p className="text-[11px] text-slate-400">Simulating live match events as they roll on the turf</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest animate-pulse">
                  Live Feed Active
                </div>
              </div>

              {/* Commentary interactive adding form */}
              <form onSubmit={handleAddCommentary} className="mb-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask commentary helper, e.g. 'France hits the woodwork!'..."
                  value={newCommentaryInput}
                  onChange={(e) => setNewCommentaryInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 bg-rose-650 border border-rose-550 text-slate-100 text-xs font-bold rounded-xl hover:bg-rose-600 transition-all cursor-pointer shadow-md"
                >
                  Post Goal
                </button>
              </form>

              {/* Vertical Scroll of commentary list */}
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {liveCommentary.map((comm, idx) => (
                  <div key={idx} className="flex gap-3 text-xs font-sans items-start p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl animate-in fade-in">
                    <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400 shrink-0">
                      {comm.min}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-black uppercase tracking-wider ${
                          comm.type === 'goal' ? 'text-emerald-400' : comm.type === 'card' ? 'text-yellow-400' : 'text-slate-500'
                        }`}>
                          {comm.event}
                        </span>
                        {comm.type === 'goal' && <span className="animate-ping w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{comm.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Post-Match Summary Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2 mb-3">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                AI Post-Match Narrative Summary
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">A descriptive narrative of the main match outcome instead of dry stats</p>
              
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-xs leading-relaxed text-slate-300 space-y-2 font-sans">
                <p>
                  🏆 <strong>The Grand Wrap:</strong> Argentina held off a fierce late French surge to claim a legendary victory. The defining tactical highlight was Scaloni’s mid-match rotation shifting into a three-man center block, completely closing down the overlapping channels that Mbappe was targeting.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mt-2">
                  <div><strong>Best Player:</strong> Lionel Messi (9.3 Rating)</div>
                  <div><strong>Biggest Turning Point:</strong> Martinez penalty block (72')</div>
                </div>
              </div>
            </div>

          </div>

          {/* Panel 2: Live Match Statistics & Charts (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-5">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <BarChart4 className="w-4.5 h-4.5 text-indigo-400" />
                Match stats & Analytics
              </h3>

              <div className="space-y-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                {/* Stat 1: Possession */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-indigo-400 font-bold">54% ARG</span>
                    <span className="text-slate-500 uppercase tracking-widest font-bold">Possession</span>
                    <span className="text-pink-400 font-bold">46% FRA</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '54%' }} />
                    <div className="bg-pink-500 h-full" style={{ width: '46%' }} />
                  </div>
                </div>

                {/* Stat 2: Shots */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-indigo-400 font-bold">14 Shots</span>
                    <span className="text-slate-500 uppercase tracking-widest font-bold">Total Shots</span>
                    <span className="text-pink-400 font-bold">11 Shots</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '56%' }} />
                    <div className="bg-pink-500 h-full" style={{ width: '44%' }} />
                  </div>
                </div>

                {/* Stat 3: Expected Goals (xG) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-indigo-400 font-bold">2.14 xG</span>
                    <span className="text-slate-500 uppercase tracking-widest font-bold">Expected Goals</span>
                    <span className="text-pink-400 font-bold">1.48 xG</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '59%' }} />
                    <div className="bg-pink-500 h-full" style={{ width: '41%' }} />
                  </div>
                </div>

                {/* Stat 4: Pass Accuracy */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-indigo-400 font-bold">88% ARG</span>
                    <span className="text-slate-500 uppercase tracking-widest font-bold">Passing accuracy</span>
                    <span className="text-pink-400 font-bold">82% FRA</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 flex overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: '88%' }} />
                    <div className="bg-pink-500 h-full" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>

              {/* Match Incidents Timeline */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Match Incidents Timeline</span>
                
                <div className="relative border-l border-slate-800 pl-4 ml-2.5 space-y-4">
                  {/* Timeline Node 1 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                    <div className="text-[10px] font-bold text-slate-300">90\' • Full Time whistle</div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Match concludes. Argentina wins 2-1 over France.</p>
                  </div>
                  
                  {/* Timeline Node 2 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-slate-950" />
                    <div className="text-[10px] font-bold text-slate-300">75\' • Substitution</div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Di Maria exits. Lisandro Martinez enters to lock defensive lanes.</p>
                  </div>

                  {/* Timeline Node 3 */}
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
                    <div className="text-[10px] font-bold text-slate-300">21\' • Goal! Alvarez</div>
                    <p className="text-[9px] text-slate-500 mt-0.5">Julian Alvarez slams in a clean finish into the lower corner.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ==================== SUB-TAB 4: FAN ZONE PREDICTIONS & QUIZZES ==================== */}
      {subTab === 'fan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Panel 1: Dream Team XI Builder (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 relative">
              <div className="space-y-1 mb-4">
                <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-emerald-400" />
                  My Dream World Cup XI Builder
                </h3>
                <p className="text-[11px] text-slate-400">Assemble your custom fantasy starting lineup. AI analyzes and approves team chemistry index.</p>
              </div>

              {/* Grid of Pitch Positions */}
              <div className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 rounded-2xl p-4 border border-emerald-500/20 space-y-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />
                
                <div className="grid grid-cols-3 gap-3">
                  {/* GK */}
                  <div className="col-span-3 flex flex-col items-center">
                    <span className="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded mb-1">GK</span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-28 text-center text-[10px]">
                      {dreamTeam['GK'] ? `${dreamTeam['GK'].flag} ${dreamTeam['GK'].name}` : '❌ Vacant Slot'}
                    </div>
                  </div>

                  {/* DEFS */}
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded mb-1">LCB</span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-full text-center text-[10px]">
                      {dreamTeam['LCB'] ? `${dreamTeam['LCB'].flag} ${dreamTeam['LCB'].name}` : '❌ Empty'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded mb-1">RCB</span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-full text-center text-[10px]">
                      {dreamTeam['RCB'] ? `${dreamTeam['RCB'].flag} ${dreamTeam['RCB'].name}` : '❌ Empty'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1 py-0.2 rounded mb-1">DM</span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-full text-center text-[10px]">
                      {dreamTeam['LDM'] ? `${dreamTeam['LDM'].flag} ${dreamTeam['LDM'].name}` : '❌ Empty'}
                    </div>
                  </div>

                  {/* MIDS */}
                  <div className="col-span-3 flex justify-around gap-2">
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-emerald-300 block mb-1">LCM</span>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] w-28 text-center">
                        {dreamTeam['RCM'] ? `${dreamTeam['RCM'].flag} ${dreamTeam['RCM'].name}` : '❌ Vacant'}
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-[8px] font-mono text-emerald-300 block mb-1">CAM</span>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] w-28 text-center">
                        {dreamTeam['CAM'] ? `${dreamTeam['CAM'].flag} ${dreamTeam['CAM'].name}` : '❌ Vacant'}
                      </div>
                    </div>
                  </div>

                  {/* FWDS */}
                  <div className="col-span-3 flex justify-between gap-2 mt-2">
                    <div className="text-center flex-1">
                      <span className="text-[8px] font-mono text-emerald-300 block mb-1">LW</span>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
                        {dreamTeam['LW'] ? `${dreamTeam['LW'].flag} ${dreamTeam['LW'].name}` : '❌ Empty'}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <span className="text-[8px] font-mono text-emerald-300 block mb-1">ST</span>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
                        {dreamTeam['ST'] ? `${dreamTeam['ST'].flag} ${dreamTeam['ST'].name}` : '❌ Empty'}
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <span className="text-[8px] font-mono text-emerald-300 block mb-1">RW</span>
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px]">
                        {dreamTeam['RW'] ? `${dreamTeam['RW'].flag} ${dreamTeam['RW'].name}` : '❌ Empty'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive team adding selectors */}
                <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between gap-4">
                  <div className="text-[10px] text-slate-400 font-mono">Fill LW slot:</div>
                  <div className="flex gap-1 overflow-x-auto max-w-[400px] scrollbar-none">
                    {WORLD_CUP_PLAYERS.filter(p => p.position === 'FWD').map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectDreamPlayer('LW', p)}
                        className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[9px] hover:border-emerald-400 text-slate-300 shrink-0 cursor-pointer"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Critique badge banner */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-sans leading-relaxed">
                <span className="font-bold text-yellow-300">AI Tactical XI Coach Critique:</span>
                <p className="mt-0.5">{aiTeamCritique}</p>
              </div>
            </div>

            {/* Guess & Predict the score */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-pink-400" />
                World Cup Match Score Predictions
              </h3>

              <form onSubmit={handlePredictSubmit} className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">ARG Score Goal</label>
                    <input
                      type="number"
                      value={predictedScoreHome}
                      onChange={(e) => setPredictedScoreHome(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-300 text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">FRA Score Goal</label>
                    <input
                      type="number"
                      value={predictedScoreAway}
                      onChange={(e) => setPredictedScoreAway(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-300 text-center font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">First Scorer Choice</label>
                    <input
                      type="text"
                      value={predictedScorer}
                      onChange={(e) => setPredictedScorer(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1">Player of the Match</label>
                    <input
                      type="text"
                      value={predictedPOTM}
                      onChange={(e) => setPredictedPOTM(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold rounded-xl hover:opacity-90 transition-all text-xs uppercase cursor-pointer"
                >
                  Submit Score Prediction to Fan Pool
                </button>
              </form>

              {hasPredicted && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Success! Your predictions were submitted. Community Pool average: <span className="font-bold text-white">ARG 2.4 - 1.2 FRA</span>.</span>
                </div>
              )}
            </div>

          </div>

          {/* Panel 2: Fun Football Quizzes, Trivia & Live Polls (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Daily Football Quiz */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Football Quiz</h4>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-200">
                  Which national team holds the record for the most FIFA World Cup appearances in history?
                </p>

                <div className="space-y-2">
                  {[
                    { label: "Germany 🇩🇪", value: 0 },
                    { label: "Brazil 🇧🇷", value: 1, correct: true },
                    { label: "Italy 🇮🇹", value: 2 },
                    { label: "Argentina 🇦🇷", value: 3 }
                  ].map((ans) => (
                    <button
                      key={ans.value}
                      onClick={() => {
                        setQuizAnswerSelected(ans.value);
                        setQuizScore(ans.correct ? 1 : 0);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                        quizAnswerSelected === ans.value
                          ? ans.correct 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                            : 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {ans.label}
                    </button>
                  ))}
                </div>

                {quizScore !== null && (
                  <div className={`p-2.5 rounded-xl text-[10px] font-bold ${quizScore === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {quizScore === 1 
                      ? "🎉 Correct! Brazil has appeared in every single tournament since 1930." 
                      : "❌ Incorrect. Try again! Brazil holds the perfect streak of 22 appearances."}
                  </div>
                )}
              </div>
            </div>

            {/* Player of the Match Fan Poll */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-pink-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vote: Player of the Match</h4>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Lionel Messi', flag: '🇦🇷' },
                  { name: 'Kylian Mbappé', flag: '🇫🇷' },
                  { name: 'Erling Haaland', flag: '🇳🇴' },
                  { name: 'Vinícius Júnior', flag: '🇧🇷' }
                ].map((p) => {
                  const votes = pollVotes[p.name as keyof typeof pollVotes] as number;
                  const total = (Object.values(pollVotes) as number[]).reduce((a, b) => a + b, 0);
                  const pct = Math.round((votes / total) * 100);

                  return (
                    <div key={p.name} className="space-y-1.5">
                      <button
                        onClick={() => handlePollVote(p.name)}
                        disabled={!!pollVoted}
                        className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between font-medium transition-all ${
                          pollVoted === p.name 
                            ? 'bg-pink-500/10 border-pink-500 text-pink-400 font-bold' 
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 disabled:opacity-70'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">{p.flag} {p.name}</span>
                        {pollVoted && <span className="font-mono text-[10px] text-slate-400">{pct}%</span>}
                      </button>
                      {pollVoted && (
                        <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-pink-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
