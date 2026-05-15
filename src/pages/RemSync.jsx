import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Loader2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  CreditCard,
  Wallet
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncedData([]);
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.status === 'Connected') {
        setTimeout(() => {
          const accounts = data.accounts.map(acc => ({
            id: Math.random(),
            raw: acc.IBAN,
            clean: "Garanti Mevduat Hesabı",
            amount: acc.balances.find(b => b.type === 'AvailableBalance')?.Amount || "0.00",
            category: "VARLIK",
            icon: Wallet
          }));
          setSyncedData(accounts);
          setIsSyncing(false);
        }, 1500);
      } else {
        alert('Hata: ' + data.error);
        setIsSyncing(false);
      }
    } catch (err) {
      alert('Sistem Hatası: Sunucu bağlantısı kesildi.');
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <CheckCircle2 size={14} /> GARANTI BBVA DATA LINE ACTIVE
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid #10b981', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), transparent)', marginBottom: 40 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 8 }}>Otonom Veri Hattı</h2>
                 <p style={{ color: 'var(--text2)', fontSize: 14 }}>Bankanızdan gerçek zamanlı bakiye ve hareket bilgileri çekilmeye hazır.</p>
              </div>
              <button onClick={handleSync} disabled={isSyncing} className="btn btn-primary" style={{ padding: '20px 40px', borderRadius: 16, fontSize: 16, fontWeight: 900, gap: 12 }}>
                {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
                {isSyncing ? 'Veriler Çekiliyor...' : 'Bakiyeleri Güncelle'}
              </button>
           </div>
           {isSyncing && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                   <div className="animate-spin-slow" style={{ color: 'var(--accent)' }}><Database size={24} /></div>
                   <div style={{ fontSize: 13, fontWeight: 800 }}>R.E.M Otonom Analiz: <span style={{ color: 'var(--accent)' }}>Hesap bakiyeleri doğrulanıyor...</span></div>
                </div>
             </motion.div>
           )}
        </div>

        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8, paddingLeft: 8 }}>Aktif Hesaplarınız</h3>
                {syncedData.map((acc) => (
                  <div key={acc.id} className="glass" style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.5fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: '1px solid #10b981' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: 'var(--text2)' }}>{acc.raw}</div>
                    <ArrowRight size={16} color="#10b981" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <acc.icon size={24} color="#10b981" />
                       </div>
                       <div>
                          <div style={{ fontSize: 16, fontWeight: 900 }}>{acc.clean}</div>
                          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>{acc.category}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 22, fontWeight: 950, color: '#10b981' }}>{acc.amount} ₺</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)' }}>GÜNCEL BAKİYE</div>
                    </div>
                  </div>
                ))}
             </motion.div>
           )}
        </AnimatePresence>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40 }}>
           <div className="glass" style={{ padding: 32 }}>
              <ShieldCheck size={24} color="#10b981" style={{ marginBottom: 16 }} />
              <h4 style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>Güvenli Veri Akışı</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Banka verileriniz uçtan uca şifreli protokollerle çekilmektedir.</p>
           </div>
           <div className="glass" style={{ padding: 32 }}>
              <CreditCard size={24} color="var(--accent)" style={{ marginBottom: 16 }} />
              <h4 style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>Kart Hareketleri</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Kredi kartı dönem içi harcamalarınız da otonom olarak işlenmektedir.</p>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
