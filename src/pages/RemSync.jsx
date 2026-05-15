import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  ShieldCheck, 
  Zap,
  Database,
  FileSearch,
  Layers,
  Search,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Activity,
  Key,
  Unplug,
  ExternalLink,
  Loader2
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function RemSync() {
  const [step, setStep] = useState('setup'); // setup, connect, syncing
  const [nordigenKeys, setNordigenKeys] = useState({ id: '', key: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate Nordigen Handshake
    setTimeout(() => {
      setIsLoading(false);
      setStep('connect');
    }, 2000);
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 60px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, marginTop: 40 }}>
        <div>
          <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 100, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 10, fontWeight: 900, letterSpacing: 1, marginBottom: 16 }}>
            <Activity size={12} /> NORDIGEN (GOCARDLESS) OPEN BANKING
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 40, fontWeight: 950, margin: 0, letterSpacing: '-0.03em' }}>
            REM <span style={{ color: 'var(--accent)' }}>Sync</span> <span style={{ fontSize: 14, opacity: 0.5 }}>v4.2 Live API</span>
          </motion.h1>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginTop: 8 }}>Gerçek Zamanlı Banka Entegrasyonu</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* NORDIGEN SETUP PANEL */}
        <div className="glass" style={{ padding: 40, border: '1px solid var(--accent-dim)', background: 'linear-gradient(135deg, rgba(129,140,248,0.05), transparent)' }}>
           {step === 'setup' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                   <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Key size={24} color="var(--accent)" />
                   </div>
                   <div>
                      <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>API Yetkilendirmesi</h3>
                      <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Nordigen anahtarlarınızı buraya girin.</p>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
                   <div className="glass" style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8 }}>SECRET ID</div>
                      <input 
                        type="password" 
                        placeholder="••••••••-••••-••••-••••-••••••••••••"
                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text1)', fontSize: 14, outline: 'none' }} 
                        value={nordigenKeys.id}
                        onChange={(e) => setNordigenKeys({...nordigenKeys, id: e.target.value})}
                      />
                   </div>
                   <div className="glass" style={{ padding: '16px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', marginBottom: 8 }}>SECRET KEY</div>
                      <input 
                        type="password" 
                        placeholder="••••••••••••••••••••••••••••••••"
                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text1)', fontSize: 14, outline: 'none' }} 
                        value={nordigenKeys.key}
                        onChange={(e) => setNordigenKeys({...nordigenKeys, key: e.target.value})}
                      />
                   </div>
                </div>

                <div className="glass" style={{ padding: 24, marginBottom: 32, background: 'rgba(255,255,255,0.02)' }}>
                   <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                      <Info size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Nordigen ücretsiz Open Banking API sağlar. Anahtarlarınızı <strong>bankaccountdata.gocardless.com</strong> adresinden alabilirsiniz.
                   </p>
                </div>

                <button 
                  onClick={handleConnect}
                  disabled={!nordigenKeys.id || !nordigenKeys.key || isLoading}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '20px', borderRadius: 16, fontWeight: 900, fontSize: 16, gap: 12 }}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                  Nordigen Gateway''e Bağlan
                </button>
             </motion.div>
           )}

           {step === 'connect' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                   <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid #10b981' }}>
                      <CheckCircle2 size={40} color="#10b981" />
                   </div>
                   <h3 style={{ fontSize: 24, fontWeight: 950, marginBottom: 8 }}>Gateway Hazır!</h3>
                   <p style={{ color: 'var(--text2)', fontSize: 14 }}>Nordigen ile güvenli bağlantı kuruldu. Şimdi bankanızı seçin.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
                   {['Garanti BBVA', 'Akbank', 'İş Bankası', 'QNB Finansbank'].map(bank => (
                      <div key={bank} className="glass" style={{ padding: 20, borderRadius: 16, cursor: 'pointer', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                         <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <Globe size={16} />
                         </div>
                         <div style={{ fontSize: 12, fontWeight: 800 }}>{bank}</div>
                      </div>
                   ))}
                </div>

                <button className="btn btn-ghost" onClick={() => setStep('setup')} style={{ width: '100%', fontSize: 13 }}>Geri Dön</button>
             </motion.div>
           )}
        </div>

        {/* SIDE INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
           <div className="glass" style={{ padding: 32 }}>
              <ShieldCheck size={32} color="#10b981" style={{ marginBottom: 20 }} />
              <h4 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>PSD2 Güvenlik Protokolü</h4>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                Nordigen bağlantısı PSD2 (Payment Services Directive 2) uyumludur. Banka şifreniz asla Insomni veya Nordigen tarafından görülmez; doğrudan bankanızın kendi güvenli ekranında yetkilendirme yaparsınız.
              </p>
           </div>

           <div className="glass" style={{ padding: 32 }}>
              <Layers size={32} color="var(--accent)" style={{ marginBottom: 20 }} />
              <h4 style={{ fontSize: 16, fontWeight: 900, marginBottom: 12 }}>90 Günlük Yetki</h4>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                Verdiğiniz yetki 90 gün boyunca geçerlidir. İstediğiniz an yetkiyi bankanızın mobil uygulamasından veya buradan iptal edebilirsiniz.
              </p>
           </div>

           <a 
             href="https://bankaccountdata.gocardless.com/overview/" 
             target="_blank" 
             className="glass" 
             style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--accent)', textDecoration: 'none' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                 <ExternalLink size={18} />
                 <span style={{ fontSize: 13, fontWeight: 900 }}>Nordigen Dashboard''a Git</span>
              </div>
              <ArrowRight size={16} />
           </a>
        </div>

      </div>
    </motion.div>
  );
}
