import React from 'react';

interface LogoProps {
  className?: string;
  isLight?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', isLight = false, showText = true, size = 'md' }: LogoProps) {
  // Size helper
  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-28 w-28',
    xl: 'h-48 w-48'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const tagSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  const textColor = isLight ? 'text-slate-950' : 'text-white';
  const subtextColor = isLight ? 'text-slate-600' : 'text-slate-300';
  const borderGradient = isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-[#060814]/80';

  return (
    <div id="fifa-flow-logo-container" className={`flex flex-col items-center justify-center text-center ${className}`}>
      
      {/* Dynamic SVG Icon representation */}
      <svg
        id="fifa-flow-svg-icon"
        viewBox="0 0 200 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} filter drop-shadow-lg`}
      >
        <defs>
          {/* Rainbow wing gradients */}
          <linearGradient id="wing-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="wing-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="wing-rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="30%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          
          <linearGradient id="wing-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="wing-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#84CC16" />
          </linearGradient>
          <linearGradient id="wing-low" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          {/* Text Flow Gradient */}
          <linearGradient id="logo-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="33%" stopColor="#10B981" />
            <stop offset="66%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>

          {/* Golden Trophy Gradient */}
          <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* --- LEFT SPEED TRAILS --- */}
        <g opacity="0.85">
          <line x1="20" y1="75" x2="60" y2="75" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="83" x2="55" y2="83" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="5" y1="91" x2="52" y2="91" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="15" y1="99" x2="56" y2="99" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="107" x2="58" y2="107" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* --- MAIN STYLIZED "F" BODY --- */}
        <path
          d="M 125 35 
             C 90 35, 70 38, 55 58
             C 45 71, 40 85, 41 100
             L 58 100
             C 56 80, 68 62, 90 59
             L 115 59
             C 105 69, 100 81, 102 96
             L 118 96
             C 118 85, 122 75, 128 69
             C 132 64, 137 60, 142 59
             L 123 59
             C 134 49, 145 45, 158 45
             L 125 35 Z"
          fill={isLight ? '#0F172A' : '#FFFFFF'}
        />

        {/* --- RIGHT FLUID SWEEPING RAINBOW WINGS --- */}
        {/* Wing 1 (Top Blue-Cyan) */}
        <path
          d="M 115 59 
             C 125 45, 145 28, 185 28 
             C 170 50, 145 60, 115 59 Z"
          fill="url(#wing-top)"
        />
        
        {/* Wing 2 (Green-Lime) */}
        <path
          d="M 110 75 
             C 125 60, 150 48, 175 48 
             C 160 68, 135 76, 110 75 Z"
          fill="url(#wing-mid)"
        />

        {/* Wing 3 (Orange-Yellow) */}
        <path
          d="M 105 91 
             C 118 78, 142 68, 162 68 
             C 148 85, 125 92, 105 91 Z"
          fill="url(#wing-low)"
        />

        {/* Wing 4 (Red-Pink) */}
        <path
          d="M 90 112 
             C 105 100, 135 88, 155 88 
             C 140 108, 115 115, 90 112 Z"
          fill="url(#wing-rainbow)"
        />

        {/* --- SOCCER FOOTBALL ON THE LEFT --- */}
        <g id="football-group">
          {/* Base ball shape shadow and body */}
          <circle cx="75" cy="90" r="22" fill="#FFFFFF" stroke={isLight ? '#0F172A' : '#1E293B'} strokeWidth="2" />
          
          {/* Inner pentagons/hexagons */}
          {/* Center pentagon */}
          <polygon points="75,80 84,86 81,96 69,96 66,86" fill={isLight ? '#0F172A' : '#111827'} />
          
          {/* Lines going outward to represent panel seams */}
          <line x1="75" y1="80" x2="75" y2="68" stroke={isLight ? '#0F172A' : '#111827'} strokeWidth="1.5" />
          <line x1="84" y1="86" x2="94" y2="90" stroke={isLight ? '#0F172A' : '#111827'} strokeWidth="1.5" />
          <line x1="81" y1="96" x2="88" y2="108" stroke={isLight ? '#0F172A' : '#111827'} strokeWidth="1.5" />
          <line x1="69" y1="96" x2="62" y2="108" stroke={isLight ? '#0F172A' : '#111827'} strokeWidth="1.5" />
          <line x1="66" y1="86" x2="56" y2="90" stroke={isLight ? '#0F172A' : '#111827'} strokeWidth="1.5" />

          {/* Outer edge panel pieces */}
          <polygon points="75,68 83,72 87,68" fill={isLight ? '#0F172A' : '#111827'} opacity="0.8" />
          <polygon points="94,90 97,98 94,104" fill={isLight ? '#0F172A' : '#111827'} opacity="0.8" />
          <polygon points="88,108 78,111 75,112" fill={isLight ? '#0F172A' : '#111827'} opacity="0.8" />
          <polygon points="62,108 55,103 53,109" fill={isLight ? '#0F172A' : '#111827'} opacity="0.8" />
          <polygon points="56,90 53,82 56,76" fill={isLight ? '#0F172A' : '#111827'} opacity="0.8" />
        </g>
      </svg>

      {/* --- BRAND NAME & TAGLINE TEXT BELOW --- */}
      {showText && (
        <div className="mt-3 space-y-1.5 animate-in fade-in duration-300">
          <div className={`flex items-center justify-center font-black tracking-wider ${textSizes[size]}`}>
            <span className={textColor}>FIFA</span>
            <span className="ml-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-emerald-400 via-yellow-400 to-rose-500 font-black">
              FLOW
            </span>
          </div>
          
          <div className={`font-mono font-bold tracking-[0.18em] uppercase ${subtextColor} ${tagSizes[size]}`}>
            Your AI Matchday Companion
          </div>

          {/* Cute 2026 World Cup mini-badge for high visual authority */}
          {size !== 'sm' && (
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-6 h-[1px] bg-slate-800/60" />
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                🏆 HOST CITY • 2026
              </div>
              <span className="w-6 h-[1px] bg-slate-800/60" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
