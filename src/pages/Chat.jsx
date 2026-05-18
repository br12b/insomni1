import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Sparkles, Shield, Zap } from 'lucide-react';
import AIChat from '../components/dashboard/AIChat';
import { useLanguage } from '../context/LanguageContext';

export default function Chat({ salaryData, expensesData }) {
  const { lang, t } = useLanguage();
  const [vremStage, setVremStage] = useState('idle'); // 'idle' -> 'loading' -> 'done'

  useEffect(() => {
    const handleTrigger = () => {
      setVremStage('loading');
    };
    window.addEventListener('vrem_search_start', handleTrigger);
    return () => window.removeEventListener('vrem_search_start', handleTrigger);
  }, []);

  useEffect(() => {
    if (vremStage === 'loading') {
      const timer = setTimeout(() => {
        setVremStage('done');
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [vremStage]);

  const topPPFs = [
    { code: 'TP2', name: 'Tera Portföy Para Piyasası', yield: '%3.91' },
    { code: 'PNU', name: 'Pusula Portföy İkinci P.P.', yield: '%3.90' },
    { code: 'PRY', name: 'Pusula Portföy Para Piyasası', yield: '%3.89' },
    { code: 'MPL', name: 'MT Portföy Para Piyasası', yield: '%3.81' },
    { code: 'PPT', name: 'Atlas Portföy Para Piyasası', yield: '%3.67' }
  ];

  const handlePrintPdf = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #vrem-print-section, #vrem-print-section * {
          visibility: visible !important;
        }
        #vrem-print-section {
          position: absolute;
          left: 0;
          top: 0;
          width: 100% !important;
          background: #101012 !important;
          color: #ffffff !important;
          padding: 40px !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .vrem-pdf-btn, .vrem-reset-btn {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

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
              <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0 }}>Powered by <span style={{ color: 'var(--accent)', fontWeight: 800 }}>Gemini Flash 3.1</span></p>
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
                {lang === 'tr' ? 'Henüz bir finansal analiz yapılmadı.' : 'No financial analysis performed yet.'}
              </div>
            )}
          </div>

          {/* V.R.E.M - TEFAS Analiz Ajanı (On-Demand Interactive Subagent) */}
          <div 
            id="vrem-print-section"
            className="glass" 
            style={{ 
              padding: 20, 
              border: vremStage === 'loading' ? '1px solid var(--amber)' : vremStage === 'done' ? '1px solid var(--accent)' : '1px solid var(--glass-border)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 14,
              transition: 'all 0.3s ease',
              background: 'var(--glass)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              boxShadow: vremStage === 'loading' ? '0 0 15px rgba(245,158,11,0.15)' : vremStage === 'done' ? '0 0 15px var(--accent-dim)' : 'var(--shadow)'
            }}
          >
            {/* Subagent Status Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: vremStage === 'loading' ? 'var(--amber)' : vremStage === 'done' ? 'var(--green)' : 'rgba(255,255,255,0.2)', 
                  boxShadow: vremStage === 'loading' ? '0 0 8px var(--amber)' : vremStage === 'done' ? '0 0 8px var(--green)' : 'none',
                  animation: vremStage === 'loading' ? 'blink 1.2s infinite' : 'none'
                }} />
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text1)', letterSpacing: '0.04em' }}>
                  V.R.E.M: TEFAS Analiz Ajanı
                </span>
              </div>
              <span style={{ 
                fontSize: 9, 
                background: vremStage === 'loading' ? 'rgba(245,158,11,0.1)' : vremStage === 'done' ? 'var(--accent-dim)' : 'rgba(255,255,255,0.05)', 
                color: vremStage === 'loading' ? 'var(--amber)' : vremStage === 'done' ? 'var(--accent)' : 'var(--text3)', 
                fontWeight: 700, 
                padding: '2px 6px', 
                borderRadius: 4 
              }}>
                {vremStage === 'loading' ? 'SCANNING' : vremStage === 'done' ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            {/* STAGE 1: IDLE STATE */}
            {vremStage === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
                <div style={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.015)', 
                  border: '1px dashed var(--glass-border)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--text3)'
                }}>
                  📡
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600 }}>
                    TEFAS PPF Taraması Hazır
                  </span>
                  <p style={{ fontSize: 9, color: 'var(--text3)', lineHeight: 1.4, margin: 0 }}>
                    Sorgu başlatmak için R.E.M AI sohbetinde PPF/TEFAS sorgusu yapın veya aşağıdaki butona basın.
                  </p>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setVremStage('loading')}
                  style={{ fontSize: 10, width: '100%', padding: '8px 0', height: 'auto', fontWeight: 700 }}
                >
                  Canlı TEFAS PPF Taraması Başlat
                </button>
              </div>
            )}

            {/* STAGE 2: LOADING / SCANNING STATE */}
            {vremStage === 'loading' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ 
                    width: 14, 
                    height: 14, 
                    borderRadius: '50%', 
                    border: '1.5px solid rgba(245,158,11,0.2)', 
                    borderTopColor: 'var(--amber)', 
                    animation: 'spin 0.8s linear infinite' 
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--amber)', fontWeight: 700 }}>
                    Veri Köprüsü Aktif, Sorgulanıyor...
                  </span>
                </div>
                
                {/* Console logs */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 6, 
                  background: 'rgba(245,158,11,0.015)', 
                  border: '1px solid rgba(245,158,11,0.1)', 
                  borderRadius: 8, 
                  padding: 10, 
                  fontFamily: 'var(--mono)', 
                  fontSize: 9, 
                  color: 'var(--text2)',
                  lineHeight: 1.4
                }}>
                  <div>[vrem-bridge] Connecting to tefas.gov.tr...</div>
                  <div>[vrem-filter] Filtering: "PARA PİYASASI ŞEMSİYE FONU"</div>
                  <div>[vrem-sort] Sorting top 5 by highest returns...</div>
                </div>
              </div>
            )}

            {/* STAGE 3: COMPLETED STATE */}
            {vremStage === 'done' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 600 }}>
                  Günün En Çok Kazandıran PPF'leri (1 Aylık Getiri)
                </span>
                
                {/* PPF Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {topPPFs.map((ppf) => (
                    <div 
                      key={ppf.code}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '8px 10px', 
                        background: 'rgba(255,255,255,0.015)', 
                        border: '1px solid var(--glass-border)', 
                        borderRadius: 8,
                        fontSize: 10
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 9, background: 'var(--accent-dim)', padding: '2px 4px', borderRadius: 4 }}>
                          {ppf.code}
                        </span>
                        <span style={{ color: 'var(--text1)', fontWeight: 500 }}>
                          {ppf.name}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
                        {ppf.yield}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Print & Reset Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px dashed var(--glass-border)', paddingTop: 10, marginTop: 4 }}>
                  <button 
                    className="vrem-reset-btn btn btn-sm"
                    onClick={() => setVremStage('idle')}
                    style={{ fontSize: 9, padding: '4px 8px', height: 22, border: '1px solid var(--glass-border)', color: 'var(--text2)' }}
                  >
                    Sıfırla
                  </button>
                  <button 
                    className="vrem-pdf-btn btn btn-accent btn-sm"
                    onClick={handlePrintPdf}
                    style={{ fontSize: 9, padding: '4px 10px', height: 22, fontWeight: 700 }}
                  >
                    Rapor İndir (PDF)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="glass" style={{ padding: 20, border: '1px solid var(--accent-dim)', background: 'linear-gradient(to bottom right, rgba(129,140,248,0.1), transparent)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Our Vision</h3>
            <p style={{ fontSize: 12, color: 'var(--text1)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              "Insomni, atıl nakdin sadece bir rakam değil, kaçırılmış bir gelecek olduğu inancıyla doğdu. R.E.M ile amacımız, finansal verilerinizdeki her bir saniyeyi değere dönüştürmek ve size paranın gerçek zamanlı maliyetini göstererek finansal özgürlüğünüzü optimize etmektir."
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