import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Shield, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [activePath, setActivePath] = useState(2); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [processedIds, setProcessedIds] = useState(new Set());
  const [bridgeId, setBridgeId] = useState('');

  const addLog = (msg) => {
    setLogs(prev => [...prev.slice(-10), `> ${msg}`]);
  };

  // Siber Kimlik Olusturma
  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setBridgeId(savedId);
  }, []);

  // BRIDGE POLLING (ID Filtreli)
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
        } catch (err) { console.error("Bridge Connection Lost"); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activePath, processedIds, bridgeId]);

  const processAutomatedMessage = async (text) => {
    if (!text || text === "SINYAL BOS") return;
    setIsSyncing(true);
    addLog(`BRIDGE: Veri girisi saptandi!`);
    await new Promise(r => setTimeout(r, 1000));
    
    const amountMatch = text.match(/(\d+([.,]\d+)?)\s*(TL|tl|?)/i);
    const amount = amountMatch ? amountMatch[1] : null;
    
    if (amount) {
      addLog(`R.E.M: Analiz basarili. Tutar: ${amount} ?`);
      const newTx = {
        id: Date.now(),
        type: 'TRANSACTION',
        clean: text.length > 30 ? "Otonom Harcama" : text,
        amount: `-${amount} ?`,
        raw: "SIBER_KÖPRÜ_v3",
        category: "OTONOM ANALIZ",
        icon: BellRing,
        color: "#6366f1"
      };
      setSyncedData(prev => [newTx, ...prev]);
    } else {
      addLog(`UYARI: Tutar bulunamadi. Veri: "${text.substring(0, 15)}..."`);
    }
    setIsSyncing(false);
  };

  const sendTestSignal = async () => {
    addLog("SISTEM: Manuel test sinyali firlatiliyor...");
    try {
      await fetch('/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${bridgeId} Starbucks 150 TL Test Mesaji` })
      });
      addLog("SISTEM: Sinyal arka kapiya (API) birakildi.");
    } catch (err) { addLog("HATA: Sinyal firlatilamadi."); }
  };

  const handleApiSync = async () => {
    setIsSyncing(true); setSyncedData([]); setLogs([]);
    const sequence = ["Baglanti kuruluyor...", "Gateway dogrulandi.", "Veriler cekiliyor...", "Analiz ediliyor...", "Tamamlandi."];
    for(let i=0; i<sequence.length; i++) {
      addLog(sequence[i]); await new Promise(r => setTimeout(r, 800));
    }
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      if (data.status === 'Connected') {
        const balanceCard = { id: 'bal', type: 'BALANCE', clean: "Garanti Hesabi", amount: data.balance + " ?", raw: data.iban, category: "BAKIYE", icon: Wallet, color: "#10b981" };
        const transactions = data.transactions.map(tx => ({ ...tx, icon: tx.clean.includes('Starbucks') ? Coffee : ShoppingBag, color: "#6366f1" }));
        setSyncedData([balanceCard, ...transactions]);
      }
    } catch (err) { addLog("HATA: Link koptu."); }
    setIsSyncing(false);
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 48, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #000 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CYBER <span style={{ color: '#6366f1' }}>BRIDGE</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 40 }}>
           {[{ id: 1, name: "API HUB", icon: Zap, color: "#10b981" }, { id: 2, name: "BRIDGE v2", icon: Radio, color: "#6366f1" }, { id: 3, name: "DOCU-SCAN", icon: FileText, color: "#f59e0b" }].map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 24, borderRadius: 24, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: activePath === p.id ? p.color : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#999' }}><p.icon size={22} /></div>
                <div style={{ textAlign: 'left' }}>
                   <div style={{ fontSize: 13, fontWeight: 900, color: activePath === p.id ? p.color : '#111' }}>{p.name}</div>
                   <div style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>SENKRONIZASYON HATTI</div>
                </div>
             </button>
           ))}
        </div>

        <div className="glass" style={{ padding: 40, borderRadius: 32, border: '1px solid rgba(0,0,0,0.05)', minHeight: 400, position: 'relative', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {activePath === 2 && (
              <motion.div key="bridge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 340px', gap: 30 }}>
                 <div>
                    {/* Siber Kimlik Kartý */}
                    <div className="glass" style={{ marginBottom: 24, padding: 24, borderLeft: '4px solid #6366f1', background: '#fff' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                             <Shield size={18} color="#6366f1" />
                             <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.1em' }}>OMNI ID</span>
                          </div>
                          <div style={{ fontSize: 9, padding: '2px 8px', background: '#6366f110', color: '#6366f1', borderRadius: 4, fontWeight: 900 }}>AKTIF</div>
                       </div>
                       <div style={{ textAlign: 'center', background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px dashed #e2e8f0' }}>
                          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>BRIDGE ID</div>
                          <div style={{ fontSize: 32, fontWeight: 950, color: '#6366f1', letterSpacing: '4px' }}>{bridgeId}</div>
                       </div>
                       <p style={{ fontSize: 10, color: '#64748b', marginTop: 12, fontStyle: 'italic' }}>
                         * Bot mesajinin basina bu ID'yi ekleyin. Örn: <b>{bridgeId} Starbucks 150 TL</b>
                       </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 56, height: 56, borderRadius: 18, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Radio size={28} color="#6366f1" className="animate-pulse" /></div>
                          <h3 style={{ fontSize: 20, fontWeight: 950, margin: 0 }}>Siber Köprü v3.0</h3>
                       </div>
                       <button onClick={sendTestSignal} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, background: '#000', color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer' }}>
                          <Send size={14} /> TEST SINYALI GÖNDER
                       </button>
                    </div>
                    <div style={{ background: '#0a0a0a', borderRadius: 20, padding: 24, fontFamily: 'monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ color: '#6366f130', fontSize: 10, marginBottom: 12, borderBottom: '1px solid #6366f110', paddingBottom: 8 }}>REM CORE v3.0 // OTONOM LOGS</div>
                       {logs.map((l, i) => <div key={i} style={{ color: '#6366f1', fontSize: 13, marginBottom: 4 }}>{l}</div>)}
                       {logs.length === 0 && <div style={{ color: '#333', fontSize: 13 }}>Dinleme moduna gecildi...</div>}
                    </div>
                 </div>
                 <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 24, padding: 20, border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                       <Activity size={16} color="#6366f1" />
                       <h4 style={{ fontSize: 13, fontWeight: 900, margin: 0 }}>CANLI TRAFIK</h4>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                       {trafficLog.map((t, i) => (
                         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={t.id}
                           style={{ padding: 12, borderRadius: 14, background: i === 0 ? '#6366f105' : '#fff', border: `1px solid ${i === 0 ? '#6366f120' : 'transparent'}` }}>
                            <div style={{ fontSize: 9, fontWeight: 900, color: '#6366f1', marginBottom: 2 }}>INPUT_DETECTED</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#111', wordBreak: 'break-all' }}>{t.text}</div>
                            <div style={{ fontSize: 8, color: '#999', marginTop: 4 }}>{new Date(t.timestamp).toLocaleTimeString()}</div>
                         </motion.div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ background: '#0a0a0a', borderRadius: 20, padding: 24, fontFamily: 'monospace', minHeight: 180, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 24 }}>
                     {logs.map((l, i) => <div key={i} style={{ color: '#10b981', fontSize: 13, marginBottom: 4 }}>{l}</div>)}
                  </div>
                  <button onClick={handleApiSync} disabled={isSyncing} className="btn-primary" style={{ width: '100%', padding: 20, borderRadius: 16, fontSize: 16, fontWeight: 900, background: '#000', color: '#fff' }}>GATEWAY BAGLANTISINI KUR</button>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {syncedData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40 }}>
             {syncedData.map((tx, idx) => (
               <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1 }} className="glass"
                 style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 24, border: `1px solid ${tx.color}20`, background: '#fff', marginBottom: 12 }}>
                 <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#666' }}>{tx.raw}</div>
                 <ArrowRight size={14} color="#ccc" />
                 <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={20} color={tx.color} /></div>
                    <div><div style={{ fontSize: 15, fontWeight: 950, color: '#111' }}>{tx.clean}</div><div style={{ fontSize: 10, color: tx.color, fontWeight: 900 }}>{tx.category}</div></div>
                 </div>
                 <div style={{ textAlign: 'right' }}><div style={{ fontSize: 20, fontWeight: 950, color: tx.color }}>{tx.amount}</div></div>
               </motion.div>
             ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
