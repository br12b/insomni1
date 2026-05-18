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
  const { lang } = useLanguage();
  const [text, setText] = useState('');
  const fullText = "Don't miss the opportunities in your life...";
  const [showCursor, setShowCursor] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef(null);

  const handleClose = () => {
    setIsClosing(true);
  };

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

    // Safari / Chrome Incognito / Low Power Mode Autoplay & Mute Fix
    if (videoRef.current) {
      // Explicitly set muted & defaultMuted properties to bypass React muted attribute bug
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay blocked by browser policy, bypassing intro:", error);
          // If browser completely blocks muted autoplay, close intro immediately so user isn't stuck
          handleClose();
        });
      }
    }

    // Safety fallback: if video gets stuck or is too slow to load, auto-close after 8 seconds
    const safetyTimeout = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <motion.div 
      onDoubleClick={handleClose}
      animate={{
        backgroundColor: isClosing ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.85)',
        backdropFilter: isClosing ? 'blur(0px)' : 'blur(8px)',
      }}
      transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }} // Arka plan cam erimesini de ipeksi yavaşlığa senkronize ettik
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
        // FİZİK TABANLI SPRING MOTORU: Yapay süreler yerine gerçekçi süzülme sürtünmesi
        transition={{ 
          type: "spring",
          stiffness: 22, // Yumuşacık bir çekim gerilimi
          damping: 13,   // İpeksi, sarsıntısız sönümleme
          mass: 0.85     // Akıcı bir kütle hissi
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
          onEnded={handleClose}
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

      {/* ULTRA-RESPONSIVE GLASSMORPHISM SKIP INTRO BUTTON */}
      {!isClosing && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          whileHover={{ opacity: 1, scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 32,
            right: 32,
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: 'rgba(255, 255, 255, 0.95)',
            padding: '10px 22px',
            borderRadius: '100px',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: 10000,
            transition: 'border-color 0.2s, background-color 0.2s'
          }}
        >
          {lang === 'tr' ? 'İntroyu Geç' : 'Skip Intro'} <ChevronRight size={14} />
        </motion.button>
      )}
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
    localStorage.clear();
    window.location.reload();
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
          <IntroSequence onComplete={() => setShowIntro(false)} />
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
            {showFullNav ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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
                <button onClick={() => goTo('docs')} className={`btn btn-sm ${view === 'docs' ? 'btn-accent' : 'btn-ghost'}`} style={{ gap: 8 }}>
                  <BookOpen size={14} /> Docs
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
          {view === 'remsync' && <RemSync onSalaryUpdate={setSalaryData} />}
          {view === 'calendar' && <Calendar financialData={{ salaryData, expensesData }} />}
          {view === 'docs' && <Docs />}
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
