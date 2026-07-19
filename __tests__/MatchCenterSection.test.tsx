import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MatchCenterSection from '../src/components/MatchCenterSection';
import { UserSetup, Match } from '../src/types';

const mockSetup: UserSetup = {
  stadiumId: 'metlife',
  matchId: 'usa-eng',
  seat: '101',
  accessibility: 'Standard',
  transport: 'Metro',
  language: 'English (US)',
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

describe('MatchCenterSection Component', () => {
  it('renders tactical insights and lineups headers', () => {
    const handleSendMessage = vi.fn();
    render(
      <MatchCenterSection
        setup={mockSetup}
        match={mockMatch}
        onSendMessage={handleSendMessage}
      />
    );

    expect(screen.getByText(/Matchday Arena/i)).toBeInTheDocument();
  });

  it('allows clicking prediction tab and shows expectation values', () => {
    const handleSendMessage = vi.fn();
    render(
      <MatchCenterSection
        setup={mockSetup}
        match={mockMatch}
        onSendMessage={handleSendMessage}
      />
    );

    // Clicking "Projections" tab specifically as a button
    const forecastTab = screen.getByRole('button', { name: /Projections/i });
    expect(forecastTab).toBeInTheDocument();
    fireEvent.click(forecastTab);

    expect(screen.getByText(/AI Match Predictor Pro/i)).toBeInTheDocument();
  });
});
