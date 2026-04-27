import { describe, it, expect, vi } from 'vitest';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { getSmartResponse } from '../utils/smartEngine';
import { ChatView } from '../components/chat/ChatView';

// Mock zustand store
vi.mock('../store/appStore', () => ({
  useAppStore: (sel: (s: unknown) => unknown) => {
    const state = {
      country: 'india',
      language: 'en',
      messages: [],
      isTyping: false,
      addUserMessage: vi.fn(),
      addAssistantMessage: vi.fn(),
      setTyping: vi.fn(),
      clearMessages: vi.fn(),
      activeView: 'chat',
      setActiveView: vi.fn(),
      quizScore: 0,
      quizTotal: 0,
      incrementScore: vi.fn(),
      resetQuiz: vi.fn(),
      setCountry: vi.fn(),
      setLanguage: vi.fn(),
    };
    return sel ? sel(state) : state;
  },
}));

vi.mock('../hooks/useChat', () => ({
  useChat: () => ({
    messages: [],
    isTyping: false,
    send: vi.fn(),
    clearMessages: vi.fn(),
  }),
}));

// ─── Smart engine tests ───────────────────────────────────────────────────────
describe('getSmartResponse — intent detection', () => {
  it('responds to greeting', () => {
    const r = getSmartResponse('hello', 'india');
    expect(r).toContain('ElectIQ');
  });

  it('responds to registration query', () => {
    const r = getSmartResponse('how do I register to vote', 'india');
    expect(r.toLowerCase()).toContain('register');
  });

  it('responds to ID documents query', () => {
    const r = getSmartResponse('what ID do I need at the booth', 'india');
    expect(r.toLowerCase()).toContain('id');
  });

  it('responds to eligibility query', () => {
    const r = getSmartResponse('am I eligible to vote', 'india');
    expect(r.toLowerCase()).toContain('citizen');
  });

  it('gives country-specific response for australia', () => {
    const r = getSmartResponse('is voting compulsory', 'australia');
    expect(r.toLowerCase()).toContain('compulsory');
    expect(r).toContain('Australia');
  });

  it('gives country-specific response for germany', () => {
    const r = getSmartResponse('what are the two votes', 'germany');
    expect(r.toLowerCase()).toContain('erststimme');
  });

  it('gives country-specific response for usa', () => {
    const r = getSmartResponse('how does the electoral college work', 'usa');
    expect(r.toLowerCase()).toContain('electoral college');
  });

  it('gives country-specific response for uk', () => {
    const r = getSmartResponse('what is first past the post', 'uk');
    expect(r.toLowerCase()).toContain('first past the post');
  });

  it('handles unknown intent gracefully', () => {
    const r = getSmartResponse('xyzzy unknown nonsense', 'india');
    expect(r.length).toBeGreaterThan(10);
  });

  it('handles thank you messages', () => {
    const r = getSmartResponse('thanks so much!', 'india');
    expect(r.toLowerCase()).toContain('welcome');
  });

  it('NOTA is explained correctly', () => {
    const r = getSmartResponse('what is NOTA', 'india');
    expect(r).toContain('None of the Above');
  });

  it('postal voting response for germany', () => {
    const r = getSmartResponse('how do I vote by post', 'germany');
    expect(r.toLowerCase()).toContain('briefwahl');
  });
});

// ─── ChatView component tests ─────────────────────────────────────────────────
describe('ChatView', () => {
  it('renders heading', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /ask the election assistant/i })).toBeInTheDocument();
  });

  it('renders suggestion chips', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('group', { name: /suggested questions/i })).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('send button enables when user types', async () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    await userEvent.type(screen.getByLabelText(/your question/i), 'how do I vote?');
    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('has accessible chat log region', () => {
    render(<MemoryRouter><ChatView /></MemoryRouter>);
    expect(screen.getByRole('log', { name: /chat conversation/i })).toBeInTheDocument();
  });
});
