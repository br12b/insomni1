import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Shield, Zap } from 'lucide-react';
import AIChat from '../components/dashboard/AIChat';
import { useLanguage } from '../context/LanguageContext';

export default function Chat({ salaryData, expensesData }) {
  const { lang, t } = useLanguage();

  const hasData = salaryData && expensesData && expensesData.length > 0;

  // Prepare financial context for R.E.M
  const totalExpense = expensesData ? expensesData.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0) : 0;
  const netBalance = parseFloat(salaryData?.income || 0) - totalExpense;
  
  const financialData = hasData ? {
    salary: salaryData,
    expenses: expensesData,
    totalExpense: totalExpense,
    netBalance: netBalance,
    opportunityCost: (netBalance * 0.51) / 12
  } : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', padding: '0 40px 40px 40px' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.03, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(120px)' }} />
      </div>

      <div style={{ display: 'flex', gap: 32, height: '100%' }}>
        
        {/* LEFT SIDE - CONTEXT & STATS */}
        <div style={{ width: 350, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
              <img src="/rem_avatar.png" alt="R.E.M" style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                transform: 'scale(2.2)', // 2x and a bit more for impact
                filter: 'drop-shadow(0 0 10px rgba(129,140,248,0.3))' 
              }} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>R.E.M AI</h1>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Personal Financial Intelligence</p>
            </div>
          </div>

          <div className="glass" style={{ padding: 20, border: hasData ? '1px solid var(--accent-dim)' : '1px dashed var(--glass-border)', opacity: hasData ? 1 : 0.6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={12}/> {hasData ? 'Analysis Context' : 'Veri Bekleniyor'}
            </div>
            {hasData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                   <span style={{ color: 'var(--text2)' }}>Income:</span>
                   <span style={{ fontWeight: 700 }}>{salaryData?.income} {salaryData?.currency}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                   <span style={{ color: 'var(--text2)' }}>Expenses:</span>
                   <span style={{ fontWeight: 700, color: '#f87171' }}>{totalExpense.toLocaleString()} {salaryData?.currency}</span>
                 </div>
                 <div style={{ height: 1, background: 'var(--glass-border)' }} />
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                   <span style={{ color: 'var(--text2)' }}>Net Savings:</span>
                   <span style={{ fontWeight: 700, color: 'var(--green)' }}>{netBalance.toLocaleString()} {salaryData?.currency}</span>
                 </div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'center', padding: '10px 0' }}>
                {lang === 'tr' ? 'HenÃ¼z bir finansal analiz yapÄ±lmadÄ±.' : 'No financial analysis performed yet.'}
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="glass" style={{ padding: 20, border: '1px solid var(--accent-dim)', background: 'linear-gradient(to bottom right, rgba(129,140,248,0.1), transparent)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Our Vision</h3>
            <p style={{ fontSize: 12, color: 'var(--text1)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              "Insomni, atÄ±l nakdin sadece bir rakam deÄŸil, kaÃ§Ä±rÄ±lmÄ±ÅŸ bir gelecek olduÄŸu inancÄ±yla doÄŸdu. R.E.M ile amacÄ±mÄ±z, finansal verilerinizdeki her bir saniyeyi deÄŸere dÃ¶nÃ¼ÅŸtÃ¼rmek ve size paranÄ±n gerÃ§ek zamanlÄ± maliyetini gÃ¶stererek finansal Ã¶zgÃ¼rlÃ¼ÄŸÃ¼nÃ¼zÃ¼ optimize etmektir."
            </p>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>AI Capabilities</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <Sparkles size={16} color="var(--accent)" />
              <div style={{ fontSize: 12 }}>
                <strong>Scenario Simulation</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text2)' }}>R.E.M can simulate your expenses based on your savings goals.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Shield size={16} color="var(--accent)" />
              <div style={{ fontSize: 12 }}>
                <strong>Goal Planning</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text2)' }}>Set a target like "iPad" and ask for a daily saving plan.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - THE CHAT */}
        <div className="glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)', padding: 32, borderRadius: 'var(--r-lg)' }}>
          <AIChat financialData={financialData} />
        </div>

      </div>
    </div>
  );
}