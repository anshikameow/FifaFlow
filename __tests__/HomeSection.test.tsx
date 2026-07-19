import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeSection from '../src/components/HomeSection';
import { UserSetup, Match, Stadium, TransportOption } from '../src/types';

const mockSetup: UserSetup = {
  stadiumId: 'metlife',
  matchId: 'usa-eng',
  seat: '101',
  accessibility: 'Standard',
  transport: 'Metro',
  language: 'English (US)',
};

const mockStadium: Stadium = {
  id: 'metlife',
  name: 'MetLife Stadium',
  city: 'East Rutherford, NJ',
  capacity: 82500,
  gates: [],
  sections: [],
};

const mockMatch: Match = {
  id: 'usa-eng',
  teams: 'USA vs England',
  dateTime: '2026-07-19T20:00:00Z',
  stadiumId: 'metlife',
  group: 'Group Stage',
  temperature: '24°C',
  weatherCondition: 'Clear Sky',
};

const mockTransport: TransportOption = {
  type: 'Metro',
  name: 'Metro Train Express',
  status: 'Normal',
  details: 'Direct to main terminal',
  avgTravelTimeMinutes: 25,
  recommendationRating: 9.8,
};

describe('HomeSection Component', () => {
  it('renders active stadium and seat connectivity info', () => {
    const handleNavigate = vi.fn();
    render(
      <HomeSection
        setup={mockSetup}
        stadium={mockStadium}
        match={mockMatch}
        transport={mockTransport}
        onNavigateToSection={handleNavigate}
      />
    );

    // Check match teams text
    expect(screen.getByText(/USA vs England/i)).toBeInTheDocument();
  });

  it('renders critical security and weather widgets', () => {
    const handleNavigate = vi.fn();
    render(
      <HomeSection
        setup={mockSetup}
        stadium={mockStadium}
        match={mockMatch}
        transport={mockTransport}
        onNavigateToSection={handleNavigate}
      />
    );

    expect(screen.getByText(/Live Environment Diagnostics/i)).toBeInTheDocument();
    expect(screen.getByText(/Stadium Climate/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Sky/i)).toBeInTheDocument();
  });
});
