import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIAssistantSection from '../src/components/AIAssistantSection';
import { UserSetup, ChatMessage } from '../src/types';

const mockSetup: UserSetup = {
  stadiumId: 'metlife',
  matchId: 'usa-eng',
  seat: '101',
  accessibility: 'Standard',
  transport: 'Metro',
  language: 'English (US)',
};

const mockMessages: ChatMessage[] = [
  { id: '1', role: 'user', text: 'Which food stall has the shortest queue?', timestamp: '20:00' },
  { id: '2', role: 'model', text: ':::thinking\nEvaluating Seat Section 101\nQuerying queue parameters\n:::\n\n:::confidence\nScore: High\nReason: POS sensors online\n:::\n\n:::factors\ncrowd: Fastest overall wait time\ndistance: 50 meters away\n:::\n\n:::alternatives\n- **Best Overall**: Stadium Bites at Section 102 - 3 min wait\n- **Fastest Option**: Samba Pit Grill - 2 min wait\n:::\n\nUse Stadium Bites adjacent to your Section.', timestamp: '20:01' },
];

describe('AIAssistantSection & CopilotChat Components', () => {
  it('renders chat message flow with custom high-fidelity visual cards', () => {
    const handleSendMessage = vi.fn();
    render(
      <AIAssistantSection
        setup={mockSetup}
        messages={mockMessages}
        onSendMessage={handleSendMessage}
        isLoading={false}
      />
    );

    // Verifies custom card elements like the confidence rating & alternative scenarios exist
    expect(screen.getByText(/Shortest Queue Food/i)).toBeInTheDocument();
    expect(screen.getByText(/Use Stadium Bites adjacent to your Section./i)).toBeInTheDocument();
    expect(screen.getByText(/Confidence Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Alternative Scenarios Evaluated:/i)).toBeInTheDocument();
  });

  it('triggers What-If slider modifications and updates simulated outcomes', () => {
    const handleSendMessage = vi.fn();
    render(
      <AIAssistantSection
        setup={mockSetup}
        messages={mockMessages}
        onSendMessage={handleSendMessage}
        isLoading={false}
      />
    );

    expect(screen.getByText(/Live Simulation Centre/i)).toBeInTheDocument();
    expect(screen.getByText(/What-If Scenario Engine/i)).toBeInTheDocument();

    // Fire simulated heavy downpour
    const rainBtn = screen.getByText(/Sudden Rain 8mm\/h/i);
    fireEvent.click(rainBtn);

    expect(screen.getByText(/Sudden Heavy Downpour Triggered/i)).toBeInTheDocument();
    expect(screen.getByText(/RE-CALCULATED ADVICE:/i)).toBeInTheDocument();
  });

  it('triggers AI Match story generator', async () => {
    const handleSendMessage = vi.fn();
    render(
      <AIAssistantSection
        setup={mockSetup}
        messages={mockMessages}
        onSendMessage={handleSendMessage}
        isLoading={false}
      />
    );

    const storyBtn = screen.getByText(/Generate Match Story/i);
    fireEvent.click(storyBtn);

    await waitFor(() => {
      expect(screen.getByText(/PERSONALIZED TACTICAL MATCH NARRATIVE/i)).toBeInTheDocument();
    }, { timeout: 1500 });
  });
});
