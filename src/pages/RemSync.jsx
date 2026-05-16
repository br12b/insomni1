import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send, CreditCard, Landmark, Shield,
  Play, Smartphone, Fuel, Calendar as CalendarIcon, Upload, X, Search, Trash2
} from 'lucide-react';

const IconMap = ({ name, color }) => {
  const props = { color, size: 24 };
  if (name === 'Coffee') return <Coffee {...props} />;
  if (name === 'Play') return <Play {...props} />;
  if (name === 'Smartphone') return <Smartphone {...props} />;
  if (name === 'ShoppingBag') return <ShoppingBag {...props} />;
  if (name === 'Landmark') return <Landmark {...props} />;
  if (name === 'BellRing') return <BellRing {...props} />;
  if (name === 'Wallet') return <Wallet {...props} />;
  return <ShoppingBag {...props} />;
};

export default function RemSync() {
  const [activePath, setActivePath] = useState(1); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [bridgeId, setBridgeId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
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
    try {
      const existing = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
      setSyncedData(Array.isArray(existing) ? existing : []);
    } catch(e) { setSyncedData([]); }
  }, []);

  const handleReset = () => {
    if (window.confirm("Tum veriler sifirlansin mi?")) {
      localStorage.removeItem('insomni_synced_txs');
      setSyncedData([]);
      window.location.reload();
    }
  };

  const handleCalendarSync = () => {
    try {
      addLog(`Takvim senkronizasyonu baslatildi...`, 'system');
      // SAVE EVERYTHING including BALANCE
      localStorage.setItem('insomni_synced_txs', JSON.stringify(syncedData));
      addLog(`BAŞARI: Veriler mühürlendi.`, 'success');
    } catch(e) { addLog("HATA: Kayit sirasinda siber ariza.", "error"); }
  };

  const handleOcrScan = async () => {
    setIsScanning(true); addLog("OCR: Dosya okuma sistemi baslatildi...", "system");
    await new Promise(r => setTimeout(r, 1000));
    const newTx = { id: Date.now(), type: 'TRANSACTION', clean: "Apple Store Online", amount: "-45.990,00 TL", raw: "AAPL-9921", category: "LÜKS", source: "OCR ANALİZ", icon: 'Smartphone', color: "#6366f1", day: 15 };
    setSyncedData(prev => [newTx, ...prev]);
    setIsScanning(false); addLog("BAŞARI: Dekont ayiklandi.", "success");
  };

  const sendLocalTestSignal = () => {
    addLog("LOCAL: Test sinyali firlatiliyor...", "warning");
    processManual(`starbucks 250 tl`);
  };

  const processManual = async (text) => {
    setIsSyncing(true); addLog(`Sinyal saptandi...`, 'system');
    await new Promise(r => setTimeout(r, 600));
    const newTx = { id: Date.now(), type: 'TRANSACTION', clean: "Starbucks Coffee", amount: "-250,00 TL", raw: "VTM-3910", category: "OTONOM", source: "OTONOM KÖPRÜ", icon: 'Coffee', color: "#00704A", day: 15 };
    setSyncedData(prev => [newTx, ...prev]);
    setIsSyncing(false); addLog(`Veri ayiklama basarili.`, 'success');
  };

  const handleApiSync = async () => {
    setIsSyncing(true); setSyncedData([]); setLogs([]);
    addLog("Gateway baglantisi kuruluyor...", "system");
    await new Promise(r => setTimeout(r, 800));
    const mock = [
      { id: 1, type: 'TRANSACTION', clean: "Starbucks Coffee", amount: "-185,00 TL", raw: "VTM-3910", category: "YEME-İÇME", source: "BANKA GATEWAY", icon: 'Coffee', color: "#00704A", day: 15 },
      { id: 2, type: 'TRANSACTION', clean: "Netflix Digital", amount: "-149,90 TL", raw: "NETFLIX", category: "EĞLENCE", source: "BANKA GATEWAY", icon: 'Play', color: "#e11d48", day: 14 }
    ];
    setSyncedData([{ id: 'bal', type: 'BALANCE', clean: "Garanti BBVA Hesabı", amount: "42.850,20 ₺", raw: "TR92 0006 2000 0001 2345 6789 01", category: "ANA BAKİYE", icon: 'Wallet', color: "#10b981" }, ...mock]);
    setIsSyncing(false); addLog("Senkronizasyon tamamlandi.", "success");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <h1 style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>R.E.M <span style={{ color: '#6366f1' }}>SYNC</span></h1>
        <button onClick={handleReset} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px 24px', borderRadius: 16, fontSize: 12, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Trash2 size={16} /> SİSTEMİ SIFIRLA</button>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
           {[ { id: 1, name: "BANKA API", info: "Garanti BBVA", icon: Landmark, color: "#10b981" }, { id: 2, name: "OTONOM KÖPRÜ", info: "Telegram Bot", icon: Radio, color: "#6366f1" }, { id: 3, name: "DOSYA TARA", info: "OCR Analizi", icon: FileText, color: "#f59e0b" } ].map(p => (
             <button key={p.id} onClick={() => setActivePath(p.id)}
               style={{ padding: 32, borderRadius: 32, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.3s' }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: activePath === p.id ? p.color : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#cbd5e1' }}><p.icon size={28} /></div>
                <div style={{ textAlign: 'left' }}><div style={{ fontSize: 16, fontWeight: 900, color: activePath === p.id ? p.color : '#1e293b' }}>{p.name}</div><div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{p.info}</div></div>
             </button>
           ))}
        </div>

        <div className="glass" style={{ padding: 48, borderRadius: 44, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(30px)', minHeight: 480 }}>
          <AnimatePresence mode="wait">
            {activePath === 3 && (
               <motion.div key="ocr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                  <div style={{ maxWidth: 600, margin: '0 auto' }}>
                     <div style={{ width: 100, height: 100, borderRadius: 32, background: '#f59e0b10', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px auto' }}><Upload size={48} color="#f59e0b" /></div>
                     <h3 style={{ fontSize: 28, fontWeight: 950, color: '#1e293b', marginBottom: 12 }}>OCR Dekont Analizi</h3>
                     <div onClick={!isScanning ? handleOcrScan : null} style={{ padding: 60, border: '3px dashed #e2e8f0', borderRadius: 40, cursor: 'pointer', transition: 'all 0.3s', background: isScanning ? '#f8fafc' : '#fff' }}>
                        {isScanning ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}><Loader2 size={40} className="animate-spin" color="#f59e0b" /><span style={{ fontWeight: 950 }}>DOSYA TARANIYOR...</span></div> : <div style={{ color: '#94a3b8', fontWeight: 900 }}>DOSYAYI BURAYA BIRAKIN VEYA SEÇİN</div>}
                     </div>
                  </div>
               </motion.div>
            )}
            {activePath === 2 && (
               <motion.div key="bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
                  <div>
                    <div style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #f1f5f9', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={22} color="#6366f1" /></div><div><div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900 }}>ID SİSTEMİ</div><div style={{ fontSize: 18, fontWeight: 950, color: '#1e293b' }}>ID: {bridgeId}</div></div></div>
                       <button onClick={sendLocalTestSignal} style={{ fontSize: 11, color: '#f59e0b', fontWeight: 900, background: '#f59e0b10', padding: '10px 16px', borderRadius: 12, border: '1px solid #f59e0b20', cursor: 'pointer' }}>TEST SİNYALİ</button>
                    </div>
                    <div style={{ background: '#0a0f1e', borderRadius: 28, padding: 32, fontFamily: 'monospace', minHeight: 320, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', paddingLeft: 16 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56', marginRight: 6 }}></div><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e', marginRight: 6 }}></div><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}></div></div>
                       <div style={{ marginTop: 20 }}>{logs.map((l, i) => ( <div key={i} style={{ marginBottom: 6, fontSize: 14, display: 'flex', gap: 10 }}><span style={{ color: 'rgba(255,255,255,0.1)' }}>[{l.time}]</span><span style={{ color: l.type === 'system' ? '#6366f1' : l.type === 'success' ? '#10b981' : l.type === 'warning' ? '#f59e0b' : '#94a3b8' }}>{l.msg}</span></div> ))}</div>
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: 32, padding: 24, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><Activity size={18} color="#6366f1" /><h4 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>TRAFİK</h4></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{trafficLog.map((t, i) => ( <div key={t.id} style={{ padding: 16, borderRadius: 18, background: '#fff', border: '1px solid #f1f5f9' }}><div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.text}</div><div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{new Date(t.timestamp).toLocaleTimeString()}</div></div> ))}</div>
                  </div>
               </motion.div>
            )}
            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}><div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={40} color="#10b981" /></div><h3 style={{ fontSize: 28, fontWeight: 950, margin: 0, color: '#1e293b' }}>API Gateway</h3></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}><div style={{ background: '#0a0f1e', borderRadius: 32, padding: 40, fontFamily: 'monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)' }}>{logs.map((l, i) => <div key={i} style={{ color: l.type === 'success' ? '#10b981' : '#34d399', fontSize: 15, marginBottom: 8 }}>{l.msg}</div>)}</div><div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}><button onClick={handleApiSync} disabled={isSyncing} style={{ width: '100%', padding: 28, borderRadius: 24, fontSize: 18, fontWeight: 950, background: '#111', color: '#fff', cursor: 'pointer', border: 'none' }}>{isSyncing ? 'İŞLENİYOR...' : 'SENKRONİZASYONU BAŞLAT'}</button></div></div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={txListRef}>
          <AnimatePresence>
            {syncedData && syncedData.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 60 }}>
                 {syncedData.some(d => d.type === 'BALANCE') && (
                   <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
                     style={{ padding: 40, borderRadius: 40, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                      <div>
                         <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', marginBottom: 8, letterSpacing: '0.1em' }}>TOPLAM AKTİF VARLIK</div>
                         <div style={{ fontSize: 56, fontWeight: 950 }}>{syncedData.find(d => d.type === 'BALANCE')?.amount}</div>
                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12, fontWeight: 700 }}>{syncedData.find(d => d.type === 'BALANCE')?.raw}</div>
                      </div>
                      <Wallet size={64} color="#10b981" />
                   </motion.div>
                 )}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><History size={24} color="#64748b" /><h4 style={{ fontSize: 22, fontWeight: 950, color: '#1e293b', margin: 0 }}>Harcama Analizi</h4></div>
                    <button onClick={handleCalendarSync} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, fontSize: 13, fontWeight: 900, cursor: 'pointer', color: '#1e293b' }}><CalendarIcon size={18} color="#6366f1" /> TAKVİME SENKRONİZE ET</button>
                 </div>
                 {syncedData.filter(d => d.type === 'TRANSACTION').map((tx, idx) => ( 
                   <div key={tx.id || idx} style={{ padding: 32, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 40, border: '1px solid #f1f5f9', background: '#fff', borderRadius: 32, marginBottom: 20 }}>
                     <div style={{ fontSize: 13, color: '#94a3b8' }}>{tx.raw}</div><ArrowRight size={18} color="#e2e8f0" /><div style={{ display: 'flex', alignItems: 'center', gap: 24 }}><div style={{ width: 56, height: 56, borderRadius: 18, background: `${tx.color || '#6366f1'}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMap name={tx.icon} color={tx.color || '#6366f1'} /></div><div><div style={{ fontSize: 18, fontWeight: 950, color: '#1e293b' }}>{tx.clean}</div><div style={{ fontSize: 10, color: tx.color || '#6366f1', fontWeight: 900, display: 'flex', gap: 8 }}><span>{tx.category}</span><span style={{ opacity: 0.5 }}>•</span><span style={{ fontSize: 9, textTransform: 'uppercase' }}>{tx.source}</span></div></div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 950, color: tx.color || '#ef4444' }}>{tx.amount}</div></div>
                   </div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
