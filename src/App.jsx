import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, RefreshCw, Calendar as CalendarIcon, Brain, ChevronLeft, ChevronRight, Zap, BookOpen } from 'lucide-react';
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
import Docs from './pages/Docs';

import { LanguageProvider, useLanguage } from './context/LanguageContext';

const IntroSequence = ({ onComplete }) => {
  const [text, setText] = useState('');
  const fullText = "Don't miss the opportunities in your life...";
  const [showCursor, setShowCursor] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef(null);

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

    // Programmatic play & mute safety injection to bypass browser autoplay policies
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log("Autoplay prevented, waiting for user click/interaction to play", err);
        });
      }
    }

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
  };

  return (
    <motion.div 
      onDoubleClick={handleClose}
      animate={{
        backgroundColor: isClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(5, 5, 10, 0.98)',
        // Heavy GPU backdropFilter completely wiped to unlock buttery smooth 60FPS video playback!
      }}
      transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
      onAnimationComplete={() => {
        if (isClosing) onComplete();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: isClosing ? 'none' : 'auto'
      }}
    >
      {/* High-fidelity glassmorphism skip button in top right */}
      <motion.button
        onClick={handleClose}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.08)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          padding: '10px 20px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          color: 'rgba(255, 255, 255, 0.75)',
          fontFamily: 'var(--mono)',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          cursor: 'pointer',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          textTransform: 'uppercase'
        }}
      >
        <span>{useLanguage().lang === 'tr' ? 'İntroyu Geç' : 'Skip Intro'}</span>
        <ChevronRight size={14} />
      </motion.button>

      <motion.div 
        animate={isClosing ? {
          scale: 0.01,
          x: '-44vw',
          y: '-44vh',
          opacity: 0,
        } : {
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
        }}
        transition={{ 
          type: "spring",
          stiffness: 22,
          damping: 13,
          mass: 0.85
        }} 
        style={{
          width: '100%',
          maxWidth: '1200px',
          aspectRatio: '21/9',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          transformOrigin: 'center center'
        }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          defaultMuted
          preload="auto" // Preloads the entire 5MB file aggressively into cache for lag-free rendering
          onEnded={handleClose}
          onError={handleClose}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.02)',
            pointerEvents: 'none'
          }}
        >
          <source src="/intro.mp4" type="video/mp4" />
        </video>

        <div style={{
          position: 'absolute',
          bottom: '8%',
          fontFamily: 'var(--mono)',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#000',
          letterSpacing: '0.08em',
          height: 40,
          textShadow: 'none',
          zIndex: 10
        }}>
          {text}<span style={{ opacity: showCursor ? 1 : 0 }}>_</span>
        </div>
      </motion.div>
    </motion.div>
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

  const handleResetProfile = () => { 
    localStorage.removeItem(`insomni_synced_txs`);
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

      <div className={`app-container ${isDark ? 'dark' : 'light'}`}>
        <header className="app-header glass" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <div className="header-left">
            <span className="logo-text" onClick={() => goTo('landing')}>
              INSOMNI
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {profile && view !== 'profile' && (
              <nav className={`app-nav ${isNavVisible ? 'nav-active' : ''}`} style={{ display: 'flex', gap: 12 }}>
                <button className={`nav-link ${view === 'landing' ? 'active' : ''}`} onClick={() => goTo('landing')}>
                  <User size={16} /> {lang === 'tr' ? 'Profil' : 'Profile'}
                </button>
                <button className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} onClick={() => goTo('dashboard')}>
                  <Settings size={16} /> {lang === 'tr' ? 'Yönetim' : 'Dashboard'}
                </button>
                <button className={`nav-link ${view === 'opportunities' ? 'active' : ''}`} onClick={() => goTo('opportunities')}>
                  <Zap size={16} /> {lang === 'tr' ? 'Fırsatlar' : 'Opportunities'}
                </button>
                <button className={`nav-link ${view === 'remsync' ? 'active' : ''}`} onClick={() => goTo('remsync')}>
                  <RefreshCw size={16} /> REM Sync
                </button>
                <button className={`nav-link ${view === 'calendar' ? 'active' : ''}`} onClick={() => goTo('calendar')}>
                  <CalendarIcon size={16} /> {lang === 'tr' ? 'Takvim' : 'Calendar'}
                </button>
                <button className={`nav-link ${view === 'docs' ? 'active' : ''}`} onClick={() => goTo('docs')}>
                  <BookOpen size={16} /> {lang === 'tr' ? 'Rehber' : 'Docs'}
                </button>
              </nav>
            )}

            <ThemeToggle />

            {profile && (
              <button
                className="btn btn-icon btn-primary"
                onClick={() => goTo('chat')}
                style={{ width: 44, height: 44, padding: 0 }}
                title="REM AI"
              >
                <Brain size={20} />
              </button>
            )}

            {profile && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleResetProfile}
                style={{ fontSize: 11, padding: '8px 12px' }}
              >
                {lang === 'tr' ? 'Profili Değiştir' : 'Switch Profile'}
              </button>
            )}
          </div>
        </header>

        <main className="app-main" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg)', color: 'var(--text1)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              style={{ width: '100%', height: '100%' }}
            >
              {view === 'profile' && (
                <ProfilePage
                  onSelectProfile={handleUpdateName}
                  onResetProfile={handleResetProfile}
                />
              )}

              {view === 'landing' && profile && (
                <Landing
                  salaryData={salaryData}
                  setSalaryData={setSalaryData}
                  expensesData={expensesData}
                  setExpensesData={setExpensesData}
                  onNavigate={goTo}
                />
              )}

              {view === 'dashboard' && profile && (
                <Dashboard
                  salaryData={salaryData}
                  expensesData={expensesData}
                  setExpensesData={setExpensesData}
                  profileName={profile}
                />
              )}

              {view === 'opportunities' && profile && (
                <Opportunities
                  salaryData={salaryData}
                  expensesData={expensesData}
                />
              )}

              {view === 'chat' && profile && (
                <Chat
                  financialData={{
                    salary: salaryData,
                    expenses: expensesData,
                  }}
                />
              )}

              {view === 'remsync' && profile && (
                <RemSync />
              )}

              {view === 'calendar' && profile && (
                <Calendar
                  salaryData={salaryData}
                  expensesData={expensesData}
                />
              )}

              {view === 'docs' && (
                <Docs />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AdminUIProvider>
        <AppContent />
      </AdminUIProvider>
    </LanguageProvider>
  );
}
