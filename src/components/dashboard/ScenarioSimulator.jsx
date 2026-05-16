import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Zap, Target } from 'lucide-react';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { useLanguage } from '../../context/LanguageContext';

export default function ScenarioSimulator({ currentIdleBalance = 0 }) {
  const { lang, t } = useLanguage();
  
  // Real-world PPF average (Daily ~0.14%)
  const dailyRate = 0.0014;

  const scenarios = [
    { label: lang === 'tr' ? '10 Günlük Vuruş' : '10-Day Impact', amount: 200000, days: 10 },
    { label: lang === 'tr' ? 'Maaş Tam Çevrim' : 'Full Salary Cycle', amount: 100000, days: 30 },
    { label: lang === 'tr' ? 'Mevcut Atıl Nakit' : 'Current Idle Cash', amount: currentIdleBalance, days: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--green-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={16} color="var(--green)" />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{lang === 'tr' ? 'Büyük Vuruş Senaryoları' : 'High-Impact Scenarios'}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {scenarios.map((s, i) => {
          const gain = Math.round(s.amount * dailyRate * s.days);
          return (
            <motion.div key={i} whileHover={{ y: -4, background: 'var(--glass-bg-hover)' }}
              className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{s.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>{s.days} {lang === 'tr' ? 'GÜN' : 'DAYS'}</span>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 2 }}>{lang === 'tr' ? 'Yatırım:' : 'Investment:'}</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{t.currency}{s.amount.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, marginBottom: 2 }}>{lang === 'tr' ? 'KAZANÇ' : 'POTENTIAL GAIN'}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--green)' }}>
                  +{t.currency}<AnimatedCounter value={gain} />
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: -10, right: -10, opacity: 0.05 }}>
                <Zap size={60} />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div style={{ fontSize: 11, color: 'var(--text2)', padding: '10px 14px', borderRadius: 10, background: 'var(--bg1)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Target size={12} color="var(--accent)" />
        {lang === 'tr' 
          ? "Bu analizler gerçek Para Piyasası Fonu (PPF) ortalamalarıyla hesaplanmıştır." 
          : "These analyses are calculated based on real Money Market Fund (PPF) averages."}
      </div>
    </div>
  );
}
