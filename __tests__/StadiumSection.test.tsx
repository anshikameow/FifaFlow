import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StadiumSection from '../src/components/StadiumSection';
import { UserSetup, Stadium, Gate, FoodStall, Washroom, Facility } from '../src/types';

const mockSetup: UserSetup = {
  stadiumId: 'metlife',
  matchId: 'usa-eng',
  seat: '101',
  accessibility: 'Standard',
  transport: 'Metro',
  language: 'English (US)',
};

const mockGates: Gate[] = [
  { id: 'gate-a', name: 'Gate A', status: 'Open', crowdLevel: 'Medium', accessibility: ['Wheelchair'], avgWaitTimeMinutes: 12 },
  { id: 'gate-b', name: 'Gate B', status: 'Congested', crowdLevel: 'High', accessibility: ['Standard'], avgWaitTimeMinutes: 35 },
];

const mockFoodStalls: FoodStall[] = [
  { 
    id: 'food-1', 
    stadiumId: 'metlife', 
    name: 'Stadium Bites', 
    section: '101', 
    cuisine: 'American', 
    dietaryOptions: ['Vegetarian'], 
    queueLengthMinutes: 4, 
    popularItems: ['Pretzels', 'Hot dogs'], 
    rating: 4.5, 
    distanceMetresFromSection: { '101': 20 }
  }
];

const mockWashrooms: Washroom[] = [
  {
    id: 'washroom-1',
    stadiumId: 'metlife',
    section: '101',
    gender: 'Unisex',
    accessibility: true,
    queueLengthMinutes: 2,
    cleanlinessScore: 9,
    distanceMetresFromSection: { '101': 30 }
  }
];

const mockFacilities: Facility[] = [
  {
    id: 'fac-1',
    stadiumId: 'metlife',
    name: 'Main Medical Station',
    type: 'medical',
    section: '110',
    status: 'Available',
    details: 'Equipped with basic care kits'
  }
];

const mockStadium: Stadium = {
  id: 'metlife',
  name: 'MetLife Stadium',
  city: 'East Rutherford, NJ',
  capacity: 82500,
  gates: mockGates,
  sections: [
    { id: '101', level: 'Lower', gate: 'Gate A', crowdLevel: 'Low', heatmapValue: 10 }
  ],
};

describe('StadiumSection Component', () => {
  it('renders stadium map, gates list and active items', () => {
    const handleSelect = vi.fn();
    const handleSetRoute = vi.fn();

    render(
      <StadiumSection
        stadium={mockStadium}
        gates={mockGates}
        foodStalls={mockFoodStalls}
        washrooms={mockWashrooms}
        facilities={mockFacilities}
        setup={mockSetup}
        activeRoute={null}
        onSelectFacility={handleSelect}
        onSetRoute={handleSetRoute}
      />
    );

    expect(screen.getByText(/Live Interactive Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-time Wait Times Checklist/i)).toBeInTheDocument();
  });

  it('filters foods & restrooms by toggle chips', () => {
    const handleSelect = vi.fn();
    const handleSetRoute = vi.fn();

    render(
      <StadiumSection
        stadium={mockStadium}
        gates={mockGates}
        foodStalls={mockFoodStalls}
        washrooms={mockWashrooms}
        facilities={mockFacilities}
        setup={mockSetup}
        activeRoute={null}
        onSelectFacility={handleSelect}
        onSetRoute={handleSetRoute}
      />
    );

    // Clicking food button
    const foodFilterTab = screen.getByText(/Food 🍔/i);
    fireEvent.click(foodFilterTab);

    // Once in food mode, verify food menu header is visible
    expect(screen.getByText(/FIFA WORLD CUP FOOD COURT/i)).toBeInTheDocument();
  });
});
