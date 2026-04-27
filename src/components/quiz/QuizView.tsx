import { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import clsx from 'clsx';

interface Q { id:string; question:string; options:string[]; correctIndex:number; explanation:string; }

const QUESTIONS: Q[] = [
  { id:'q1', question:'At what minimum age can most citizens vote in a general election?', options:['14 years old','16 years old','18 years old','21 years old'], correctIndex:2, explanation:'In most democracies — India, USA, UK, Australia, and Germany — the minimum voting age is 18. Some countries allow 16 for certain elections.' },
  { id:'q2', question:"What does India's Model Code of Conduct (MCC) govern?", options:['Rules for counting votes accurately','Conduct of parties & candidates during elections','How EVMs are tested before use','Polling booth staff standards'], correctIndex:1, explanation:'The MCC is a set of ECI guidelines that all parties must follow from the election announcement until results — to ensure a level playing field.' },
  { id:'q3', question:'How does preferential (ranked-choice) voting work in Australia?', options:['Vote for one candidate only','Rank candidates in order of preference','Vote twice — once for a candidate and once for a party','Candidate with most seats wins automatically'], correctIndex:1, explanation:'You number candidates 1, 2, 3… If no one gets 50%+1 of first-preference votes, the last-place candidate is eliminated and preferences redistribute.' },
  { id:'q4', question:'What does EVM stand for in Indian elections?', options:['Electronic Voting Machine','Election Verification Method','Enrolled Voter Module','Every Vote Matters'], correctIndex:0, explanation:'EVM = Electronic Voting Machine. Used in India since 1982, paired with VVPAT since 2013 so voters can verify their vote was recorded correctly.' },
  { id:'q5', question:'Which body conducts general elections in India?', options:['The Supreme Court of India','The Prime Minister\'s Office','The Election Commission of India','The Lok Sabha Secretariat'], correctIndex:2, explanation:'The Election Commission of India (ECI) is an independent constitutional authority established on January 25, 1950.' },
  { id:'q6', question:'How many Electoral College votes are needed to win the US Presidency?', options:['218 out of 435','270 out of 538','306 out of 538','51 out of 100'], correctIndex:1, explanation:'A candidate needs 270 of 538 Electoral College votes. The 538 total = 435 House seats + 100 Senate seats + 3 for Washington D.C.' },
  { id:'q7', question:'Is voting compulsory in Australia?', options:['No, it is voluntary like most democracies','Yes, for citizens over 21 only','Yes, for all enrolled citizens aged 18+','Only compulsory in federal elections'], correctIndex:2, explanation:'Voting is compulsory for all enrolled Australian citizens aged 18+. Australia has had compulsory voting since 1924, resulting in 90%+ turnout.' },
  { id:'q8', question:"What is Germany's 5% threshold (Fünf-Prozent-Hürde)?", options:['Parties need 5% of seats to govern','Parties need 5% of second votes to enter Bundestag','Candidates need 5% to keep their deposit','5% of ballots are hand-counted for verification'], correctIndex:1, explanation:'A party must win at least 5% of national second votes (or 3 direct seats) to enter the Bundestag. This prevents extreme political fragmentation.' },
  { id:'q9', question:'What does NOTA stand for in Indian elections?', options:['National Official Tally Authority','None of the Above','National Online Turnout Assessment','No Other Transparent Alternative'], correctIndex:1, explanation:'NOTA = "None of the Above". It lets voters officially reject all candidates. Introduced on Indian EVMs in 2013 after a Supreme Court order.' },
  { id:'q10', question:'Which voting system does the United Kingdom use for general elections?', options:['Proportional Representation','Preferential (Ranked Choice) Voting','First Past the Post','Mixed-Member Proportional'], correctIndex:2, explanation:'The UK uses First Past the Post (FPTP). Each of 650 constituencies elects one MP — the candidate with the most votes wins that seat.' },
];

const RESULT_CONFIG = [
  { min: 9, emoji: '🏆', label: 'Election Expert!',     color: 'from-amber-400 to-yellow-500',   msg: "Outstanding! You know elections inside out. Share your knowledge with others!" },
  { min: 7, emoji: '🎯', label: 'Sharp Voter!',         color: 'from-emerald-400 to-teal-500',   msg: "Great score! You're well-prepared to vote confidently." },
  { min: 5, emoji: '📚', label: 'Getting There!',       color: 'from-blue-400 to-indigo-500',    msg: "Good effort! Explore the Election Lifecycle and Ask Anything to fill the gaps." },
  { min: 0, emoji: '🌱', label: 'Just Getting Started', color: 'from-violet-400 to-purple-500',  msg: "No worries — that's what ElectIQ is for! Keep exploring and ask me anything." },
];

export function QuizView() {
  const { quizScore, quizTotal, incrementScore, resetQuiz } = useAppStore();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [complete, setComplete] = useState(false);

  const q = QUESTIONS[idx];
  const pct = complete ? Math.round((quizScore / QUESTIONS.length) * 100) : 0;
  const result = RESULT_CONFIG.find(r => quizScore >= r.min) ?? RESULT_CONFIG[RESULT_CONFIG.length - 1];

  function answer(i: number) {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    incrementScore(i === q.correctIndex);
  }

  function next() {
    if (idx === QUESTIONS.length - 1) { setComplete(true); return; }
    setIdx(i => i + 1);
    setSelected(null);
    setRevealed(false);
  }

  function restart() {
    setIdx(0); setSelected(null); setRevealed(false); setComplete(false); resetQuiz();
  }

  if (complete) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 1px 12px rgba(0,0,0,0.04)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
            🧠
          </div>
          <h1 className="text-sm font-bold text-gray-900">Quiz Results</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center">
          {/* Score circle */}
          <div className={clsx('w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-glow-lg mt-4 mb-6 bg-gradient-to-br', result.color)}>
            <span className="text-3xl" aria-hidden="true">{result.emoji}</span>
            <span className="text-2xl font-black">{pct}%</span>
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-1">{result.label}</h2>
          <p className="text-sm text-gray-500 text-center mb-2 max-w-xs">{result.msg}</p>
          <p className="text-sm font-semibold text-gray-700 mb-6">
            You got <span className="gradient-text font-black">{quizScore}</span> out of {QUESTIONS.length} correct
          </p>

          {/* Score breakdown */}
          <div className="w-full max-w-sm card mb-6 p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Score breakdown</span>
              <span className="text-xs text-gray-400">{quizScore}/{QUESTIONS.length}</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full bg-gradient-to-r transition-all duration-1000', result.color)}
                style={{ width: `${pct}%` }}
                role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0</span><span>5</span><span>10</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-4 flex items-center gap-1">
            <span>💾</span> Score saved locally on your device
          </p>
          <button onClick={restart} className="btn-primary px-8">
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 1px 12px rgba(0,0,0,0.04)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(99,102,241,0.2)' }}>
          🧠
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-gray-900">Quick Quiz</h1>
          <p className="text-xs text-gray-400">Test your election knowledge</p>
        </div>
        {quizTotal > 0 && (
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' }}>
            {quizScore}/{quizTotal} ✓
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span className="font-semibold">Question {idx + 1} <span className="text-gray-400">of {QUESTIONS.length}</span></span>
            <span>{Math.round(((idx) / QUESTIONS.length) * 100)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"
            role="progressbar" aria-valuenow={idx + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-label={`Question ${idx + 1} of ${QUESTIONS.length}`}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((idx) / QUESTIONS.length) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
            />
          </div>
          {/* Step dots */}
          <div className="flex gap-1 mt-2 justify-center">
            {QUESTIONS.map((_, i) => (
              <div key={i} className={clsx('h-1 rounded-full transition-all duration-300', i < idx ? 'w-4 bg-indigo-400' : i === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-200')} aria-hidden="true" />
            ))}
          </div>
        </div>

        {/* Question card */}
        <div className="card animate-scale-in">
          <p className="text-sm font-bold text-gray-900 mb-5 leading-snug" id="quiz-q">{q.question}</p>

          <div className="space-y-2.5" role="radiogroup" aria-labelledby="quiz-q">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => answer(i)}
                  disabled={revealed}
                  role="radio"
                  aria-checked={isSelected}
                  className={clsx(
                    'w-full text-left px-4 py-3.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3',
                    !revealed && 'hover:-translate-y-0.5 hover:shadow-soft',
                    !revealed && 'border border-gray-100 bg-white/60 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50',
                    revealed && isCorrect && 'border border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm',
                    revealed && isSelected && !isCorrect && 'border border-red-300 bg-red-50 text-red-800',
                    revealed && !isSelected && !isCorrect && 'border border-gray-100 bg-white/30 text-gray-400 opacity-60',
                  )}
                  style={{ backdropFilter: 'blur(8px)' }}
                >
                  <span className={clsx(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all',
                    !revealed && 'border-gray-300 text-gray-400',
                    revealed && isCorrect && 'border-emerald-500 bg-emerald-500 text-white',
                    revealed && isSelected && !isCorrect && 'border-red-400 bg-red-400 text-white',
                    revealed && !isSelected && !isCorrect && 'border-gray-200',
                  )} aria-hidden="true">
                    {revealed && isCorrect ? '✓' : revealed && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {revealed && (
            <div className={clsx(
              'mt-4 p-4 rounded-xl animate-slide-up',
              selected === q.correctIndex ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200',
            )} role="alert" aria-live="polite">
              <p className={clsx('font-bold text-sm mb-1', selected === q.correctIndex ? 'text-emerald-700' : 'text-red-700')}>
                {selected === q.correctIndex ? '✓ Correct!' : '✗ Not quite.'}
              </p>
              <p className="text-sm text-gray-700">{q.explanation}</p>
            </div>
          )}
        </div>

        {revealed && (
          <button onClick={next} className="btn-primary w-full justify-center animate-slide-up">
            {idx === QUESTIONS.length - 1 ? '🎉 See my results' : 'Next question →'}
          </button>
        )}
      </div>
    </div>
  );
}
