import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, RefreshCw, Calendar as CalendarIcon, Brain } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { AdminUIContext, AdminUIProvider } from './context/AdminUIContext';
import { storage } from './lib/storage';
import ThemeToggle from './components/ui/ThemeToggle';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import Chat from './pages/Chat';
import RemSync from './pages/RemSync';
import Calendar from './pages/Calendar';
import SalaryInput from './components/onboarding/SalaryInput';
import ExpenseInput from './components/onboarding/ExpenseInput';
import ProfileModal from './components/ProfileModal';
import Admin from './pages/Admin';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AppContent() {
  const { isDark } = useTheme();
  const { lang, t, toggleLang } = useLanguage();
  const [profile, setProfile] = useState(() => storage.getCurrentProfile());
  
  const initialView = window.location.pathname === '/admin' ? 'admin' : (storage.getCurrentProfile() ? 'landing' : 'profile');
  const [view, setView] = useState(initialView);
  
  const [salaryData, setSalaryData] = useState(null);
  const [expensesData, setExpensesData] = useState([]);

  useEffect(() => {
    if (profile === 'Test User') {
      setSalaryData({ income: 0, currency: '₺', day: 1 });
      setExpensesData([]);
    } else if (profile) {
      setSalaryData(storage.loadProfile(profile, 'salary'));
      setExpensesData(storage.loadProfile(profile, 'expenses', []));
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      storage.setCurrentProfile(profile);
      if (salaryData) storage.saveProfile(profile, 'salary', salaryData);
      if (expensesData) storage.saveProfile(profile, 'expenses', expensesData);
    }
  }, [profile, salaryData, expensesData]);

  const goTo = (v) => {
    if (v === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    setView(v);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {view !== 'admin' && (
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', zIndex: 1000, position: 'relative', flexShrink: 0 }}>
        <div onClick={() => goTo('landing')} style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/insomni.png" alt="Insomni" style={{ height: 220, width: 'auto' }} />
        </div>
        <div className="glass" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 20px', borderRadius: 100 }}>
          <button onClick={toggleLang} className="btn btn-ghost btn-sm" style={{ fontWeight: 800, minWidth: 44 }}>
            {lang.toUpperCase()}
          </button>

          {profile && salaryData && (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => goTo('dashboard')} className={`btn btn-sm ${view === 'dashboard' ? 'btn-accent' : 'btn-ghost'}`}>
                Dashboard
              </button>
              <button onClick={() => goTo('opportunities')} className={`btn btn-sm ${view === 'opportunities' ? 'btn-accent' : 'btn-ghost'}`}>
                {lang === 'tr' ? 'Fırsatlar' : 'Opportunities'}
              </button>
              <button onClick={() => goTo('remsync')} className={`btn btn-sm ${view === 'remsync' ? 'btn-accent' : 'btn-ghost'}`} style={{ gap: 8 }}>
                <RefreshCw size={14} /> REM Sync
              </button>
              <button onClick={() => goTo('chat')} className={`btn btn-sm ${view === 'chat' ? 'btn-accent' : 'btn-ghost'}`} style={{ gap: 8 }}>
                <Brain size={14} /> R.E.M AI
              </button>
              <button onClick={() => goTo('calendar')} className={`btn btn-sm ${view === 'calendar' ? 'btn-accent' : 'btn-ghost'}`} style={{ gap: 8 }}>
                <CalendarIcon size={14} /> {lang === 'tr' ? 'Takvim' : 'Calendar'}
              </button>
            </div>
          )}

          {profile && (
            <>
              <button onClick={() => goTo('profile')} className="btn btn-ghost btn-icon btn-sm" title={profile}>
                <User size={16} />
              </button>
              <button onClick={() => goTo('admin')} className={`btn btn-icon btn-sm ${view === 'admin' ? 'btn-accent' : 'btn-ghost'}`} title="Admin Panel">
                <Settings size={16} />
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </nav>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={view} variants={pageVariants} initial="initial" animate="animate" exit="exit"
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {view === 'landing' && <Landing onStart={() => goTo('salary')} />}
          {view === 'profile' && <ProfileModal initialName={profile} onComplete={name => { setProfile(name); goTo('landing'); }} />}
          {view === 'salary' && <SalaryInput onComplete={d => { setSalaryData(d); goTo('expenses'); }} />}
          {view === 'expenses' && <ExpenseInput onComplete={d => { setExpensesData(d); goTo('dashboard'); }} />}
          {view === 'dashboard' && <Dashboard salaryData={salaryData} expensesData={expensesData} profileName={profile} />}
          {view === 'opportunities' && <Opportunities expenses={expensesData} salaryData={salaryData} />}
          {view === 'chat' && <Chat salaryData={salaryData} expensesData={expensesData} />}
          {view === 'remsync' && <RemSync />}
          {view === 'calendar' && <Calendar financialData={{ salaryData, expensesData }} />}
          {view === 'admin' && <Admin onClose={() => goTo('landing')} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AdminUIProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AdminUIProvider>
  );
}
