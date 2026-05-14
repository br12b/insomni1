import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Clock, Shield, Sparkles } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Landing({ onStart }) {
  const { lang, t } = useLanguage();

  const FEATURES = [
    { icon: Clock, title: t.landing.feature1, desc: t.landing.feature1Desc },
    { icon: TrendingUp, title: t.landing.feature2, desc: t.landing.feature2Desc },
    { icon: Sparkles, title: t.landing.feature3, desc: t.landing.feature3Desc },
    { icon: Shield, title: t.landing.feature4, desc: t.landing.feature4Desc },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, position: 'relative', minHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg0)' }}>

      {/* ARIA - CENTER BACKGROUND */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: '50%', 
          marginLeft: '-min(425px, 50vw)', 
          width: 'min(850px, 100vw)', 
          height: 'min(950px, 95vh)', 
          zIndex: 1,
        }}
      >
        <img src="/aria_standing.png" alt="Aria" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            objectPosition: 'bottom',
            filter: 'drop-shadow(0 0 60px rgba(129,140,248,0.2))',
            pointerEvents: 'none'
          }} 
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 150, background: 'linear-gradient(to top, var(--bg0), transparent)', pointerEvents: 'none' }} />
      </motion.div>

      {/* Main Content Overlay */}
      <div className="container" style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '8vh', paddingBottom: 60, width: '100%' }}>
        
        {/* MAIN TITLE */}
        <motion.h1 variants={fadeUp}
          style={{ fontSize: 'clamp(44px, 8vw, 110px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em', margin: 0, maxWidth: 1000, marginBottom: 28 }}>
          {lang === 'tr' ? (
            <>Atıl nakdin <span style={{ color: 'var(--accent)' }}>gerçek</span> maliyeti nedir?</>
          ) : (
            <>What is the <span style={{ color: 'var(--accent)' }}>real</span> cost of idle cash?</>
          )}
        </motion.h1>

        {/* MAIN DESCRIPTION */}
        <motion.p variants={fadeUp} style={{ fontSize: 18, color: 'var(--text1)', maxWidth: 620, lineHeight: 1.6, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.4)', marginBottom: 44 }}>
          {t.landing.desc}
        </motion.p>

        {/* BUTTON AREA WITH ATTACHED LITTLE R.E.M */}
        <motion.div variants={fadeUp} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginBottom: 64 }}>
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src="/rem_profile.png" 
            alt="R.E.M Small" 
            style={{ 
              width: 120, 
              height: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 40px rgba(129,140,248,0.4))',
              pointerEvents: 'none',
              position: 'absolute', 
              right: '100%', 
              marginRight: -20, // Overlap slightly with the button area but to the left
              top: '35%',
              transform: 'translateY(-50%)',
              zIndex: 20
            }} 
          />

          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(129,140,248,0.5)' }} 
            whileTap={{ scale: 0.95 }} 
            onClick={onStart}
            className="btn btn-primary" 
            style={{ 
              fontSize: 17, 
              padding: '18px 48px', 
              borderRadius: 100, 
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}>
            <ArrowLeft size={20} /> R.E.M ile Analize Başla
          </motion.button>
        </motion.div>

        {/* STAT CARDS CONTAINER */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48, width: '100%' }}>
          {[
            { id: 'stat_1', label: t.landing.stat1, value: 18450, suffix: ' ' + t.currency },
            { id: 'stat_2', label: t.landing.stat2, value: 51, suffix: '%' },
            { id: 'stat_3', label: t.landing.stat3, value: 31, suffix: t.landing.stat3Val },
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp} className="glass" style={{ padding: '24px 36px', minWidth: 220, backdropFilter: 'blur(20px)', border: '1px solid var(--accent-dim)' }}>
              <div className="label" style={{ marginBottom: 10, fontSize: 11, opacity: 0.8 }}>{s.label}</div>
              <div className="stat-num" style={{ fontSize: 32, fontWeight: 900 }}><AnimatedCounter value={s.value} suffix={s.suffix} /></div>
            </motion.div>
          ))}
        </div>

        {/* FEATURES CONTAINER */}
        <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, width: '100%', maxWidth: 1100 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={i} variants={fadeUp} whileHover={{ y: -5, background: 'var(--glass-bg-hover)' }} className="glass" style={{ padding: '28px', textAlign: 'left', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <f.icon size={22} color="var(--accent)" />
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, opacity: 0.9 }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
