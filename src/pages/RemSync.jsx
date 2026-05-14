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
  Lock
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const TechInfo = ({ title, content, icon: Icon, color }) => (
  <motion.div variants={fadeUp} className="glass" style={{ padding: 24, border: '1px solid var(--accent-dim)', display: 'flex', gap: 16 }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{content}</div>
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
    { id: 1, name: 'Migros Ticaret', amount: '-245.50', category: 'Market', date: 'Bugün 14:20', icon: Globe, color: 'var(--accent)', method: 'Direct API' },
    { id: 2, name: 'Spotify Premium', amount: '-59.90', category: 'Eğlence', date: 'Bugün 11:05', icon: Zap, color: '#f59e0b', method: 'Cloud Sync' },
    { id: 3, name: 'Akbank Maaş Ödemesi', amount: '+45,000', category: 'Gelir', date: 'Dün 09:00', icon: Database, color: '#10b981', method: 'Core Uplink' },
    { id: 4, name: 'Shell Akaryakıt', amount: '-1,200', category: 'Ulaşım', date: 'Dün 18:30', icon: ShieldCheck, color: '#ef4444', method: 'Direct API' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, marginTop: 40 }}>
        <div>
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 100, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 10, fontWeight: 900, letterSpacing: 1, marginBottom: 16 }}>
            <Activity size={12} /> REAL-TIME DATA HUB
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
            REM <span style={{ color: 'var(--accent)', textShadow: '0 0 40px rgba(129,140,248,0.4)' }}>Sync</span>
          </motion.h1>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text2)', marginBottom: 8 }}>BAĞLI KAYNAKLAR</div>
           <div style={{ display: 'flex', gap: 12 }}>
              {['Garanti', 'Akbank'].map(b => (
                <div key={b} className="glass" style={{ padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 900, border: '1px solid var(--accent-dim)' }}>{b}</div>
              ))}
           </div>
        </div>
      </div>

      {/* PEAK VISUALIZATION */}
      <div style={{ position: 'relative', height: 400, marginBottom: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: 600, height: 600, background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.15 }} />
        <div style={{ position: 'relative', width: 280, height: 280, z_index: 20 }}>
           <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: -40, border: '1px dashed var(--accent-dim)', borderRadius: '50%', opacity: 0.3 }} />
           <motion.div animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 40px var(--accent-dim)', '0 0 100px var(--accent)', '0 0 40px var(--accent-dim)'] }} transition={{ duration: 4, repeat: Infinity }}
             style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg1)', border: '3px solid var(--accent)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
             <RefreshCw size={80} color="var(--accent)" />
             <div style={{ marginTop: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent)', letterSpacing: 2 }}>SYNCING</div>
                <div style={{ fontSize: 24, fontWeight: 950 }}>98.4<span style={{ fontSize: 14 }}>%</span></div>
             </div>
             <motion.div animate={{ top: ['-10%', '110%'] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', boxShadow: '0 0 10px var(--accent)' }} />
           </motion.div>
        </div>
      </div>

      {/* TECHNOLOGY INFO NOTES SECTION [NEW] */}
      <div style={{ marginBottom: 60 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Layers size={20} color="var(--accent)" /> Senkronizasyon Teknolojileri
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
           <TechInfo 
             title="Direct API" 
             icon={Globe} 
             color="var(--accent)" 
             content="Bankanızla kurulan doğrudan, 256-bit şifreli bağlantı. Veriler hiçbir aracı olmadan, milisaniyeler içinde R.E.M''e aktarılır." 
           />
           <TechInfo 
             title="Cloud Sync" 
             icon={Zap} 
             color="#f59e0b" 
             content="Bulut tabanlı veri eşitleme protokolü. Farklı platformlardaki harcamalarınızı otonom bir şekilde tek bir havuzda birleştirir." 
           />
           <TechInfo 
             title="Core Uplink" 
             icon={Database} 
             color="#10b981" 
             content="Maaş ve düzenli gelirler için kullanılan ana sunucu bağlantısı. Finansal çekirdek verilerinizin en yüksek hızda işlenmesini sağlar." 
           />
           <TechInfo 
             title="Secure OCR" 
             icon={FileSearch} 
             color="#ef4444" 
             content="Görsel zekâ ile dekont analizi. Kağıt faturaları dijital verilere dönüştürürken gizliliğinizi %100 korur." 
           />
        </div>
      </div>

      {/* DEEP LEDGER */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
           <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Akıllı İşlem Detayları</h2>
           <div className="glass" style={{ padding: '10px 20px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={14} color="var(--text2)" />
              <span style={{ fontSize: 12, color: 'var(--text2)' }}>İşlemlerde ara...</span>
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
