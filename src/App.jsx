import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './hooks/useTheme';
import { AdminUIProvider } from './context/AdminUIContext';
import { storage } from './lib/storage';
import Sidebar from './components/Sidebar';
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
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function AppContent() {
  const { isDark, toggleTheme } = useTheme();
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

  const showSidebar = profile && salaryData && view !== 'admin' && view !== 'landing' && view !== 'profile' && view !== 'salary' && view !== 'expenses';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg1)', color: 'var(--text0)' }}>
      {/* Sidebar Entegrasyonu */}
      {showSidebar && (
        <Sidebar 
          view={view} 
          goTo={goTo} 
          lang={lang} 
          toggleLang={toggleLang} 
          profile={profile}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
