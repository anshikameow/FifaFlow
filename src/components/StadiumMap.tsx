import React, { useState } from 'react';
import { Stadium, Gate, FoodStall, Washroom, Facility, UserSetup } from '../types';
import { 
  Flame, 
  MapPin, 
  Layers, 
  RotateCw, 
  Sparkles, 
  Compass, 
  Accessibility, 
  Utensils, 
  Droplets, 
  BatteryCharging, 
  Activity, 
  Info,
  InfoIcon
} from 'lucide-react';

interface StadiumMapProps {
  stadium: Stadium;
  gates: Gate[];
  foodStalls: FoodStall[];
  washrooms: Washroom[];
  facilities: Facility[];
  setup: UserSetup;
  activeRoute: string | null; // e.g., 'to-seat', 'to-washroom', 'to-food', etc.
  onSelectFacility: (type: string, id: string) => void;
}

export default function StadiumMap({ 
  stadium, 
  gates, 
  foodStalls, 
  washrooms, 
  facilities, 
  setup,
  activeRoute,
  onSelectFacility 
}: StadiumMapProps) {
  const [viewMode, setViewMode] = useState<'normal' | 'heatmap' | 'accessibility'>('normal');
  const [selectedElement, setSelectedElement] = useState<{
    type: 'gate' | 'stall' | 'washroom' | 'facility' | 'section';
    name: string;
    detail: string;
    metric?: string;
    accessibility?: string;
  } | null>(null);

  // Define section layout coords on a 500x500 SVG coordinate grid
  // In the center is a football field at (200, 200) to (300, 300)
  const sectionsData = [
    { id: '101', cx: 250, cy: 90, r: 25, label: 'Sec 101' },
    { id: '104', cx: 370, cy: 120, r: 25, label: 'Sec 104' },
    { id: '110', cx: 410, cy: 210, r: 25, label: 'Sec 110' },
    { id: '112', cx: 410, cy: 290, r: 25, label: 'Sec 112' },
    { id: '115', cx: 370, cy: 380, r: 25, label: 'Sec 115' },
    { id: '124', cx: 250, cy: 410, r: 25, label: 'Sec 124' },
    { id: '128', cx: 130, cy: 380, r: 25, label: 'Sec 128' },
    { id: '130', cx: 90, cy: 290, r: 25, label: 'Sec 130' },
    { id: '138', cx: 90, cy: 210, r: 25, label: 'Sec 138' },
    { id: '140', cx: 130, cy: 120, r: 25, label: 'Sec 140' }
  ];

  // Map gates around the perimeter
  const gatesData = [
    { id: 'gate-a', x: 250, y: 35, label: 'Gate A', isAda: true },
    { id: 'gate-b', x: 445, y: 150, label: 'Gate B', isAda: false },
    { id: 'gate-c', x: 445, y: 350, label: 'Gate C (Closed)', isAda: false },
    { id: 'gate-d', x: 250, y: 465, label: 'Gate D', isAda: true },
    { id: 'gate-e', x: 55, y: 250, label: 'Gate E (ADA)', isAda: true }
  ];

  // Map elements colors depending on crowd levels
  const getCrowdColor = (level: 'Low' | 'Medium' | 'High') => {
    if (level === 'Low') return 'fill-emerald-500/20 stroke-emerald-400';
    if (level === 'Medium') return 'fill-amber-500/20 stroke-amber-400';
    return 'fill-rose-500/20 stroke-rose-400';
  };

  const getCrowdHeatColor = (val: number) => {
    if (val < 0.3) return 'fill-emerald-500/40 stroke-emerald-400/80';
    if (val < 0.7) return 'fill-amber-500/50 stroke-amber-400/80';
    return 'fill-rose-500/60 stroke-rose-400/80 animate-pulse';
  };

  // Determine user starting gate depending on transport or setup
  const startingGate = setup.accessibility === 'Wheelchair' ? 'gate-e' : 'gate-a';
  const startCoords = gatesData.find(g => g.id === startingGate) || gatesData[0];
  const userSeatSection = sectionsData.find(s => s.id === setup.seat) || sectionsData[3];

  return (
    <div id="stadium-map-card" className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[580px] relative overflow-hidden group">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-emerald-950/5 pointer-events-none" />

      {/* Header Controls */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Live Interactive Map
              {activeRoute && (
                <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                  Route Active
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">Click section, gate or marker to inspect</p>
          </div>
        </div>

        {/* View Mode Selectors */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5">
          <button
            id="map-view-normal"
            onClick={() => setViewMode('normal')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
              viewMode === 'normal' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sectors
          </button>
          <button
            id="map-view-heatmap"
            onClick={() => setViewMode('heatmap')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
              viewMode === 'heatmap' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Heatmap
          </button>
          <button
            id="map-view-access"
            onClick={() => setViewMode('accessibility')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
              viewMode === 'accessibility' ? 'bg-blue-500 text-slate-100 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ADA View
          </button>
        </div>
      </div>

      {/* Vector Stadium Container */}
      <div className="flex-1 flex items-center justify-center py-4 relative">
        <svg 
          viewBox="0 0 500 500" 
          className="w-full max-w-[430px] h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
        >
          {/* Outer Ring Boundary */}
          <circle 
            cx="250" 
            cy="250" 
            r="230" 
            className="fill-none stroke-slate-800/80 stroke-[4] stroke-dasharray-[6,6]" 
          />
          <circle 
            cx="250" 
            cy="250" 
            r="190" 
            className="fill-slate-950/40 stroke-slate-800/60 stroke-[1]" 
          />

          {/* Football Field in Center */}
          <g transform="translate(180, 200)">
            {/* Field Turf */}
            <rect 
              width="140" 
              height="100" 
              rx="4" 
              className="fill-emerald-950/40 stroke-emerald-500/20 stroke-[1.5]" 
            />
            {/* Midfield line */}
            <line x1="70" y1="0" x2="70" y2="100" className="stroke-emerald-500/20 stroke-[1]" />
            <circle cx="70" cy="50" r="20" className="fill-none stroke-emerald-500/20 stroke-[1]" />
            {/* Goal boxes */}
            <rect x="0" y="25" width="15" height="50" className="fill-none stroke-emerald-500/20 stroke-[1]" />
            <rect x="125" y="25" width="15" height="50" className="fill-none stroke-emerald-500/20 stroke-[1]" />
            <text x="70" y="54" textAnchor="middle" className="fill-emerald-500/30 font-mono font-bold text-[8px] tracking-wider uppercase">WC 2026</text>
          </g>

          {/* Gates Perimeter Markers */}
          {gatesData.map(gate => {
            const dynamicGate = gates.find(g => g.id === gate.id);
            const gateColor = dynamicGate?.status === 'Closed' 
              ? 'fill-slate-800 stroke-slate-600' 
              : dynamicGate?.status === 'Congested' 
                ? 'fill-rose-500/40 stroke-rose-400' 
                : 'fill-emerald-500/30 stroke-emerald-400';

            return (
              <g 
                key={gate.id} 
                className="cursor-pointer group/gate"
                onClick={() => setSelectedElement({
                  type: 'gate',
                  name: dynamicGate?.name || gate.label,
                  detail: dynamicGate?.status === 'Closed' ? 'CLOSED - Security restriction.' : `Wait Time: ${dynamicGate?.avgWaitTimeMinutes} mins. Ingress level: ${dynamicGate?.crowdLevel}.`,
                  accessibility: dynamicGate?.accessibility.join(', ') || 'None'
                })}
              >
                <circle 
                  cx={gate.x} 
                  cy={gate.y} 
                  r="12" 
                  className={`${gateColor} stroke-[2] transition-all duration-300 group-hover/gate:r-14`} 
                />
                <text 
                  x={gate.x} 
                  y={gate.y + 3} 
                  textAnchor="middle" 
                  className="fill-slate-300 font-mono text-[6px] font-extrabold"
                >
                  {gate.id.replace('gate-', '').toUpperCase()}
                </text>
                {/* Gate Tooltip descriptor on hover */}
                <circle cx={gate.x} cy={gate.y} r="25" className="fill-transparent" />
              </g>
            );
          })}

          {/* Tiered Seating Sections */}
          {sectionsData.map(section => {
            const sectorData = stadium.sections.find(s => s.id === section.id);
            const isUserSeatSection = setup.seat === section.id;
            
            let colorClass = getCrowdColor(sectorData?.crowdLevel || 'Low');
            if (viewMode === 'heatmap') {
              colorClass = getCrowdHeatColor(sectorData?.heatmapValue || 0.3);
            } else if (viewMode === 'accessibility') {
              colorClass = setup.accessibility === 'Wheelchair' && ['101', '110', '130', '138'].includes(section.id)
                ? 'fill-blue-500/30 stroke-blue-400'
                : 'fill-slate-900/40 stroke-slate-800';
            }

            return (
              <g 
                key={section.id} 
                className="cursor-pointer group/section"
                onClick={() => setSelectedElement({
                  type: 'section',
                  name: `Lower Section ${section.id}`,
                  detail: `Crowd Density: ${sectorData?.crowdLevel || 'Low'}. Level: Lower Bowl. Gate connection: ${sectorData?.gate.toUpperCase()}.`,
                  accessibility: ['101', '110', '130', '138'].includes(section.id) ? 'Fully Wheelchair Ramp Enabled & ADA seating rows' : 'Standard Incline Steps only'
                })}
              >
                <circle 
                  cx={section.cx} 
                  cy={section.cy} 
                  r={section.r} 
                  className={`${colorClass} stroke-[1.5] transition-all duration-300 group-hover/section:scale-[1.05] origin-center`} 
                />
                
                {/* Seat Section Badge Label */}
                <text 
                  x={section.cx} 
                  y={section.cy + 3} 
                  textAnchor="middle" 
                  className="fill-slate-100 font-sans text-[7px] font-bold tracking-tight pointer-events-none"
                >
                  {section.id}
                </text>

                {/* User Seat Highlight */}
                {isUserSeatSection && (
                  <g>
                    <circle 
                      cx={section.cx} 
                      cy={section.cy} 
                      r={section.r + 6} 
                      className="fill-none stroke-blue-400 stroke-[2.5] animate-ping opacity-60" 
                    />
                    <circle 
                      cx={section.cx + 12} 
                      cy={section.cy - 12} 
                      r="5" 
                      className="fill-blue-500 stroke-slate-950 stroke-[1.5]" 
                    />
                    <text 
                      x={section.cx + 12} 
                      y={section.cy - 10} 
                      textAnchor="middle" 
                      className="fill-slate-100 font-extrabold text-[5px]"
                    >
                      ★
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Smart Animated Walking Routes overlaying top */}
          {activeRoute && (
            <g>
              {/* Route Path line from Gates to Section */}
              {activeRoute === 'to-seat' && (
                <path
                  d={`M ${startCoords.x} ${startCoords.y} Q ${setup.accessibility === 'Wheelchair' ? '150 250, 100 290' : '300 150, 350 250'} T ${userSeatSection.cx} ${userSeatSection.cy}`}
                  fill="none"
                  className={`${
                    setup.accessibility === 'Wheelchair' ? 'stroke-blue-400' : 'stroke-emerald-400'
                  } stroke-[3] stroke-dasharray-[8,4]`}
                  style={{ strokeDashoffset: '20', animation: 'dash 1.5s linear infinite' }}
                />
              )}
              {activeRoute === 'to-food' && (
                <path
                  d={`M ${userSeatSection.cx} ${userSeatSection.cy} Q 250 250 410 290`}
                  fill="none"
                  className="stroke-amber-400 stroke-[3] stroke-dasharray-[8,4]"
                  style={{ strokeDashoffset: '20', animation: 'dash 1.5s linear infinite' }}
                />
              )}
              {activeRoute === 'to-washroom' && (
                <path
                  d={`M ${userSeatSection.cx} ${userSeatSection.cy} L 370 380`}
                  fill="none"
                  className="stroke-blue-400 stroke-[3] stroke-dasharray-[8,4]"
                  style={{ strokeDashoffset: '20', animation: 'dash 1.5s linear infinite' }}
                />
              )}
            </g>
          )}

          {/* Interactive Facility Markers as small glowing nodes */}
          {/* Washrooms (Section 115, 138, 128) */}
          <g transform="translate(370, 360)" className="cursor-pointer" onClick={() => onSelectFacility('washroom', 'wash-115')}>
            <circle cx="0" cy="0" r="7" className="fill-blue-500 stroke-slate-950 stroke-[1] shadow-lg animate-pulse" />
            <text x="0" y="2" textAnchor="middle" className="fill-slate-100 font-bold text-[6px]">WC</text>
          </g>

          {/* Food Stalls (Section 112, 104) */}
          <g transform="translate(410, 310)" className="cursor-pointer" onClick={() => onSelectFacility('food', 'food-1')}>
            <circle cx="0" cy="0" r="7" className="fill-amber-500 stroke-slate-950 stroke-[1] shadow-lg" />
            <text x="0" y="2.5" textAnchor="middle" className="fill-slate-950 font-bold text-[6px]">🌭</text>
          </g>

          <g transform="translate(350, 100)" className="cursor-pointer" onClick={() => onSelectFacility('food', 'food-2')}>
            <circle cx="0" cy="0" r="7" className="fill-amber-500 stroke-slate-950 stroke-[1] shadow-lg" />
            <text x="0" y="2.5" textAnchor="middle" className="fill-slate-950 font-bold text-[6px]">🌮</text>
          </g>

          {/* Medical hub at Section 110 */}
          <g transform="translate(410, 185)" className="cursor-pointer" onClick={() => onSelectFacility('facility', 'facility-med-1')}>
            <circle cx="0" cy="0" r="7" className="fill-rose-500 stroke-slate-950 stroke-[1] shadow-lg" />
            <text x="0" y="2.5" textAnchor="middle" className="fill-slate-100 font-extrabold text-[7px]">+</text>
          </g>

          {/* Charging Hub at Section 104 */}
          <g transform="translate(390, 140)" className="cursor-pointer" onClick={() => onSelectFacility('facility', 'facility-charge-1')}>
            <circle cx="0" cy="0" r="7" className="fill-teal-500 stroke-slate-950 stroke-[1] shadow-lg" />
            <text x="0" y="2.5" textAnchor="middle" className="fill-slate-100 font-bold text-[6px]">⚡</text>
          </g>
        </svg>

        {/* Route legend / details */}
        <div className="absolute bottom-1 left-2 bg-slate-950/90 border border-slate-800/80 rounded-lg p-2 text-[9px] text-slate-400 space-y-1 z-10 max-w-[150px]">
          <div className="font-semibold text-slate-200">Active Routing:</div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Your Seat (Sec {setup.seat})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ADA Ingress (Gate {startingGate.replace('gate-', '').toUpperCase()})</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-slate-800">
            <Accessibility className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-slate-300">{setup.accessibility} Mode</span>
          </div>
        </div>
      </div>

      {/* Footer Drawer Inspector Card (When clicked) */}
      {selectedElement ? (
        <div className="z-10 bg-slate-950 border border-slate-800 rounded-xl p-3 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button 
            onClick={() => setSelectedElement(null)}
            className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 text-xs font-bold font-mono px-1.5 py-0.5 rounded-md hover:bg-slate-900"
          >
            ×
          </button>
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-100 uppercase tracking-wider">{selectedElement.type}</div>
              <h4 className="text-xs font-extrabold text-emerald-400 mt-0.5">{selectedElement.name}</h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{selectedElement.detail}</p>
              {selectedElement.accessibility && (
                <div className="flex items-center gap-1.5 mt-2 text-[9px] text-blue-400 font-semibold bg-blue-950/40 border border-blue-900/40 px-2 py-0.5 rounded-md w-fit">
                  <Accessibility className="w-3 h-3" />
                  <span>{selectedElement.accessibility}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="z-10 bg-slate-950/40 border border-slate-800/40 rounded-xl p-3 mt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <InfoIcon className="w-3.5 h-3.5 text-emerald-500/60" />
          <span>Click any sector, outer gate, or facility icon to inspect real-time queue states.</span>
        </div>
      )}

      {/* Route animation keyframe style block */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
