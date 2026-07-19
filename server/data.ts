export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  gates: {
    id: string;
    name: string;
    status: 'Open' | 'Closed' | 'Congested';
    crowdLevel: 'Low' | 'Medium' | 'High';
    accessibility: string[];
    avgWaitTimeMinutes: number;
  }[];
  sections: {
    id: string;
    level: 'Lower' | 'Middle' | 'Upper';
    gate: string; // Nearest gate
    crowdLevel: 'Low' | 'Medium' | 'High';
    heatmapValue: number; // 0 to 1
  }[];
}

export interface Match {
  id: string;
  teams: string;
  dateTime: string;
  stadiumId: string;
  group: string;
  temperature: string;
  weatherCondition: string;
}

export interface FoodStall {
  id: string;
  stadiumId: string;
  name: string;
  section: string;
  cuisine: string;
  dietaryOptions: string[]; // 'Vegetarian', 'Vegan', 'Gluten-Free', 'Halal', 'Standard'
  queueLengthMinutes: number;
  popularItems: string[];
  rating: number;
  distanceMetresFromSection: { [section: string]: number };
}

export interface Washroom {
  id: string;
  stadiumId: string;
  section: string;
  gender: 'Male' | 'Female' | 'Unisex' | 'All-Gender';
  accessibility: boolean;
  queueLengthMinutes: number;
  cleanlinessScore: number; // 1 to 10
  distanceMetresFromSection: { [section: string]: number };
}

export interface Facility {
  id: string;
  stadiumId: string;
  name: string;
  type: 'charging' | 'medical' | 'merchandise' | 'emergency';
  section: string;
  status: 'Available' | 'Busy' | 'Closed';
  details: string;
}

export interface TransportOption {
  type: 'Metro' | 'Car' | 'Bus' | 'Walking';
  name: string;
  status: 'Normal' | 'Delayed' | 'Congested' | 'Closed';
  details: string;
  avgTravelTimeMinutes: number;
  recommendationRating: number; // 1-5
}

export const STADIUMS: Stadium[] = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York/New Jersey',
    capacity: 82500,
    gates: [
      { id: 'gate-a', name: 'Gate A (Main Ingress)', status: 'Open', crowdLevel: 'Low', accessibility: ['Wheelchair', 'Standard', 'Elderly', 'Blind', 'Deaf'], avgWaitTimeMinutes: 5 },
      { id: 'gate-b', name: 'Gate B', status: 'Congested', crowdLevel: 'High', accessibility: ['Standard', 'Deaf'], avgWaitTimeMinutes: 35 },
      { id: 'gate-c', name: 'Gate C (North)', status: 'Closed', crowdLevel: 'High', accessibility: [], avgWaitTimeMinutes: 999 },
      { id: 'gate-d', name: 'Gate D (East)', status: 'Open', crowdLevel: 'Medium', accessibility: ['Standard', 'Elderly', 'Deaf'], avgWaitTimeMinutes: 15 },
      { id: 'gate-e', name: 'Gate E (South/ADA)', status: 'Open', crowdLevel: 'Low', accessibility: ['Wheelchair', 'Standard', 'Elderly', 'Blind', 'Deaf'], avgWaitTimeMinutes: 4 }
    ],
    sections: [
      { id: '101', level: 'Lower', gate: 'gate-a', crowdLevel: 'Low', heatmapValue: 0.15 },
      { id: '104', level: 'Lower', gate: 'gate-a', crowdLevel: 'Medium', heatmapValue: 0.45 },
      { id: '110', level: 'Lower', gate: 'gate-b', crowdLevel: 'High', heatmapValue: 0.85 },
      { id: '112', level: 'Lower', gate: 'gate-b', crowdLevel: 'High', heatmapValue: 0.90 },
      { id: '115', level: 'Lower', gate: 'gate-b', crowdLevel: 'Medium', heatmapValue: 0.50 },
      { id: '124', level: 'Lower', gate: 'gate-d', crowdLevel: 'High', heatmapValue: 0.80 },
      { id: '128', level: 'Lower', gate: 'gate-d', crowdLevel: 'Low', heatmapValue: 0.20 },
      { id: '130', level: 'Lower', gate: 'gate-e', crowdLevel: 'Low', heatmapValue: 0.10 },
      { id: '138', level: 'Lower', gate: 'gate-e', crowdLevel: 'Medium', heatmapValue: 0.60 },
      { id: '140', level: 'Lower', gate: 'gate-a', crowdLevel: 'Low', heatmapValue: 0.30 }
    ]
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    capacity: 70000,
    gates: [
      { id: 'sofi-gate-1', name: 'American Airlines Plaza Gate 1', status: 'Open', crowdLevel: 'Medium', accessibility: ['Wheelchair', 'Standard', 'Elderly', 'Blind', 'Deaf'], avgWaitTimeMinutes: 12 },
      { id: 'sofi-gate-2', name: 'Gate 2', status: 'Open', crowdLevel: 'Low', accessibility: ['Standard', 'Deaf'], avgWaitTimeMinutes: 6 },
      { id: 'sofi-gate-3', name: 'Gate 3', status: 'Congested', crowdLevel: 'High', accessibility: ['Standard', 'Elderly', 'Deaf'], avgWaitTimeMinutes: 28 },
      { id: 'sofi-gate-4', name: 'VIP Gate 4', status: 'Open', crowdLevel: 'Low', accessibility: ['Wheelchair', 'Standard', 'Elderly', 'Blind', 'Deaf'], avgWaitTimeMinutes: 3 }
    ],
    sections: [
      { id: '101', level: 'Lower', gate: 'sofi-gate-1', crowdLevel: 'Low', heatmapValue: 0.25 },
      { id: '104', level: 'Lower', gate: 'sofi-gate-1', crowdLevel: 'Medium', heatmapValue: 0.55 },
      { id: '110', level: 'Lower', gate: 'sofi-gate-2', crowdLevel: 'High', heatmapValue: 0.75 },
      { id: '112', level: 'Lower', gate: 'sofi-gate-2', crowdLevel: 'High', heatmapValue: 0.80 },
      { id: '124', level: 'Lower', gate: 'sofi-gate-3', crowdLevel: 'High', heatmapValue: 0.95 },
      { id: '130', level: 'Lower', gate: 'sofi-gate-4', crowdLevel: 'Low', heatmapValue: 0.10 }
    ]
  },
  {
    id: 'azteca',
    name: 'Estadio Azteca',
    city: 'Mexico City',
    capacity: 87500,
    gates: [
      { id: 'azteca-gate-1', name: 'Acceso General 1', status: 'Open', crowdLevel: 'Medium', accessibility: ['Standard', 'Deaf'], avgWaitTimeMinutes: 18 },
      { id: 'azteca-gate-2', name: 'Acceso Especial 2 (ADA)', status: 'Open', crowdLevel: 'Low', accessibility: ['Wheelchair', 'Standard', 'Elderly', 'Blind', 'Deaf'], avgWaitTimeMinutes: 5 },
      { id: 'azteca-gate-3', name: 'Acceso General 3', status: 'Congested', crowdLevel: 'High', accessibility: ['Standard', 'Deaf'], avgWaitTimeMinutes: 40 }
    ],
    sections: [
      { id: '101', level: 'Lower', gate: 'azteca-gate-1', crowdLevel: 'Medium', heatmapValue: 0.60 },
      { id: '104', level: 'Lower', gate: 'azteca-gate-1', crowdLevel: 'High', heatmapValue: 0.85 },
      { id: '110', level: 'Lower', gate: 'azteca-gate-2', crowdLevel: 'Low', heatmapValue: 0.20 },
      { id: '112', level: 'Lower', gate: 'azteca-gate-2', crowdLevel: 'Medium', heatmapValue: 0.40 },
      { id: '124', level: 'Lower', gate: 'azteca-gate-3', crowdLevel: 'High', heatmapValue: 0.90 }
    ]
  }
];

export const MATCHES: Match[] = [
  {
    id: 'match-1',
    teams: 'Argentina 🇦🇷 vs France 🇫🇷',
    dateTime: '2026-07-19T19:00:00-04:00',
    stadiumId: 'metlife',
    group: 'Group A - Opening Stage',
    temperature: '24°C / 75°F',
    weatherCondition: 'Clear skies with mild breeze'
  },
  {
    id: 'match-2',
    teams: 'USA 🇺🇸 vs Mexico 🇲🇽',
    dateTime: '2026-07-20T18:00:00-07:00',
    stadiumId: 'sofi',
    group: 'Group C - Continental Derby',
    temperature: '21°C / 70°F',
    weatherCondition: 'Cloudy, high probability of rain later'
  },
  {
    id: 'match-3',
    teams: 'Brazil 🇧🇷 vs Germany 🇩🇪',
    dateTime: '2026-07-21T20:00:00-06:00',
    stadiumId: 'azteca',
    group: 'Group F - Historic Clash',
    temperature: '18°C / 64°F',
    weatherCondition: 'Showers and wet pitch'
  }
];

export const FOOD_STALLS: FoodStall[] = [
  {
    id: 'food-1',
    stadiumId: 'metlife',
    name: 'World Cup Eats',
    section: '112',
    cuisine: 'International Bowls',
    dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
    queueLengthMinutes: 15,
    popularItems: ['Falafel Bowl', 'Vegan Burger', 'Avocado Quinoa Salad'],
    rating: 4.8,
    distanceMetresFromSection: {
      '112': 15,
      '115': 60,
      '110': 80,
      '104': 250,
      '138': 400
    }
  },
  {
    id: 'food-2',
    stadiumId: 'metlife',
    name: 'Taco Goal',
    section: '104',
    cuisine: 'Mexican Street Tacos',
    dietaryOptions: ['Halal', 'Standard'],
    queueLengthMinutes: 5,
    popularItems: ['Carne Asada Tacos', 'Chicken Quesadilla', 'Churros'],
    rating: 4.6,
    distanceMetresFromSection: {
      '104': 10,
      '101': 80,
      '140': 120,
      '112': 280
    }
  },
  {
    id: 'food-3',
    stadiumId: 'metlife',
    name: 'Valkyrie Burgers & Dogs',
    section: '124',
    cuisine: 'American Diner',
    dietaryOptions: ['Standard'],
    queueLengthMinutes: 28,
    popularItems: ['Championship Double Cheeseburger', 'Stadium Footlong Hotdog', 'Loaded Garlic Fries'],
    rating: 4.2,
    distanceMetresFromSection: {
      '124': 20,
      '128': 120,
      '115': 320
    }
  },
  {
    id: 'food-4',
    stadiumId: 'metlife',
    name: 'Greens & Grains Co.',
    section: '130',
    cuisine: 'Healthy / Organic',
    dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free'],
    queueLengthMinutes: 4,
    popularItems: ['Greek Protein Salad', 'Acai Berry Bowl', 'Fresh Green Juice'],
    rating: 4.9,
    distanceMetresFromSection: {
      '130': 12,
      '128': 45,
      '138': 140,
      '140': 300
    }
  },
  {
    id: 'food-5',
    stadiumId: 'metlife',
    name: 'Samba Pit Grill',
    section: '138',
    cuisine: 'Brazilian BBQ',
    dietaryOptions: ['Standard', 'Gluten-Free'],
    queueLengthMinutes: 12,
    popularItems: ['Picanha Steak Skewers', 'Carioca Rice & Beans', 'Pão de Queijo'],
    rating: 4.7,
    distanceMetresFromSection: {
      '138': 15,
      '130': 150,
      '140': 180,
      '112': 380
    }
  }
];

export const WASHROOMS: Washroom[] = [
  {
    id: 'wash-102',
    stadiumId: 'metlife',
    section: '101',
    gender: 'All-Gender',
    accessibility: true,
    queueLengthMinutes: 12,
    cleanlinessScore: 9,
    distanceMetresFromSection: { '101': 15, '104': 95, '140': 110 }
  },
  {
    id: 'wash-115',
    stadiumId: 'metlife',
    section: '115',
    gender: 'Unisex',
    accessibility: true,
    queueLengthMinutes: 3, // Very fast!
    cleanlinessScore: 8.5,
    distanceMetresFromSection: { '115': 10, '112': 65, '110': 90 }
  },
  {
    id: 'wash-128',
    stadiumId: 'metlife',
    section: '128',
    gender: 'All-Gender',
    accessibility: true,
    queueLengthMinutes: 7,
    cleanlinessScore: 9.5,
    distanceMetresFromSection: { '128': 14, '130': 50, '124': 115 }
  },
  {
    id: 'wash-138',
    stadiumId: 'metlife',
    section: '138',
    gender: 'Male',
    accessibility: false,
    queueLengthMinutes: 2, // Fast but standard
    cleanlinessScore: 7,
    distanceMetresFromSection: { '138': 12, '140': 70, '130': 130 }
  },
  {
    id: 'wash-139',
    stadiumId: 'metlife',
    section: '138',
    gender: 'Female',
    accessibility: true,
    queueLengthMinutes: 3,
    cleanlinessScore: 8.8,
    distanceMetresFromSection: { '138': 15, '140': 75, '130': 135 }
  }
];

export const FACILITIES: Facility[] = [
  {
    id: 'facility-charge-1',
    stadiumId: 'metlife',
    name: 'Section 108 PowerHub',
    type: 'charging',
    section: '104',
    status: 'Available',
    details: '8 universal USB-C fast charging slots available. Free of charge.'
  },
  {
    id: 'facility-charge-2',
    stadiumId: 'metlife',
    name: 'Section 125 BoltStation',
    type: 'charging',
    section: '124',
    status: 'Busy',
    details: 'Currently 100% occupied. Next slot estimated in 8 minutes.'
  },
  {
    id: 'facility-med-1',
    stadiumId: 'metlife',
    name: 'Main Medical Center Center 110',
    type: 'medical',
    section: '110',
    status: 'Available',
    details: 'Full cardiac response, paramedics, Wheelchair transfers, climate-controlled recovery.'
  },
  {
    id: 'facility-med-2',
    stadiumId: 'metlife',
    name: 'First Aid Post Section 132',
    type: 'medical',
    section: '130',
    status: 'Available',
    details: 'Surgical dressings, minor trauma support, basic life support.'
  },
  {
    id: 'facility-merch-1',
    stadiumId: 'metlife',
    name: 'Superstore Mega Pavilion',
    type: 'merchandise',
    section: '101',
    status: 'Busy',
    details: 'Official FIFA World Cup 2026 merchandise, jerseys, custom prints. Queue length: 25 minutes.'
  }
];

export const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    type: 'Metro',
    name: 'Stadium Express Metro Link',
    status: 'Normal',
    details: 'Trains leaving every 4 minutes. Ingress speed high. Excellent wheelchair accessibility.',
    avgTravelTimeMinutes: 25,
    recommendationRating: 5
  },
  {
    type: 'Bus',
    name: 'FIFA Shuttle Bus Network',
    status: 'Delayed',
    details: 'Shuttles held back by minor traffic congestion on Route 3. Delayed by ~10 minutes.',
    avgTravelTimeMinutes: 40,
    recommendationRating: 3
  },
  {
    type: 'Car',
    name: 'Private Ride / Parking Lots',
    status: 'Congested',
    details: 'Lot Blue is 45% full. Lot Red is 85% full. Severe bottleneck on outer perimeter lanes.',
    avgTravelTimeMinutes: 55,
    recommendationRating: 2
  },
  {
    type: 'Walking',
    name: 'Pedestrian Promenade Route',
    status: 'Normal',
    details: 'Fully walkable, safe, secure lit path from the South Hub.',
    avgTravelTimeMinutes: 15,
    recommendationRating: 4
  }
];

export const STADIUM_POLICIES = {
  clearBag: 'Only clear plastic, vinyl or PVC bags that do not exceed 12" x 6" x 12" or small clutch bags up to 4.5" x 6.5" are permitted inside. Standard large backpacks are strictly prohibited.',
  powerBanks: 'Fans are allowed to bring personal power banks into the venue, provided they do not exceed 20,000mAh capacity and have readable labels. Professional grade battery packs are subject to confiscation.',
  cameras: 'Small point-and-shoot digital cameras are permitted. Cameras with detachable lenses longer than 6 inches or professional equipment (monopods, tripods, stabilizers) are strictly prohibited.',
  umbrellas: 'To prevent sightline obstructions, standard umbrellas are not permitted inside. In the event of forecast rain, clear plastic ponchos are highly recommended.',
  reEntry: 'No re-entry is permitted. Once your ticket has been scanned and you pass through stadium security gates, you cannot exit and return with the same ticket.',
  alcohol: 'Alcohol sales are restricted to guests 21+ with physical, government-issued IDs. All alcohol sales will cease at the 75th minute of the match.'
};

export function getClosestFacility(stadiumId: string, section: string, type: string) {
  // Simple heuristic based on numerical section difference
  const relevantFacs = FACILITIES.filter(f => f.stadiumId === stadiumId && f.type === type);
  if (relevantFacs.length === 0) return null;
  
  let closest = relevantFacs[0];
  let minDiff = Math.abs(parseInt(section) - parseInt(closest.section));
  
  for (let i = 1; i < relevantFacs.length; i++) {
    const diff = Math.abs(parseInt(section) - parseInt(relevantFacs[i].section));
    if (diff < minDiff) {
      minDiff = diff;
      closest = relevantFacs[i];
    }
  }
  return closest;
}
