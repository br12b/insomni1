import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, RefreshCw, Calendar as CalendarIcon, Brain, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
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
import ProfilePage from './pages/ProfilePage';
import SalaryInput from './components/onboarding/SalaryInput';
import ExpenseInput from './components/onboarding/ExpenseInput';
import ProfileModal from './components/ProfileModal';

import { LanguageProvider, useLanguage } from './context/LanguageContext';

const IntroSequence = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "Don't miss the opportunities in your life...";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div 
      onDoubleClick={onComplete}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)', // Biraz daha koyulaştırdık ki video net çıksın
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '21/9', // SİBER MAKAS: 16:9 yerine 21:9 Ultra Geniş yaptık. Böylece alt ve üst otomatik kırpılacak!
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}>
        <video 
          autoPlay 
          muted 
          playsInline
          onEnded={onComplete}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Videoyu 21:9 içine yay, taşan kısımları (alt/üst) kes
            transform: 'scale(1.02)', // Hafif bir yakınlaştırma, gereksiz payları alır
            pointerEvents: 'none'
          }}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>
      </div>

      <div style={{
        marginTop: '30px',
        fontFamily: 'var(--mono)',
        fontSize: '2.5rem', // Daktilo yazısını biraz daha büyüttüm
        fontWeight: 600,
        color: '#000',
        letterSpacing: '0.08em',
        height: 50,
        textShadow: 'none',
        zIndex: 10
      }}>
        {text}<span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
      </div>
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AppContent() {
  const { isDark } = useTheme();
  const { lang, t, toggleLang } = useLanguage();
  const [profile, setProfile] = useState(() => storage.getCurrentProfile());
    const [showFullNav, setShowFullNav] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
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

  const handleResetProfile = () => { localStorage.removeItem(`insomni_synced_txs`);
    storage.setCurrentProfile('');
    setProfile('');
    setSalaryData(null);
    setExpensesData([]);
    goTo('profile');
  };

  const handleUpdateName = (newName) => {
    storage.setCurrentProfile(newName);
    setProfile(newName);
  };

  // NAVIGATION IS NOW PURELY CONTROLLED BY THE ZAP BUTTON FOR COMPACT VIBE
  const isNavVisible = showFullNav;

    return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
          >
            <IntroSequence onComplete={() => setShowIntro(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {view !== 'admin' && (
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 40px', zIndex: 1000, position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 180 }}>
          <div onClick={() => goTo('landing')} style={{ cursor: 'pointer', userSelect: 'none' }}>
            <img src="/insomni.png" alt="Insomni" style={{ height: 180, width: 'auto' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 20, left: 100, pointerEvents: 'none' }}>
            <img src="/build-with-gemini.png" alt="Build with Gemini" 
                 style={{ 
                   height: 110, 
                   width: 'auto', 
                   userSelect: 'none',
                   filter: 'brightness(0) contrast(100)'
                 }} />
          </div>
        </div>

        <div className="glass" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 20px', borderRadius: 100 }}>
          <button onClick={toggleLang} className="btn btn-ghost btn-sm" style={{ fontWeight: 800, minWidth: 44 }}>
            {lang.toUpperCase()}
          </button>

          {/* PERMANENT PURPLE ZAP BUTTON */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFullNav(!showFullNav)}
            className="btn btn-icon btn-sm"
            style={{ 
              background: 'linear-gradient(135deg, #818cf8, #c084fc)', 
              color: '#fff', 
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(192,132,252,0.5)',
              border: 'none'
            }}
          >
            {showFullNav ? <ChevronRight size={16} /> : <Zap size={16} fill="currentColor" />}
          </motion.button>

          <AnimatePresence>
            {isNavVisible && (
              <motion.div 
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                style={{ display: 'flex', gap: 8, overflow: 'hidden' }}
              >
                {/* Dashboard etc. now only show if they have data OR user explicitly expanded */}
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
              </motion.div>
            )}
          </AnimatePresence>

          {profile && (
            <>
              <button onClick={() => goTo('profile')} className={`btn btn-icon btn-sm ${view === 'profile' ? 'btn-accent' : 'btn-ghost'}`} title={profile}>
                <User size={16} />
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
          {view === 'profile' && (
            profile ? 
              <ProfilePage name={profile} onReset={handleResetProfile} onUpdateName={handleUpdateName} /> : 
              <ProfileModal initialName={profile} onComplete={name => { setProfile(name); goTo('landing'); }} />
          )}
          {view === 'salary' && <SalaryInput onComplete={d => { setSalaryData(d); goTo('expenses'); }} />}
          {view === 'expenses' && <ExpenseInput onComplete={d => { setExpensesData(d); goTo('dashboard'); }} />}
          {view === 'dashboard' && <Dashboard salaryData={salaryData || {income:0, currency:'₺', day:1}} expensesData={expensesData} profileName={profile} />}
          {view === 'opportunities' && <Opportunities expenses={expensesData} salaryData={salaryData || {income:0, currency:'₺', day:1}} />}
          {view === 'chat' && <Chat salaryData={salaryData} expensesData={expensesData} />}
          {view === 'remsync' && <RemSync />}
          {view === 'calendar' && <Calendar financialData={{ salaryData, expensesData }} />}
        </motion.div>
      </AnimatePresence>
    </div>
    </>
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
// Force Vercel Sync: 05/16/2026 21:49:43
// Deploy Trigger: 05/16/2026 22:05:54
// Vercel Global Update: 05/16/2026 22:27:10
// Vercel Global Reset Sync: 05/16/2026 23:00:51
// Vercel Wake Up Call: 05/16/2026 23:02:19
