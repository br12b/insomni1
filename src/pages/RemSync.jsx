import React from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, RefreshCw, 
  ShieldCheck, 
  Zap,
  Database,
  FileSearch,
  Layers,
  Search,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Activity
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const TechInfo = ({ title, content, icon: Icon, color, specs }) => (
  <motion.div variants={fadeUp} className="glass" style={{ padding: 32, border: '1px solid var(--accent-dim)', display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text2)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 4 }}>TECHNICAL</div>
    </div>
    <div>
      <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 16 }}>{content}</div>
    </div>
    <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {specs.map(s => (
        <span key={s} style={{ fontSize: 8, fontWeight: 900, padding: '3px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.03)', color: 'var(--text2)' }}>{s}</span>
      ))}
    </div>
  </motion.div>
);

export default function RemSync() {
  const transactions = [
    { id: 1, name: 'MGRS-IST-1234', normalized: 'Migros Ticaret', amount: '-245.50', status: 'Verified', method: 'Open Banking' },
    { id: 2, name: 'SPOTIFY-PREM-SYC', normalized: 'Spotify Premium', amount: '-59.90', status: 'Verified', method: 'Cloud Feed' },
    { id: 3, name: 'AKBNK-SALARY-PAY', normalized: 'Akbank Maaş Ödemesi', amount: '+45,000', status: 'Verified', method: 'Core Uplink' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, marginTop: 40 }}>
        <div>
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 100, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 10, fontWeight: 900, letterSpacing: 1, marginBottom: 16 }}>
            <Activity size={12} /> AUTONOMOUS DATA HUB
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 40, fontWeight: 950, margin: 0, letterSpacing: '-0.03em' }}>
            REM <span style={{ color: 'var(--accent)' }}>Sync</span>
          </motion.h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginTop: 8 }}>Otonom Veri Toplama ve İşlem Senkronizasyonu</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', marginBottom: 8 }}>AKTİF KAYNAKLAR</div>
           <div style={{ display: 'flex', gap: 10 }}>
              {['Garanti', 'Akbank'].map(b => (
                <div key={b} className="glass" style={{ padding: '8px 16px', borderRadius: 100, fontSize: 11, fontWeight: 900, border: '1px solid var(--accent-dim)' }}>{b}</div>
              ))}
           </div>
        </div>
      </div>

      {/* TECH INFO GRID (CENTRAL FOCUS NOW) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 60 }}>
         <TechInfo 
           title="Open Banking (PSD2)" 
           icon={Globe} color="var(--accent)"
           content="Bankanızla kurulan doğrudan ve güvenli bağlantı. PSD2 standartlarında, banka şifreniz olmadan güvenli veri akışı sağlar."
           specs={['OAuth 2.0', 'PSD2 Compliant', 'Token Access']}
         />
         <TechInfo 
           title="Merchant Normalization" 
           icon={RefreshCw} color="#10b981"
           content="Karmaşık banka verilerini R.E.M zekâsı ile anlamlı markalara ve kategorilere dönüştürür."
           specs={['NLP Analysis', 'Auto-Category', '99.9% Accuracy']}
         />
         <TechInfo 
           title="Zero-Knowledge Vault" 
           icon={ShieldCheck} color="#f59e0b"
           content="Verileriniz uçtan uca şifrelenmiş bir kalede korunur. R.E.M dışında kimse ham verilerinize erişemez."
           specs={['AES-256', 'Private Key', 'Isolated Core']}
         />
      </div>

      {/* TRANSACTION RESOLUTION LIST */}
      <div className="glass" style={{ padding: 40, borderRadius: 24, border: '1px solid var(--accent-dim)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Veri Çözümleme Motoru</h2>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> AKTİF SENKRONİZASYON
            </div>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {transactions.map(tx => (
               <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 24, padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'monospace' }}>{tx.name}</div>
                  <ArrowRight size={14} color="var(--accent)" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={16} color="var(--accent)" />
                     </div>
                     <div style={{ fontSize: 14, fontWeight: 800 }}>{tx.normalized}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: 14, fontWeight: 900 }}>{tx.amount} ₺</div>
                     <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--accent)' }}>{tx.method}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </motion.div>
  );
}

