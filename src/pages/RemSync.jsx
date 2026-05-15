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
  CheckCircle2
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const [step, setStep] = useState('selection'); // selection, garanti_setup, connected
  const [keys, setKeys] = useState({ clientId: '', clientSecret: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleGarantiConnect = () => {
    setIsLoading(true);
    // Simulate Garanti OAuth2 Handshake
    setTimeout(() => {
      setIsLoading(false);
      setStep('connected');
    }, 2000);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40, marginTop: 40, textAlign: 'center' }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 100, background: 'rgba(129,140,248,0.1)', color: 'var(--accent)', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <Activity size={14} /> DIRECT BANKING GATEWAY v1.0
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 56, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
        <p style={{ color: 'var(--text2)', fontSize: 16, marginTop: 12 }}>Aracısız, doğrudan banka bağlantı merkezi.</p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        
        {step === 'selection' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <motion.div 
              whileHover={{ y: -8, borderColor: 'var(--accent)' }}
              onClick={() => setStep('garanti_setup')}
              className="glass" 
              style={{ padding: 40, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}
            >
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Globe size={40} color="#10b981" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Garanti BBVA</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)' }}>API Market üzerinden doğrudan bağlantı kurun.</p>
              <div style={{ marginTop: 24, color: 'var(--accent)', fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                BAĞLAN <ArrowRight size={16} />
              </div>
            </motion.div>

            <motion.div 
              style={{ padding: 40, opacity: 0.5, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}
              className="glass"
            >
              <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Lock size={40} color="var(--text2)" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Diğer Bankalar</h3>
              <p style={{ fontSize: 14, color: 'var(--text2)' }}>Yakında eklenecek...</p>
            </motion.div>
          </div>
        )}

        {step === 'garanti_setup' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: 60, border: '1px solid var(--accent-dim)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
               <div style={{ width: 64, height: 64, borderRadius: 16, background: '#10b98115', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={32} color="#10b981" />
               </div>
               <div>
                  <h2 style={{ fontSize: 28, fontWeight: 950, margin: 0 }}>Garanti BBVA API Gateway</h2>
                  <p style={{ fontSize: 14, color: 'var(--text2)', margin: 0 }}>Lütfen API Market anahtarlarınızı girin.</p>
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
               <div className="glass" style={{ padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8, letterSpacing: 1 }}>CLIENT ID</div>
                  <input 
                    type="password" 
                    placeholder="Garanti Client ID"
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text1)', fontSize: 16, outline: 'none' }} 
                    value={keys.clientId}
                    onChange={(e) => setKeys({...keys, clientId: e.target.value})}
                  />
               </div>
               <div className="glass" style={{ padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8, letterSpacing: 1 }}>CLIENT SECRET</div>
                  <input 
                    type="password" 
                    placeholder="Garanti Client Secret"
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text1)', fontSize: 16, outline: 'none' }} 
                    value={keys.clientSecret}
                    onChange={(e) => setKeys({...keys, clientSecret: e.target.value})}
                  />
               </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
               <div className="glass" style={{ flex: 1, padding: 24, background: 'rgba(16,185,129,0.03)' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 900, marginBottom: 8, color: '#10b981' }}>OAuth 2.0 Güvenliği</h4>
                  <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, margin: 0 }}>
                    Bilgileriniz sadece yerel cihazınızda tutulur ve doğrudan Garanti sunucularına iletilir.
                  </p>
               </div>
               <div className="glass" style={{ flex: 1, padding: 24 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 900, marginBottom: 8 }}>Nasıl Alınır?</h4>
                  <a href="https://apimarket.garantibbva.com.tr/" target="_blank" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                    API Market''e Git <ExternalLink size={12} />
                  </a>
               </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
               <button onClick={() => setStep('selection')} className="btn btn-ghost" style={{ padding: '20px 40px' }}>Geri Dön</button>
               <button 
                 onClick={handleGarantiConnect}
                 disabled={!keys.clientId || !keys.clientSecret || isLoading}
                 className="btn btn-primary" 
                 style={{ flex: 1, padding: '20px', borderRadius: 16, fontWeight: 900, fontSize: 16, gap: 12 }}
               >
                 {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                 Bağlantıyı Doğrula ve Yetkilendir
               </button>
            </div>
          </motion.div>
        )}

        {step === 'connected' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 60, textAlign: 'center', border: '1px solid #10b981' }}>
             <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', border: '2px solid #10b981' }}>
                <CheckCircle2 size={50} color="#10b981" />
             </div>
             <h2 style={{ fontSize: 32, fontWeight: 950, marginBottom: 12 }}>Garanti BBVA Bağlandı</h2>
             <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 48 }}>Hesap hareketleriniz R.E.M tarafından otonom olarak çekilmeye hazır.</p>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 48 }}>
                <div className="glass" style={{ padding: 20 }}>
                   <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8 }}>SON SENK.</div>
                   <div style={{ fontSize: 14, fontWeight: 800 }}>Şimdi</div>
                </div>
                <div className="glass" style={{ padding: 20 }}>
                   <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8 }}>DURUM</div>
                   <div style={{ fontSize: 14, fontWeight: 800, color: '#10b981' }}>Aktif</div>
                </div>
                <div className="glass" style={{ padding: 20 }}>
                   <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8 }}>YETKİ</div>
                   <div style={{ fontSize: 14, fontWeight: 800 }}>90 Gün</div>
                </div>
             </div>

             <button onClick={() => setStep('selection')} className="btn btn-ghost" style={{ fontSize: 13 }}>Bağlantıyı Kes</button>
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
