import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Database, 
  FileSearch, 
  Globe, 
  ShieldCheck, 
  Zap,
  CreditCard,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Info,
  Lock,
  Cpu,
  Key,
  EyeOff,
  Link
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const TechDeepDive = ({ title, content, specs, icon: Icon, color }) => (
  <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="glass" 
    style={{ padding: 32, border: '1px solid var(--accent-dim)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={28} color={color} />
      </div>
      <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 4 }}>TECHNICAL SPEC</div>
    </div>
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 950, marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>{content}</p>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {specs.map(s => (
        <span key={s} style={{ fontSize: 9, fontWeight: 900, padding: '4px 8px', borderRadius: 4, background: color + '10', color: color, border: `1px solid ${color}30` }}>
          {s}
        </span>
      ))}
    </div>
  </motion.div>
);

const TransactionCard = ({ tx, index }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ scale: 1.02, y: -5 }}
    className="glass"
    style={{ 
      padding: 24, display: 'flex', flexDirection: 'column', gap: 16, 
      border: '1px solid var(--accent-dim)', background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)',
      position: 'relative', overflow: 'hidden'
    }}>
    <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.03 }}>
       <tx.icon size={100} />
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: tx.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <tx.icon size={24} color={tx.color} />
      </div>
      <div style={{ textAlign: 'right' }}>
         <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', letterSpacing: 1, marginBottom: 4 }}>DURUM</div>
         <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
           <CheckCircle2 size={12} /> DOĞRULANDI
         </div>
      </div>
    </div>

    <div>
      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text0)' }}>{tx.name}</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{tx.category} • {tx.date}</div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 }}>
       <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text2)', marginBottom: 4 }}>METOD</div>
          <div style={{ fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            {tx.method} <Info size={10} color="var(--accent)" />
          </div>
       </div>
       <div style={{ fontSize: 24, fontWeight: 950, color: tx.amount.startsWith('+') ? '#10b981' : 'var(--text0)' }}>
         {tx.amount} <span style={{ fontSize: 14 }}>₺</span>
       </div>
    </div>
  </motion.div>
);

export default function RemSync() {
  const transactions = [
    { id: 1, name: 'MGRS-IST-1234', normalized: 'Migros Ticaret', amount: '-245.50', category: 'Market', date: 'Bugün 14:20', icon: Globe, color: 'var(--accent)', method: 'Open Banking (OAuth 2.0)' },
    { id: 2, name: 'SPOTIFY-PREM-SYC', normalized: 'Spotify Premium', amount: '-59.90', category: 'Eğlence', date: 'Bugün 11:05', icon: Zap, color: '#f59e0b', method: 'Cloud Sync' },
    { id: 3, name: 'AKBNK-SALARY-PAY', normalized: 'Akbank Maaş Ödemesi', amount: '+45,000', category: 'Gelir', date: 'Dün 09:00', icon: Database, color: '#10b981', method: 'Core Uplink' },
    { id: 4, name: 'Shell Akaryakıt', amount: '-1,200', category: 'Ulaşım', date: 'Dün 18:30', icon: ShieldCheck, color: '#ef4444', method: 'Direct API' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: 60, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 11, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <Activity size={14} /> AUTONOMOUS DATA PIPELINE v4.0
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 64, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
          REM <span style={{ color: 'var(--accent)', textShadow: '0 0 40px rgba(129,140,248,0.4)' }}>Sync</span>
        </motion.h1>
        <motion.p variants={fadeUp} style={{ color: 'var(--text2)', fontSize: 18, maxWidth: 700, margin: '20px auto 0', lineHeight: 1.6 }}>
          Finansal verinin ham halden (RAW) zekâya (IQ) dönüştüğü otonom köprü. PSD2 standartlarında, tam yetkili Open Banking entegrasyonu.
        </motion.p>
      </div>

      {/* PEAK VISUALIZATION - THE CORE */}
      <div style={{ position: 'relative', height: 500, marginBottom: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15 }} />
        {[1, 2, 3].map(i => (
          <motion.div key={i} animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }} transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: 300 + i * 100, height: 300 + i * 100, borderRadius: '50%', border: '1px solid rgba(129,140,248,0.1)', zIndex: 1 }} />
        ))}
        <div style={{ position: 'relative', zIndex: 20, width: 320, height: 320 }}>
           <motion.img src="/financial_intelligence_core.png" alt="Core" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 40px var(--accent-dim))' }} />
        </div>
      </div>

      {/* DEEP TECHNICAL GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32, marginBottom: 80 }}>
         <TechDeepDive title="Open Banking (PSD2)" icon={Globe} color="var(--accent)"
           content="Evrensel bankacılık standartları ile tam entegrasyon. Kullanıcı onayıyla (Consent) oluşturulan geçici tokenlar sayesinde en yüksek güvenliği sağlar."
           specs={['OAuth 2.0', 'PSD2 Compliant', 'Token Based']} />
         <TechDeepDive title="Merchant Normalization" icon={RefreshCw} color="#10b981"
           content="Karmaşık ve okunamaz banka ekstre verilerini R.E.M zekâsıyla anlamlı ticari markalara ve kategorilere dönüştürür."
           specs={['NLP Analysis', '99.9% Accuracy', 'Auto-Category']} />
         <TechDeepDive title="Zero-Knowledge Logic" icon={ShieldCheck} color="#f59e0b"
           content="Verileriniz sadece R.E.M''in izole zekâ hücresinde işlenir. Şirket çalışanları dahil hiç kimse ham finansal verilerinize erişemez."
           specs={['SHA-256', 'End-to-End', 'Isolated Core']} />
      </div>

      {/* DATA RESOLUTION LIST */}
      <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid var(--accent-dim)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 950, margin: 0 }}>Data Resolution Engine</h2>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> LIVE RESOLUTION ACTIVE
            </div>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {transactions.map((tx, i) => (
            <TransactionCard key={tx.id} tx={tx} index={i} />
          ))}
        </div>
      </div>

    </motion.div>
  );
}
