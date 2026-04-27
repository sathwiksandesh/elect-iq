import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CountryCode, ChatMessage, ViewId } from '../types';

function uid(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface AppState {
  // Navigation
  activeView: ViewId;
  setActiveView: (v: ViewId) => void;

  // Country & language
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  language: string;
  setLanguage: (l: string) => void;

  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setTyping: (v: boolean) => void;
  clearMessages: () => void;

  // Quiz
  quizScore: number;
  quizTotal: number;
  incrementScore: (correct: boolean) => void;
  resetQuiz: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeView: 'chat',
      setActiveView: (activeView) => set({ activeView }),

      country: 'india',
      setCountry: (country) => set({ country }),

      language: 'en',
      setLanguage: (language) => set({ language }),

      messages: [],
      isTyping: false,
      addUserMessage: (content) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: uid(), role: 'user', content, timestamp: new Date() },
          ],
        })),
      addAssistantMessage: (content) =>
        set((s) => ({
          isTyping: false,
          messages: [
            ...s.messages,
            { id: uid(), role: 'assistant', content, timestamp: new Date() },
          ],
        })),
      setTyping: (isTyping) => set({ isTyping }),
      clearMessages: () => set({ messages: [] }),

      quizScore: 0,
      quizTotal: 0,
      incrementScore: (correct) =>
        set((s) => ({
          quizScore: s.quizScore + (correct ? 1 : 0),
          quizTotal: s.quizTotal + 1,
        })),
      resetQuiz: () => set({ quizScore: 0, quizTotal: 0 }),
    }),
    {
      name: 'electiq-v2',
      partialize: (s) => ({
        country: s.country,
        language: s.language,
        quizScore: s.quizScore,
        quizTotal: s.quizTotal,
      }),
    },
  ),
);
