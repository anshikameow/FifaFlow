/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSetup, ChatMessage, Stadium, Match, FoodStall, Washroom, Facility, TransportOption } from './types';
import SetupScreen from './components/SetupScreen';
import HomeSection from './components/HomeSection';
import MatchCenterSection from './components/MatchCenterSection';
import StadiumSection from './components/StadiumSection';
import AIAssistantSection from './components/AIAssistantSection';
import ProfileSection from './components/ProfileSection';
import Logo from './components/Logo';

import { 
  STADIUMS, 
  MATCHES, 
  FOOD_STALLS, 
  WASHROOMS, 
  FACILITIES, 
  TRANSPORT_OPTIONS, 
  STADIUM_POLICIES 
} from '../server/data';

import { 
  Sparkles, 
  Clock, 
  CloudSun, 
  Compass, 
  Accessibility, 
  ShieldAlert, 
  HelpCircle, 
  RefreshCw, 
  LogOut, 
  Flame, 
  MessageSquareCode, 
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Info,
  Home,
  Trophy,
  Map,
  MessageSquare,
  User,
  Settings,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const [setup, setSetup] = useState<UserSetup | null>(null);
  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('fifa-flow-theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('fifa-flow-theme', next);
      return next;
    });
  };

  const isLight = theme === 'light';
  
  // Navigation tabs state: 'home' | 'match_center' | 'stadium' | 'ai_assistant' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'match_center' | 'stadium' | 'ai_assistant' | 'profile'>('home');

  // Dynamic synchronized data caches (fetched from server or fallbacked locally)
  const [stadiums, setStadiums] = useState<Stadium[]>(STADIUMS);
  const [matches, setMatches] = useState<Match[]>(MATCHES);
  const [foodStalls, setFoodStalls] = useState<FoodStall[]>(FOOD_STALLS);
  const [washrooms, setWashrooms] = useState<Washroom[]>(WASHROOMS);
  const [facilities, setFacilities] = useState<Facility[]>(FACILITIES);
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>(TRANSPORT_OPTIONS);
  const [policies, setPolicies] = useState<any>(STADIUM_POLICIES);

  // Active Map Route key: 'to-seat' | 'to-food' | 'to-washroom' | null
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(2); // Default to 'Arrive & Enter Stadium'
  
  // AI Copilot Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "👋 Welcome to FIFA Flow Assistant! I am fully synchronized with the stadium central command. \n\nI have customized your matchday experience based on your ADA profiles, transport mode, and seating location. Ask me anything like:\n\n👉 *'How do I find my seat with zero stairs?'*\n👉 *'Which washroom has the shortest queue near Section 112?'*\n👉 *'Can I carry my 15,000mAh power bank?'*",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Proactive Notifications array
  const [notifications, setNotifications] = useState<string[]>([]);
  const [currentNotificationIdx, setCurrentNotificationIdx] = useState(0);

  // Fetch live synchronized data on startup or setup modification
  useEffect(() => {
    async function loadLiveData() {
      try {
        console.log("[Client] Synchronizing real-time stadium metrics...");
        const response = await fetch('/api/live-info');
        if (!response.ok) throw new Error("Synchronization endpoint unavailable");
        const data = await response.json();
        if (data.success) {
          setStadiums(data.stadiums);
          setMatches(data.matches);
          setFoodStalls(data.foodStalls);
          setWashrooms(data.washrooms);
          setFacilities(data.facilities);
          setTransportOptions(data.transportOptions);
          setPolicies(data.policies);
        }
      } catch (err) {
        console.warn("[Client] Falling back to high-fidelity offline datasets:", err);
      }
    }
    loadLiveData();
  }, [setup]);

  // Generate dynamic smart proactive alerts depending on user setups
  useEffect(() => {
    if (!setup) return;
    
    const alerts: string[] = [];
    
    // 1. Weather proactive alert
    const match = matches.find(m => m.id === setup.matchId);
    if (match?.weatherCondition.toLowerCase().includes('rain') || match?.weatherCondition.toLowerCase().includes('showers')) {
      alerts.push("⚠️ Weather Alert: Rain is forecasted for today. Standard umbrellas are prohibited to protect sightlines. Grab a transparent poncho at Main Ingress.");
    } else {
      alerts.push("☀️ Weather Report: Clear skies expected. Stay hydrated during the game!");
    }

    // 2. Accessibility specific alert
    if (setup.accessibility === 'Wheelchair') {
      alerts.push("♿ ADA Mode: Gate E is the designated ADA-priority entrance, featuring zero stairs and elevators. Avoid Gate B due to heavy turnstile traffic.");
      alerts.push("🥗 Smart Dining: 'Greens & Grains Co' at Section 130 is 100% ADA ramp compliant with ADA-accessible checkout.");
    } else if (setup.accessibility === 'Blind') {
      alerts.push("🔊 Visual Assistance Active: Tactile floor guides lead to Section 101. Tap 'Speak Aloud' on any AI response for high-contrast audio guidance.");
    } else if (setup.accessibility === 'Deaf') {
      alerts.push("🧏 Visual Alerts: High-density flash notifications will illuminate in case of stadium emergency announcements.");
    }

    // 3. Transport status alert
    const transport = transportOptions.find(t => t.type === setup.transport);
    if (transport?.status !== 'Normal') {
      alerts.push(`🚨 Transport delay: ${transport?.name} is currently experiencing congestion/delays. Consider adjusting your hotel departure.`);
    } else {
      alerts.push(`🚀 Transport Greenlight: ${transport?.name} is operating perfectly with zero bottlenecks. Est travel time: ${transport?.avgTravelTimeMinutes}m.`);
    }

    // 4. Food & Washroom alert nearby
    const activeStall = foodStalls.find(s => s.section === setup.seat);
    if (activeStall && activeStall.queueLengthMinutes < 10) {
      alerts.push(`🍔 Dining recommendation: Food stall '${activeStall.name}' near your seat section has an unusually short queue of ${activeStall.queueLengthMinutes} mins!`);
    }

    setNotifications(alerts);
    setCurrentNotificationIdx(0);

    // Auto rotate notifications every 9 seconds
    const interval = setInterval(() => {
      setCurrentNotificationIdx((prev) => (prev + 1) % alerts.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [setup, matches, foodStalls, transportOptions]);

  if (!setup) {
    return (
      <SetupScreen 
        stadiums={stadiums} 
        matches={matches} 
        onComplete={(newSetup) => setSetup(newSetup)} 
        isLight={isLight}
        onToggleTheme={toggleTheme}
      />
    );
  }

  const selectedStadium = stadiums.find(s => s.id === setup.stadiumId) || stadiums[0];
  const selectedMatch = matches.find(m => m.id === setup.matchId) || matches[0];
  const selectedTransport = transportOptions.find(t => t.type === setup.transport) || transportOptions[0];

  // AI Chat message sender
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatHistory.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
          })),
          setup
        })
      });

      if (!response.ok) throw new Error("Copilot API failed");
      const data = await response.json();

      if (data.success) {
        const copilotMsg: ChatMessage = {
          id: Math.random().toString(),
          role: 'model',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCalls: data.toolCalls
        };

        setChatHistory(prev => [...prev, copilotMsg]);

        // Auto-highlight maps routes based on AI recommendations
        const lowerText = text.toLowerCase();
        if (lowerText.includes('seat') || lowerText.includes('gate') || lowerText.includes('guide')) {
          setActiveRoute('to-seat');
        } else if (lowerText.includes('washroom') || lowerText.includes('toilet') || lowerText.includes('restroom')) {
          setActiveRoute('to-washroom');
        } else if (lowerText.includes('food') || lowerText.includes('eat') || lowerText.includes('vegetarian') || lowerText.includes('stall')) {
          setActiveRoute('to-food');
        }
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error("[Client] AI Copilot request failure:", err);
      // Fallback response inside client
      setChatHistory(prev => [...prev, {
        id: Math.random().toString(),
        role: 'model',
        text: `I'm currently running in high-fidelity offline mode. \n\nBased on your selected seat (Section ${setup.seat}), you should use Gate A, which is open with low lines. The closest fast washroom is at Section 115 (3 min queue) and the recommended dining option is Greens & Grains (Section 130) or Taco Goal (Section 104). \n\nPlease configure the GEMINI_API_KEY in your project secrets to enable full contextual tool reasoning.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSelectFacility = (type: string, id: string) => {
    // Simple alert / focus highlight handler
  };

  return (
    <div className={`min-h-screen ${isLight ? 'light bg-slate-50 text-slate-900' : 'dark bg-slate-950 text-slate-100'} flex flex-col justify-between relative overflow-hidden font-sans pb-24 transition-colors duration-300`}>
      
      {/* Background radial effects */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Main Header navigation */}
      <header className={`${isLight ? 'bg-white/85 border-slate-200' : 'bg-slate-900/40 border-slate-800/80'} border-b backdrop-blur-md px-6 py-4 flex items-center justify-between z-20 transition-all duration-300`}>
        <div className="flex items-center gap-3">
          <Logo isLight={isLight} showText={false} size="sm" />
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 via-pink-500 to-indigo-600 bg-clip-text text-transparent flex items-center gap-1.5">
              FIFA Flow
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${isLight ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'} uppercase font-bold tracking-wider border`}>World Cup 2026</span>
            </h1>
            <p className={`text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'} font-mono flex items-center gap-1`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CONNECTED TO {selectedStadium.name.toUpperCase()} SERVER
            </p>
          </div>
        </div>

        {/* Live Match Summary Info */}
        <div className={`hidden md:flex items-center gap-6 ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'} border rounded-xl px-4 py-2`}>
          <div className="text-right">
            <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'} tracking-wide uppercase`}>Active Match</div>
            <div className="text-xs font-black text-pink-500 mt-0.5">{selectedMatch.teams}</div>
          </div>
          <div className={`h-6 w-[1px] ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />
          <div className="text-left">
            <div className={`text-[10px] font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'} flex items-center gap-1`}>
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              Dynamic Forecast
            </div>
            <div className={`text-xs font-mono font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'} mt-0.5`}>{selectedMatch.weatherCondition} • {selectedMatch.temperature}</div>
          </div>
        </div>

        {/* Action button triggers */}
        <div className="flex items-center gap-2">
          {/* Light/Dark Mode Switcher */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 focus-visible:outline-none cursor-pointer ${
              isLight 
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900' 
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-slate-100'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {isLight ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-amber-400" />}
          </button>

          <button
            id="reset-profile-btn"
            onClick={() => setSetup(null)}
            aria-label="Change Match or Seat assignment setup"
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 focus-visible:outline-none cursor-pointer ${
              isLight
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Change Match / Seat</span>
          </button>
        </div>
      </header>

      {/* Proactive Notification Ticker */}
      {notifications.length > 0 && (
        <div 
          role="status" 
          aria-live="polite" 
          className="bg-pink-950/10 border-b border-pink-500/10 px-6 py-2.5 flex items-center justify-between z-10 transition-all"
        >
          <div className="flex items-center gap-2.5 max-w-[85%]">
            <div className="w-5 h-5 rounded bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20 shrink-0">
              <BellRing className="w-3.5 h-3.5 animate-bounce" />
            </div>
            <p className="text-xs font-medium text-slate-200 transition-all animate-in fade-in duration-500">
              {notifications[currentNotificationIdx]}
            </p>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950/60 border border-slate-800/80 px-2 py-0.5 rounded">
            Alert {currentNotificationIdx + 1} of {notifications.length}
          </span>
        </div>
      )}

      {/* Main Core Dashboard Navigation Sections */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full z-10">
        {activeTab === 'home' && (
          <HomeSection 
            setup={setup}
            match={selectedMatch}
            stadium={selectedStadium}
            transport={selectedTransport}
            onNavigateToSection={(sectionName) => {
              if (sectionName === 'stadium') setActiveTab('stadium');
              else if (sectionName === 'match-center') setActiveTab('match_center');
              else if (sectionName === 'assistant') setActiveTab('ai_assistant');
            }}
          />
        )}

        {activeTab === 'match_center' && (
          <MatchCenterSection 
            setup={setup}
            match={selectedMatch}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'stadium' && (
          <StadiumSection 
            stadium={selectedStadium}
            gates={selectedStadium.gates}
            foodStalls={foodStalls}
            washrooms={washrooms}
            facilities={facilities}
            setup={setup}
            activeRoute={activeRoute}
            onSelectFacility={handleSelectFacility}
            onSetRoute={(route) => setActiveRoute(route)}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistantSection 
            setup={setup}
            messages={chatHistory}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection 
            setup={setup}
            stadiums={stadiums}
            matches={matches}
            onUpdateSetup={(newSetup) => {
              setSetup(newSetup);
            }}
          />
        )}
      </main>

      {/* Floating Bottom Navigation Tab Bar - Apple & Spotify Usability Quality */}
      <nav 
        aria-label="Main Tab Navigation" 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-2 flex items-center gap-1.5 z-50 shadow-2xl shadow-black/80 max-w-[92vw] sm:max-w-md w-full"
      >
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'match_center', label: 'Match Center', icon: Trophy },
          { id: 'stadium', label: 'Stadium', icon: Map },
          { id: 'ai_assistant', label: 'AI Copilot', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 flex flex-col items-center justify-center py-2 rounded-2xl transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500 focus-visible:outline-none cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-black shadow-md shadow-pink-500/10' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[9px] font-bold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
