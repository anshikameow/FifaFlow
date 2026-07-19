import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';

// Mock speech synthesis for accessibility testing
const mockSpeak = vi.fn();
const mockCancel = vi.fn();

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: vi.fn().mockReturnValue([]),
    },
    writable: true,
  });
}

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock motion animations from motion/react or motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => {
      // Return a basic div but pass down relevant testing IDs and classes
      return React.createElement('div', { className, ...props }, children);
    },
    span: ({ children, className, ...props }: any) => {
      return React.createElement('span', { className, ...props }, children);
    },
    header: ({ children, className, ...props }: any) => {
      return React.createElement('header', { className, ...props }, children);
    },
    button: ({ children, className, ...props }: any) => {
      return React.createElement('button', { className, ...props }, children);
    },
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock React and motion elements
import React from 'react';
