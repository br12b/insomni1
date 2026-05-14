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
  Activity,
  Layers,
  Search,
  CheckCircle2,
  Info,
  Lock,
  Cpu, Link,
  Key,
  EyeOff
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

export default function RemSync() {
  const [activeTab, setActiveTab] = useState('banking');

  const transactions = [
    { id: 1, name: 'MGRS-IST-1234', normalized: 'Migros Ticaret', amount: '-245.50', status: 'Normalized', method: 'Open Banking (OAuth 2.0)' },
    { id: 2, name: 'SPOTIFY-PREM-SYC', normalized: 'Spotify Premium', amount: '-59.90', status: 'Secure Sync', method: 'Cloud Feed' },
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

      {/* AISUDIO LEVEL VISUALIZATION - THE CORE */}
      <div style={{ position: 'relative', height: 500, marginBottom: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Dynamic Holographic Rings */}
        {[1, 2, 3].map(i => (
          <motion.div 
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ 
              position: 'absolute', width: 300 + i * 100, height: 300 + i * 100, 
              borderRadius: '50%', border: '1px solid rgba(129,140,248,0.1)',
              zIndex: 1, boxShadow: 'inset 0 0 20px rgba(129,140,248,0.05)'
            }} 
          />
        ))}

        {/* THE AISUDIO GENERATED CORE IMAGE */}
        <div style={{ position: 'relative', zIndex: 20, width: 320, height: 320 }}>
           <motion.img 
             src="/financial_intelligence_core.png" 
             alt="Financial Intelligence Core"
             animate={{ y: [0, -15, 0], filter: ['drop-shadow(0 0 20px rgba(129,140,248,0.3))', 'drop-shadow(0 0 60px rgba(129,140,248,0.6))', 'drop-shadow(0 0 20px rgba(129,140,248,0.3))'] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             style={{ width: '100%', height: '100%', objectFit: 'contain' }}
           />
           {/* Data Stream Beams */}
           <div style={{ position: 'absolute', inset: -100, zIndex: -1 }}>
              <motion.div animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, height: 400, background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(60px)' }} 
              />
           </div>
        </div>

        {/* Source Nodes with Technical Depth */}
        {[
          { label: 'PSD2 Open Banking', icon: Globe, pos: { top: '0%', left: '15%' } },
          { label: 'Proprietary Direct API', icon: Link, pos: { bottom: '0%', left: '15%' } },
          { label: 'OAuth 2.0 Auth', icon: Key, pos: { top: '0%', right: '15%' } },
          { label: 'Zero-Knowledge Vault', icon: EyeOff, pos: { bottom: '0%', right: '15%' } },
        ].map((node, i) => (
          <motion.div 
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.2 }}
            style={{ 
              position: 'absolute', ...node.pos, padding: '16px 24px', borderRadius: 20, 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(129,140,248,0.2)',
              backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 30,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
            <node.icon size={20} color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--text1)' }}>{node.label}</span>
          </motion.div>
        ))}
      </div>

      {/* DEEP TECHNICAL GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 32, marginBottom: 80 }}>
         <TechDeepDive 
           title="Open Banking (PSD2)" 
           icon={Globe} color="var(--accent)"
           content="Evrensel bankacılık standartları ile tam entegrasyon. Kullanıcı onayıyla (Consent) oluşturulan geçici tokenlar sayesinde, banka şifreniz hiçbir zaman sisteme girilmez."
           specs={['OAuth 2.0', 'PSD2 Compliant', 'Token Based', 'AES-256']}
         />
         <TechDeepDive 
           title="Merchant Normalization" 
           icon={RefreshCw} color="#10b981"
           content="Karmaşık ve okunamaz banka ekstre verilerini (MGRS-IST-...) gelişmiş NLP algoritmalarıyla anlamlı ticari markalara ve kategorilere dönüştürür."
           specs={['NLP Analysis', 'Pattern Matching', 'Auto-Category', '99% Accuracy']}
         />
         <TechDeepDive 
           title="Zero-Knowledge Logic" 
           icon={ShieldCheck} color="#f59e0b"
           content="Verileriniz sadece R.E.M''in izole zekâ hücresinde işlenir. Şirket çalışanları dahil hiç kimse ham finansal verilerinize erişemez."
           specs={['SHA-256', 'End-to-End', 'Private Key', 'Isolated Core']}
         />
      </div>

      {/* REAL-WORLD DATA NORMALIZATION PREVIEW */}
      <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid var(--accent-dim)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 950, margin: 0 }}>Data Resolution Engine</h2>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
               <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} /> LIVE RESOLUTION ACTIVE
            </div>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transactions.map(tx => (
               <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1.5fr auto', alignItems: 'center', gap: 24, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 20 }}>
                  <div style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'monospace' }}>{tx.name}</div>
                  <ArrowRight size={16} color="var(--accent)" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={18} color="var(--accent)" />
                     </div>
                     <div style={{ fontSize: 15, fontWeight: 900 }}>{tx.normalized}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: 14, fontWeight: 950 }}>{tx.amount} ₺</div>
                     <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>{tx.method}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </motion.div>
  );
}


