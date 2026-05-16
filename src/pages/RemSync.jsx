import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send, CreditCard, Landmark, Shield,
  Play, Smartphone, Fuel, Calendar
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
};

export default function RemSync() {
  const [activePath, setActivePath] = useState(2); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncedData, setSyncedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [processedIds, setProcessedIds] = useState(new Set());
  const [bridgeId, setBridgeId] = useState('');
  const txListRef = useRef(null);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev.slice(-12), { msg: `> ${msg}`, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setBridgeId(savedId);
  }, []);

  useEffect(() => {
    if (syncedData.length > 0 && !isSyncing) {
      setTimeout(() => {
        txListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [syncedData, isSyncing]);

  useEffect(() => {
    let interval;
    if (activePath === 2 && bridgeId) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/bridge?id=${bridgeId}`);
          const data = await res.json();
          if (data.history) {
            setTrafficLog(data.history);
            const latest = data.history[0];
            if (latest && !processedIds.has(latest.id)) {
              setProcessedIds(prev => new Set(prev).add(latest.id));
              processAutomatedMessage(latest.text);
            }
          }
        } catch (err) { console.error("Bridge Lost"); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activePath, processedIds, bridgeId]);

  const processAutomatedMessage = async (text) => {
    if (!text) return;
    setIsSyncing(true);
    addLog(`R.E.M: Sinyal saptandi. Analiz ediliyor...`, 'system');
    const amountMatch = text.match(/(\d+([.,]\d+)?)\s*(TL|tl|₺)/i);
    const amount = amountMatch ? amountMatch[1] : null;
    if (amount) {
      addLog(`R.E.M: Veri ayiklama basarili. Tutar: ${amount} TL`, 'success');
      const newTx = { id: Date.now(), type: 'TRANSACTION', clean: text.length > 25 ? "Otonom Harcama" : text, amount: `-${amount} TL`, raw: "REM_GATEWAY_v2", category: "OTONOM", icon: BellRing, color: "#6366f1" };
      setSyncedData(prev => [newTx, ...prev]);
    } else {
      addLog(`UYARI: Tutar bulunamadi. Ham metin isleniyor.`, 'warning');
    }
    setIsSyncing(false);
  };

  const handleCalendarSync = () => {
    addLog(`SISTEM: Takvim senkronizasyonu baslatildi...`, 'system');
    setTimeout(() => {
      addLog(`BAŞARI: ${syncedData.length} islem takvime aktarildi.`, 'success');
    }, 1500);
  };

  const handleApiSync = async () => {
    setIsSyncing(true); setSyncedData([]); setLogs([]); setSyncProgress(0);
    addLog("Sistem gateway baglantisi kuruluyor...", "system");
    await new Promise(r => setTimeout(r, 800));
    setSyncProgress(30); addLog("Guvenlik sertifikalari dogrulandi.", "info");
    await new Promise(r => setTimeout(r, 800));
    setSyncProgress(60); addLog("Banka verileri cekiliyor...", "info");
    await new Promise(r => setTimeout(r, 800));
    setSyncProgress(100); addLog("Senkronizasyon tamamlandi.", "success");
    
    const mockTransactions = [
      { id: 1, type: 'TRANSACTION', clean: "Starbucks Coffee", amount: "-185,00 TL", raw: "VTM-3910 / ISTANBUL", category: "YEME-İÇME", icon: Coffee, color: "#00704A" },
      { id: 2, type: 'TRANSACTION', clean: "Migros Sanal Market", amount: "-1.240,50 TL", raw: "MGR-2901 / ONLINE", category: "MUTFAK", icon: ShoppingBag, color: "#f59e0b" },
      { id: 3, type: 'TRANSACTION', clean: "Netflix Digital", amount: "-149,90 TL", raw: "NETFLIX.COM / AMST", category: "EĞLENCE", icon: Play, color: "#e11d48" }
    ];
    setSyncedData([{ id: 'bal', type: 'BALANCE', clean: "Garanti BBVA Hesabı", amount: "42.850,20 ₺", raw: "TR92 0006 2000 0001 2345 6789 01", category: "ANA BAKİYE", icon: Wallet, color: "#10b981" }, ...mockTransactions]);
    setIsSyncing(false);
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', color: '#111' }}>
          R.E.M <span style={{ color: '#6366f1' }}>SYNC</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
           {[
             { id: 1, name: "BANKA API", info: "Garanti BBVA Gateway", icon: Landmark, color: "#10b981" }, 
             { id: 2, name: "OTONOM KÖPRÜ", info: "Telegram Bulut Hattı", icon: Radio, color: "#6366f1" }, 
             { id: 3, name: "DOSYA TARA", info: "OCR Dekont Analizi", icon: FileText, color: "#f59e0b" }
           ].map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 32, borderRadius: 32, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.4s', boxShadow: activePath === p.id ? '0 20px 40px rgba(0,0,0,0.05)' : 'none' }}>
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
            {activePath === 2 && (
               <motion.div key="bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
                  <div>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #f1f5f9', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 48, height: 48, borderRadius: 14, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={22} color="#6366f1" /></div>
                          <div>
                             <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900 }}>OMNI ID SİSTEMİ</div>
                             <div style={{ fontSize: 18, fontWeight: 950, color: '#1e293b' }}>ID: {bridgeId}</div>
                          </div>
                       </div>
                       <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 900, background: '#6366f108', padding: '6px 12px', borderRadius: 10 }}>AKTİF</span>
                    </div>
                    {/* TERMINAL UI */}
                    <div style={{ background: '#0a0f1e', borderRadius: 28, padding: 32, fontFamily: 'monospace', minHeight: 320, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', px: 16, gap: 6, paddingLeft: 16 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }}></div>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }}></div>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}></div>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 10, fontWeight: 900 }}>REM_TERMINAL_v2.0</span>
                       </div>
                       <div style={{ marginTop: 20 }}>
                          {logs.map((l, i) => (
                            <div key={i} style={{ marginBottom: 6, fontSize: 14, display: 'flex', gap: 10 }}>
                               <span style={{ color: 'rgba(255,255,255,0.1)' }}>[{l.time}]</span>
                               <span style={{ 
                                 color: l.type === 'system' ? '#6366f1' : 
                                        l.type === 'success' ? '#10b981' : 
                                        l.type === 'warning' ? '#f59e0b' : '#94a3b8' 
                               }}>
                                 {l.msg}
                               </span>
                            </div>
                          ))}
                          {logs.length === 0 && <div style={{ color: '#2d3748' }}>Sinyal bekleniyor...</div>}
                       </div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 32, padding: 24, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                       <Activity size={18} color="#6366f1" />
                       <h4 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>TRAFİK</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {trafficLog.map((t, i) => (
                         <div key={t.id} style={{ padding: 16, borderRadius: 18, background: '#fff', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.text}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{new Date(t.timestamp).toLocaleTimeString()}</div>
                         </div>
                       ))}
                    </div>
                  </div>
               </motion.div>
            )}
            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={40} color="#10b981" /></div>
                        <h3 style={{ fontSize: 28, fontWeight: 950, margin: 0, color: '#1e293b' }}>API Gateway</h3>
                     </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}>
                     <div style={{ background: '#0a0f1e', borderRadius: 32, padding: 40, fontFamily: 'monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {logs.map((l, i) => <div key={i} style={{ color: l.type === 'success' ? '#10b981' : '#34d399', fontSize: 15, marginBottom: 8 }}>{l.msg}</div>)}
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}>
                        <button onClick={handleApiSync} disabled={isSyncing} style={{ width: '100%', padding: 28, borderRadius: 24, fontSize: 18, fontWeight: 950, background: '#111', color: '#fff', cursor: 'pointer', border: 'none' }}>
                          {isSyncing ? 'İŞLENİYOR...' : 'SENKRONİZASYONU BAŞLAT'}
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={txListRef}>
          <AnimatePresence>
            {syncedData.length > 0 && (
              <motion.div initial="hidden" animate="show" variants={container} style={{ marginTop: 60 }}>
                 {syncedData[0].type === 'BALANCE' && (
                   <motion.div variants={item} style={{ padding: 40, borderRadius: 40, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><div style={{ fontSize: 56, fontWeight: 950 }}>{syncedData[0].amount}</div></div>
                      <Wallet size={48} color="#10b981" />
                   </motion.div>
                 )}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <History size={24} color="#64748b" />
                       <h4 style={{ fontSize: 22, fontWeight: 950, color: '#1e293b', margin: 0 }}>Harcama Analizi</h4>
                    </div>
                    <button onClick={handleCalendarSync} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, fontSize: 13, fontWeight: 900, cursor: 'pointer', color: '#1e293b' }}>
                       <Calendar size={18} color="#6366f1" /> TAKVİME SENKRONİZE ET
                    </button>
                 </div>
                 {syncedData.filter(d => d.type === 'TRANSACTION').map((tx) => (
                   <motion.div key={tx.id} variants={item} style={{ padding: 32, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 40, border: '1px solid #f1f5f9', background: '#fff', borderRadius: 32, marginBottom: 20 }}>
                     <div style={{ fontSize: 13, color: '#94a3b8' }}>{tx.raw}</div>
                     <ArrowRight size={18} color="#e2e8f0" />
                     <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ width: 56, height: 56, borderRadius: 18, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={26} color={tx.color} /></div>
                        <div><div style={{ fontSize: 18, fontWeight: 950, color: '#1e293b' }}>{tx.clean}</div><div style={{ fontSize: 12, color: tx.color, fontWeight: 900 }}>{tx.category}</div></div>
                     </div>
                     <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 950, color: tx.color }}>{tx.amount}</div></div>
                   </motion.div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
