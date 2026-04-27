import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useChat } from '../../hooks/useChat';
import { ELECTION_DATA } from '../../data/electionData';
import type { LifecycleStage, TimelineEvent } from '../../types';
import clsx from 'clsx';

// ── Shared page shell ─────────────────────────────────────────────────────────
function PageShell({ title, subtitle, icon, children }: {
  title: string; subtitle?: string; icon: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.04)',
        }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
          {icon}
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

// ── Stage color configs ───────────────────────────────────────────────────────
const STAGE_STYLES = [
  { gradient: 'from-blue-500 to-indigo-500',   light: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
  { gradient: 'from-violet-500 to-purple-500', light: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500' },
  { gradient: 'from-teal-500 to-emerald-500',  light: 'bg-teal-50',   border: 'border-teal-200',   dot: 'bg-teal-500'   },
  { gradient: 'from-amber-500 to-orange-500',  light: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  { gradient: 'from-rose-500 to-pink-500',     light: 'bg-rose-50',   border: 'border-rose-200',   dot: 'bg-rose-500'   },
  { gradient: 'from-cyan-500 to-blue-500',     light: 'bg-cyan-50',   border: 'border-cyan-200',   dot: 'bg-cyan-500'   },
];

// ── LifecycleView ─────────────────────────────────────────────────────────────
export function LifecycleView() {
  const country = useAppStore(s => s.country);
  const { send } = useChat();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const data = ELECTION_DATA[country];

  function askMore(stage: LifecycleStage) {
    send(`Tell me more about "${stage.title}" in ${data.name} elections.`);
    navigate('/chat');
  }

  return (
    <PageShell title={`Election Lifecycle — ${data.name}`} subtitle="Tap any stage to learn more" icon="🗳️">
      <div className="p-5 space-y-3">
        <ol className="space-y-3" aria-label="Election lifecycle stages">
          {data.lifecycle.map((stage, idx) => {
            const style = STAGE_STYLES[idx % STAGE_STYLES.length];
            const isOpen = expanded === stage.id;
            return (
              <li key={stage.id} className="animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className={clsx(
                  'rounded-2xl overflow-hidden transition-all duration-300',
                  'border',
                  isOpen ? style.border : 'border-transparent',
                )}
                  style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isOpen ? '0 8px 24px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.05)',
                    transform: isOpen ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : stage.id)}
                    aria-expanded={isOpen}
                    aria-controls={`stage-${stage.id}`}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Stage number badge */}
                      <div className={clsx(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 bg-gradient-to-br shadow-md',
                        style.gradient,
                      )} aria-hidden="true">
                        {stage.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{stage.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{stage.description}</p>
                      </div>
                      <div className={clsx(
                        'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200',
                        isOpen ? clsx('bg-gradient-to-br text-white', style.gradient) : 'bg-gray-100 text-gray-400',
                      )} aria-hidden="true">
                        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', display: 'block', transition: 'transform 0.2s' }}>
                          ▾
                        </span>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div id={`stage-${stage.id}`} className="px-4 pb-4 animate-fade-in">
                      <div className={clsx('rounded-xl p-4 mb-3', style.light)}>
                        <p className="text-sm text-gray-700 leading-relaxed">{stage.details}</p>
                      </div>
                      {stage.tips.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">💡 Tips</p>
                          <ul className="space-y-1.5">
                            {stage.tips.map((tip, i) => (
                              <li key={i} className="flex gap-2 text-xs text-gray-600">
                                <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', style.dot)} aria-hidden="true" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <button onClick={() => askMore(stage)}
                        className="btn-secondary text-xs w-full justify-center gap-2">
                        <span>💬</span> Ask the assistant about this stage
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-2 pt-2 px-1">
          <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
          <p className="text-xs text-gray-400 flex-shrink-0">
            Source:{' '}
            <a href={data.authorityUrl} target="_blank" rel="noopener noreferrer"
              className="text-indigo-500 hover:underline font-medium">
              {data.authority}
            </a>
          </p>
          <div className="flex-1 h-px bg-gray-200" aria-hidden="true" />
        </div>
      </div>
    </PageShell>
  );
}

// ── TimelineView ──────────────────────────────────────────────────────────────
export function TimelineView() {
  const country = useAppStore(s => s.country);
  const data = ELECTION_DATA[country];

  const statusConfig = {
    done:     { dot: 'tl-dot-done',   label: 'Completed', labelClass: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    active:   { dot: 'tl-dot-active', label: 'Now',       labelClass: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    upcoming: { dot: 'tl-dot-future', label: '',          labelClass: '' },
  };

  return (
    <PageShell title={`Key Dates — ${data.name}`} subtitle="Important election deadlines" icon="📅">
      <div className="p-5">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Completed', count: data.timeline.filter(t => t.status === 'done').length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            { label: 'Active', count: data.timeline.filter(t => t.status === 'active').length, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
            { label: 'Upcoming', count: data.timeline.filter(t => t.status === 'upcoming').length, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
          ].map(s => (
            <div key={s.label} className={clsx('rounded-xl p-3 text-center border', s.bg, s.border)}>
              <p className={clsx('text-xl font-bold', s.color)}>{s.count}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <ol className="space-y-0" aria-label={`Election timeline for ${data.name}`}>
          {data.timeline.map((event: TimelineEvent, idx: number) => {
            const isLast = idx === data.timeline.length - 1;
            const cfg = statusConfig[event.status];
            return (
              <li key={event.id} className="flex gap-4 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="flex flex-col items-center">
                  <div className={clsx(cfg.dot, 'mt-1.5')} aria-hidden="true" />
                  {!isLast && <div className="w-px flex-1 my-1" style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.2), transparent)' }} aria-hidden="true" />}
                </div>
                <div className={clsx('pb-5 flex-1', isLast && 'pb-2')}>
                  <div className="card p-3.5 hover:shadow-card transition-shadow duration-200">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={clsx(
                        'text-sm font-semibold',
                        event.status === 'done' ? 'text-gray-400 line-through' :
                        event.status === 'active' ? 'text-indigo-700' : 'text-gray-900',
                      )}>
                        {event.title}
                      </p>
                      {cfg.label && (
                        <span className={clsx('text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0', cfg.labelClass)}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{event.description}</p>
                    <p className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <span aria-hidden="true">📅</span> {event.date}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-2 p-3 rounded-xl text-xs text-gray-500 text-center"
          style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.06)' }}>
          ⚠️ Always verify dates with{' '}
          <a href={data.authorityUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 font-medium hover:underline">
            {data.authority}
          </a>
        </div>
      </div>
    </PageShell>
  );
}
