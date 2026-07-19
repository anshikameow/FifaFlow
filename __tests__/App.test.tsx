import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Component and Navigation Flow', () => {
  it('renders SetupScreen initially if no profile exists', () => {
    render(<App />);

    // Setup screen elements
    expect(screen.getByText(/Stadium Copilot AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Configure Matchday Profile/i)).toBeInTheDocument();
  });

  it('submits onboarding and displays main app and navigation tabs', async () => {
    const { container } = render(<App />);

    // Modify seat via select dropdown
    const seatSelector = container.querySelector('#seat-selector');
    expect(seatSelector).toBeInTheDocument();
    if (seatSelector) {
      fireEvent.change(seatSelector, { target: { value: '110' } });
    }

    // Submit setup using the correct form submit button label
    const startBtn = screen.getByText(/LAUNCH COPILOT DASHBOARD/i);
    expect(startBtn).toBeInTheDocument();
    fireEvent.click(startBtn);

    // After profile creation, we should see the live dashboard header and tabs
    await waitFor(() => {
      expect(screen.getByText(/CONNECTED TO/i)).toBeInTheDocument();
    });

    // Check footer tabs specifically as button elements, allowing multiple instances
    expect(screen.getAllByRole('button', { name: /Home/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Match Center/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Stadium/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /AI Copilot/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Profile/i })[0]).toBeInTheDocument();
  });
});
