import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Database, 
  FileSearch, 
  Globe, 
  ShieldCheck, 
  Zap,
  CreditCard,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const sampleTransactions = [
    { id: 1, name: 'Migros Ticaret', amount: '-245.50', time: '14:20', type: 'Market' },
    { id: 2, name: 'Spotify Premium', amount: '-59.90', time: '11:05', type: 'Eğlence' },
    { id: 3, name: 'Akbank Maaş Ödemesi', amount: '+45,000', time: '09:00', type: 'Gelir' },
    { id: 4, name: 'Shell Akaryakıt', amount: '-1,200', time: 'Dün', type: 'Ulaşım' },
    { id: 5, name: 'Netflix Subscription', amount: '-159', time: 'Dün', type: 'Eğlence' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto' }}>
      
      {/* HEADER - CLEAN & PRO */}
      <div style={{ marginBottom: 40, marginTop: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 16, margin: '8px 0 0 0' }}>
          Otomatik Hesap Akışı ve Akıllı İşlem Takibi
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 32, alignItems: 'start' }}>
        
        {/* LEFT: COMPACT SYNC VISUALIZATION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass" style={{ padding: 40, position: 'relative', overflow: 'hidden', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Minimal Flow Animation */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 30 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Globe size={24} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>BANKALAR</div>
              </div>

              <div style={{ position: 'relative', width: 100, height: 2, background: 'rgba(255,255,255,0.1)' }}>
                 <motion.div 
                    animate={{ left: ['0%', '100%'] }} 
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ position: 'absolute', top: -2, width: 20, height: 6, background: 'var(--accent)', borderRadius: 10, boxShadow: '0 0 10px var(--accent)' }} 
                 />
              </div>

              <div style={{ textAlign: 'center' }}>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--bg1)', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <RefreshCw size={32} color="var(--accent)" />
                </motion.div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--accent)' }}>AKTİF AKIŞ</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="glass" style={{ padding: 24 }}>
              <ShieldCheck size={20} color="var(--accent)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>Uçtan Uca Güvenlik</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>AES-256 Bankacılık Standartları</div>
            </div>
            <div className="glass" style={{ padding: 24 }}>
              <Zap size={20} color="var(--accent)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>Anlık Senkronizasyon</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>Milisaniyeler İçinde İşleme</div>
            </div>
          </div>
        </div>

        {/* RIGHT: LIVE TRANSACTION STREAM */}
        <div className="glass" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>Canlı İşlem Akışı</h3>
             <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> BAĞLI
             </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sampleTransactions.map((tx) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: tx.id * 0.1 }}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px', 
                  background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} color="var(--text2)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{tx.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{tx.type} • {tx.time}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: tx.amount.startsWith('+') ? '#10b981' : 'var(--text0)' }}>
                  {tx.amount} ₺
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: 20 }}>
             <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 20 }}>
                Bu işlemler bankanızdan otonom olarak çekilip R.E.M tarafından analiz edilir.
             </p>
             <button className="btn btn-primary btn-sm" style={{ padding: '12px 32px', borderRadius: 100, fontWeight: 800 }}>
                Yeni Hesap Bağla
             </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
