import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  ShieldCheck, 
  Settings2, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import AIChat from '../components/dashboard/AIChat';
import { useLanguage } from '../context/LanguageContext';
import AnimatedCounter from '../components/ui/AnimatedCounter';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Chat({ salaryData, expensesData }) {
  const { lang, t } = useLanguage();
  const [strictness, setStrictness] = useState(50); // 0: Relaxed, 100: Extreme saving

  const hasData = salaryData && expensesData && expensesData.length > 0;
  const income = parseFloat(salaryData?.income || 0);
  const totalExpense = expensesData ? expensesData.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) : 0;
  const currentNet = income - totalExpense;

  // Projection Logic
  const projections = useMemo(() => {
    if (!hasData) return null;
    const monthlySaving = currentNet * (0.5 + (strictness / 200)); // Base saving + strictness bonus
    const annualRate = 0.51; // Market rate
    const monthlyRate = annualRate / 12;

    const calculateWealth = (years) => {
      const months = years * 12;
      // Formula: P * (1+r)^n + PMT * [((1+r)^n - 1) / r]
      const futureValue = (monthlySaving * (Math.pow(1 + monthlyRate, months) - 1)) / monthlyRate;
      return Math.round(futureValue);
    };

    return {
      five: calculateWealth(5),
      ten: calculateWealth(10),
      twenty: calculateWealth(20),
      monthlySaving: Math.round(monthlySaving)
    };
  }, [hasData, currentNet, strictness]);

  const financialContext = hasData ? {
    salary: salaryData,
    expenses: expensesData,
    totalExpense: totalExpense,
    netBalance: currentNet,
    projections
  } : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
            Intelligence <span style={{ color: 'var(--accent)' }}>Hub</span>
          </h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0 0' }}>R.E.M Advanced Financial Projection & Analysis</p>
        </div>
        <div className="glass" style={{ padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
          NEURAL NETWORK ACTIVE
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 24, flex: 1 }}>
        
        {/* LEFT: 4-CARD MATRIX */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 20 }}>
          
          {/* Card 1: Cognitive Network */}
          <motion.div variants={fadeUp} className="glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Brain size={24} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Cognitive Network</h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, flex: 1 }}>
              {lang === 'tr' ? 'Tüm finansal verilerin mikroçip çekirdeğinde birleştirilip analiz ediliyor.' : 'Unifies and analyzes all data in a microchip core.'}
            </p>
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text2)', marginBottom: 4 }}>DATA NODES</div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>{expensesData.length + 2}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text2)', marginBottom: 4 }}>UPLINK</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--accent)' }}>99.9%</div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Predictive Flow (Projections) */}
          <motion.div variants={fadeUp} className="glass" style={{ padding: 32, background: 'linear-gradient(135deg, rgba(129,140,248,0.1), transparent)' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <TrendingUp size={24} color="#10b981" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Predictive Flow</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '5 Years', val: projections?.five },
                { label: '10 Years', val: projections?.ten },
                { label: '20 Years', val: projections?.twenty },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{p.label}</span>
                  <span style={{ fontSize: 15, fontWeight: 900 }}>
                    {p.val ? p.val.toLocaleString() : '---'} {salaryData?.currency}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 12, fontSize: 11, color: 'var(--text2)', display: 'flex', gap: 8 }}>
              <Info size={14} />
              Calculated based on current savings rate and 51% annual yield.
            </div>
          </motion.div>

          {/* Card 3: Fine-Tune Dial */}
          <motion.div variants={fadeUp} className="glass" style={{ padding: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Settings2 size={24} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Fine-Tune Dial</h3>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>
              Adjust R.E.M''s saving strictness to see future impact.
            </p>
            <input 
              type="range" min="0" max="100" value={strictness} 
              onChange={(e) => setStrictness(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', marginBottom: 12 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800 }}>
              <span>RELAXED</span>
              <span style={{ color: 'var(--accent)' }}>{strictness}% AGGRESSIVE</span>
            </div>
          </motion.div>

          {/* Card 4: Trust Matrix */}
          <motion.div variants={fadeUp} className="glass" style={{ padding: 32 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <ShieldCheck size={24} color="var(--accent)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>Trust Matrix</h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
              Privacy-first logic ensuring your financial data never leaves your neural ecosystem.
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
              {['AES-256', 'LOCAL-AI', 'SSL'].map(tag => (
                <span key={tag} style={{ fontSize: 9, fontWeight: 900, padding: '4px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.05)', color: 'var(--text2)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

        </div>

        {/* RIGHT: AI PERSONA & CHAT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Persona Card */}
          <motion.div variants={fadeUp} className="glass" style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: 20 }}>
              <div style={{ width: 220, height: 220, position: 'relative', marginBottom: 30 }}>
                <img src="/rem_profile.png" alt="R.E.M" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 30px rgba(129,140,248,0.4))' }} />
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid var(--accent)', opacity: 0.3 }} 
                />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>R.E.M Intelligence</h2>
              <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 800, marginTop: 4, letterSpacing: 2 }}>GEN-IV ARCHITECTURE</p>
            </div>

            <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
               <AIChat financialData={financialContext} minimal />
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
