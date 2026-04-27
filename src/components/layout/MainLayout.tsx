import { Outlet, NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { LANGUAGES } from '../../hooks/useTranslation';
import { ELECTION_DATA } from '../../data/electionData';
import type { CountryCode } from '../../types';
import clsx from 'clsx';

const NAV = [
  { to: '/chat',      icon: '💬', label: 'Ask anything',       aria: 'Open AI chat',               color: 'from-indigo-500 to-violet-500' },
  { to: '/lifecycle', icon: '🗳️', label: 'Election lifecycle', aria: 'View election stages',        color: 'from-blue-500 to-cyan-500' },
  { to: '/timeline',  icon: '📅', label: 'Key dates',          aria: 'View key dates timeline',     color: 'from-emerald-500 to-teal-500' },
  { to: '/quiz',      icon: '🧠', label: 'Quick quiz',         aria: 'Take the quiz',               color: 'from-amber-500 to-orange-500' },
  { to: '/next-step', icon: '✅', label: "What's next?",       aria: 'Get personalised next steps', color: 'from-rose-500 to-pink-500' },
];

const COUNTRIES = Object.values(ELECTION_DATA).map(d => ({
  code: d.code, name: d.name,
  flag: ({ india:'🇮🇳', usa:'🇺🇸', uk:'🇬🇧', australia:'🇦🇺', germany:'🇩🇪' } as Record<string,string>)[d.code] ?? '🌍',
}));

export function MainLayout() {
  const { country, setCountry, language, setLanguage } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)' }}>

      {/* ── Sidebar ──────────────────────────────────────── */}
      <nav
        aria-label="Main navigation"
        className="hidden md:flex flex-col w-60 flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #1e1b4b 100%)',
          boxShadow: '4px 0 24px rgba(30,27,75,0.3)',
        }}
      >
        {/* Brand */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 12px rgba(99,102,241,0.5)' }}>
              🗳️
            </div>
            <div>
              <p className="text-base font-bold text-white tracking-tight">ElectIQ</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Free election guide</p>
            </div>
          </div>
          {/* Decorative line */}
          <div className="mt-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
        </div>

        {/* Nav links */}
        <ul className="flex-1 px-3 space-y-1 overflow-y-auto" role="list">
          {NAV.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                aria-label={item.aria}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 w-full group',
                  isActive
                    ? 'nav-active shadow-sm'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white',
                )}
              >
                {({ isActive }) => (
                  <>
                    <div className={clsx(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-200',
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-md`
                        : 'bg-white/10 group-hover:bg-white/20',
                    )}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" aria-hidden="true" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Country & language */}
        <div className="p-3 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <label htmlFor="country-sel" className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              🌍 Country / Region
            </label>
            <select
              id="country-sel"
              value={country}
              onChange={e => setCountry(e.target.value as CountryCode)}
              aria-label="Select your country or region"
              className="w-full px-3 py-2 text-xs rounded-xl text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#1e1b4b' }}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="lang-sel" className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              🌐 Language
            </label>
            <select
              id="lang-sel"
              value={language}
              onChange={e => setLanguage(e.target.value)}
              aria-label="Select display language"
              className="w-full px-3 py-2 text-xs rounded-xl text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} style={{ background: '#1e1b4b' }}>{l.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center gap-1.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Built with ❤️ by Sathwik Sandesh</p>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom nav ────────────────────────────── */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          background: 'rgba(30,27,75,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.aria}
            className={({ isActive }) => clsx(
              'flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors',
              isActive ? 'text-indigo-300' : 'text-indigo-500',
            )}
          >
            <span aria-hidden="true" className="text-lg">{item.icon}</span>
            <span className="leading-none font-medium">{item.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── Main content ─────────────────────────────────── */}
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
