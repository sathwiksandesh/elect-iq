import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { useChat } from '../../hooks/useChat';
import clsx from 'clsx';

const STEPS = [
  {
    id: 'registered',
    question: 'Are you currently registered to vote?',
    icon: '📋',
    options: [
      { label: 'Yes, I\'m registered', icon: '✅', value: 'yes', color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' },
      { label: 'Not yet', icon: '❌', value: 'no', color: 'border-red-200 hover:border-red-400 hover:bg-red-50' },
      { label: 'Not sure', icon: '🤔', value: 'unsure', color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' },
    ],
  },
  {
    id: 'first_time',
    question: 'Have you voted in an election before?',
    icon: '🗳️',
    options: [
      { label: 'Yes, several times', icon: '🎖️', value: 'many', color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50' },
      { label: 'Once before', icon: '☑️', value: 'once', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
      { label: 'First time voter!', icon: '🆕', value: 'never', color: 'border-violet-200 hover:border-violet-400 hover:bg-violet-50' },
    ],
  },
  {
    id: 'know_booth',
    question: 'Do you know your polling station location?',
    icon: '📍',
    options: [
      { label: 'Yes, I know it', icon: '📍', value: 'yes', color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' },
      { label: 'Need to find out', icon: '🔍', value: 'no', color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' },
      { label: 'Voting by post/mail', icon: '📮', value: 'postal', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
    ],
  },
];

function getActions(answers: Record<string, string>, country: string) {
  const n = country.charAt(0).toUpperCase() + country.slice(1);
  const items: { icon: string; title: string; text: string; prompt?: string; urgent?: boolean }[] = [];

  if (answers.registered !== 'yes') {
    items.push({ icon: '📝', title: 'Register to vote', urgent: true,
      text: `Register on the official ${n} electoral authority website — deadlines are weeks before polling day.`,
      prompt: `How do I register to vote in ${n}?` });
  }
  if (answers.registered === 'unsure') {
    items.push({ icon: '🔎', title: 'Check your registration',
      text: `Verify your registration status — your details may be outdated if you've moved.`,
      prompt: `How do I check if I'm registered to vote in ${n}?` });
  }
  if (answers.know_booth === 'no') {
    items.push({ icon: '📍', title: 'Find your polling station',
      text: `Your booth is assigned by your registered address. Use the official electoral authority's voter lookup tool.`,
      prompt: `How do I find my polling station in ${n}?` });
  }
  if (answers.first_time === 'never') {
    items.push({ icon: '🧠', title: 'Learn the full process',
      text: `Read the Election Lifecycle section — it walks through every stage so you feel confident on polling day.` });
    items.push({ icon: '🪪', title: 'Know your ID requirements', urgent: true,
      text: `Find out which ID documents are accepted at polling stations in ${n}.`,
      prompt: `What ID documents do I need to vote in ${n}?` });
  }
  if (answers.know_booth === 'postal') {
    items.push({ icon: '📮', title: 'Request your postal ballot',
      text: `Request your mail-in ballot well in advance — there are strict application and return deadlines.`,
      prompt: `How do I vote by post in ${n}?` });
  }
  if (answers.registered === 'yes' && answers.know_booth === 'yes') {
    items.push({ icon: '📅', title: 'Check key dates',
      text: `Review the Key Dates section for the exact polling day and any upcoming deadlines for ${n}.` });
  }
  items.push({ icon: '💬', title: 'Ask the AI assistant',
    text: 'Have any other questions? The assistant knows all the rules for your country — just ask!' });
  return items;
}

export function NextStepView() {
  const country = useAppStore(s => s.country);
  const { send } = useChat();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function pick(value: string) {
    const next = { ...answers, [STEPS[step].id]: value };
    setAnswers(next);
    if (step < STEPS.length - 1) setStep(prev => prev + 1);
    else setDone(true);
  }

  function reset() { setStep(0); setAnswers({}); setDone(false); }

  function askPrompt(prompt: string) {
    send(prompt);
    navigate('/chat');
  }

  const actions = done ? getActions(answers, country) : [];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 1px 12px rgba(0,0,0,0.04)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
          ✅
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">What's my next step?</h1>
          <p className="text-xs text-gray-400">Personalised action plan in 3 questions</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {!done ? (
          <div className="space-y-5 animate-fade-in max-w-lg mx-auto">
            {/* Step progress */}
            <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
              {STEPS.map((_, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                    i < step ? 'bg-emerald-500 text-white shadow-sm' :
                    i === step ? 'bg-indigo-600 text-white shadow-md scale-110' :
                    'bg-gray-100 text-gray-400',
                  )}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={clsx('flex-1 h-1 rounded-full transition-all duration-500', i < step ? 'bg-emerald-400' : 'bg-gray-200')} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            {/* Question */}
            <div className="card animate-scale-in">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}>
                  {STEPS[step].icon}
                </div>
                <p className="text-sm font-bold text-gray-900" id="wiz-q">{STEPS[step].question}</p>
              </div>

              <div className="space-y-2.5" role="group" aria-labelledby="wiz-q">
                {STEPS[step].options.map(opt => (
                  <button key={opt.value} onClick={() => pick(opt.value)}
                    className={clsx(
                      'w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 hover:-translate-y-0.5',
                      opt.color,
                      'bg-white/60',
                    )}
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <span className="text-lg flex-shrink-0" aria-hidden="true">{opt.icon}</span>
                    <span className="text-gray-700">{opt.label}</span>
                    <span className="ml-auto text-gray-300" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up max-w-lg mx-auto">
            {/* Action plan header */}
            <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl" aria-hidden="true">🎯</span>
                <p className="font-bold text-base">Your personalised action plan</p>
              </div>
              <p className="text-indigo-200 text-xs">Based on your answers — here's exactly what to do next:</p>
            </div>

            {/* Actions */}
            <ol className="space-y-3" aria-label="Your personalised election action plan">
              {actions.map((action, i) => (
                <li key={i} className="card flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: action.urgent
                        ? 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.1))'
                        : 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
                    }}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900">{action.title}</p>
                      {action.urgent && (
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-red-100 text-red-600 font-semibold border border-red-200">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{action.text}</p>
                    {action.prompt && (
                      <button onClick={() => askPrompt(action.prompt!)}
                        className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                        aria-label={`Ask: ${action.prompt}`}>
                        <span>Ask the assistant</span>
                        <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <button onClick={reset} className="btn-secondary w-full justify-center">
              ↺ Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
