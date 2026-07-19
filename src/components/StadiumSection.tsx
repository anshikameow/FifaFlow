import React, { useState, useEffect } from 'react';
import { Stadium, Gate, FoodStall, Washroom, Facility, UserSetup } from '../types';
import StadiumMap from './StadiumMap';
import { 
  Compass, 
  Utensils, 
  Droplet, 
  Battery, 
  ShieldAlert, 
  ChevronRight, 
  ArrowRight,
  TrendingUp, 
  Accessibility, 
  DoorOpen, 
  Clock, 
  Sparkles,
  Search,
  Filter,
  Star,
  CheckCircle2,
  ShoppingCart,
  QrCode,
  MapPin,
  X,
  Flame,
  ThumbsUp,
  Coins,
  Map as MapIcon,
  Navigation,
  Activity,
  Heart,
  Smile,
  Info
} from 'lucide-react';

interface StadiumSectionProps {
  stadium: Stadium;
  gates: Gate[];
  foodStalls: FoodStall[];
  washrooms: Washroom[];
  facilities: Facility[];
  setup: UserSetup;
  activeRoute: string | null;
  onSelectFacility: (type: string, id: string) => void;
  onSetRoute: (routeKey: string | null) => void;
}

export default function StadiumSection({
  stadium,
  gates,
  foodStalls,
  washrooms,
  facilities,
  setup,
  activeRoute,
  onSelectFacility,
  onSetRoute
}: StadiumSectionProps) {
  const [filterType, setFilterType] = useState<'all' | 'food' | 'toilet' | 'charging' | 'medical'>('all');
  
  // Interactive food ordering system state
  const [selectedFoodStall, setSelectedFoodStall] = useState<FoodStall | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [orderQty, setOrderQty] = useState<number>(1);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'seat'>('pickup');
  const [orderStatus, setOrderStatus] = useState<'idle' | 'ordering' | 'confirmed'>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'Vegetarian' | 'Vegan' | 'Gluten-Free' | 'Halal'>('all');

  // State to handle the beautiful "Seat-to-Restaurant Route Map" Popup Modal
  const [routePopupStall, setRoutePopupStall] = useState<FoodStall | null>(null);

  // Map of food item prices (simulated but static)
  const itemPrices: { [key: string]: number } = {
    // World Cup Eats
    'Falafel Bowl': 14.00,
    'Vegan Burger': 15.50,
    'Avocado Quinoa Salad': 13.50,
    // Taco Goal
    'Carne Asada Tacos': 12.00,
    'Chicken Quesadilla': 11.50,
    'Churros': 6.00,
    // Valkyrie Burgers
    'Championship Double Cheeseburger': 16.50,
    'Stadium Footlong Hotdog': 11.00,
    'Loaded Garlic Fries': 8.50,
    // Greens & Grains Co.
    'Greek Protein Salad': 13.00,
    'Acai Berry Bowl': 10.50,
    'Fresh Green Juice': 7.00,
    // Samba Pit Grill
    'Picanha Steak Skewers': 18.00,
    'Carioca Rice & Beans': 9.00,
    'Pão de Queijo': 7.50
  };

  // Helper to map cuisine types to colorful food icons and vibrant gradients
  const getCuisineTheme = (cuisine: string) => {
    const lower = cuisine.toLowerCase();
    if (lower.includes('burger') || lower.includes('diner') || lower.includes('american')) {
      return {
        emoji: '🍔',
        gradient: 'from-amber-600 via-orange-500 to-rose-600',
        textColor: 'text-amber-400',
        borderColor: 'border-orange-500/30',
        bgColor: 'bg-orange-500/10'
      };
    }
    if (lower.includes('taco') || lower.includes('mexican')) {
      return {
        emoji: '🌮',
        gradient: 'from-yellow-500 via-orange-500 to-red-500',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        bgColor: 'bg-yellow-500/10'
      };
    }
    if (lower.includes('healthy') || lower.includes('organic') || lower.includes('green')) {
      return {
        emoji: '🥗',
        gradient: 'from-emerald-500 via-teal-500 to-lime-500',
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30',
        bgColor: 'bg-emerald-500/10'
      };
    }
    if (lower.includes('brazilian') || lower.includes('bbq') || lower.includes('grill')) {
      return {
        emoji: '🍖',
        gradient: 'from-red-600 via-rose-500 to-amber-500',
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30',
        bgColor: 'bg-rose-500/10'
      };
    }
    return {
      emoji: '🍲',
      gradient: 'from-sky-500 via-indigo-500 to-purple-600',
      textColor: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      bgColor: 'bg-sky-500/10'
    };
  };

  // Helper to get distance to the user's seat section
  const getDistanceMetres = (stall: FoodStall) => {
    const dist = stall.distanceMetresFromSection?.[setup.seat];
    if (dist !== undefined) return dist;
    
    // Fallback logic
    const userSec = parseInt(setup.seat) || 112;
    const stallSec = parseInt(stall.section) || 112;
    const diff = Math.abs(userSec - stallSec);
    return diff === 0 ? 12 : diff * 15 + 20;
  };

  // Filter facilities/stalls based on selection
  const filteredStalls = foodStalls.filter(s => {
    // 1. Check general tab filter
    const matchesTab = filterType === 'all' || filterType === 'food';
    if (!matchesTab) return false;

    // 2. Search query filter
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.popularItems.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 3. Dietary option filter
    const matchesDietary = dietaryFilter === 'all' || s.dietaryOptions.includes(dietaryFilter);

    return matchesSearch && matchesDietary;
  });

  const filteredWashrooms = washrooms.filter(w => filterType === 'all' || filterType === 'toilet');
  const filteredFacilities = facilities.filter(f => {
    if (filterType === 'all') return true;
    if (filterType === 'charging' && f.type === 'charging') return true;
    if (filterType === 'medical' && f.type === 'medical') return true;
    return false;
  });

  // Handle Order Placement Simulation
  const handlePlaceOrder = () => {
    setOrderStatus('ordering');
    setTimeout(() => {
      setOrderStatus('confirmed');
    }, 1500);
  };

  // Reset Order Modal State
  const resetOrderState = () => {
    setSelectedFoodStall(null);
    setSelectedItem(null);
    setOrderQty(1);
    setOrderStatus('idle');
  };

  const selectedItemPrice = selectedItem ? (itemPrices[selectedItem] || 12.00) : 0;
  const subtotal = selectedItemPrice * orderQty;
  const tax = subtotal * 0.08;
  const deliveryFee = deliveryType === 'seat' ? 4.50 : 0.00;
  const grandTotal = subtotal + tax + deliveryFee;

  const isFoodMode = filterType === 'food';

  // Focus Trapping & Autofocus for Route Popup Modal
  useEffect(() => {
    if (routePopupStall) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setRoutePopupStall(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      // Autofocus close button to center visual context
      setTimeout(() => {
        document.getElementById('close-route-popup')?.focus();
      }, 50);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [routePopupStall]);

  // Focus Trapping & Autofocus for Pre-Order Modal
  useEffect(() => {
    if (selectedFoodStall) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          resetOrderState();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      // Autofocus close button to center visual context
      setTimeout(() => {
        document.getElementById('close-order-modal')?.focus();
      }, 50);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedFoodStall]);

  return (
    <section id="stadium-section-container" aria-label="Stadium Concourse and Food Navigator" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      
      {/* -------------------- DYNAMIC VIEW SELECTION -------------------- */}
      {!isFoodMode ? (
        // Standard Grid Layout for other sections (All, Toilet, Battery, Medical)
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Grid: Stadium Map (Visible for non-food filters) */}
          <div className="lg:col-span-7">
            <StadiumMap 
              stadium={stadium}
              gates={gates}
              foodStalls={foodStalls}
              washrooms={washrooms}
              facilities={facilities}
              setup={setup}
              activeRoute={activeRoute}
              onSelectFacility={(type, id) => {
                onSelectFacility(type, id);
                if (type === 'food') {
                  const stall = foodStalls.find(fs => fs.id === id);
                  if (stall) {
                    setFilterType('food');
                    setSelectedFoodStall(stall);
                    onSetRoute('to-food');
                  }
                }
              }}
            />
          </div>

          {/* Right Grid: Filters & Quick Highlights (Visible for non-food filters) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Panel A: Live Facility Filters */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-emerald-400" />
                  Live Facility Filters
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded">
                  {foodStalls.length + washrooms.length + facilities.length} Hubs Synchronized
                </span>
              </div>

              {/* Quick Filter Buttons Grid */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'all', label: 'All', icon: Compass, color: 'from-slate-800 to-slate-900' },
                  { id: 'food', label: 'Food 🍔', icon: Utensils, color: 'from-amber-500 to-orange-600' },
                  { id: 'toilet', label: 'Toilet', icon: Droplet, color: 'from-blue-500 to-indigo-600' },
                  { id: 'charging', label: 'Battery', icon: Battery, color: 'from-teal-500 to-emerald-600' },
                  { id: 'medical', label: 'Medical', icon: ShieldAlert, color: 'from-rose-500 to-red-600' }
                ].map((btn) => {
                  const Icon = btn.icon;
                  const isActive = filterType === btn.id;

                  return (
                    <button
                      key={btn.id}
                      id={`filter-btn-${btn.id}`}
                      onClick={() => {
                        setFilterType(btn.id as any);
                        if (btn.id === 'food') {
                          onSetRoute('to-food');
                        } else if (btn.id === 'toilet') {
                          onSetRoute('to-washroom');
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive 
                          ? `bg-gradient-to-br ${btn.color} border-transparent text-white scale-[1.03] shadow-md shadow-amber-500/10`
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-bold tracking-tight">{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel B: Pre-designed Fast route highlights - One-tap action cards */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Quick Route Highlight Generator
              </span>

              <div className="space-y-2.5">
                {[
                  { key: 'to-seat', label: 'Guide Me to My Seat', desc: 'ADA ramp-optimized pathway from Gate E', icon: Accessibility, color: 'text-blue-400' },
                  { key: 'to-food', label: 'Find Shortest Food Queues', desc: 'Highlights Valkyrie / Taco Goal stalls nearby', icon: Utensils, color: 'text-amber-400' },
                  { key: 'to-washroom', label: 'Locate Fast Clean Toilet', desc: 'Directs to low wait-time Unisex restroom', icon: Droplet, color: 'text-blue-400' }
                ].map((route) => {
                  const Icon = route.icon;
                  const isActive = activeRoute === route.key;

                  return (
                    <button
                      key={route.key}
                      id={`route-btn-${route.key}`}
                      onClick={() => onSetRoute(isActive ? null : route.key)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                        isActive 
                          ? 'bg-gradient-to-r from-emerald-950/50 to-slate-900 border-emerald-500 shadow-md shadow-emerald-500/5' 
                          : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-center ${route.color}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {route.label}
                          </h4>
                          <p className="text-[9px] text-slate-500 mt-0.5">{route.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-slate-600 transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Panel C: Scrolling list of filtered facilities / wait times */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Real-time Wait Times Checklist</span>
              
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {filteredStalls.map(s => (
                  <div 
                    key={s.id} 
                    id={`facility-item-food-${s.id}`}
                    onClick={() => {
                      onSelectFacility('food', s.id);
                      setFilterType('food');
                      onSetRoute('to-food');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🌭</span>
                      <div>
                        <h5 className="font-bold text-slate-200">{s.name}</h5>
                        <span className="text-[9px] text-slate-500">Sec {s.section} • {s.cuisine}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                        {s.queueLengthMinutes} mins wait
                      </span>
                    </div>
                  </div>
                ))}

                {filteredWashrooms.map(w => (
                  <div 
                    key={w.id} 
                    id={`facility-item-washroom-${w.id}`}
                    onClick={() => {
                      onSelectFacility('washroom', w.id);
                      onSetRoute('to-washroom');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚻</span>
                      <div>
                        <h5 className="font-bold text-slate-200">{w.gender} Toilet</h5>
                        <span className="text-[9px] text-slate-500">Sec {w.section} • Rating {w.cleanlinessScore}/10</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {w.queueLengthMinutes} mins wait
                      </span>
                    </div>
                  </div>
                ))}

                {filteredFacilities.map(f => (
                  <div 
                    key={f.id} 
                    id={`facility-item-generic-${f.id}`}
                    onClick={() => onSelectFacility(f.type, f.id)}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚨</span>
                      <div>
                        <h5 className="font-bold text-slate-200">{f.name}</h5>
                        <span className="text-[9px] text-slate-500">Sec {f.section} • {f.status}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {f.details}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      ) : (
        // -------------------- VIBRANT DEDICATED FOOD PLAZA LAYOUT (NO STANDARD LEFT MAP) --------------------
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-400">
          
          {/* Header Back Button & Plaza Title */}
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-rose-950/60 border border-amber-500/20 rounded-[2rem] p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <button
                    id="back-to-all-filters-btn"
                    onClick={() => {
                      setFilterType('all');
                      onSetRoute(null);
                    }}
                    className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-mono text-amber-400 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    ← Back to Map View
                  </button>
                  <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase animate-pulse">
                    🔥 5 STAR DINING ACTIVE
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-rose-400 tracking-tight flex items-center gap-2.5">
                  🍔 FIFA WORLD CUP FOOD COURT
                </h2>
                <p className="text-xs text-slate-300 max-w-xl">
                  Order refreshments with express pickup or enjoy premium <span className="text-sky-300 font-bold">ADA seat runner delivery</span> directly to Row F, Seat {setup.seat}. Click <span className="text-amber-400 underline decoration-dashed">View Route</span> on any diner to see your customized seat-to-food walk route!
                </p>
              </div>

              {/* Status Indicator */}
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center shrink-0 text-center min-w-[150px]">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block">Your Location</span>
                <span className="text-lg font-black text-emerald-400 mt-1">Section {setup.seat}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-mono">Row F, Concourse B</span>
              </div>
            </div>
          </div>

          {/* Fully custom 2-Column layout designed to display food menu and search vibrant styles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar Column - Search & Filters (lg:col-span-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Filter Panel Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <span className="text-xs font-extrabold text-amber-400 flex items-center gap-2 uppercase tracking-widest">
                  <Filter className="w-4 h-4 text-amber-400" />
                  Fast Concession Filter
                </span>

                <div className="space-y-3.5">
                  {/* Styled Search Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono">Keyword Search</label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                      <input 
                        type="text"
                        placeholder="Burgers, tacos, skewers, acai..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Dietary Selectors */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 font-mono block">Dietary Restrictions</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: 'All Menus 🍽️' },
                        { id: 'Vegetarian', label: 'Vegetarian 🌿' },
                        { id: 'Vegan', label: 'Vegan 🌱' },
                        { id: 'Gluten-Free', label: 'Gluten-Free 🌾' },
                        { id: 'Halal', label: 'Halal ☪️' }
                      ].map((diet) => (
                        <button
                          key={diet.id}
                          onClick={() => setDietaryFilter(diet.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                            dietaryFilter === diet.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-extrabold shadow-md shadow-amber-500/5'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {diet.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Spectacular Extra Detail Widget - Pre-order Wallet Simulation */}
              <div className="bg-gradient-to-br from-slate-900 to-amber-950/20 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Express Fan Wallet
                  </span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold">
                    SECURE NFC
                  </span>
                </div>

                <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono">CURRENT BALANCE</span>
                    <h4 className="text-lg font-black text-slate-100 mt-0.5">$45.50</h4>
                  </div>
                  <button
                    onClick={() => alert("Simulated wallet balance refreshed! This applet uses client-side fast orders.")}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] rounded-xl uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
                  >
                    + Top Up
                  </button>
                </div>

                <p className="text-[9px] text-slate-500 leading-normal font-mono">
                  💡 Order directly from your seat and use pre-saved tickets or NFC to checkout. ADA delivery fee is waived automatically!
                </p>
              </div>

              {/* Live Crowd Info Ticker */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Live Concourse Feed</span>
                <div className="space-y-2 text-[10px]">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Concourse Section 112: Low queue time at Valkyrie Burgers (4 mins)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                    <span>Match intermission started: Expect concession rushes soon!</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column - Restaurant Cards Bento Grid (lg:col-span-8) */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Filtered Restaurant Selections ({filteredStalls.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  Sorted by closest to Section {setup.seat}
                </span>
              </div>

              {filteredStalls.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-3xl text-slate-400 text-sm">
                  🚫 No dining options matching your criteria. Try adjusting filters or search query!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredStalls.map((s) => {
                    const theme = getCuisineTheme(s.cuisine);
                    const distance = getDistanceMetres(s);
                    const walkTimeMins = Math.max(1, Math.round(distance / 70));

                    // Wait level styles
                    let waitColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
                    let waitDot = 'bg-emerald-400';
                    let waitText = `${s.queueLengthMinutes}m queue (Express)`;

                    if (s.queueLengthMinutes > 20) {
                      waitColor = 'bg-rose-500/10 border-rose-500/20 text-rose-400';
                      waitDot = 'bg-rose-400';
                      waitText = `${s.queueLengthMinutes}m queue (Heavy)`;
                    } else if (s.queueLengthMinutes > 10) {
                      waitColor = 'bg-amber-500/10 border-amber-500/20 text-amber-400';
                      waitDot = 'bg-amber-400';
                      waitText = `${s.queueLengthMinutes}m queue (Moderate)`;
                    }

                    return (
                      <div 
                        key={s.id}
                        className={`p-5 rounded-3xl bg-slate-900/60 border ${theme.borderColor} hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-lg`}
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-rose-500/0 group-hover:from-amber-500/5 group-hover:to-rose-500/5 transition-all duration-500 pointer-events-none" />

                        <div className="space-y-4">
                          {/* Card Header: Diner Identity */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shrink-0">
                                {theme.emoji}
                              </span>
                              <div>
                                <h4 className="font-extrabold text-slate-100 group-hover:text-amber-300 transition-colors text-sm">
                                  {s.name}
                                </h4>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                                  <span className="font-mono bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-amber-400">Sec {s.section}</span>
                                  <span>•</span>
                                  <span className="text-slate-300">{s.cuisine}</span>
                                  <span>•</span>
                                  <span className="flex items-center text-yellow-400 gap-0.5 font-bold">
                                    <Star className="w-3 h-3 fill-yellow-400 stroke-none" />
                                    {s.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Queue Badge */}
                          <div className={`p-2.5 rounded-xl border text-[10px] font-bold flex items-center justify-between ${waitColor}`}>
                            <span className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${waitDot} animate-pulse`} />
                              Queue Delay Status:
                            </span>
                            <span className="font-extrabold">{waitText}</span>
                          </div>

                          {/* Dynamic Map Distance Pin Button (Map Trigger) */}
                          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-2">
                            <div className="space-y-0.5 text-left">
                              <span className="text-[9px] text-slate-500 block uppercase font-mono tracking-wider">Distance from Seat {setup.seat}</span>
                              <span className="font-bold text-xs text-slate-100">
                                📍 {distance} meters ({walkTimeMins} mins)
                              </span>
                            </div>
                            <button
                              id={`route-popup-btn-${s.id}`}
                              type="button"
                              onClick={() => {
                                setRoutePopupStall(s);
                                onSetRoute('to-food');
                              }}
                              className="px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10 transition-all hover:scale-[1.03]"
                            >
                              <MapIcon className="w-3.5 h-3.5" />
                              View Route
                            </button>
                          </div>

                          {/* Dietary Tags */}
                          <div className="flex flex-wrap gap-1">
                            {s.dietaryOptions.map(opt => (
                              <span key={opt} className="text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-lg bg-slate-950 text-slate-400 border border-slate-800">
                                {opt}
                              </span>
                            ))}
                          </div>

                          {/* Menu list */}
                          <div className="space-y-2 pt-3 border-t border-slate-800/60">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Signature Menu Highlights:</span>
                            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                              {s.popularItems.map((item) => {
                                const price = itemPrices[item] || 12.00;
                                return (
                                  <div 
                                    key={item}
                                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-transparent hover:border-slate-800/60 transition-all text-xs"
                                  >
                                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                                      <span className="text-amber-500">✔</span>
                                      {item}
                                    </span>
                                    <div className="flex items-center gap-2.5">
                                      <span className="font-mono font-extrabold text-emerald-400">${price.toFixed(2)}</span>
                                      <button
                                        id={`preorder-${s.id}-${item.replace(/\s+/g, '-').toLowerCase()}`}
                                        onClick={() => {
                                          setSelectedFoodStall(s);
                                          setSelectedItem(item);
                                          setOrderQty(1);
                                          setOrderStatus('idle');
                                          onSelectFacility('food', s.id);
                                        }}
                                        className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[9px] rounded-lg uppercase tracking-wider transition-all hover:scale-105 cursor-pointer"
                                      >
                                        Order
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* -------------------- SEAT-TO-RESTAURANT ROUTE POPUP MODAL -------------------- */}
      {routePopupStall && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div role="dialog" aria-modal="true" aria-labelledby="route-dialog-title" className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 max-h-[90vh]">
            
            {/* Beautiful Colorful Header line */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 via-pink-500 via-orange-500 to-yellow-400" />

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 id="route-dialog-title" className="font-black text-slate-100 text-sm tracking-wide uppercase">Seat-to-Table Live Navigator</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Routing from Section <span className="text-emerald-400 font-extrabold">{setup.seat}</span> to <span className="text-amber-400 font-extrabold">{routePopupStall.name}</span> (Section {routePopupStall.section})
                  </p>
                </div>
              </div>
              
              <button 
                id="close-route-popup"
                onClick={() => setRoutePopupStall(null)}
                aria-label="Close Navigator"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Side by Side Grid */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Stadium Map showing highlighting path */}
              <div className="lg:col-span-7 h-[360px] md:h-[420px] rounded-2xl border border-slate-850 overflow-hidden relative bg-slate-900/20">
                <StadiumMap 
                  stadium={stadium}
                  gates={gates}
                  foodStalls={foodStalls}
                  washrooms={washrooms}
                  facilities={facilities}
                  setup={setup}
                  activeRoute="to-food" // Ensure path to food area highlights automatically
                  onSelectFacility={() => {}}
                />
                
                {/* Visual marker label overlay on top of map */}
                <div className="absolute top-16 left-4 bg-slate-950/90 border border-slate-800 rounded-xl p-2.5 text-[9px] text-slate-300 space-y-1 max-w-[160px] z-20">
                  <span className="font-bold text-slate-100 uppercase tracking-widest block">HIGHLIGHTED ROUTE:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Your Seat (Section {setup.seat})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>{routePopupStall.name} (Section {routePopupStall.section})</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Directions Step by Step & Accessibility Options */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Stats Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                    <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Total Distance</span>
                    <span className="text-sm font-black text-blue-400 mt-1 block">{getDistanceMetres(routePopupStall)}m</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                    <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Walking Time</span>
                    <span className="text-sm font-black text-emerald-400 mt-1 block">{Math.max(1, Math.round(getDistanceMetres(routePopupStall) / 70))} mins</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
                    <span className="text-[8px] text-slate-500 block uppercase font-mono font-bold">Queue Delay</span>
                    <span className="text-sm font-black text-rose-400 mt-1 block">{routePopupStall.queueLengthMinutes} mins</span>
                  </div>
                </div>

                {/* Step-by-step navigation instructions list */}
                <div className="space-y-3 bg-slate-900/30 border border-slate-800/80 rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Step-By-Step Directions:</span>
                  
                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] shrink-0 mt-0.5">1</span>
                      <p className="text-slate-300 leading-normal">
                        Exit Row F of Section <span className="text-white font-bold">{setup.seat}</span> and head to the outer Concourse B exit gates corridor.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] shrink-0 mt-0.5">2</span>
                      <div className="space-y-1">
                        <p className="text-slate-300 leading-normal">
                          {setup.accessibility === 'Wheelchair' 
                            ? "Use Concourse Elevator 4 (Ramp accessible) to descend down to the Food Plaza Level. Fully optimized for wheelchair comfort."
                            : "Take the primary Concourse B escalator down to the lower Concession deck lobby."}
                        </p>
                        {setup.accessibility !== 'Standard' && (
                          <div className="flex items-center gap-1.5 text-[9px] text-sky-400 font-bold bg-sky-950/40 border border-sky-900/40 px-2 py-0.5 rounded-md w-fit">
                            <Accessibility className="w-3.5 h-3.5" />
                            <span>ADA Route Priority Active</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-400 text-[10px] shrink-0 mt-0.5">3</span>
                      <p className="text-slate-300 leading-normal">
                        Walk {getDistanceMetres(routePopupStall)} meters past Concourse Medical Hub A to Concession Stall <span className="text-white font-bold">Section {routePopupStall.section}</span>.
                      </p>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">★</span>
                      <p className="text-slate-200 font-bold leading-normal">
                        Spot the restaurant sign with {getCuisineTheme(routePopupStall.cuisine).emoji} and pick up your meal at pre-order Window #2!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Order from navigation widget */}
                <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-500 block font-mono">POPULAR DISH</span>
                    <span className="font-extrabold text-xs text-white block truncate">{routePopupStall.popularItems[0]}</span>
                  </div>
                  <button
                    id={`preorder-from-route-${routePopupStall.id}`}
                    onClick={() => {
                      setSelectedFoodStall(routePopupStall);
                      setSelectedItem(routePopupStall.popularItems[0]);
                      setOrderQty(1);
                      setOrderStatus('idle');
                      setRoutePopupStall(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                  >
                    Quick Order
                  </button>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-850 flex items-center justify-end gap-3 bg-slate-900/20">
              <button
                id="close-route-footer-btn"
                onClick={() => setRoutePopupStall(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Close Navigator
              </button>
            </div>

          </div>
        </div>
      )}

      {/* -------------------- FOOD PRE-ORDER SIMULATION MODAL OVERLAY -------------------- */}
      {selectedFoodStall && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div role="dialog" aria-modal="true" aria-labelledby="preorder-dialog-title" className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[30px] shadow-[0_20px_50px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            
            {/* Decorative Top Rainbow Strip */}
            <div className="h-2 w-full bg-gradient-to-r from-rose-600 via-orange-500 via-yellow-400 via-emerald-500 via-sky-500 to-indigo-600" />

            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 id="preorder-dialog-title" className="font-extrabold text-slate-100 text-sm">FIFA Fast-Pass Pre-Order</h3>
                  <p className="text-[10px] text-slate-500">Direct Express Ingress Service</p>
                </div>
              </div>
              <button 
                id="close-order-modal"
                onClick={resetOrderState}
                aria-label="Close Order Modal"
                className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderStatus === 'idle' && (
              <div className="p-6 space-y-5">
                {/* Stall & Item Info */}
                <div className="flex items-start gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
                  <span className="text-4xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/10">
                    {getCuisineTheme(selectedFoodStall.cuisine).emoji}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">{selectedFoodStall.cuisine}</span>
                    <h4 className="font-extrabold text-white text-sm">{selectedFoodStall.name}</h4>
                    <p className="text-xs text-slate-400 font-bold">{selectedItem}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Located near Section {selectedFoodStall.section}</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between bg-slate-950/40 border border-slate-800/60 rounded-xl p-3">
                  <span className="text-xs font-bold text-slate-300">Order Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      id="order-qty-dec"
                      type="button"
                      disabled={orderQty <= 1}
                      onClick={() => setOrderQty(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-mono font-extrabold text-sm text-white w-6 text-center">{orderQty}</span>
                    <button
                      id="order-qty-inc"
                      type="button"
                      onClick={() => setOrderQty(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Fulfillment Strategy Option (ADA Friendly) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Delivery / Fulfillment:</span>
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Self Pick-Up Option */}
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        deliveryType === 'pickup'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <span className="font-bold text-xs">🚶 Express Pick-Up</span>
                      <span className="text-[9px] text-slate-500 mt-1 leading-normal">Skip the line! Tap QR code at the stall window.</span>
                    </button>

                    {/* Deliver to Seat ADA Custom Option */}
                    <button
                      type="button"
                      onClick={() => setDeliveryType('seat')}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        deliveryType === 'seat'
                          ? 'bg-sky-500/10 border-sky-400 text-sky-300'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">♿ Seat Delivery</span>
                        {setup.accessibility !== 'Standard' && (
                          <span className="text-[8px] font-black text-sky-300 bg-sky-400/20 px-1 rounded">VIP ADA</span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 leading-normal">Delivered directly to Row F, Section {setup.seat}.</span>
                    </button>

                  </div>

                  {deliveryType === 'seat' && (
                    <div className="bg-sky-950/20 border border-sky-500/20 p-2.5 rounded-xl text-[10px] text-sky-300 font-medium leading-normal flex items-start gap-2 animate-in slide-in-from-top-1 duration-200">
                      <Accessibility className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />
                      <div>
                        <span className="font-bold block">ADA Spectator Mode Active</span>
                        Since you configured {setup.accessibility} mode, we have waived the standard delivery fee. A FIFA host runner will arrive with your warm food within 12 minutes!
                      </div>
                    </div>
                  )}
                </div>

                {/* Invoice Breakdown */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>{selectedItem} x {orderQty}</span>
                    <span className="text-slate-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax (8%)</span>
                    <span className="text-slate-200">${tax.toFixed(2)}</span>
                  </div>
                  {deliveryType === 'seat' && (
                    <div className="flex justify-between text-slate-400">
                      <span>ADA Seat Delivery Service</span>
                      <span className="text-emerald-400 font-bold">FREE</span>
                    </div>
                  )}
                  <div className="h-[1px] bg-slate-800 my-2" />
                  <div className="flex justify-between text-white font-extrabold text-sm">
                    <span className="font-sans uppercase tracking-wider text-slate-300 text-xs">Total Bill:</span>
                    <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Trigger Button */}
                <button
                  id="confirm-place-order-btn"
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-500 via-orange-500 to-yellow-400 hover:from-rose-400 hover:to-yellow-300 text-slate-950 font-black text-xs tracking-widest uppercase rounded-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(244,63,94,0.3)]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Confirm and Place Order
                </button>
              </div>
            )}

            {orderStatus === 'ordering' && (
              <div className="p-12 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
                <h4 className="font-extrabold text-slate-100 text-sm">Processing Payment...</h4>
                <p className="text-[10px] text-slate-500 font-mono">Contacting Stadium Section {selectedFoodStall.section} Kitchen Terminal</p>
              </div>
            )}

            {orderStatus === 'confirmed' && (
              <div className="p-6 space-y-6 text-center">
                
                {/* Success Indicator Badge */}
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="font-black text-slate-100 text-base uppercase tracking-wider">Order Confirmed!</h4>
                  <p className="text-xs text-slate-400 font-medium">Your Fast-Pass is generated & synchronized</p>
                </div>

                {/* Spectacular Custom Styled QR Code Mock */}
                <div className="relative mx-auto w-44 h-44 bg-white rounded-2xl p-3 shadow-2xl flex flex-col items-center justify-center group overflow-hidden">
                  
                  {/* Subtle pulsing scanner overlay bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-blue-600 animate-bounce" />

                  {/* High-Fidelity Custom QR Block Array Rendered via Pure CSS elements */}
                  <div className="w-full h-full border border-slate-200/80 rounded-xl grid grid-cols-4 gap-1.5 p-2 bg-slate-50">
                    <div className="border-[3px] border-slate-900 rounded bg-transparent" />
                    <div className="flex flex-col gap-1 justify-center items-center">
                      <span className="w-full h-1 bg-slate-900" />
                      <span className="w-2/3 h-1 bg-slate-900" />
                    </div>
                    <div className="flex flex-col gap-1 justify-center items-end">
                      <span className="w-1/2 h-1 bg-slate-900" />
                      <span className="w-full h-1 bg-slate-900" />
                    </div>
                    <div className="border-[3px] border-slate-900 rounded bg-transparent" />
                    
                    <div className="flex gap-1">
                      <span className="w-1 bg-slate-900 h-full" />
                      <span className="w-1 bg-slate-900 h-2/3" />
                    </div>
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="flex gap-1 justify-end">
                      <span className="w-1 bg-slate-900 h-1/2" />
                      <span className="w-1 bg-slate-900 h-full" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="w-full h-1 bg-slate-900" />
                      <span className="w-1/2 h-1 bg-slate-900" />
                    </div>
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="bg-slate-900 rounded-sm" />
                    <div className="flex flex-col gap-1 items-end">
                      <span className="w-2/3 h-1 bg-slate-900" />
                      <span className="w-full h-1 bg-slate-900" />
                    </div>

                    <div className="border-[3px] border-slate-900 rounded bg-transparent" />
                    <div className="flex gap-1">
                      <span className="w-1 bg-slate-900 h-full" />
                      <span className="w-1 bg-slate-900 h-full" />
                    </div>
                    <div className="flex gap-1 justify-end">
                      <span className="w-1 bg-slate-900 h-1/2" />
                      <span className="w-1 bg-slate-900 h-full" />
                    </div>
                    <div className="border-[3px] border-slate-900 rounded bg-transparent" />
                  </div>

                  {/* Emblem in center of QR */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-slate-900 border-2 border-white rounded-xl flex items-center justify-center text-xs">
                    🏆
                  </div>
                </div>

                {/* Fast pass specifications details */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 space-y-1.5 text-xs text-slate-300 text-left font-sans">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-1.5">
                    <span>Spectator Token</span>
                    <span className="text-amber-400">#FIFA-{Math.floor(Math.random() * 8999) + 1000}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order:</span>
                    <span className="font-bold text-white">{orderQty}x {selectedItem}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-bold text-amber-300">
                      {deliveryType === 'pickup' ? '🚶 Self Express Pick-Up' : '♿ Directly to My Seat'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preparation:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                      Ready in ~6 minutes
                    </span>
                  </div>
                </div>

                {/* Finalize order simulation button */}
                <button
                  id="close-confirmation-btn"
                  onClick={resetOrderState}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Return to Stadium Map
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
