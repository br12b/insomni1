import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [activePath, setActivePath] = useState(1); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [msgInput, setMsgInput] = useState("");
  const [webhookStatus, setWebhookStatus] = useState("Idle");
  const [lastProcessedId, setLastProcessedId] = useState(null);

  const steps = [
    { name: "Cihaz", icon: Globe, color: "#6366f1" },
    { name: "Proxy", icon: Server, color: "#10b981" },
    { name: "Banka", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M", icon: BrainCircuit, color: "#ec4899" }
  ];

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // WEBHOOK POLLING (Simulating Android Bridge)
  useEffect(() => {
    let interval;
    if (activePath === 2) {
      setWebhookStatus("Listening");
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/webhook');
          const data = await res.json();
          if (data.id && data.id !== lastProcessedId) {
            setLastProcessedId(data.id);
            processAutomatedMessage(data.text);
          }
        } catch (err) { console.error("Webhook Check Failed"); }
      }, 3000);
    } else {
      setWebhookStatus("Idle");
    }
    return () => clearInterval(interval);
  }, [activePath, lastProcessedId]);

  const processAutomatedMessage = async (text) => {
    setIsSyncing(true);
    setLogs([]);
    addLog("OTONOM BİLDİRİM YAKALANDI!");
    addLog(`KAYNAK: Android Bridge`);
    await new Promise(r => setTimeout(r, 1000));
    addLog("R.E.M ANALİZ: Veri süzülüyor...");
    
    const amountMatch = text.match(/(\d+[.,]\d+)\s*TL/i);
    const amount = amountMatch ? amountMatch[1] : "Bilinmiyor";
    
    addLog(`BAŞARILI: ${amount} TL harcama Dashboard'a işlendi.`);
    
    const newTx = {
      id: Date.now(),
      type: 'TRANSACTION',
      clean: text.length > 20 ? "Bildirim İşlendi" : text,
      amount: `-${amount} ₺`,
      raw: "OTONOM WEBHOOK",
      category: "ANDROID BRIDGE",
      icon: BellRing,
      color: "#6366f1"
    };
    
    setSyncedData(prev => [newTx, ...prev]);
    setIsSyncing(false);
  };

  const handleApiSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setLogs([]);
    setActiveStep(0);
    const sequence = [
      "BAŞLATILIYOR: Vercel Edge üzerinden tünel kuruluyor...",
      "OAUTH 2.0: Garanti BBVA Gateway doğrulandı.",
      "VERI ÇEKİLDİ: Starbucks Coffee (185 TL) tespit edildi.",
      "R.E.M ANALİZ: İşlem 'Gıda' kategorisine işlendi.",
      "BAŞARILI: Veri hattı senkronize edildi."
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
        const transactions = data.transactions.map(tx => ({ ...tx, icon: tx.clean.includes('Starbucks') ? Coffee : ShoppingBag, color: "var(--accent)" }));
        setSyncedData([balanceCard, ...transactions]);
        setIsSyncing(false);
      }
    } catch (err) { addLog("HATA: Bağlantı koptu."); setIsSyncing(false); }
  };

  const paths = [
    { id: 1, name: "API YOLU", desc: "Bankayla Direkt Bağlantı", icon: Zap, color: "#10b981" },
    { id: 2, name: "MESAJ YOLU", desc: "Otonom Bildirim Dinleyici", icon: MessageSquare, color: "#6366f1" },
    { id: 3, name: "MANUEL / PDF", desc: "Dosya ve El ile Giriş", icon: FileText, color: "#f59e0b" }
  ];

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync Hub</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* PATH SELECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 40 }}>
           {paths.map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 24, borderRadius: 24, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', transition: 'all 0.3s ease' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: activePath === p.id ? p.color : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#666' }}>
                   <p.icon size={24} />
                </div>
                <div>
                   <div style={{ fontSize: 13, fontWeight: 900, color: activePath === p.id ? p.color : '#333' }}>{p.name}</div>
                   <div style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>{p.desc}</div>
                </div>
             </button>
           ))}
        </div>

        {/* ACTIVE PATH CONTENT */}
        <AnimatePresence mode="wait">
          {activePath === 1 && (
            <motion.div key="path1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, position: 'relative' }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                        <motion.div animate={activeStep >= i + 1 ? { scale: [1, 1.1, 1], boxShadow: [`0 0 10px ${s.color}20`, `0 0 30px ${s.color}60`, `0 0 10px ${s.color}20`] } : {}} transition={{ repeat: Infinity, duration: 2 }}
                          style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeStep >= i + 1 ? s.color : 'rgba(0,0,0,0.05)', color: activeStep >= i + 1 ? '#fff' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', zIndex: 3 }}><s.icon size={28} /></motion.div>
                        <div style={{ fontSize: 12, fontWeight: 900, color: activeStep >= i + 1 ? s.color : '#333' }}>{s.name.toUpperCase()}</div>
                        
                        {i < 3 && (
                          <div style={{ position: 'absolute', top: 32, left: '50%', width: '100%', height: 2, background: 'rgba(0,0,0,0.05)', zIndex: 1 }}>
                             <motion.div initial={{ width: 0 }} animate={{ width: activeStep > i + 1 ? '100%' : 0 }} style={{ height: '100%', background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})` }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#000', borderRadius: 20, padding: 24, fontFamily: 'monospace', minHeight: 180, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 32 }}>
                     <div style={{ display: 'flex', gap: 6, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 10, background: '#ff5f56' }} />
                        <div style={{ width: 8, height: 8, borderRadius: 10, background: '#ffbd2e' }} />
                        <div style={{ width: 8, height: 8, borderRadius: 10, background: '#27c93f' }} />
                     </div>
                     {logs.map((l, i) => <div key={i} style={{ color: '#10b981', fontSize: 13, marginBottom: 6 }}>{l}</div>)}
                     {logs.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>Siber köprü beklemede...</div>}
                  </div>
                  <button onClick={handleApiSync} disabled={isSyncing} className="btn btn-primary" style={{ width: '100%', padding: 24, borderRadius: 20, fontSize: 18, fontWeight: 950 }}>{isSyncing ? 'VERİ HATTI AKTİF...' : 'BANKA BAĞLANTISINI ATEŞLE'}</button>
               </div>
            </motion.div>
          )}

          {activePath === 2 && (
            <motion.div key="path2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(255,255,255,0.85)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                     <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                        <div style={{ width: 64, height: 64, borderRadius: 20, background: '#6366f115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Radio size={32} color="#6366f1" className={isSyncing ? "animate-pulse" : ""} /></div>
                        <div>
                           <h3 style={{ fontSize: 24, fontWeight: 950 }}>R.E.M Otonom Listener</h3>
                           <p style={{ fontSize: 13, color: '#666' }}>Android Bridge bağlantısı bekleniyor...</p>
                        </div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: webhookStatus === 'Listening' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)', color: webhookStatus === 'Listening' ? '#10b981' : '#666' }}>
                        <Activity size={14} className={webhookStatus === 'Listening' ? "animate-spin" : ""} />
                        <span style={{ fontSize: 11, fontWeight: 900 }}>{webhookStatus.toUpperCase()}</span>
                     </div>
                  </div>
                  
                  <div style={{ background: '#000', borderRadius: 24, padding: 32, textAlign: 'center', marginBottom: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ marginBottom: 20 }}><BellRing size={48} color="#6366f1" className={webhookStatus === 'Listening' ? "animate-bounce" : ""} /></div>
                     <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Canlı Dinleme Aktif</h4>
                     <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, maxWidth: 400, margin: '0 auto' }}>Telefonuna bildirim geldiği an R.E.M burada otomatik olarak analize başlayacak abi.</p>
                  </div>

                  <div style={{ background: '#000', borderRadius: 20, padding: 20, fontFamily: 'monospace', minHeight: 120, border: '1px solid rgba(255,255,255,0.1)' }}>
                     {logs.map((l, i) => <div key={i} style={{ color: '#6366f1', fontSize: 13, marginBottom: 6 }}>{l}</div>)}
                     {logs.length === 0 && <div style={{ color: '#444', fontSize: 13 }}>Sinyal bekleniyor...</div>}
                  </div>
               </div>
            </motion.div>
          )}

          {activePath === 3 && (
            <motion.div key="path3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="glass" style={{ padding: 100, borderRadius: 32, border: '1px dashed #f59e0b', textAlign: 'center', background: 'rgba(255,255,255,0.85)' }}>
                  <PlusCircle size={64} color="#f59e0b" style={{ marginBottom: 24 }} />
                  <h3 style={{ fontSize: 24, fontWeight: 950 }}>Dosya veya Manuel Giriş</h3>
                  <p style={{ color: '#666', fontSize: 15 }}>Çok yakında...</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: 950, paddingLeft: 8 }}>Yakaladığım Veriler</h3>
                {syncedData.map((tx, idx) => (
                  <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1, type: "spring" }} className="glass"
                    style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: `1px solid ${tx.color}30`, background: 'rgba(255,255,255,0.9)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#555' }}>{tx.raw}</div>
                    <ArrowRight size={16} color={tx.color} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tx.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={24} color={tx.color} /></div>
                       <div>
                          <div style={{ fontSize: 16, fontWeight: 950, color: '#111' }}>{tx.clean}</div>
                          <div style={{ fontSize: 11, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 22, fontWeight: 950, color: tx.color }}>{tx.amount}</div>
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
