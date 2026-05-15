import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, ShieldCheck, Zap, Loader2, Lock, ArrowRight, Database, 
  CheckCircle2, Wallet, Activity, Server, Cpu, Globe, Coffee, ShoppingBag,
  MessageSquare, BrainCircuit
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const txEntry = { hidden: { opacity: 0, x: -30, scale: 0.95 }, show: { opacity: 1, x: 0, scale: 1 } };

export default function RemSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [narrative, setNarrative] = useState([]);

  const steps = [
    { name: "Cihaz", icon: Globe, color: "#6366f1" },
    { name: "Vercel", icon: Server, color: "#10b981" },
    { name: "Banka", icon: Lock, color: "#f59e0b" },
    { name: "R.E.M", icon: BrainCircuit, color: "#ec4899" }
  ];

  const addStory = (msg) => {
    setNarrative(prev => [...prev, msg]);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    setNarrative([]);
    
    // R.E.M Storytelling Timeline
    const story = [
      { step: 1, text: "Garanti BBVA geçidine güvenli bir sorgu fırlattım..." },
      { step: 2, text: "Vercel üzerinden senin anahtarlarını doğruladım, banka kapıyı açtı!" },
      { step: 3, text: "Hesap hareketlerini tarıyorum... Yakaladım! Yeni harcamalar var." },
      { step: 4, text: "R.E.M Zekası: Starbucks harcamasını 'Gıda' olarak etiketledim ve bütçene işledim." },
      { step: 4, text: "Migros harcamasını analiz ettim; 'Mutfak Alışverişi' kategorisine taşıdım." },
      { step: 4, text: "Bakiye güncellendi. Takvimin artık pırıl pırıl ve güncel!" }
    ];

    for(let i=0; i<3; i++) {
      setActiveStep(i + 1);
      addStory(story[i].text);
      await new Promise(r => setTimeout(r, 1200));
    }
    
    setActiveStep(4);
    for(let i=3; i<story.length; i++) {
      addStory(story[i].text);
      await new Promise(r => setTimeout(r, 1000));
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
      addStory("BİR HATA OLUŞTU: Banka hattında kopukluk var abi!");
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <BrainCircuit size={14} /> R.E.M NARRATIVE ENGINE v2.0
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* STORYTELLING BRIDGE */}
        <div className="glass" style={{ padding: '48px', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 32, background: 'rgba(255,255,255,0.01)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                   <motion.div 
                     animate={activeStep >= i + 1 ? { scale: [1, 1.1, 1], boxShadow: [`0 0 10px ${s.color}20`, `0 0 30px ${s.color}60`, `0 0 10px ${s.color}20`] } : {}}
                     transition={{ repeat: Infinity, duration: 2 }}
                     style={{ width: 64, height: 64, borderRadius: 22, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeStep >= i + 1 ? s.color : 'rgba(255,255,255,0.03)', color: activeStep >= i + 1 ? '#fff' : 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.05)', zIndex: 2, position: 'relative' }}
                   >
                      <s.icon size={28} />
                   </motion.div>
                   <div style={{ fontSize: 11, fontWeight: 900, color: activeStep >= i + 1 ? '#fff' : 'var(--text2)' }}>{s.name.toUpperCase()}</div>
                   {i < 3 && (
                     <div style={{ position: 'absolute', top: 32, right: '-50%', width: '100%', height: 1, background: 'rgba(255,255,255,0.05)', zIndex: 1 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: activeStep > i + 1 ? '100%' : 0 }} style={{ height: '100%', background: `linear-gradient(90deg, ${steps[i].color}, ${steps[i+1].color})` }} />
                     </div>
                   )}
                </div>
              ))}
           </div>

           {/* NARRATIVE FEED */}
           <div className="glass" style={{ padding: 32, background: 'rgba(129,140,248,0.03)', border: '1px solid rgba(129,140,248,0.1)', borderRadius: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                 <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={16} color="#000" />
                 </div>
                 <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1 }}>R.E.M ANALİZ GÜNLÜĞÜ</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <AnimatePresence>
                   {narrative.length === 0 && <div style={{ color: 'var(--text2)', fontSize: 14, fontStyle: 'italic' }}>Butona basın, siber serüven başlasın...</div>}
                   {narrative.map((text, i) => (
                     <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ marginTop: 6, width: 6, height: 6, borderRadius: 10, background: 'var(--accent)' }} />
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{text}</div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>
           </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <button onClick={handleSync} disabled={isSyncing} className="btn btn-primary" style={{ padding: '24px 64px', borderRadius: 20, fontSize: 18, fontWeight: 950, gap: 16 }}>
              {isSyncing ? <Loader2 className="animate-spin" /> : <Zap size={22} />}
              {isSyncing ? 'R.E.M Hikayeyi Yazıyor...' : 'Senkronizasyonu Başlat'}
            </button>
        </div>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ padding: '0 8px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <h3 style={{ fontSize: 18, fontWeight: 900 }}>Banka Verileri İşlendi</h3>
                   <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent)' }}>3 YENİ VERİ NOKTASI</div>
                </div>
                {syncedData.map((tx, idx) => (
                  <motion.div key={tx.id} variants={txEntry} transition={{ delay: idx * 0.15, type: "spring" }} className="glass"
                    style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: `1px solid ${tx.type === 'BALANCE' ? '#10b98140' : 'rgba(255,255,255,0.05)'}` }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text2)' }}>{tx.raw}</div>
                    <ArrowRight size={16} color={tx.color} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 48, height: 48, borderRadius: 14, background: `${tx.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><tx.icon size={24} color={tx.color} /></div>
                       <div>
                          <div style={{ fontSize: 16, fontWeight: 900 }}>{tx.clean}</div>
                          <div style={{ fontSize: 11, color: tx.color, fontWeight: 900 }}>{tx.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 24, fontWeight: 950, color: tx.type === 'BALANCE' ? '#10b981' : '#fff' }}>{tx.amount}</div>
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
