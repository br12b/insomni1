import React from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  RefreshCw, 
  FileSearch, 
  Globe, 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  Plus
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Efrozu() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
          Efrozu <span style={{ color: 'var(--accent)' }}>Data Hub</span>
        </h1>
        <p style={{ color: 'var(--text2)', margin: '4px 0 0 0' }}>The Big Vision: Autonomous Financial Data Aggregation</p>
      </div>

      {/* DATA FLOW HERO */}
      <div className="glass" style={{ 
        marginBottom: 32, padding: 48, borderRadius: 32, background: 'linear-gradient(135deg, rgba(129,140,248,0.05), transparent)', 
        position: 'relative', overflow: 'hidden', border: '1px solid rgba(129,140,248,0.2)' 
      }}>
        {/* Animated Particles (CSS) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.1 }}>
           <div className="data-beam" style={{ position: 'absolute', top: '20%', left: '-10%', width: '120%', height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'flow 3s linear infinite' }} />
           <div className="data-beam" style={{ position: 'absolute', top: '50%', left: '-10%', width: '120%', height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'flow 5s linear infinite' }} />
           <div className="data-beam" style={{ position: 'absolute', top: '80%', left: '-10%', width: '120%', height: 2, background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'flow 4s linear infinite' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: '0 0 30px rgba(129,140,248,0.5)' }}>
            <Database size={32} color="white" />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>Autonomous Ingestion</h2>
          <p style={{ fontSize: 16, color: 'var(--text1)', lineHeight: 1.6, margin: 0 }}>
            Insomni''nin vizyonu manuel veri girişini tamamen ortadan kaldırmaktır. Efrozu ile bankalarınız, faturalarınız ve harcamalarınız otonom bir şekilde sisteme akar.
          </p>
        </div>
      </div>

      {/* CORE MODULES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Module 1: Open Banking */}
        <motion.div variants={fadeUp} className="glass" style={{ padding: 32, border: '1px solid var(--accent-dim)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} color="var(--accent)" />
            </div>
            <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '4px 10px', borderRadius: 100 }}>VISIONARY</span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Open Banking Feed</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
            Tüm banka hesaplarını tek bir havuzda topla. R.E.M harcamalarını gerçek zamanlı takip etsin.
          </p>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', gap: 8, border: '1px dashed var(--glass-border)' }}>
             <Plus size={16} /> Connect Your Bank
          </button>
        </motion.div>

        {/* Module 2: Receipt & PDF Scan */}
        <motion.div variants={fadeUp} className="glass" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSearch size={24} color="#10b981" />
            </div>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Intelligent Scanning</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
            Dekontları veya PDF ekstreleri sürükle, R.E.M saniyeler içinde tüm harcamaları kategorize etsin.
          </p>
          <div style={{ 
            height: 80, border: '2px dashed var(--glass-border)', borderRadius: 12, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', fontSize: 12 
          }}>
            Drop statement here...
          </div>
        </motion.div>

        {/* Module 3: Agentic Pipeline */}
        <motion.div variants={fadeUp} className="glass" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={24} color="#f59e0b" />
            </div>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Auto-Sync Pipeline</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 24 }}>
            Sistem arka planda banka verilerinle senkronize kalsın. Manuel girişe son ver.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ width: '40%', height: '100%', background: '#f59e0b' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 800 }}>PENDING SETUP</span>
          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes flow {
          0% { transform: translateX(-100%); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
}
