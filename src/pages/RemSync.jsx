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
  Globe,
  Coffee,
  ShoppingBag
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: "Cihaz", icon: Globe, color: "#6366f1" },
    { name: "Vercel", icon: Server, color: "#10b981" },
    { name: "Banka", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M", icon: Cpu, color: "#ec4899" }
  ];

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    
    // Animation flow
    for(let i=0; i<4; i++) {
      setActiveStep(i + 1);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.status === 'Connected') {
        const balanceCard = {
          id: 'bal',
          type: 'BALANCE',
          clean: "Garanti Mevduat Hesabı",
          amount: data.balance + " ₺",
          raw: data.iban,
          category: "GÜNCEL BAKİYE",
          icon: Wallet,
          color: "#10b981"
        };

        const transactions = data.transactions.map(tx => ({
          ...tx,
          icon: tx.clean.includes('Starbucks') ? Coffee : ShoppingBag,
          color: "var(--accent)"
        }));

        setSyncedData([balanceCard, ...transactions]);
        setIsSyncing(false);
        setActiveStep(4); // Keep the last step active/glow
      }
    } catch (err) {
      alert('Hata: Bağlantı koptu.');
      setIsSyncing(false);
      setActiveStep(0);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <CheckCircle2 size={14} /> PERSISTENT OAUTH BRIDGE ACTIVE
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* PERSISTENT BRIDGE UI */}
        <div className="glass" style={{ padding: '32px 48px', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 40, background: 'rgba(255,255,255,0.01)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                   <div 
                     style={{ 
                       width: 56, height: 56, borderRadius: 18, margin: '0 auto 12px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       background: activeStep >= i + 1 ? s.color : 'rgba(255,255,255,0.03)',
                       color: activeStep >= i + 1 ? '#fff' : 'rgba(255,255,255,0.15)',
                       boxShadow: activeStep >= i + 1 ? `0 0 30px ${s.color}30` : 'none',
                       transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                       border: '1px solid rgba(255,255,255,0.05)'
                     }}
                   >
                      <s.icon size={24} />
                   </div>
                   <div style={{ fontSize: 10, fontWeight: 900, color: activeStep >= i + 1 ? '#fff' : 'var(--text2)', opacity: activeStep >= i + 1 ? 1 : 0.4, transition: 'all 0.5s ease' }}>{s.name.toUpperCase()}</div>
                   
                   {i < 3 && (
                     <div style={{ position: 'absolute', top: 28, right: '-50%', width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: activeStep > i + 1 ? '100%' : 0 }} 
                          style={{ height: '100%', background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})` }} 
                        />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <button onClick={handleSync} disabled={isSyncing} className="btn btn-primary" style={{ padding: '20px 56px', borderRadius: 16, fontSize: 16, fontWeight: 950, gap: 12 }}>
              {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
              {isSyncing ? 'Siber Hat Sorgulanıyor...' : 'Otonom Senkronizasyon'}
            </button>
        </div>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {syncedData.map((tx, idx) => (
                  <motion.div 
                    key={tx.id}
                    variants={txEntry}
                    transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                    className="glass"
                    style={{ 
                      padding: '24px 32px', display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', 
                      alignItems: 'center', gap: 32, border: `1px solid ${tx.type === 'BALANCE' ? '#10b98140' : 'rgba(255,255,255,0.05)'}`
                    }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>{tx.raw}</div>
                    <ArrowRight size={16} color={tx.color} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <tx.icon size={22} color={tx.color} />
                       </div>
                       <div>
                          <div style={{ fontSize: 15, fontWeight: 900 }}>{tx.clean}</div>
                          <div style={{ fontSize: 10, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 20, fontWeight: 950, color: tx.type === 'BALANCE' ? '#10b981' : '#fff' }}>{tx.amount}</div>
                       <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text2)' }}>{tx.type === 'BALANCE' ? 'TOPLAM VARLIK' : 'İŞLEM ONAYLANDI'}</div>
                    </div>
                  </motion.div>
                ))}
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
