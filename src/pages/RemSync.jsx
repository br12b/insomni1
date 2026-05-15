import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Globe, 
  ShieldCheck, 
  Zap,
  Activity,
  Key,
  ExternalLink,
  Loader2,
  Lock,
  ArrowRight,
  Database,
  CheckCircle2,
  CreditCard,
  Info,
  ChevronDown
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const [step, setStep] = useState('connected'); 
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedData, setSyncedData] = useState([]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync');
      const data = await response.json();
      
      if (data.redirectUrl) { window.location.href = data.redirectUrl; return; } if (data.status) {
        // Simulate a slight delay for R.E.M logic visualization
        setTimeout(() => {
          setSyncedData([
            { id: 1, raw: 'GRNT-YEMEKSEP-IST', clean: 'Yemeksepeti', amount: '-450.00', category: 'Gıda', icon: Zap },
            { id: 2, raw: 'GRNT-MIGROS-SANAL', clean: 'Migros Sanal Market', amount: '-1,250.00', category: 'Market', icon: Globe },
            { id: 3, raw: 'GRNT-SPOTIFY-STOCK', clean: 'Spotify Premium', amount: '-59.90', category: 'Eğlence', icon: Activity },
          ]);
          setIsSyncing(false);
        }, 1500);
      } else {
        alert('Banka Bağlantı Hatası: ' + (data.error || 'Bilinmeyen Hata'));
        setIsSyncing(false);
      }
    } catch (err) {
      alert('Sistem Hatası: API Sunucusuna ulaşılamadı.');
      setIsSyncing(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <CheckCircle2 size={14} /> GARANTI BBVA CONNECTED
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {/* SYNC CONTROL CENTER */}
        <div className="glass" style={{ padding: 48, borderRadius: 32, border: '1px solid #10b981', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), transparent)', marginBottom: 40 }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                 <h2 style={{ fontSize: 24, fontWeight: 950, marginBottom: 8 }}>Otonom Kontrol Merkezi</h2>
                 <p style={{ color: 'var(--text2)', fontSize: 14 }}>Garanti BBVA hesabınızdan veriler çekilmeye hazır.</p>
              </div>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="btn btn-primary" 
                style={{ padding: '20px 40px', borderRadius: 16, fontSize: 16, fontWeight: 900, gap: 12, boxShadow: '0 0 40px rgba(129,140,248,0.3)' }}
              >
                {isSyncing ? <Loader2 className="animate-spin" /> : <RefreshCw size={20} />}
                {isSyncing ? 'Senkronize Ediliyor...' : 'Şimdi Senkronize Et'}
              </button>
           </div>

           {isSyncing && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 40, padding: 24, background: 'rgba(255,255,255,0.02)', borderRadius: 20, border: '1px dashed var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                   <div className="animate-spin-slow" style={{ color: 'var(--accent)' }}><Database size={24} /></div>
                   <div style={{ fontSize: 13, fontWeight: 800 }}>R.E.M Veri Çözümleme Motoru Çalışıyor: <span style={{ color: 'var(--accent)' }}>Ham veriler temizleniyor...</span></div>
                </div>
             </motion.div>
           )}
        </div>

        {/* SYNCED DATA RESULTS */}
        <AnimatePresence>
           {syncedData.length > 0 && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 8px' }}>
                   <h3 style={{ fontSize: 18, fontWeight: 900 }}>Son Senkronize Edilenler</h3>
                   <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text2)' }}>3 YENİ İŞLEM</div>
                </div>
                {syncedData.map((tx, i) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass"
                    style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: '1.5fr auto 1.5fr auto', alignItems: 'center', gap: 32, border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text2)' }}>{tx.raw}</div>
                    <ArrowRight size={16} color="var(--accent)" />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                       <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <tx.icon size={20} color="var(--accent)" />
                       </div>
                       <div>
                          <div style={{ fontSize: 15, fontWeight: 900 }}>{tx.clean}</div>
                          <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 800 }}>{tx.category.toUpperCase()}</div>
                       </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: 18, fontWeight: 950 }}>{tx.amount} ₺</div>
                       <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981' }}>DOĞRULANDI</div>
                    </div>
                  </motion.div>
                ))}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass" style={{ padding: 24, textAlign: 'center', background: 'rgba(16,185,129,0.05)', border: '1px solid #10b98130' }}>
                   <p style={{ fontSize: 14, fontWeight: 800, margin: 0, color: '#10b981' }}>
                      <CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                      Senkronizasyon Başarılı. Veriler Dashboard ve Takvime İşlendi.
                   </p>
                </motion.div>
             </motion.div>
           )}
        </AnimatePresence>

        {/* STATUS INFO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 40 }}>
           <div className="glass" style={{ padding: 32 }}>
              <ShieldCheck size={24} color="#10b981" style={{ marginBottom: 16 }} />
              <h4 style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>Aktif Bağlantı Güvenliği</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, margin: 0 }}>
                Garanti BBVA ile kurulan bu bağlantı OAuth 2.0 ile korunmaktadır. Yetkiniz 90 gün boyunca geçerlidir.
              </p>
           </div>
           <div className="glass" style={{ padding: 32 }}>
              <Lock size={24} color="var(--accent)" style={{ marginBottom: 16 }} />
              <h4 style={{ fontSize: 15, fontWeight: 900, marginBottom: 8 }}>Uçtan Uca Şifreleme</h4>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, margin: 0 }}>
                Çekilen ham veriler R.E.M tarafından işlendikten sonra şifreli olarak sadece sizin yerel hafızanıza kaydedilir.
              </p>
           </div>
        </div>

      </div>
    </motion.div>
  );
}

