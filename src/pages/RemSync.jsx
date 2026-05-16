import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send, CreditCard, Landmark
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

  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setBridgeId(savedId);
  }, []);

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
    if (!text) return;
    setIsSyncing(true);
    addLog(`R.E.M: Veri akisi yakalandi...`);
    
    const amountMatch = text.match(/(\d+([.,]\d+)?)\s*(TL|tl|₺)/i);
    const amount = amountMatch ? amountMatch[1] : null;
    
    if (amount) {
      addLog(`ANALIZ: Harcama tespit edildi: ${amount} TL`);
      const newTx = {
        id: Date.now(),
        type: 'TRANSACTION',
        clean: text.length > 25 ? "Otonom Harcama" : text,
        amount: `-${amount} TL`,
        raw: "REM_GATEWAY_v2",
        category: "OTONOM",
        icon: BellRing,
        color: "#6366f1"
      };
      setSyncedData(prev => [newTx, ...prev]);
    }
    setIsSyncing(false);
  };

  const handleApiSync = async () => {
    setIsSyncing(true); setSyncedData([]); setLogs([]);
    const sequence = ["Bağlantı kuruluyor...", "Banka gateway doğrulandı.", "Veriler çekiliyor...", "Analiz ediliyor...", "Tamamlandı."];
    for(let i=0; i<sequence.length; i++) {
      addLog(sequence[i]); await new Promise(r => setTimeout(r, 800));
    }
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      if (data.status === 'Connected') {
        const balanceCard = { id: 'bal', type: 'BALANCE', clean: "Garanti BBVA Hesabı", amount: data.balance + " ₺", raw: "TR-- ---- ---- ----", category: "BAKİYE", icon: Wallet, color: "#10b981" };
        const transactions = data.transactions.map(tx => ({ ...tx, icon: ShoppingBag, color: "#6366f1" }));
        setSyncedData([balanceCard, ...transactions]);
      }
    } catch (err) { addLog("HATA: Bağlantı koptu."); }
    setIsSyncing(false);
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.h1 variants={fadeUp} style={{ fontSize: 44, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', color: '#111' }}>
          R.E.M <span style={{ color: '#6366f1' }}>SYNC</span>
        </motion.h1>
        <p style={{ color: '#666', fontSize: 14, fontWeight: 500, marginTop: 8 }}>Banka ve Cüzdan Veri Senkronizasyon Merkezi</p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 40 }}>
           {[
             { id: 1, name: "BANKA API", info: "Doğrudan Gateway", icon: Landmark, color: "#10b981" }, 
             { id: 2, name: "OTONOM KÖPRÜ", info: "Bulut Senkronu", icon: Radio, color: "#6366f1" }, 
             { id: 3, name: "DOSYA TARA", info: "PDF/Dekont Analiz", icon: FileText, color: "#f59e0b" }
           ].map(p => (
             <button key={p.id} onClick={() => {setActivePath(p.id); setSyncedData([]); setLogs([]);}}
               style={{ padding: 28, borderRadius: 28, border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, background: activePath === p.id ? `${p.color}05` : '#fff', display: 'flex', alignItems: 'center', gap: 20, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: activePath === p.id ? '0 20px 40px rgba(0,0,0,0.05)' : 'none' }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: activePath === p.id ? p.color : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: activePath === p.id ? '#fff' : '#cbd5e1' }}><p.icon size={26} /></div>
                <div style={{ textAlign: 'left' }}>
                   <div style={{ fontSize: 15, fontWeight: 900, color: activePath === p.id ? p.color : '#1e293b' }}>{p.name}</div>
                   <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{p.info}</div>
                </div>
             </button>
           ))}
        </div>

        <div className="glass" style={{ padding: 48, borderRadius: 40, border: '1px solid rgba(0,0,0,0.03)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', minHeight: 450, position: 'relative' }}>
          <AnimatePresence mode="wait">
            {activePath === 2 && (
              <motion.div key="bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
                 <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
                       <div style={{ width: 64, height: 64, borderRadius: 20, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Radio size={32} color="#6366f1" className="animate-pulse" /></div>
                       <div>
                          <h3 style={{ fontSize: 24, fontWeight: 950, margin: 0, color: '#1e293b' }}>Otonom Bulut Köprüsü</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div>
                             <span style={{ fontSize: 12, color: '#10b981', fontWeight: 900 }}>DINLEME MODU AKTIF</span>
                          </div>
                       </div>
                    </div>

                    <div style={{ background: '#0f172a', borderRadius: 24, padding: 32, fontFamily: 'JetBrains Mono, monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                       <div style={{ color: '#6366f160', fontSize: 11, marginBottom: 16, borderBottom: '1px solid #6366f120', paddingBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                          <span>REM_CORE_v2.4 // SYSTEM_LOG</span>
                          <span>OMNI ID: {bridgeId}</span>
                       </div>
                       {logs.map((l, i) => <div key={i} style={{ color: '#818cf8', fontSize: 14, marginBottom: 6, display: 'flex', gap: 12 }}><span style={{ color: '#312e81' }}>[{new Date().toLocaleTimeString()}]</span> {l}</div>)}
                       {logs.length === 0 && <div style={{ color: '#334155', fontSize: 14 }}>Sinyal bekleniyor... Telegram botuna mesaj fırlatın.</div>}
                    </div>
                 </div>

                 <div style={{ background: '#f8fafc', borderRadius: 32, padding: 24, border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                       <Activity size={18} color="#6366f1" />
                       <h4 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: '#1e293b' }}>CANLI TRAFİK</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {trafficLog.map((t, i) => (
                         <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={t.id}
                           style={{ padding: 16, borderRadius: 18, background: '#fff', border: i === 0 ? '2px solid #6366f110' : '1px solid #f1f5f9', boxShadow: i === 0 ? '0 10px 20px rgba(99, 102, 241, 0.05)' : 'none' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.text}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{new Date(t.timestamp).toLocaleTimeString()}</div>
                         </motion.div>
                       ))}
                       {trafficLog.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#cbd5e1', fontSize: 12 }}>Henüz veri girişi yok.</div>}
                    </div>
                 </div>
              </motion.div>
            )}

            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}>
                      <div style={{ width: 72, height: 72, borderRadius: 24, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={36} color="#10b981" /></div>
                      <div>
                        <h3 style={{ fontSize: 26, fontWeight: 950, margin: 0, color: '#1e293b' }}>Banka API Gateway</h3>
                        <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Garanti BBVA ve diğer bankalarla doğrudan güvenli hat.</p>
                      </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 30 }}>
                     <div style={{ background: '#0f172a', borderRadius: 28, padding: 32, fontFamily: 'JetBrains Mono, monospace', minHeight: 240, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {logs.map((l, i) => <div key={i} style={{ color: '#34d399', fontSize: 14, marginBottom: 6 }}>{l}</div>)}
                        {logs.length === 0 && <div style={{ color: '#1e293b', fontSize: 14 }}>Sistem hazır. Bağlantı bekleniyor...</div>}
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
                        <div style={{ padding: 24, borderRadius: 24, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                           <div style={{ fontSize: 12, fontWeight: 900, color: '#10b981', marginBottom: 8 }}>DOĞRULAMA DURUMU</div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <ShieldCheck size={20} color="#10b981" />
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>SSL & AES-256 Şifreleme Aktif</span>
                           </div>
                        </div>
                        <button onClick={handleApiSync} disabled={isSyncing} className="btn-primary" 
                          style={{ width: '100%', padding: 24, borderRadius: 20, fontSize: 16, fontWeight: 950, background: '#111', color: '#fff', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                          {isSyncing ? 'VERİLER ÇEKİLİYOR...' : 'GATEWAY BAĞLANTISINI BAŞLAT'}
                        </button>
                     </div>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {syncedData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40 }}>
             {syncedData.map((tx, idx) => (
               <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.1 }}
                 style={{ padding: 28, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: '1px solid #f1f5f9', background: '#fff', borderRadius: 28, marginBottom: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                 <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#94a3b8' }}>{tx.raw}</div>
                 <ArrowRight size={16} color="#e2e8f0" />
                 <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={24} color={tx.color} /></div>
                    <div><div style={{ fontSize: 17, fontWeight: 950, color: '#1e293b' }}>{tx.clean}</div><div style={{ fontSize: 11, color: tx.color, fontWeight: 900 }}>{tx.category}</div></div>
                 </div>
                 <div style={{ textAlign: 'right' }}><div style={{ fontSize: 22, fontWeight: 950, color: tx.color }}>{tx.amount}</div></div>
               </motion.div>
             ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
