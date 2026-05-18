import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';
import AIChat from '../components/dashboard/AIChat';
import { useLanguage } from '../context/LanguageContext';

export default function Chat({ salaryData, expensesData }) {
  const { lang } = useLanguage();

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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 240px)', minHeight: 500, padding: '0 40px 40px 40px' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1, opacity: 0.03, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(120px)' }} />
      </div>

      <div style={{ display: 'flex', gap: 32, height: '100%', minHeight: 0 }}>
        
        {/* LEFT SIDE - CONTEXT & STATS (Clean, Reverted Sidebar) */}
        <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15 }}>
              <img src="/rem_avatar.webp" alt="R.E.M" style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                transform: 'scale(2.2)', 
                filter: 'drop-shadow(0 0 10px rgba(129,140,248,0.3))' 
              }} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>R.E.M AI</h1>
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Powered by <span style={{ color: 'var(--accent)', fontWeight: 800 }}>Gemini Flash 3.1</span></p>
            </div>
          </div>



          <div className="glass" style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
            <div className="glass" style={{ padding: 20, border: '1px solid var(--accent-dim)', background: 'linear-gradient(to bottom right, rgba(129,140,248,0.1), transparent)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                {lang === 'tr' ? 'Vizyonumuz' : 'Our Vision'}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text1)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                {lang === 'tr'
                  ? '"Insomni, atıl nakdin sadece bir rakam değil, kaçırılmış bir gelecek olduğu inancıyla doğdu. R.E.M ile amacımız, finansal verilerinizdeki her bir saniyeyi değere dönüştürmek, size paranın gerçek zamanlı maliyetini göstererek finansal özgürlüğünüzü optimize etmek ve atıl bakiyelerinizi otonom olarak korumaktır. Unutmayın, hayatınızdaki fırsatları kaçırmayın!"'
                  : '"Insomni was born from the belief that idle cash is not just a number, but a missed future. Our mission with R.E.M is to transform every second of your financial data into value, optimizing your financial freedom by showing the real-time cost of money and autonomously protecting your idle balances. Remember, don\'t miss the opportunities in your life!"'}
              </p>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>
              {lang === 'tr' ? 'Yapay Zeka Yetenekleri' : 'AI Capabilities'}
            </h3>
            
            <div style={{ display: 'flex', gap: 10 }}>
              <Zap size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 12 }}>
                <strong>{lang === 'tr' ? 'V.R.E.M Canlı Subagent' : 'Subagent V.R.E.M'}</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text2)', lineHeight: 1.4 }}>
                  {lang === 'tr' 
                    ? 'Canlı TEFAS verilerine anında erişerek atıl nakdiniz için en kazançlı para piyasası fonlarını sorgular.' 
                    : 'Instantly scans live TEFAS market data to secure your idle cash in top-performing money market funds.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 12 }}>
                <strong>{lang === 'tr' ? 'Senaryo Simülasyonu' : 'Scenario Simulation'}</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text2)', lineHeight: 1.4 }}>
                  {lang === 'tr' 
                    ? 'Birikim hedeflerinize ve gelecekteki harcama planlarınıza göre bütçe simülasyonları gerçekleştirir.'
                    : 'R.E.M can simulate your expenses based on your savings and future financial goals.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <Shield size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: 12 }}>
                <strong>{lang === 'tr' ? 'Hedef ve Planlama' : 'Goal Planning'}</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text2)', lineHeight: 1.4 }}>
                  {lang === 'tr'
                    ? '"iPad almak istiyorum" gibi bir hedef girin, size günlük özel bir tasarruf planı sunsun.'
                    : 'Set a target like "iPad" and ask R.E.M for a detailed daily saving strategy.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - THE CHAT (Stretched fully downwards, premium and massive) */}
        <div className="glass" style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          border: '1px solid var(--glass-border)', 
          background: 'rgba(255,255,255,0.02)', 
          padding: 32, 
          borderRadius: 'var(--r-lg)',
          minWidth: 0,
          height: '100%'
        }}>
          <AIChat financialData={financialData} />
        </div>

      </div>
    </div>
  );
}
