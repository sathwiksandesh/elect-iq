import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../../hooks/useChat';
import { useAppStore } from '../../store/appStore';
import type { ChatMessage } from '../../types';
import clsx from 'clsx';

const SUGGESTIONS: Record<string, string[]> = {
  india:     ['How do I register to vote?', 'What ID do I need?', 'What is NOTA?', 'Am I eligible to vote?', 'How are EVMs verified?'],
  usa:       ['How do I register to vote?', 'Do I need photo ID?', 'How does the Electoral College work?', 'Can I vote by mail?'],
  uk:        ['How do I register to vote?', 'What photo ID is accepted?', 'What is First Past the Post?', 'Get a free Voter ID'],
  australia: ['Is voting compulsory?', 'How does preferential voting work?', 'How do I enrol?', 'Do I need ID to vote?'],
  germany:   ['What are the two votes?', 'How do I get my polling card?', 'What is the 5% threshold?', 'How do I vote by post?'],
};

function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up" role="status" aria-label="Assistant is typing">
      <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 text-white text-xs font-bold shadow-md"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} aria-hidden="true">AI</div>
      <div className="bubble-ai flex items-center gap-1.5 px-5 py-4">
        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        <span className="sr-only">Assistant is typing</span>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={clsx('flex gap-3 animate-slide-up', isUser && 'flex-row-reverse')}
      role="article" aria-label={isUser ? 'Your message' : 'Assistant response'}>
      <div
        className={clsx('w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold shadow-md')}
        style={{
          background: isUser
            ? 'linear-gradient(135deg, #8b5cf6, #ec4899)'
            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white',
        }}
        aria-hidden="true"
      >
        {isUser ? 'You' : 'AI'}
      </div>
      <div className={clsx('max-w-[520px]', isUser ? 'bubble-user' : 'bubble-ai')}>
        {isUser ? (
          <p>{msg.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none text-gray-700">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
        <time className={clsx('block text-xs mt-2 opacity-60')} dateTime={msg.timestamp.toISOString()}>
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </time>
      </div>
    </div>
  );
}

export function ChatView() {
  const { messages, isTyping, send, clearMessages } = useChat();
  const country = useAppStore(s => s.country);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = SUGGESTIONS[country] ?? [];
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    send(input);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
            💬
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">Ask the election assistant</h1>
            <p className="text-xs text-gray-400">Powered by ElectIQ · {countryName}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="btn-ghost text-xs gap-1.5" aria-label="Clear conversation">
            <span>✕</span> New chat
          </button>
        )}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
        role="log" aria-live="polite" aria-label="Chat conversation" aria-relevant="additions">

        {messages.length === 0 && (
          <div className="animate-scale-in flex flex-col items-center text-center pt-6 pb-2">
            {/* Hero icon */}
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-glow"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              🗳️
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Hello! I'm your free election guide <span aria-hidden="true">👋</span>
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md">
              I can help you understand elections in{' '}
              <span className="font-semibold gradient-text">{countryName}</span>{' '}
              — registration, eligibility, voting day, and much more. No sign-up needed.
            </p>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-lg"
              role="group" aria-label="Suggested questions">
              {suggestions.map(s => (
                <button key={s} onClick={() => { send(s); inputRef.current?.focus(); }}
                  className="chip" aria-label={`Ask: ${s}`}>
                  {s}
                </button>
              ))}
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {['🔒 Private', '⚡ Instant', '🌍 5 countries', '💸 Always free'].map(f => (
                <span key={f} className="text-xs px-3 py-1 rounded-full text-gray-500"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* ── Input area ── */}
      <div className="px-5 py-4 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(99,102,241,0.1)',
        }}>
        <form onSubmit={handleSubmit} aria-label="Send a message">
          <div className="flex gap-3 items-end">
            <label htmlFor="chat-input" className="sr-only">Type your election question</label>
            <div className="flex-1 relative">
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about registration, voting, eligibility…"
                rows={1}
                disabled={isTyping}
                className="input w-full resize-none min-h-[44px] max-h-32 py-3 pr-4"
                aria-label="Your question"
                style={{ lineHeight: '1.5' }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-primary flex-shrink-0 h-11 px-5"
              aria-label="Send message"
            >
              <span>Send</span>
              <span aria-hidden="true">↑</span>
            </button>
          </div>  
        </form>
      </div>
    </div>
  );
}
