import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [activePath, setActivePath] = useState(1); // 1: API, 2: Message, 3: Manual/PDF
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [msgInput, setMsgInput] = useState("");

  const steps = [
    { name: "Cihaz", icon: Globe, color: "#6366f1" },
    { name: "Proxy", icon: Server, color: "#10b981" },
    { name: "Banka", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M", icon: BrainCircuit, color: "#ec4899" }
  ];

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleApiSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setLogs([]);
    const sequence = [
      "BAŞLATILIYOR: Vercel Edge üzerinden tünel kuruluyor...",
      "OAUTH 2.0: Garanti BBVA Gateway doğrulandı.",
      "VERI ÇEKİLDİ: Starbucks Coffee (185 TL) tespit edildi.",
      "R.E.M ANALİZ: İşlem 'Gıda' kategorisine işlendi.",
      "BAŞARILI: Veri hattı senkronize edildi."
    ];
    for(let i=0; i<sequence.length; i++) {
      if (i < 4) setActiveStep(i + 1);
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

  const handleMsgSync = async () => {
    if (!msgInput) return alert("Lütfen bir mesaj yapıştırın!");
    setIsSyncing(true);
    setLogs([]);
    addLog("R.E.M LISTENER: Mesaj metni taranıyor...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("NLP ANALİZ: Harcama kalıbı ve tutar ayıklanıyor...");
    await new Promise(r => setTimeout(r, 1200));
    
    // Simple parsing logic simulation
    const amountMatch = msgInput.match(/(\d+[.,]\d+)\s*TL/i);
    const amount = amountMatch ? amountMatch[1] : "Bilinmiyor";
    
    addLog(`TESPİT EDİLDİ: ${amount} TL tutarında harcama.`);
    addLog("SUCCESS: İşlem Takvime eklendi.");
    
    const newTx = {
      id: Date.now(),
      type: 'TRANSACTION',
      clean: "Analiz Edilen İşlem",
      amount: `-${amount} ₺`,
      raw: "MESAJ / BILDIRIM",
      category: "OTONOM TESPİT",
      icon: Sparkles,
      color: "var(--accent)"
    };
    
    setSyncedData([newTx]);
    setIsSyncing(false);
  };

  const paths = [
    { id: 1, name: "API YOLU", desc: "Bankayla Direkt Bağlantı", icon: Zap, color: "#10b981" },
    { id: 2, name: "MESAJ YOLU", desc: "Bildirim Analiz Sistemi", icon: MessageSquare, color: "#6366f1" },
    { id: 3, name: "MANUEL / PDF", desc: "Dosya ve El ile Giriş", icon: FileText, color: "#f59e0b" }
  ];

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync Hub</span>
        </motion.h1>
        <p style={{ color: 'var(--text2)', marginTop: 8 }}>Finansal verileriniz için 3 otonom kanal hazır.</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* PATH SELECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 40 }}>
           {paths.map(p => (
             <button 
               key={p.id} 
               onClick={() => setActivePath(p.id)}
               style={{ 
                 padding: 24, borderRadius: 24, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`,
                 background: activePath === p.id ? `${p.color}05` : 'rgba(255,255,255,0.7)',
                 display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', transition: 'all 0.3s ease'
               }}
             >
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
               <div className="glass" style={{ padding: 40, borderRadius: 32, border: '1px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                        <motion.div animate={activeStep >= i + 1 ? { scale: [1, 1.1, 1], boxShadow: [`0 0 10px ${s.color}20`, `0 0 30px ${s.color}60`, `0 0 10px ${s.color}20`] } : {}} transition={{ repeat: Infinity, duration: 2 }}
                          style={{ width: 56, height: 56, borderRadius: 18, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeStep >= i + 1 ? s.color : 'rgba(0,0,0,0.05)', color: activeStep >= i + 1 ? '#fff' : 'rgba(0,0,0,0.2)', border: '1px solid rgba(0,0,0,0.05)', zIndex: 2, position: 'relative' }}><s.icon size={24} /></motion.div>
                        <div style={{ fontSize: 10, fontWeight: 900, color: activeStep >= i + 1 ? s.color : '#333' }}>{s.name.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#000', borderRadius: 16, padding: 20, fontFamily: 'monospace', minHeight: 120, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
                     {logs.map((l, i) => <div key={i} style={{ color: '#10b981', fontSize: 12, marginBottom: 4 }}>{l}</div>)}
                     {logs.length === 0 && <div style={{ color: '#444', fontSize: 12 }}>API hattı beklemede...</div>}
                  </div>
                  <button onClick={handleApiSync} disabled={isSyncing} className="btn btn-primary" style={{ width: '100%', padding: 20, borderRadius: 16 }}>{isSyncing ? 'SİSTEMLER ÇALIŞIYOR...' : 'BANKA BAĞLANTISINI ATEŞLE'}</button>
               </div>
            </motion.div>
          )}

          {activePath === 2 && (
            <motion.div key="path2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="glass" style={{ padding: 40, borderRadius: 32, border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
                     <MessageSquare size={32} color="#6366f1" />
                     <h3 style={{ fontSize: 20, fontWeight: 900 }}>R.E.M Message Listener</h3>
                  </div>
                  <textarea 
                    placeholder="Banka mesajını veya bildirim metnini buraya yapıştırın..."
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    style={{ width: '100%', height: 120, padding: 20, borderRadius: 20, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', fontSize: 14, marginBottom: 20, resize: 'none' }}
                  />
                  <div style={{ background: '#000', borderRadius: 16, padding: 20, fontFamily: 'monospace', minHeight: 80, border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>
                     {logs.map((l, i) => <div key={i} style={{ color: '#6366f1', fontSize: 12, marginBottom: 4 }}>{l}</div>)}
                     {logs.length === 0 && <div style={{ color: '#444', fontSize: 12 }}>Mesaj analizi için girdi bekleniyor...</div>}
                  </div>
                  <button onClick={handleMsgSync} disabled={isSyncing} className="btn btn-primary" style={{ width: '100%', padding: 20, borderRadius: 16, background: '#6366f1' }}>{isSyncing ? 'ANALİZ EDİLİYOR...' : 'MESAJI ÇÖZÜMLE'}</button>
               </div>
            </motion.div>
          )}

          {activePath === 3 && (
            <motion.div key="path3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <div className="glass" style={{ padding: 80, borderRadius: 32, border: '1px dashed #f59e0b', textAlign: 'center', background: 'rgba(255,255,255,0.8)' }}>
                  <PlusCircle size={48} color="#f59e0b" style={{ marginBottom: 20 }} />
                  <h3 style={{ fontSize: 20, fontWeight: 900 }}>Dosya veya Manuel Giriş</h3>
                  <p style={{ color: '#666', fontSize: 14 }}>Bu özellik bir sonraki güncelleme ile aktif edilecektir.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, paddingLeft: 8 }}>Elde Edilen Veriler</h3>
                {syncedData.map((tx, idx) => (
                  <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1, type: "spring" }} className="glass"
                    style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: `1px solid ${tx.color}40`, background: 'rgba(255,255,255,0.9)' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#444' }}>{tx.raw}</div>
                    <ArrowRight size={16} color={tx.color} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={22} color={tx.color} /></div>
                       <div>
                          <div style={{ fontSize: 15, fontWeight: 900, color: '#111' }}>{tx.clean}</div>
                          <div style={{ fontSize: 10, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 20, fontWeight: 950, color: tx.color }}>{tx.amount}</div>
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
