import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Loader2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  Wallet,
  Activity,
  Server,
  Cpu,
  Globe
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: "Sizin Cihazınız", icon: Globe, color: "#6366f1" },
    { name: "Vercel Sunucusu", icon: Server, color: "#10b981" },
    { name: "Garanti BBVA Kapısı", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M İşleme Birimi", icon: Cpu, color: "#ec4899" }
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setActiveStep(0);

    // Animation timeline
    for(let i=0; i<4; i++) {
      setActiveStep(i + 1);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.status === 'Connected') {
        const accounts = data.accounts.map(acc => ({
          id: Math.random(),
          raw: acc.IBAN,
          clean: "Garanti Mevduat Hesabı",
          amount: acc.balances.find(b => b.type === 'AvailableBalance')?.Amount || "0.00",
          category: "VARLIK",
          icon: Wallet
        }));
        setSyncedData(accounts);
        setIsSyncing(false);
        setActiveStep(0);
      }
    } catch (err) {
      alert('Sistem Hatası: Bağlantı koptu.');
      setIsSyncing(false);
      setActiveStep(0);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <CheckCircle2 size={14} /> GARANTI BBVA INFRASTRUCTURE READY
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* BRIDGE VISUALIZATION */}
        <div className="glass" style={{ padding: 48, borderRadius: 32, background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 40, overflow: 'hidden', position: 'relative' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                   <motion.div 
                     animate={{ 
                       scale: activeStep === i + 1 ? 1.2 : 1,
                       boxShadow: activeStep === i + 1 ? `0 0 40px ${s.color}60` : 'none'
                     }}
                     style={{ 
                       width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: activeStep === i + 1 ? s.color : 'rgba(255,255,255,0.05)',
                       color: activeStep === i + 1 ? '#fff' : 'rgba(255,255,255,0.2)',
                       transition: 'all 0.3s ease'
                     }}
                   >
                      <s.icon size={28} />
                   </motion.div>
                   <div style={{ fontSize: 11, fontWeight: 900, color: activeStep === i + 1 ? '#fff' : 'var(--text2)', transition: 'all 0.3s ease' }}>{s.name.toUpperCase()}</div>
                   
                   {i < 3 && (
                     <div style={{ position: 'absolute', top: 32, right: '-50%', width: '100%', height: 2, background: 'rgba(255,255,255,0.05)' }}>
                        {activeStep > i + 1 && (
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: '100%' }} 
                            style={{ height: '100%', background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})` }} 
                          />
                        )}
                     </div>
                   )}
                </div>
              ))}
           </div>

           <div style={{ marginTop: 48, textAlign: 'center' }}>
              <button onClick={handleSync} disabled={isSyncing} className="btn btn-primary" style={{ padding: '24px 64px', borderRadius: 20, fontSize: 18, fontWeight: 950, gap: 16 }}>
                {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw size={24} />}
                {isSyncing ? 'Sistemler Konuşuyor...' : 'Otonom Hattı Ateşle'}
              </button>
              <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>Bankanızla kurulan bu hat OAuth 2.0 ile şifrelenmiştir.</p>
           </div>

           {/* AMBIENT GLOW */}
           <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
        </div>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, paddingLeft: 8 }}>Aktif Hesaplarınız</h3>
                {syncedData.map((acc) => (
                  <div key={acc.id} className="glass" style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.5fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: '1px solid #10b981' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text2)' }}>{acc.raw}</div>
                    <ArrowRight size={16} color="#10b981" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <acc.icon size={24} color="#10b981" />
                       </div>
                       <div>
                          <div style={{ fontSize: 16, fontWeight: 900 }}>{acc.clean}</div>
                          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>{acc.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 22, fontWeight: 950, color: '#10b981' }}>{acc.amount} ₺</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)' }}>GÜNCEL BAKİYE</div>
                    </div>
                  </div>
                ))}
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
