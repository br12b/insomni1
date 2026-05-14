import React from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw, 
  Database, 
  FileSearch, 
  Globe, 
  ShieldCheck, 
  Zap,
  Cpu,
  Unplug,
  Waves
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

const DataPacket = ({ delay, x1, y1, x2, y2 }) => (
  <motion.div
    initial={{ left: x1, top: y1, opacity: 0 }}
    animate={{ 
      left: [x1, x2], 
      top: [y1, y2], 
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 0.5]
    }}
    transition={{ duration: 3, repeat: Infinity, delay, ease: "linear" }}
    style={{ 
      position: 'absolute', width: 6, height: 6, borderRadius: '50%', 
      background: 'var(--accent)', boxShadow: '0 0 12px var(--accent)', zIndex: 3
    }}
  />
);

export default function RemSync() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto', position: 'relative' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, var(--accent-dim) 0%, transparent 70%)', filter: 'blur(100px)', opacity: 0.08 }} />
        {/* Abstract Grid Lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(129,140,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: 80, textAlign: 'center', marginTop: 40, position: 'relative', zIndex: 10 }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 100, background: 'rgba(129,140,248,0.1)', border: '1px solid var(--accent-dim)', color: 'var(--accent)', fontSize: 11, fontWeight: 900, letterSpacing: 2, marginBottom: 20 }}>
          <Zap size={14} /> NEURAL SYNC PROTOCOL v2.4
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(40px, 6vw, 80px)', fontWeight: 900, margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>
          REM <span style={{ color: 'var(--accent)', textShadow: '0 0 30px rgba(129,140,248,0.3)' }}>Sync</span>
        </motion.h1>
        <motion.p variants={fadeUp} style={{ color: 'var(--text2)', fontSize: 19, maxWidth: 650, margin: '20px auto 0', lineHeight: 1.6 }}>
          Finansal evreninizi R.E.M Zekâsı ile senkronize edin. Verileriniz manuel giriş zahmetinden kurtulup otonom bir akışa dönüşsün.
        </motion.p>
      </div>

      {/* CENTRAL ENRICHED VISUALIZATION */}
      <div style={{ position: 'relative', height: 500, width: '100%', maxWidth: 1100, margin: '0 auto 100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Rotating Outer Rings */}
        {[0, 1, 2].map(i => (
          <motion.div 
            key={i}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
            style={{ 
              position: 'absolute', width: 220 + i * 80, height: 220 + i * 80, 
              borderRadius: '50%', border: '1px dashed rgba(129,140,248,0.1)',
              zIndex: 1
            }} 
          />
        ))}

        {/* The Core Processing Unit */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <motion.div 
            animate={{ scale: [1, 1.05, 1], boxShadow: ['0 0 20px var(--accent-dim)', '0 0 80px var(--accent)', '0 0 20px var(--accent-dim)'] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ 
              width: 140, height: 140, borderRadius: 40, background: 'var(--bg1)', 
              border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
            <Cpu size={56} color="var(--accent)" />
            {/* Core Pulse Effect */}
            <motion.div 
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: '4px solid var(--accent)' }}
            />
          </motion.div>
        </div>

        {/* Data Source Orbs */}
        {[
          { icon: Globe, label: 'Global Banks', pos: { top: '5%', left: '15%' }, delay: 0 },
          { icon: FileSearch, label: 'Vision OCR', pos: { bottom: '5%', left: '18%' }, delay: 0.5 },
          { icon: Database, label: 'Cloud Vault', pos: { top: '8%', right: '15%' }, delay: 1 },
          { icon: ShieldCheck, label: 'Crypto Feed', pos: { bottom: '10%', right: '18%' }, delay: 1.5 },
        ].map((node, i) => (
          <React.Fragment key={i}>
            <motion.div 
              variants={fadeUp}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                position: 'absolute', ...node.pos, padding: '20px 28px', borderRadius: 24, 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 15,
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <node.icon size={22} color="var(--accent)" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text1)' }}>{node.label}</span>
            </motion.div>
            
            {/* Animated Data Packets Flowing to Core */}
            <DataPacket delay={node.delay} x1={node.pos.left || (100 - parseFloat(node.pos.right)) + '%'} y1={node.pos.top || (100 - parseFloat(node.pos.bottom)) + '%'} x2="50%" y2="50%" />
            <DataPacket delay={node.delay + 1} x1={node.pos.left || (100 - parseFloat(node.pos.right)) + '%'} y1={node.pos.top || (100 - parseFloat(node.pos.bottom)) + '%'} x2="50%" y2="50%" />
            
            {/* SVG Connector Lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
              <motion.line 
                x1={node.pos.left || (100 - parseFloat(node.pos.right)) + '%'} 
                y1={node.pos.top || (100 - parseFloat(node.pos.bottom)) + '%'} 
                x2="50%" y2="50%"
                stroke="var(--accent)" strokeWidth="1.5" opacity="0.1"
              />
            </svg>
          </React.Fragment>
        ))}
      </div>

      {/* METHOD CARDS (Richly Styled) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32, maxWidth: 1200, margin: '0 auto' }}>
        
        <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="glass" style={{ padding: 48, border: '1px solid var(--accent-dim)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}><RefreshCw size={120} color="var(--accent)" /></div>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <RefreshCw size={28} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Open Banking Sync</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
            Uluslararası bankacılık standartları ile hesaplarınıza doğrudan erişim. Harcamalarınız R.E.M''in zekâsı ile milisaniyeler içinde senkronize olur.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="glass" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}><FileSearch size={120} color="#10b981" /></div>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <FileSearch size={28} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Vision Intelligence</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
            Kağıt faturalar, PDF ekstreler veya ekran görüntüleri fark etmez. Gelişmiş OCR motorumuz her detayı yakalar ve anlamlandırır.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="glass" style={{ padding: 48, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05 }}><ShieldCheck size={120} color="#f59e0b" /></div>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <ShieldCheck size={28} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Neural Fortress</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
            Verileriniz asla anonimleştirilmeden dışarı çıkmaz. R.E.M''in sinir ağında korunan, uçtan uca şifreli ve sarsılmaz bir veri kalesi.
          </p>
        </motion.div>

      </div>

      <motion.div variants={fadeUp} style={{ textAlign: 'center', marginTop: 100, paddingBottom: 60 }}>
         <button className="btn btn-primary" style={{ padding: '20px 60px', borderRadius: 100, fontWeight: 900, fontSize: 18, boxShadow: '0 10px 40px rgba(129,140,248,0.4)' }}>
            REM Sync''i Aktif Et
         </button>
      </motion.div>

    </motion.div>
  );
}
