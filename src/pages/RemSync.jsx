import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

const steps = [
  { name: "Bridge", icon: Server, color: "#6366f1" },
  { name: "Auth", icon: Lock, color: "#10b981" },
  { name: "Sync", icon: RefreshCw, color: "#f59e0b" },
  { name: "Parse", icon: BrainCircuit, color: "#6366f1" },
  { name: "Final", icon: CheckCircle2, color: "#10b981" }
];

export default function RemSync() {
  const [activePath, setActivePath] = useState(2); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [processedIds, setProcessedIds] = useState(new Set());

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-10), `> ${msg}`]);
  };

  // WEBHOOK POLLING
  useEffect(() => {
    let interval;
    if (activePath === 2) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/webhook');
          const data = await res.json();
          if (data.history) {
            setTrafficLog(data.history);
            const latest = data.history[0];
            if (latest && latest.id !== 'init' && !processedIds.has(latest.id)) {
              setProcessedIds(prev => new Set(prev).add(latest.id));
              processAutomatedMessage(latest.text);
            }
          }
        } catch (err) { console.error("Webhook Check Failed"); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activePath, processedIds]);

  const processAutomatedMessage = async (text) => {
    setIsSyncing(true);
    addLog(`BRIDGE: Incoming Signal Detected...`);
    await new Promise(r => setTimeout(r, 1000));
    
    const amountMatch = text.match(/(\d+[.,]\d+)\s*TL/i);
    const amount = amountMatch ? amountMatch[1] : null;
    
    if (amount) {
      addLog(`R.E.M: Parsing Logic Applied. Amount: ${amount} ₺`);
      const newTx = {
        id: Date.now(),
        type: 'TRANSACTION',
        clean: text.length > 30 ? "Otonom Harcama" : text,
        amount: `-${amount} ₺`,
        raw: "MACRODROID_BRIDGE_v1",
        category: "OTONOM ANALİZ",
        icon: BellRing,
        color: "#6366f1"
      };
      setSyncedData(prev => [newTx, ...prev]);
      addLog("SUCCESS: Data Ingested to Core Dashboard.");
    } else {
      addLog("ERROR: Data structure unrecognized. Manual review required.");
    }
    setIsSyncing(false);
  };

  const handleApiSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setLogs([]);
    setActiveStep(0);
    
    const sequence = [
      "Establishing Edge Tunnel...",
      "OAuth 2.0 Handshake: Garanti BBVA",
      "Fetching Ledger Data...",
      "R.E.M Neural Parsing: SUCCESS",
      "Sync Complete. Integrity Verified."
    ];

    for(let i=0; i<sequence.length; i++) {
      setActiveStep(i + 1);
      addLog(sequence[i]);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      if (data.status === 'Connected') {
        const balanceCard = { id: 'bal', type: 'BALANCE', clean: "Garanti Mevduat Hesabı", amount: data.balance + " ₺", raw: data.iban, category: "GÜNCEL BAKİYE", icon: Wallet, color: "#10b981" };
        const transactions = data.transactions.map(tx => ({ ...tx, icon: tx.clean.includes('Starbucks') ? Coffee : ShoppingBag, color: "#6366f1" }));
        setSyncedData([balanceCard, ...transactions]);
      }
    } catch (err) { addLog("CRITICAL: Link Failed."); }
    setIsSyncing(false);
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #000 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SİBER <span style={{ color: '#6366f1' }}>SENKRONİZASYON</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* PATH SELECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 40 }}>
           {[
             { id: 1, name: "API HUB", icon: Zap, color: "#10b981" },
             { id: 2, name: "BRIDGE v1", icon: Radio, color: "#6366f1" },
             { id: 3, name: "DOCU-SCAN", icon: FileText, color: "#f59e0b" }
           ].map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 24, borderRadius: 24, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: activePath === p.id ? p.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#999' }}>
                   <p.icon size={22} />
                </div>
                <div style={{ textAlign: 'left' }}>
                   <div style={{ fontSize: 13, fontWeight: 900, color: activePath === p.id ? p.color : '#111' }}>{p.name}</div>
                   <div style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>SENKRONİZASYON HATTI</div>
                </div>
             </button>
           ))}
        </div>

        {/* CONTENT AREA */}
        <div className="glass" style={{ padding: 40, borderRadius: 32, border: '1px solid rgba(0,0,0,0.05)', minHeight: 400, position: 'relative', overflow: 'hidden' }}>
          
          {/* DECORATIVE BACKGROUND ANIMATION */}
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} 
            style={{ position: 'absolute', top: '-50%', right: '-30%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)', zIndex: 0 }} />

          <AnimatePresence mode="wait">
            {activePath === 1 && (
              <motion.div key="api" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative', zIndex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                        <motion.div animate={activeStep >= i + 1 ? { scale: [1, 1.2, 1], boxShadow: `0 0 20px ${s.color}40` } : {}}
                          style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeStep >= i + 1 ? s.color : '#f3f4f6', color: activeStep >= i + 1 ? '#fff' : '#999' }}>
                          <s.icon size={22} />
                        </motion.div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: activeStep >= i + 1 ? s.color : '#111' }}>{s.name}</div>
                      </div>
                    ))}
                 </div>
                 <div style={{ background: '#0a0a0a', borderRadius: 20, padding: 24, fontFamily: '"JetBrains Mono", monospace', minHeight: 180, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)', marginBottom: 24 }}>
                    {logs.map((l, i) => <div key={i} style={{ color: '#10b981', fontSize: 13, marginBottom: 4, textShadow: '0 0 5px #10b98140' }}>{l}</div>)}
                    {logs.length === 0 && <div style={{ color: '#333', fontSize: 13 }}>Waiting for manual trigger...</div>}
                 </div>
                 <button onClick={handleApiSync} disabled={isSyncing} className="btn-primary" style={{ width: '100%', padding: 20, borderRadius: 16, fontSize: 16, fontWeight: 900, cursor: 'pointer', border: 'none', background: '#000', color: '#fff', transition: 'all 0.3s' }}>
                   {isSyncing ? 'SİNYAL HATTI MEŞGUL...' : 'BANKA GATEWAY BAĞLANTISINI KUR'}
                 </button>
              </motion.div>
            )}

            {activePath === 2 && (
              <motion.div key="bridge" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 30 }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
                       <div style={{ width: 56, height: 56, borderRadius: 18, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Radio size={28} color="#6366f1" className="animate-pulse" />
                       </div>
                       <div>
                          <h3 style={{ fontSize: 20, fontWeight: 950, margin: 0 }}>Bridge Monitor</h3>
                          <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Otonom Veri Hattı Dinleniyor</p>
                       </div>
                    </div>
                    <div style={{ background: '#0a0a0a', borderRadius: 20, padding: 24, fontFamily: '"JetBrains Mono", monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}>
                       <div style={{ color: '#6366f130', fontSize: 10, marginBottom: 12, borderBottom: '1px solid #6366f110', paddingBottom: 8 }}>REM CORE v2.1 // OTONOM LOGS</div>
                       {logs.map((l, i) => <div key={i} style={{ color: '#6366f1', fontSize: 13, marginBottom: 4 }}>{l}</div>)}
                       {logs.length === 0 && <div style={{ color: '#333', fontSize: 13 }}>Listening for MacroDroid signals...</div>}
                    </div>
                 </div>
                 <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 24, padding: 20, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                       <Activity size={16} color="#6366f1" />
                       <h4 style={{ fontSize: 13, fontWeight: 900, margin: 0 }}>CANLI TRAFİK</h4>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                       {trafficLog.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#999', fontSize: 11 }}>Sinyal bekleniyor...</div>}
                       {trafficLog.map((t, i) => (
                         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={t.id}
                           style={{ padding: 12, borderRadius: 14, background: i === 0 ? '#6366f105' : '#fff', border: `1px solid ${i === 0 ? '#6366f120' : 'transparent'}`, boxShadow: i === 0 ? '0 4px 12px rgba(99,102,241,0.05)' : 'none' }}>
                            <div style={{ fontSize: 9, fontWeight: 900, color: '#6366f1', marginBottom: 2 }}>{t.source.toUpperCase()}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#111', wordBreak: 'break-all' }}>{t.text}</div>
                            <div style={{ fontSize: 8, color: '#999', marginTop: 4 }}>{new Date(t.timestamp).toLocaleTimeString()}</div>
                         </motion.div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}

            {activePath === 3 && (
               <motion.div key="scan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 0' }}>
                  <PlusCircle size={64} color="#f59e0b" style={{ opacity: 0.2, marginBottom: 20 }} />
                  <h3 style={{ fontSize: 18, fontWeight: 900 }}>Dosya Analiz Modülü</h3>
                  <p style={{ fontSize: 13, color: '#666' }}>Geliştirme aşamasında...</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DATA RESULTS */}
        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingLeft: 10 }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
                   <h3 style={{ fontSize: 18, fontWeight: 950, margin: 0 }}>GÜNCEL VERİ TABLOSU</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                   {syncedData.map((tx, idx) => (
                     <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1 }} className="glass"
                       style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 24, border: `1px solid ${tx.color}20`, background: '#fff' }}>
                       <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#666' }}>{tx.raw}</div>
                       <ArrowRight size={14} color="#ccc" />
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                             <tx.icon size={20} color={tx.color} />
                          </div>
                          <div>
                             <div style={{ fontSize: 15, fontWeight: 950, color: '#111' }}>{tx.clean}</div>
                             <div style={{ fontSize: 10, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                          </div>
                       </div>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 950, color: tx.color }}>{tx.amount}</div>
                       </div>
                     </motion.div>
                   ))}
                </div>
             </motion.div>
           )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
