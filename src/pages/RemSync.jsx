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
  Unplug
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } };

export default function RemSync() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto', position: 'relative' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.05 }} />
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: 60, textAlign: 'center', marginTop: 40 }}>
        <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', borderRadius: 100, background: 'var(--accent-dim)', color: 'var(--accent)', fontSize: 12, fontWeight: 900, letterSpacing: 2, marginBottom: 16 }}>
          <Zap size={14} /> AUTONOMOUS DATA PIPELINE
        </motion.div>
        <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 900, margin: 0, letterSpacing: '-0.03em' }}>
          REM <span style={{ color: 'var(--accent)' }}>Sync</span>
        </motion.h1>
        <motion.p variants={fadeUp} style={{ color: 'var(--text2)', fontSize: 18, maxWidth: 600, margin: '12px auto 0' }}>
          Banka hesaplarını, harcamalarını ve finansal dünyanı R.E.M Zekâsı ile otonom bir şekilde birleştirin.
        </motion.p>
      </div>

      {/* CENTRAL VISUALIZATION */}
      <div style={{ position: 'relative', height: 400, width: '100%', maxWidth: 1000, margin: '0 auto 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* The Core */}
        <motion.div 
          animate={{ boxShadow: ['0 0 20px var(--accent-dim)', '0 0 60px var(--accent)', '0 0 20px var(--accent-dim)'] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ 
            width: 120, height: 120, borderRadius: 32, background: 'var(--bg1)', 
            border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, position: 'relative', overflow: 'hidden'
          }}>
          <Cpu size={48} color="var(--accent)" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)' }} />
        </motion.div>

        {/* Data Source Nodes & Lines */}
        {[
          { icon: Globe, label: 'Banks', pos: { top: '10%', left: '20%' } },
          { icon: FileSearch, label: 'OCR Scan', pos: { bottom: '10%', left: '25%' } },
          { icon: Database, label: 'Cloud', pos: { top: '15%', right: '22%' } },
          { icon: ShieldCheck, label: 'Security', pos: { bottom: '12%', right: '20%' } },
        ].map((node, i) => (
          <React.Fragment key={i}>
            <motion.div 
              variants={fadeUp}
              style={{ 
                position: 'absolute', ...node.pos, padding: '16px 24px', borderRadius: 20, 
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 12, zIndex: 5
              }}>
              <node.icon size={20} color="var(--accent)" />
              <span style={{ fontSize: 13, fontWeight: 800 }}>{node.label}</span>
            </motion.div>
            
            {/* Animated Flow Line (Simplified SVG approach) */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
              <motion.line 
                x1={node.pos.left || (100 - parseFloat(node.pos.right)) + '%'} 
                y1={node.pos.top || (100 - parseFloat(node.pos.bottom)) + '%'} 
                x2="50%" y2="50%"
                stroke="var(--accent)" strokeWidth="1" strokeDasharray="5,5" opacity="0.2"
              />
            </svg>
          </React.Fragment>
        ))}
      </div>

      {/* METHOD CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
        
        <motion.div variants={fadeUp} className="glass" style={{ padding: 40, border: '1px solid var(--accent-dim)' }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <RefreshCw size={24} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>Open Banking Sync</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>
            Bankalarınızla kurulan doğrudan ve güvenli köprü. Harcamalarınız R.E.M''e anlık olarak akar, manuel girişe gerek kalmaz.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass" style={{ padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <FileSearch size={24} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>Visual Intelligence</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>
            Dekontları ve PDF ekstreleri saniyeler içinde analiz eden dijital göz. R.E.M karmaşık verileri anında anlamlı harcamalara dönüştürür.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="glass" style={{ padding: 40 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <ShieldCheck size={24} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 12 }}>End-to-End Encryption</h3>
          <p style={{ color: 'var(--text2)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>
            Verileriniz R.E.M''in güvenli sinir ağından çıkmaz. AES-256 standartlarında korunan, size özel bir veri kalesi.
          </p>
        </motion.div>

      </div>

      {/* FOOTER CALL TO ACTION */}
      <motion.div variants={fadeUp} style={{ textAlign: 'center', marginTop: 80, paddingBottom: 40 }}>
         <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>REM Sync Vizyonuna Katılın</div>
         <button className="btn btn-primary" style={{ padding: '16px 48px', borderRadius: 100, fontWeight: 800, fontSize: 16 }}>
            Entegrasyonu Başlat
         </button>
      </motion.div>

    </motion.div>
  );
}
