import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, BrainCircuit, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, FileText, PlusCircle, Sparkles, Terminal as TerminalIcon,
  Radio, BellRing, Activity, History, Wifi, Link, Send, CreditCard, Landmark, Shield,
  Play, Smartphone, Fuel, Calendar as CalendarIcon, Upload, X, Search, Trash2, AlertTriangle,
  Info, ExternalLink, Key, AtSign, Power
} from 'lucide-react';
import { storage } from '../lib/storage';
import { useLanguage } from '../context/LanguageContext';

const IconMap = ({ name, color }) => {
  const props = { color, size: 24 };
  if (name === 'Coffee') return <Coffee {...props} />;
  if (name === 'Play') return <Play {...props} />;
  if (name === 'Smartphone') return <Smartphone {...props} />;
  if (name === 'ShoppingBag') return <ShoppingBag {...props} />;
  if (name === 'Landmark') return <Landmark {...props} />;
  if (name === 'BellRing') return <BellRing {...props} />;
  if (name === 'Wallet') return <Wallet {...props} />;
  if (name === 'AlertTriangle') return <AlertTriangle {...props} />;
  if (name === 'Radio') return <Radio {...props} />;
  return <ShoppingBag {...props} />;
};

export default function RemSync({ onSalaryUpdate }) {
  const { lang, t } = useLanguage();
  const [activePath, setActivePath] = useState(1); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [logs, setLogs] = useState([]);
  const [trafficLog, setTrafficLog] = useState([]);
  const [omniId, setOmniId] = useState('');
  const lastProcessedRef = useRef(new Set());

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [...prev.slice(-12), { msg: `> ${msg}`, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setOmniId(savedId);

    try {
      const existing = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
      setSyncedData(Array.isArray(existing) ? existing : []);
    } catch(e) { setSyncedData([]); }
  }, []);

  useEffect(() => {
    if (!omniId) return;
    const pollBridge = async () => {
      try {
        let history = [];
        try {
          const res = await fetch(`/api/bridge?id=${omniId}`);
          const contentType = res.headers.get('content-type') || '';
          if (res.ok && contentType.includes('application/json')) {
            const data = await res.json();
            history = data.history || [];
          } else {
            throw new Error("API Offline or Vite Fallback");
          }
        } catch (apiErr) {
          const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/s30yicqv/${omniId}`);
          if (getRes.ok) {
            const rawText = await getRes.text();
            let parsedText = JSON.parse(rawText);
            if (typeof parsedText === 'string') {
              history = JSON.parse(parsedText) || [];
            } else {
              history = parsedText || [];
            }
          }
        }
        
        if (history && history.length > 0) {
          history.forEach(entry => {
            if (!lastProcessedRef.current.has(entry.id)) {
              lastProcessedRef.current.add(entry.id);
              processManual(entry.text, entry.source);
            }
          });
          setTrafficLog(history.map(h => ({ text: h.text, time: h.timestamp })));
        }
      } catch (err) {
        console.error("Hybrid bridge polling fallback failure", err);
      }
    };
    const interval = setInterval(pollBridge, 2000);
    return () => clearInterval(interval);
  }, [omniId]);

  const processManual = (text, source = null) => {
    const actSource = source || (lang === 'tr' ? "OTONOM KÖPRÜ" : "AUTONOMOUS BRIDGE");
    addLog(`${lang === 'tr' ? 'Otonom sinyal yakalandı' : 'Autonomous signal captured'}: ${text}`, 'system');
    
    // Check if the signal contains both a digit and 'tl' (case-insensitive)
    const hasDigit = /\d+/.test(text);
    const hasTl = /tl/i.test(text);
    const isValid = hasDigit && hasTl;

    if (!isValid) {
      addLog(lang === 'tr' ? `HATA: Geçersiz sinyal formatı (Rakam ve 'TL' bulunamadı!)` : `ERROR: Invalid signal format (No digits and 'TL' found!)`, 'warning');
      const invalidTx = { 
        id: Math.random().toString(36).substr(2, 9), 
        type: 'TRANSACTION', 
        clean: text.trim() || (lang === 'tr' ? "Geçersiz Sinyal" : "Invalid Signal"), 
        amount: `0,00 ${t.currency || 'TL'}`, 
        raw: "OMNI_BRIDGE_INVALID", 
        category: lang === 'tr' ? "GEÇERSİZ" : "INVALID", 
        source: actSource, 
        icon: 'AlertTriangle', 
        color: "#f59e0b", 
        day: new Date().getDate() 
      };
      
      setSyncedData(prev => {
        if (prev.some(p => p.clean === text.trim() && p.raw === "OMNI_BRIDGE_INVALID")) {
          return prev;
        }
        return [invalidTx, ...prev];
      });
      return;
    }

    const amountMatch = text.match(/(\d+)/);
    const amountVal = amountMatch ? amountMatch[1] : "0";
    const formattedAmount = `-${parseInt(amountVal).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')},00 ${t.currency || 'TL'}`;
    
    const newTx = { 
      id: Math.random().toString(36).substr(2, 9), 
      type: 'TRANSACTION', 
      clean: text.split(/[0-9]/)[0].trim() || (lang === 'tr' ? "Otonom İşlem" : "Autonomous Transaction"), 
      amount: formattedAmount, 
      raw: "OMNI_BRIDGE", 
      category: lang === 'tr' ? "OTONOM" : "AUTONOMOUS", 
      source: actSource, 
      icon: 'Radio', 
      color: "#6366f1", 
      day: new Date().getDate() 
    };
    
    setSyncedData(prev => {
      if (prev.some(p => p.clean === newTx.clean && p.amount === newTx.amount && p.raw === "OMNI_BRIDGE")) {
        return prev;
      }
      return [newTx, ...prev];
    });
    addLog(`${lang === 'tr' ? 'BAŞARI: Veri mühürlendi' : 'SUCCESS: Data sealed'} (${formattedAmount}).`, 'success');
  };

  const handleReset = () => {
    if (window.confirm(lang === 'tr' ? "Tum veriler sifirlansin mi?" : "Reset all data?")) {
      localStorage.removeItem('insomni_synced_txs');
      setSyncedData([]);
      addLog(lang === 'tr' ? "SİSTEM SIFIRLANDI." : "SYSTEM RESET.", "warning");
    }
  };

  const handleCalendarSync = () => {
    try {
      addLog(lang === 'tr' ? `Takvim senkronizasyonu baslatildi...` : `Calendar synchronization started...`, 'system');
      localStorage.setItem('insomni_synced_txs', JSON.stringify(syncedData));
      
      const balanceItem = syncedData.find(d => d.type === 'BALANCE');
      if (balanceItem) {
        const cleanVal = balanceItem.amount.replace(/[^\d,]/g, '').replace(',', '.');
        const parsedBalance = parseFloat(cleanVal) || 0;
        
        if (parsedBalance > 0) {
          const currentProfileName = storage.getCurrentProfile() || 'Default';
          const existingSalary = storage.loadProfile(currentProfileName, 'salary') || { currency: '₺', day: 1 };
          
          const updatedSalary = {
            ...existingSalary,
            income: parsedBalance,
            salary: parsedBalance,
            day: 1,
            date: 1
          };
          
          storage.saveProfile(currentProfileName, 'salary', updatedSalary);
          
          if (onSalaryUpdate) {
            onSalaryUpdate(updatedSalary);
          }
          addLog(lang === 'tr' ? `MÜKEMMEL: Aktif varlık (${parsedBalance.toLocaleString('tr-TR')} ₺) ana maaş/gelir havuzuna eklendi!` : `EXCELLENT: Active asset (${t.currency || '₺'}${parsedBalance.toLocaleString('en-US')}) added to main salary/income pool!`, 'success');
        }
      }
      
      addLog(lang === 'tr' ? `BAŞARI: Veriler mühürlendi.` : `SUCCESS: Data sealed.`, 'success');
    } catch(e) { addLog(lang === 'tr' ? "HATA: Kayit sirasinda ariza." : "ERROR: Critical failure during seal.", "error"); }
  };

  const sendLocalTestSignal = async () => {
    addLog(lang === 'tr' ? "LOCAL: Test sinyali firlatiliyor..." : "LOCAL: Test signal is being dispatched...", "warning");
    try {
      const res = await fetch('/api/bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${omniId} ${lang === 'tr' ? 'Yemek 340 tl' : 'Food 340 tl'}` })
      });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) throw new Error("API Offline or Vite Fallback");
    } catch (e) {
      addLog(lang === 'tr' ? "HYBRID: Bulut veritabanına doğrudan bağlantı kuruluyor..." : "HYBRID: Direct connection to cloud database is being established...", "system");
      const newEntry = {
        text: lang === 'tr' ? "Yemek 340 tl" : "Food 340 tl",
        targetId: omniId,
        source: "Otonom Bridge (Local Fallback)",
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };
      try {
        let currentLog = [];
        const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/s30yicqv/${omniId}`);
        if (getRes.ok) {
          const rawText = await getRes.text();
          let parsedText = JSON.parse(rawText);
          if (typeof parsedText === 'string') {
            currentLog = JSON.parse(parsedText) || [];
          } else {
            currentLog = parsedText || [];
          }
        }
        const updatedLog = [newEntry, ...currentLog].slice(0, 50);
        const encodedVal = encodeURIComponent(JSON.stringify(updatedLog));
        await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/s30yicqv/${omniId}?value=\${encodedVal}`, {
          method: 'POST',
          body: ''
        });
      } catch (kvErr) {
        console.error("KV client fallback write error", kvErr);
      }
    }
  };

  const handleApiSync = async () => {
    setIsSyncing(true); addLog(lang === 'tr' ? "Gateway baglantisi kuruluyor..." : "Establishing Gateway connection...", "system");
    await new Promise(r => setTimeout(r, 800));
    
    const mock = [
      { id: 'tx-starbucks', type: 'TRANSACTION', clean: "Starbucks Coffee", amount: `-185,00 ${t.currency || 'TL'}`, raw: "VTM-3910", category: lang === 'tr' ? "YEME-İÇME" : "FOOD & DRINK", source: lang === 'tr' ? "BANKA GATEWAY" : "BANK GATEWAY", icon: 'Coffee', color: "#00704A", day: 15 },
      { id: 'tx-netflix', type: 'TRANSACTION', clean: "Netflix Digital", amount: `-149,90 ${t.currency || 'TL'}`, raw: "NETFLIX", category: lang === 'tr' ? "EĞLENCE" : "ENTERTAINMENT", source: lang === 'tr' ? "BANKA GATEWAY" : "BANK GATEWAY", icon: 'Play', color: "#e11d48", day: 14 }
    ];
    
    const balanceItem = { 
      id: 'bal-garanti', 
      type: 'BALANCE', 
      clean: lang === 'tr' ? "Garanti BBVA Hesabı" : "Garanti BBVA Account", 
      amount: `42.850,20 ${t.currency || '₺'}`, 
      raw: "TR92...", 
      category: lang === 'tr' ? "ANA BAKİYE" : "MAIN BALANCE", 
      source: lang === 'tr' ? "BANKA GATEWAY" : "BANK GATEWAY", 
      icon: 'Wallet', 
      color: "#10b981", 
      day: 1 
    };

    setSyncedData(prev => {
      // Prevent duplicate clone synchronizations by matching IDs
      const newIds = new Set(['bal-garanti', 'tx-starbucks', 'tx-netflix']);
      const filteredPrev = prev.filter(item => !newIds.has(item.id));
      return [balanceItem, ...mock, ...filteredPrev];
    });

    setIsSyncing(false); 
    addLog(lang === 'tr' ? "Senkronizasyon tamamlandi." : "Synchronization completed.", "success");
  };

  const filteredData = syncedData.filter(d => d.source === (activePath === 1 ? (lang === 'tr' ? "BANKA GATEWAY" : "BANK GATEWAY") : (lang === 'tr' ? "OTONOM KÖPRÜ" : "AUTONOMOUS BRIDGE")));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ textAlign: 'center', marginTop: 60, marginBottom: 40 }}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16, cursor: 'default' }}
        >
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #c084fc)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            <Power size={20} />
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 950, margin: 0, letterSpacing: '-0.05em', background: 'linear-gradient(to right, var(--text1), #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TEST THE <span style={{ color: '#6366f1', WebkitTextFillColor: '#6366f1' }}>POWER</span> OF SYNC
          </h1>
        </motion.div>
        <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 600, margin: '0 auto', fontWeight: 600, lineHeight: 1.6 }}>
          {lang === 'tr' ? "Banka API'leri ve Otonom Köprüler arasındaki gelişmiş senkronizasyonun gücünü keşfedin. Finansal verileriniz artık yüksek hızla merkeze akıyor." : "Discover the power of advanced synchronization between Banking APIs and Autonomous Bridges. Your financial data now streams to the hub at lightning speed."}
        </p>
      </motion.div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button onClick={handleReset} style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', padding: '10px 20px', borderRadius: 12, fontSize: 11, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Trash2 size={14} /> {lang === 'tr' ? 'SİSTEMİ SIFIRLA' : 'RESET SYSTEM'}</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
           {[ 
             { id: 1, name: lang === 'tr' ? "BANKA API" : "BANKING API", info: "Garanti BBVA", icon: Landmark, color: "#10b981" }, 
             { id: 2, name: lang === 'tr' ? "OTONOM KÖPRÜ" : "AUTONOMOUS BRIDGE", info: "Telegram Bot", icon: Radio, color: "#6366f1" } 
           ].map(p => (
             <motion.button 
               key={p.id} 
               onClick={() => setActivePath(p.id)}
               whileHover={{ scale: 1.02, y: -5, boxShadow: `0 20px 40px ${p.color}15` }}
               whileTap={{ scale: 0.98 }}
               style={{ 
                 padding: 32, 
                 borderRadius: 32, 
                 border: `2px solid ${activePath === p.id ? p.color : 'rgba(0,0,0,0.05)'}`, 
                 background: activePath === p.id ? `${p.color}05` : 'rgba(255,255,255,0.02)', 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: 24, 
                 transition: 'border 0.3s, background 0.3s',
                 cursor: 'pointer'
               }}
             >
                <motion.div 
                  animate={activePath === p.id ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ 
                    width: 72, height: 72, borderRadius: 22, 
                    background: activePath === p.id ? p.color : 'rgba(255,255,255,0.05)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    color: activePath === p.id ? '#fff' : '#cbd5e1',
                    boxShadow: activePath === p.id ? `0 10px 20px ${p.color}40` : 'none'
                  }}
                >
                  <p.icon size={32} />
                </motion.div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: activePath === p.id ? p.color : 'var(--text1)', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{p.info}</div>
                </div>
             </motion.button>
           ))}
         </div>

        <div className="glass" style={{ padding: 48, borderRadius: 44, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(30px)', minHeight: 400, border: '1px solid var(--glass-border)' }}>
          <AnimatePresence mode="wait">
            {activePath === 2 && (
               <motion.div key="bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
                    <div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 24, border: '1px solid var(--glass-border)', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: '#6366f110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={22} color="#6366f1" /></div><div><div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 900 }}>OMNI ID</div><div style={{ fontSize: 18, fontWeight: 950, color: 'var(--text1)' }}>{omniId}</div></div></div>
                         <button onClick={sendLocalTestSignal} style={{ fontSize: 11, color: '#f59e0b', fontWeight: 900, background: '#f59e0b10', padding: '10px 16px', borderRadius: 12, border: '1px solid #f59e0b20', cursor: 'pointer' }}>{lang === 'tr' ? 'TEST SİNYALİ' : 'TEST SIGNAL'}</button>
                      </div>
                      <div style={{ background: '#0a0f1e', borderRadius: 28, padding: 32, fontFamily: 'monospace', minHeight: 320, border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', marginBottom: 20 }}>
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 30, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', paddingLeft: 16 }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56', marginRight: 6 }}></div><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e', marginRight: 6 }}></div><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }}></div></div>
                         <div style={{ marginTop: 20 }}>{logs.map((l, i) => ( <div key={i} style={{ marginBottom: 6, fontSize: 14, display: 'flex', gap: 10 }}><span style={{ color: 'rgba(255,255,255,0.1)' }}>[{l.time}]</span><span style={{ color: l.type === 'system' ? '#6366f1' : l.type === 'success' ? '#10b981' : l.type === 'warning' ? '#f59e0b' : '#94a3b8' }}>{l.msg}</span></div> ))}</div>
                      </div>
                      <motion.button 
                        onClick={handleCalendarSync} 
                        whileHover={{ scale: 1.02, background: 'rgba(99, 102, 241, 0.12)' }}
                        whileTap={{ scale: 0.98 }}
                        style={{ 
                          width: '100%', 
                          padding: 20, 
                          borderRadius: 20, 
                          fontSize: 15, 
                          fontWeight: 950, 
                          background: 'rgba(99, 102, 241, 0.05)', 
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          color: '#a855f7', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 10, 
                          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.05)',
                          transition: 'background 0.3s, border 0.3s'
                        }}
                      >
                        <CalendarIcon size={18} color="#a855f7" /> 
                        {lang === 'tr' ? 'TAKVİME SENKRONİZE ET' : 'SYNC TO CALENDAR'}
                      </motion.button>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 32, padding: 24, border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}><Activity size={18} color="#6366f1" /><h4 style={{ fontSize: 15, fontWeight: 900, margin: 0, color: 'var(--text1)' }}>{lang === 'tr' ? 'TRAFİK' : 'TRAFFIC'}</h4></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{trafficLog.map((t, i) => ( <div key={i} style={{ padding: 16, borderRadius: 18, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}><div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text1)' }}>{t.text}</div><div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>{new Date(t.time).toLocaleTimeString()}</div></div> ))}</div>
                    </div>
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ 
                      padding: 32, 
                      borderRadius: 32, 
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(192,132,252,0.05) 100%)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 20
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                        <AtSign size={20} />
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{lang === 'tr' ? 'Otonom Köprü Protokolü' : 'Autonomous Bridge Protocol'}</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                      {[
                        { step: "01", title: lang === 'tr' ? "Botu Aç" : "Launch Bot", desc: lang === 'tr' ? "Telegram üzerinden @insomni_test_bot adresinden botu başlatın." : "Start the Telegram bot via @insomni_test_bot.", icon: <ExternalLink size={18} /> },
                        { step: "02", title: lang === 'tr' ? "Sinyal Formatı" : "Signal Format", desc: lang === 'tr' ? "Veri göndermek için önce ID, sonra boşluk ve harcama yazın." : "To send data, enter your ID first, followed by space and your expense.", icon: <MessageSquare size={18} /> },
                        { step: "03", title: lang === 'tr' ? "Örnek Veri" : "Example Signal", desc: `${omniId} ${lang === 'tr' ? 'Kahve 120 tl' : 'Coffee 120 tl'}`, icon: <Zap size={18} />, highlight: true }
                      ].map((item, idx) => (
                        <div key={idx} style={{ padding: 20, borderRadius: 20, background: item.highlight ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid \${item.highlight ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', letterSpacing: '0.2em' }}>ADIM ${item.step}</span>
                            <div style={{ color: '#6366f1' }}>{item.icon}</div>
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{item.title}</div>
                          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5, fontFamily: item.highlight ? 'monospace' : 'inherit', fontWeight: item.highlight ? 900 : 400 }}>{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
               </motion.div>
            )}
            {activePath === 1 && (
               <motion.div key="api" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 40 }}><div style={{ width: 80, height: 80, borderRadius: 24, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={40} color="#10b981" /></div><h3 style={{ fontSize: 28, fontWeight: 950, margin: 0, color: 'var(--text1)' }}>API Gateway</h3></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40 }}><div style={{ background: '#0a0f1e', borderRadius: 32, padding: 40, fontFamily: 'monospace', minHeight: 280, border: '1px solid rgba(255,255,255,0.05)' }}>{logs.map((l, i) => <div key={i} style={{ color: l.type === 'success' ? '#10b981' : '#34d399', fontSize: 15, marginBottom: 8 }}>{l.msg}</div>)}</div><div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32 }}><motion.button 
                     onClick={handleApiSync} 
                     disabled={isSyncing} 
                     whileHover={{ scale: isSyncing ? 1 : 1.02, background: 'rgba(16, 185, 129, 0.12)' }}
                     whileTap={{ scale: isSyncing ? 1 : 0.98 }}
                     style={{ 
                       width: '100%', 
                       padding: 28, 
                       borderRadius: 24, 
                       fontSize: 18, 
                       fontWeight: 950, 
                       background: 'rgba(16, 185, 129, 0.05)', 
                       backdropFilter: 'blur(12px)',
                       border: '1px solid rgba(16, 185, 129, 0.25)',
                       color: '#10b981', 
                       cursor: isSyncing ? 'not-allowed' : 'pointer', 
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: 12,
                       boxShadow: '0 8px 32px rgba(16, 185, 129, 0.05)',
                       opacity: isSyncing ? 0.6 : 1,
                       transition: 'background 0.3s, border 0.3s'
                     }}
                  >
                    {isSyncing ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                          <Loader2 size={20} color="#10b981" />
                        </motion.div>
                        <span>{lang === 'tr' ? 'İŞLENİYOR...' : 'PROCESSING...'}</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw size={20} color="#10b981" />
                        <span>{lang === 'tr' ? 'SENKRONİZASYONU BAŞLAT' : 'START SYNCHRONIZATION'}</span>
                      </>
                    )}
                  </motion.button></div></div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div style={{ marginTop: 60 }}>
          <AnimatePresence>
            {filteredData && filteredData.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 {activePath === 1 && filteredData.some(d => d.type === 'BALANCE') && (
                   <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
                     style={{ padding: 40, borderRadius: 40, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
                      <div>
                         <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981', marginBottom: 8, letterSpacing: '0.1em' }}>{lang === 'tr' ? 'TOPLAM AKTİF VARLIK' : 'TOTAL ACTIVE ASSETS'}</div>
                         <div style={{ fontSize: 56, fontWeight: 950 }}>{filteredData.find(d => d.type === 'BALANCE')?.amount}</div>
                         <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 12, fontWeight: 700 }}>{filteredData.find(d => d.type === 'BALANCE')?.raw}</div>
                      </div>
                      <Wallet size={64} color="#10b981" />
                   </motion.div>
                 )}
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><History size={24} color="#64748b" /><h4 style={{ fontSize: 22, fontWeight: 950, color: 'var(--text1)', margin: 0 }}>{lang === 'tr' ? 'Harcama Analizi' : 'Expense Analysis'}</h4></div>
                    <button onClick={handleCalendarSync} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: 16, fontSize: 13, fontWeight: 900, cursor: 'pointer', color: 'var(--text1)' }}><CalendarIcon size={18} color="#6366f1" /> {lang === 'tr' ? 'TAKVİME SENKRONİZE ET' : 'SYNC TO CALENDAR'}</button>
                 </div>
                 {filteredData.filter(d => d.type === 'TRANSACTION').map((tx, idx) => ( 
                   <div key={tx.id || idx} style={{ padding: 32, display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 40, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', borderRadius: 32, marginBottom: 20 }}>
                     <div style={{ fontSize: 13, color: '#94a3b8' }}>{tx.raw}</div><ArrowRight size={18} color="#e2e8f0" /><div style={{ display: 'flex', alignItems: 'center', gap: 24 }}><div style={{ width: 56, height: 56, borderRadius: 18, background: `${tx.color || '#6366f1'}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMap name={tx.icon} color={tx.color || '#6366f1'} /></div><div><div style={{ fontSize: 18, fontWeight: 950, color: 'var(--text1)' }}>{tx.clean}</div><div style={{ fontSize: 10, color: tx.color || '#6366f1', fontWeight: 900, display: 'flex', gap: 8 }}><span>{tx.category}</span><span style={{ opacity: 0.5 }}>•</span><span style={{ fontSize: 9, textTransform: 'uppercase' }}>{tx.source}</span></div></div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 950, color: tx.color || '#ef4444' }}>{tx.amount}</div></div>
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
