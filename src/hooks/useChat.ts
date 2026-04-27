import { useCallback } from 'react';
import { useAppStore } from '../store/appStore';
import { getSmartResponse, getTypingDelay } from '../utils/smartEngine';

export function useChat() {
  const {
    messages, isTyping, country,
    addUserMessage, addAssistantMessage, setTyping, clearMessages,
  } = useAppStore();

  const send = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isTyping) return;

      addUserMessage(trimmed);
      setTyping(true);

      // Generate response from smart engine (synchronous, no API)
      const response = getSmartResponse(trimmed, country);
      const delay = getTypingDelay(response);

      // Simulate natural typing delay
      setTimeout(() => {
        addAssistantMessage(response);
      }, delay);
    },
    [isTyping, country, addUserMessage, addAssistantMessage, setTyping],
  );

  return { messages, isTyping, send, clearMessages };
}
