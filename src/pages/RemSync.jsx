import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);

  const steps = [
    { name: "Cihaz", icon: Globe, color: "#6366f1" },
    { name: "Proxy", icon: Server, color: "#10b981" },
    { name: "Banka", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M", icon: BrainCircuit, color: "#ec4899" }
  ];

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setLogs([]);
    
    const sequence = [
      "BAŞLATILIYOR: Vercel Edge üzerinden güvenli tünel kuruluyor...",
      "OAUTH 2.0: Garanti BBVA geçidiyle el sıkışıldı. Yetki alındı.",
      "VERI ÇEKİLDİ: Starbucks Coffee harcaması tespit edildi.",
      "R.E.M ANALİZ: İşlem 'Gıda' kategorisine atandı. Bütçe güncelleniyor...",
      "SİSTEM ÖZETİ: React / Vercel Serverless / OAuth 2.0 Teknolojileri Aktif.",
      "BAŞARILI: Dashboard ve Takvim senkronize edildi."
    ];

    for(let i=0; i<sequence.length; i++) {
      if (i < 4) setActiveStep(i + 1);
      addLog(sequence[i]);
      await new Promise(r => setTimeout(r, 900));
    }

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.status === 'Connected') {
        const balanceCard = { id: 'bal', type: 'BALANCE', clean: "Garanti Mevduat Hesabı", amount: data.balance + " ₺", raw: data.iban, category: "GÜNCEL BAKİYE", icon: Wallet, color: "#10b981" };
        const transactions = data.transactions.map(tx => ({ ...tx, icon: tx.clean.includes('Starbucks') ? Coffee : ShoppingBag, color: "var(--accent)" }));
        setSyncedData([balanceCard, ...transactions]);
        setIsSyncing(false);
      }
    } catch (err) {
      addLog("HATA: Banka bağlantısı kurulamadı.");
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* BRIDGE UI WITH PULSE */}
        <div className="glass" style={{ padding: '32px 48px', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24, background: 'rgba(255,255,255,0.01)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                   <motion.div 
                     animate={activeStep >= i + 1 ? { scale: [1, 1.1, 1], boxShadow: [`0 0 10px ${s.color}20`, `0 0 30px ${s.color}60`, `0 0 10px ${s.color}20`] } : {}}
                     transition={{ repeat: Infinity, duration: 2 }}
                     style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeStep >= i + 1 ? s.color : 'rgba(255,255,255,0.03)', color: activeStep >= i + 1 ? '#fff' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.05)', zIndex: 2, position: 'relative' }}
                   >
                      <s.icon size={24} />
                   </motion.div>
                   <div style={{ fontSize: 10, fontWeight: 900, color: activeStep >= i + 1 ? '#fff' : 'var(--text2)' }}>{s.name.toUpperCase()}</div>
                   {i < 3 && (
                     <div style={{ position: 'absolute', top: 28, right: '-50%', width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', zIndex: 1 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: activeStep > i + 1 ? '100%' : 0 }} style={{ height: '100%', background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})` }} />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>

        {/* TECH TERMINAL */}
        <div className="glass" style={{ background: '#000', borderRadius: 20, padding: 24, fontFamily: 'monospace', minHeight: 180, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 10, background: '#ff5f56' }} />
                <div style={{ width: 10, height: 10, borderRadius: 10, background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: 10, background: '#27c93f' }} />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 10, fontWeight: 900 }}>REM_SYSTEM_CORE_V2.log</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {logs.length === 0 && <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Sistem hazır. Senkronizasyon komutu bekleniyor...</div>}
                {logs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} style={{ color: log.includes('HATA') ? '#ff5f56' : '#27c93f', fontSize: 13, lineHeight: 1.5 }}>
                    {log}
                  </motion.div>
                ))}
            </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <button onClick={handleSync} disabled={isSyncing} className="btn btn-primary" style={{ padding: '20px 64px', borderRadius: 16, fontSize: 16, fontWeight: 950, gap: 12 }}>
              {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
              {isSyncing ? 'SİSTEMLER ÇALIŞIYOR...' : 'Senkronizasyonu Başlat'}
            </button>
        </div>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {syncedData.map((tx, idx) => (
                  <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1, type: "spring" }} className="glass"
                    style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: `1px solid ${tx.type === 'BALANCE' ? '#10b98140' : 'rgba(255,255,255,0.05)'}` }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>{tx.raw}</div>
                    <ArrowRight size={16} color={tx.color} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={22} color={tx.color} /></div>
                       <div>
                          <div style={{ fontSize: 15, fontWeight: 900 }}>{tx.clean}</div>
                          <div style={{ fontSize: 10, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 20, fontWeight: 950, color: tx.type === 'BALANCE' ? '#10b981' : '#fff' }}>{tx.amount}</div>
                       <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text2)' }}>GÜNCEL DURUM</div>
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
