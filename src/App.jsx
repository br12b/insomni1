import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { AdminUIProvider } from './context/AdminUIContext';
import { storage } from './lib/storage';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ui/ThemeToggle';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import Goals from './pages/Goals';
import Chat from './pages/Chat';
import SalaryInput from './components/onboarding/SalaryInput';
import ExpenseInput from './components/onboarding/ExpenseInput';
import ProfileModal from './components/ProfileModal';
import Admin from './pages/Admin';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function AppContent() {
  const { isDark } = useTheme();
  const { lang, toggleLang } = useLanguage();
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

  const hasData = profile && salaryData;
  const isSpecialView = view === 'admin' || view === 'landing' || view === 'profile' || view === 'salary' || view === 'expenses';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg0)', color: 'var(--text0)' }}>
      {/* Navbar (Always Top, Optimized) */}
      {!isSpecialView && (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', zIndex: 1000, position: 'sticky', top: 0, background: 'rgba(20,20,25,0.4)', backdropFilter: 'blur(10px)' }}>
          <div onClick={() => goTo('landing')} style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center' }}>
            <img src="/insomni.png" alt="Insomni" style={{ height: 180, width: 'auto', marginTop: -60, marginBottom: -60 }} />
          </div>
          <div className="glass" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 20px', borderRadius: 100 }}>
            <button onClick={toggleLang} className="btn btn-ghost btn-sm" style={{ fontWeight: 800, minWidth: 44 }}>
              {lang.toUpperCase()}
            </button>
            {profile && (
              <>
                <button onClick={() => goTo(''profile'')} className="btn btn-ghost btn-icon btn-sm" title={profile}>
                  <User size={16} />
                </button>
                <button onClick={() => goTo(''admin'')} className={`btn btn-icon btn-sm ${view === ''admin'' ? ''btn-accent'' : ''btn-ghost''}`} title="Admin Panel">
                  <Settings size={16} />
                </button>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      )}

      {/* Main Layout (Flex) */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Glass Sidebar (Left) */}
        {!isSpecialView && hasData && (
          <Sidebar view={view} goTo={goTo} lang={lang} />
        )}

        {/* Content Area (Right) */}
        <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0, padding: !isSpecialView ? '0 40px' : 0 }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {view === 'landing' && <Landing onStart={() => goTo('salary')} />}
              {view === 'profile' && <ProfileModal initialName={profile} onComplete={name => { setProfile(name); goTo('landing'); }} />}
              {view === 'salary' && <SalaryInput onComplete={d => { setSalaryData(d); goTo('expenses'); }} />}
              {view === 'expenses' && <ExpenseInput onComplete={d => { setExpensesData(d); goTo('dashboard'); }} />}
              {view === 'dashboard' && <Dashboard salaryData={salaryData} expensesData={expensesData} profileName={profile} />}
              {view === 'opportunities' && <Opportunities expenses={expensesData} salaryData={salaryData} />}
              {view === 'chat' && <Chat salaryData={salaryData} expensesData={expensesData} />}
              {view === 'goals' && <Goals financialData={{ salaryData, expensesData }} />}
              {view === 'admin' && <Admin onClose={() => goTo('landing')} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
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
