import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Compass,
  ChevronDown,
  Activity,
  Zap,
  PieChart
} from 'lucide-react';

export default function Sidebar({ view, goTo, lang }) {
  const [isStrategyOpen, setIsStrategyOpen] = useState(true);

  const NavItem = ({ id, icon: Icon, label, badge, isSub }) => {
    const isActive = view === id;
    return (
      <motion.button
        whileHover={{ x: 4, background: 'rgba(255, 255, 255, 0.05)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => goTo(id)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: isSub ? '10px 16px 10px 48px' : '12px 16px',
          borderRadius: 14, border: 'none',
          background: isActive ? 'var(--accent-dim)' : 'transparent',
          color: isActive ? 'var(--accent)' : 'var(--text2)',
          cursor: 'pointer', transition: 'all 0.2s',
          position: 'relative', marginBottom: 4, textAlign: 'left'
        }}
      >
        {isActive && (
          <motion.div layoutId="activeSidebarNav" 
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
      initial={{ x: -260, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      style={{ 
        width: 260, height: 'calc(100vh - 120px)', 
        background: 'rgba(255,255,255,0.03)', 
        backdropFilter: 'blur(32px)', 
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column', padding: '20px 12px', 
        zIndex: 100, flexShrink: 0, position: 'sticky', top: 100,
        marginLeft: 20, borderRadius: 24, marginBottom: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ padding: '0 16px', marginBottom: 15, fontSize: 11, fontWeight: 800, color: 'var(--text2)', letterSpacing: 1.5, opacity: 0.5 }}>
          {lang === 'tr' ? 'ANA MENÜ' : 'MAIN MENU'}
        </div>
        
        <NavItem id="dashboard" icon={LayoutDashboard} label={lang === 'tr' ? 'Dashboard' : 'Dashboard'} />
        
        <div style={{ marginTop: 20 }}>
          <button 
            onClick={() => setIsStrategyOpen(!isStrategyOpen)}
            style={{ 
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', 
              background: 'transparent', border: 'none', color: 'var(--text0)', cursor: 'pointer',
              fontWeight: 800, fontSize: 13, marginBottom: 4, opacity: 0.8
            }}>
            <PieChart size={18} />
            <span style={{ flex: 1, textAlign: 'left' }}>{lang === 'tr' ? 'STRATEJİ' : 'STRATEGY'}</span>
            <motion.div animate={{ rotate: isStrategyOpen ? 180 : 0 }}>
              <ChevronDown size={14} color="var(--text2)" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {isStrategyOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', position: 'relative' }}>
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

        <div style={{ marginTop: 20, padding: '0 16px', marginBottom: 10, fontSize: 11, fontWeight: 800, color: 'var(--text2)', letterSpacing: 1.5, opacity: 0.5 }}>
          {lang === 'tr' ? 'ZEKÂ' : 'INTELLIGENCE'}
        </div>
        <NavItem id="chat" icon={Sparkles} label={lang === 'tr' ? 'R.E.M AI' : 'R.E.M AI'} />
      </div>

      <div style={{ marginTop: 'auto', padding: '16px' }}>
        <div className="glass" style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 4 }}>Premium Status</div>
          <div style={{ fontSize: 10, color: 'var(--text2)' }}>Tüm özellikler aktif.</div>
        </div>
      </div>
    </motion.div>
  );
}
