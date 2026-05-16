import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send, CreditCard, Landmark, Shield,
  Play, Smartphone, Fuel
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function RemSync() {
  const [activePath, setActivePath] = useState(1); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedData, setSyncedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [processedIds, setProcessedIds] = useState(new Set());
  const [bridgeId, setBridgeId] = useState('');

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-10), `> ${msg}`]);
  };

  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setBridgeId(savedId);
  }, []);

  const handleApiSync = async () => {
    setIsSyncing(true); setSyncedData([]); setLogs([]); setSyncProgress(0);
    const sequence = ["Bağlantı kuruluyor...", "Güvenlik katmanı doğrulandı.", "Veriler şifreli hattan çekiliyor...", "Analiz ediliyor...", "Tamamlandı."];
    
    for(let i=0; i<sequence.length; i++) {
      addLog(sequence[i]);
      setSyncProgress((i + 1) * 20);
      await new Promise(r => setTimeout(r, 800));
    }

    const mockTransactions = [
      { id: 1, type: 'TRANSACTION', clean: "Starbucks Coffee", amount: "-185,00 TL", raw: "VTM-3910 / ISTANBUL", category: "YEME-İÇME", icon: Coffee, color: "#00704A" },
      { id: 2, type: 'TRANSACTION', clean: "Migros Sanal Market", amount: "-1.240,50 TL", raw: "MGR-2901 / ONLINE", category: "MUTFAK", icon: ShoppingBag, color: "#f59e0b" },
      { id: 3, type: 'TRANSACTION', clean: "Netflix Digital", amount: "-149,90 TL", raw: "NETFLIX.COM / AMST", category: "EĞLENCE", icon: Play, color: "#e11d48" },
      { id: 4, type: 'TRANSACTION', clean: "Apple Services", amount: "-39,99 TL", raw: "ICLOUD / MONTHLY", category: "TEKNOLOJİ", icon: Smartphone, color: "#64748b" },
      { id: 5, type: 'TRANSACTION', clean: "Shell Fuel Station", amount: "-2.100,00 TL", raw: "SHL-4421 / ANKARA", category: "ULAŞIM", icon: Fuel, color: "#fbbf24" }
    ];

    setSyncedData([{ id: 'bal', type: 'BALANCE', clean: "Garanti BBVA Hesabı", amount: "42.850,20 ₺", raw: "TR92 0006 2000 0001 2345 6789 01", category: "ANA BAKİYE", icon: Wallet, color: "#10b981" }, ...mockTransactions]);
    setIsSyncing(false);
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', color: '#111' }}>
          R.E.M <span style={{ color: '#6366f1' }}>SYNC</span>
        </motion.h1>
        <p style={{ color: '#666', fontSize: 16, fontWeight: 500, marginTop: 8 }}>Banka ve Cüzdan Veri Senkronizasyon Merkezi</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
           {[
             { id: 1, name: "BANKA API", info: "Garanti BBVA Gateway", icon: Landmark, color: "#10b981" }, 
             { id: 2, name: "OTONOM KÖPRÜ", info: "Telegram Bulut Hattı", icon: Radio, color: "#6366f1" }, 
             { id: 3, name: "DOSYA TARA", info: "OCR Dekont Analizi", icon: FileText, color: "#f59e0b" }
           ].map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 32, borderRadius: 32, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: activePath === p.id ? '0 20px 40px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: activePath === p.id ? p.color : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#cbd5e1' }}><p.icon size={28} /></div>
                <div style={{ textAlign: 'left' }}>
                   <div style={{ fontSize: 16, fontWeight: 900, color: activePath === p.id ? p.color : '#1e293b' }}>{p.name}</div>
                   <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{p.info}</div>
                </div>
             </button>
           ))}
        </div>

        <div className="glass" style={{ padding: 48, borderRadius: 44, border: '1px solid rgba(0,0,0,0.02)', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(30px)', minHeight: 480 }}>
          <AnimatePresence mode="wait">
            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={40} color="#10b981" /></div>
                        <div>
                           <h3 style={{ fontSize: 28, fontWeight: 950, margin: 0, color: '#1e293b' }}>Banka API Gateway</h3>
                           <p style={{ fontSize: 15, color: '#64748b', marginTop: 4 }}>Garanti BBVA doğrudan senkronizasyon protokolü v2.4</p>
                        </div>
                     </div>
                     <div style={{ padding: '12px 24px', background: '#10b98110', borderRadius: 16, border: '1px solid #10b98120' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                           <ShieldCheck size={20} color="#10b981" />
                           <span style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>256-BIT SSL AKTİF</span>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
                     <div style={{ background: '#0f172a', borderRadius: 32, padding: 40, fontFamily: 'JetBrains Mono, monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }}></div>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }}></div>
                           <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}></div>
                        </div>
                        {logs.map((l, i) => <div key={i} style={{ color: '#34d399', fontSize: 15, marginBottom: 8 }}><span style={{ color: '#064e3b' }}>$</span> {l}</div>)}
                        {logs.length === 0 && <div style={{ color: '#1e293b', fontSize: 15 }}>Sistem hazır. Gateway bağlantısı bekleniyor...</div>}
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
                        {isSyncing && (
                          <div style={{ width: '100%' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: '#1e293b' }}>SENKRONİZASYON</span>
                                <span style={{ fontSize: 13, fontWeight: 900, color: '#10b981' }}>%{syncProgress}</span>
                             </div>
                             <div style={{ width: '100%', height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${syncProgress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' }} />
                             </div>
                          </div>
                        )}
                        <button onClick={handleApiSync} disabled={isSyncing} 
                          style={{ width: '100%', padding: 28, borderRadius: 24, fontSize: 18, fontWeight: 950, background: '#111', color: '#fff', cursor: 'pointer', transition: 'all 0.4s', boxShadow: isSyncing ? 'none' : '0 20px 40px rgba(0,0,0,0.3)', border: 'none', transform: isSyncing ? 'scale(0.98)' : 'scale(1)' }}>
                          {isSyncing ? 'VERİLER ÇEKİLİYOR...' : 'SENKRONİZASYONU BAŞLAT'}
                        </button>
                        <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>* Bu işlem ortalama 4 saniye sürmektedir.</p>
                     </div>
                  </div>
               </motion.div>
            )}
            {activePath === 2 && (
              <div style={{ textAlign: 'center', padding: 80, color: '#cbd5e1' }}>Autonomous Bridge is active. Send messages with ID: {bridgeId}</div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {syncedData.length > 0 && (
            <motion.div initial="hidden" animate="show" variants={container} style={{ marginTop: 60 }}>
               {/* Balance Card */}
               {syncedData[0].type === 'BALANCE' && (
                 <motion.div variants={item} 
                   style={{ padding: 40, borderRadius: 40, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <Landmark size={18} color="#10b981" />
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#10b981', letterSpacing: '0.1em' }}>GÜNCEL VARLIK</span>
                       </div>
                       <div style={{ fontSize: 56, fontWeight: 950, letterSpacing: '-0.04em' }}>{syncedData[0].amount}</div>
                       <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 12, fontFamily: 'JetBrains Mono, monospace' }}>{syncedData[0].raw}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ width: 100, height: 100, borderRadius: 32, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Wallet size={48} color="#fff" /></div>
                       <div style={{ fontSize: 11, fontWeight: 900, color: '#10b981', background: '#10b98110', padding: '6px 12px', borderRadius: 10 }}>SON SENK: ŞİMDİ</div>
                    </div>
                 </motion.div>
               )}

               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><History size={20} color="#64748b" /></div>
                  <h4 style={{ fontSize: 22, fontWeight: 950, color: '#1e293b', margin: 0 }}>Harcama Analizi</h4>
               </div>

               {syncedData.filter(d => d.type === 'TRANSACTION').map((tx) => (
                 <motion.div key={tx.id} variants={item}
                   style={{ padding: 32, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 40, border: '1px solid #f1f5f9', background: '#fff', borderRadius: 32, marginBottom: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.02)', transition: 'all 0.3s' }}>
                   <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#94a3b8' }}>{tx.raw}</div>
                   <ArrowRight size={18} color="#e2e8f0" />
                   <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 18, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={26} color={tx.color} /></div>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 950, color: '#1e293b' }}>{tx.clean}</div>
                        <div style={{ fontSize: 12, color: tx.color, fontWeight: 900, marginTop: 2 }}>{tx.category}</div>
                      </div>
                   </div>
                   <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 950, color: tx.color }}>{tx.amount}</div></div>
                 </motion.div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
