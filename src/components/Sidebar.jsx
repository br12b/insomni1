import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Sparkles, 
  User, 
  Settings, 
  ChevronDown,
  Compass,
  Zap,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

export default function Sidebar({ view, goTo, lang, toggleLang, profile, isDark, toggleTheme }) {
  const [isStrategyOpen, setIsStrategyOpen] = useState(true);

  const NavItem = ({ id, icon: Icon, label, badge, isSub }) => {
    const isActive = view === id;
    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => goTo(id)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: isSub ? '10px 16px 10px 48px' : '12px 16px',
          borderRadius: 12,
          border: 'none',
          background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          color: isActive ? 'var(--accent)' : 'var(--text2)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          position: 'relative',
          marginBottom: 4,
          textAlign: 'left'
        }}
      >
        {isActive && (
          <motion.div layoutId="activeNav" 
            style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 4, background: 'var(--accent)', borderRadius: '0 4px 4px 0' }} />
        )}
        <Icon size={18} color={isActive ? 'var(--accent)' : 'inherit'} />
        <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 500, flex: 1 }}>{label}</span>
        {badge && (
          <span style={{ 
            fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 20, 
            background: id === 'opportunities' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
            color: id === 'opportunities' ? '#10b981' : '#f59e0b'
          }}>
            {badge}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <motion.div 
      initial={{ x: -280 }} animate={{ x: 0 }}
      style={{ 
        width: 280, height: '100vh', background: 'rgba(20,20,25,0.8)', 
        backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 100, flexShrink: 0, position: 'sticky', top: 0
      }}>
      
      {/* Logo Area */}
      <div onClick={() => goTo('landing')} style={{ cursor: 'pointer', marginBottom: 40, padding: '0 8px' }}>
        <img src="/insomni.png" alt="Insomni" style={{ height: 160, width: 'auto', marginLeft: -30, marginTop: -60, marginBottom: -60 }} />
      </div>

      {/* Main Nav */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <NavItem id="dashboard" icon={LayoutDashboard} label={lang === 'tr' ? 'Dashboard' : 'Dashboard'} />
        
        {/* Strategy Group */}
        <div style={{ marginTop: 10 }}>
          <button 
            onClick={() => setIsStrategyOpen(!isStrategyOpen)}
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
              background: 'transparent', border: 'none', color: 'var(--text0)', cursor: 'pointer',
              fontWeight: 800, fontSize: 14, marginBottom: 4
            }}>
            <TrendingUp size={18} />
            <span style={{ flex: 1, textAlign: 'left' }}>{lang === 'tr' ? 'Strateji' : 'Strategy'}</span>
            <motion.div animate={{ rotate: isStrategyOpen ? 180 : 0 }}>
              <ChevronDown size={14} color="var(--text2)" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isStrategyOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', position: 'relative' }}>
                {/* Connecting Lines */}
                <div style={{ position: 'absolute', left: 24, top: 0, bottom: 20, width: 1, background: 'rgba(255,255,255,0.1)' }} />
                
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 24, top: 20, width: 16, height: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '0 0 0 8px' }} />
                  <NavItem id="opportunities" icon={Compass} label={lang === 'tr' ? 'Fırsatlar' : 'Opportunities'} badge="NEW" isSub />
                  
                  <div style={{ position: 'absolute', left: 24, top: 60, width: 16, height: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '0 0 0 8px' }} />
                  <NavItem id="goals" icon={Target} label={lang === 'tr' ? 'Hedefler' : 'Goals'} isSub />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavItem id="chat" icon={Sparkles} label={lang === 'tr' ? 'R.E.M AI' : 'R.E.M AI'} />
      </div>

      {/* Bottom Actions */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 8px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleLang} className="btn btn-ghost btn-sm" style={{ flex: 1, fontSize: 12, fontWeight: 900 }}>
            <Globe size={14} /> {lang.toUpperCase()}
          </button>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
        
        {profile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="var(--accent)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>Premium Plan</div>
            </div>
            <button onClick={() => goTo('admin')} style={{ background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}>
              <Settings size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
