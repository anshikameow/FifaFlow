export interface Gate {
  id: string;
  name: string;
  status: 'Open' | 'Closed' | 'Congested';
  crowdLevel: 'Low' | 'Medium' | 'High';
  accessibility: string[];
  avgWaitTimeMinutes: number;
}

export interface Section {
  id: string;
  level: 'Lower' | 'Middle' | 'Upper';
  gate: string;
  crowdLevel: 'Low' | 'Medium' | 'High';
  heatmapValue: number;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number;
  gates: Gate[];
  sections: Section[];
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
  dietaryOptions: string[];
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
  cleanlinessScore: number;
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
  recommendationRating: number;
}

export interface UserSetup {
  stadiumId: string;
  matchId: string;
  seat: string;
  language: string;
  accessibility: 'Standard' | 'Wheelchair' | 'Blind' | 'Deaf' | 'Elderly';
  transport: 'Metro' | 'Car' | 'Bus' | 'Walking';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  toolCalls?: string[];
}

export interface TimelineStep {
  title: string;
  time: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: string;
}

export interface StadiumPolicies {
  clearBag: string;
  powerBanks: string;
  cameras: string;
  umbrellas: string;
  reEntry: string;
  alcohol: string;
}

