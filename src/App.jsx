import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { AdminUIProvider, AdminUIContext } from './context/AdminUIContext';
import { storage } from './lib/storage';
import ThemeToggle from './components/ui/ThemeToggle';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
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
  
  const [salaryData, setSalaryData] = useState(() => profile ? storage.loadProfile(profile, 'salary') : null);
  const [expensesData, setExpensesData] = useState(() => profile ? storage.loadProfile(profile, 'expenses', []) : []);

  useEffect(() => {
    if (profile) {
      storage.setCurrentProfile(profile);
      if (salaryData) storage.saveProfile(profile, 'salary', salaryData);
      if (expensesData) storage.saveProfile(profile, 'expenses', expensesData);
    }
  }, [profile, salaryData, expensesData]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.pathname === '/admin') {
        setView('admin');
      } else if (view === 'admin') {
        setView(profile ? 'landing' : 'profile');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [view, profile]);

  const goTo = (v) => {
    if (v === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (view === 'admin') {
      window.history.pushState({}, '', '/');
    }
    setView(v);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
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
                {lang === 'tr' ? 'Dashboard' : 'Dashboard'}
              </button>
              <button onClick={() => goTo('opportunities')} className={`btn btn-sm ${view === 'opportunities' ? 'btn-accent' : 'btn-ghost'}`}>
                {lang === 'tr' ? 'Fırsatlar' : 'Opportunities'}
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

      {/* Pages */}
      <AnimatePresence mode="wait">
        <motion.div key={view} variants={pageVariants} initial="initial" animate="animate" exit="exit"
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: (view === 'dashboard' || view === 'opportunities') ? 'visible' : 'hidden' }}>
          {view === 'landing' && <Landing onStart={() => goTo('salary')} />}
          {view === 'profile' && <ProfileModal initialName={profile} onComplete={name => { setProfile(name); goTo('landing'); }} />}
          {view === 'salary' && <SalaryInput onComplete={d => { setSalaryData(d); goTo('expenses'); }} />}
          {view === 'expenses' && <ExpenseInput onComplete={d => { setExpensesData(d); goTo('dashboard'); }} />}
          {view === 'dashboard' && <Dashboard salaryData={salaryData} expensesData={expensesData} profileName={profile} />}
          {view === 'opportunities' && <Opportunities expenses={expensesData} />}
        
        
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
