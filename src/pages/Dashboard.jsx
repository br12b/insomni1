import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingDown, LayoutDashboard, Plus, X, Tag, Calendar, DollarSign, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AIChat from '../components/dashboard/AIChat';
import MonthlyCalendar from '../components/dashboard/MonthlyCalendar';
import SubscriptionTracker from '../components/dashboard/SubscriptionTracker';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import ExpenseList from '../components/dashboard/ExpenseList';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard({ salaryData, expensesData = [], setExpensesData, profileName }) {
  const { lang, t } = useLanguage();
  const [syncedTxs, setSyncedTxs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', date: new Date().getDate(), category: 'Diğer' });
  const [isIdlePanelExpanded, setIsIdlePanelExpanded] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
    setSyncedTxs(data);
  }, []);

  const parseRemAmount = (val) => {
    if (!val) return 0;
    const cleaned = val.toString().replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const syncedTotal = syncedTxs.reduce((acc, tx) => acc + parseRemAmount(tx.amount), 0);
  const income = salaryData?.income || salaryData?.salary || 0;
  const currency = salaryData?.currency || '₺';
  const totalExpense = (expensesData?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0) + syncedTotal;
  const remaining = income - totalExpense;

  const combinedExpenses = [
    ...expensesData,
    ...syncedTxs.map(tx => ({
      id: tx.id,
      name: tx.clean,
      amount: parseRemAmount(tx.amount),
      date: tx.day || 15,
      category: tx.category,
      isSynced: true
    }))
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name || !newExpense.amount) return;
    
    const expenseToAdd = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };

    const updatedExpenses = [...expensesData, expenseToAdd];
    setExpensesData(updatedExpenses);
    localStorage.setItem('insomni_expenses', JSON.stringify(updatedExpenses));
    
    setNewExpense({ name: '', amount: '', date: new Date().getDate(), category: 'Diğer' });
    setIsModalOpen(false);
  };

  const financialDataForAI = {
    salary: { income, currency },
    expenses: combinedExpenses,
    totalExpense,
    remaining
  };

  const dailyBalances = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dayExps = combinedExpenses.filter(e => parseInt(e.date) === day);
    const dayTotal = dayExps.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return { day, balance: income - dayTotal, isNegative: (income - dayTotal) < 0 };
  });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} style={{ paddingTop: '4vh', paddingBottom: 80, paddingLeft: 'max(20px, 5vw)', paddingRight: 'max(20px, 5vw)', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1600, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
      
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass" style={{ width: '100%', maxWidth: 450, padding: 32, border: '1px solid var(--glass-border)', position: 'relative' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer' }}><X size={20} /></button>
              
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}><Plus size={24} className="text-primary" /> {lang === 'tr' ? 'Harcama Ekle' : 'Add Expense'}</h2>
              
              <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{lang === 'tr' ? 'HARCAMA İSMİ' : 'EXPENSE NAME'}</label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                    <input type="text" value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} placeholder="Örn: Starbucks" style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'white' }} required />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{lang === 'tr' ? 'MİKTAR' : 'AMOUNT'}</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontWeight: 800 }}>{currency}</div>
                    <input type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} placeholder="0.00" style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'white' }} required />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{lang === 'tr' ? 'TARİH (GÜN)' : 'DATE (DAY)'}</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                    <input type="number" min="1" max="31" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: 12, color: 'white' }} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: 12, padding: 16 }}>{lang === 'tr' ? 'Sisteme İşle' : 'Register Expense'}</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>Hoş Geldin, {profileName || 'Kullanıcı'}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Finansal durumunun güncel özeti ve AI içgörüleri.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm"><Plus size={18} /> {lang === 'tr' ? 'Harcama Ekle' : 'Add Expense'}</button>
      </motion.div>

      <motion.div variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20 }}>
        <motion.div variants={fadeUp} className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)' }}>
          <div className="label" style={{ marginBottom: 12 }}><Wallet size={16}/> {t.dashboard?.salary || 'MAAŞ'}</div>
          <div className="stat-num" style={{ fontSize: 24 }}><AnimatedCounter value={income} suffix={` ${currency}`} /></div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)' }}>
          <div className="label" style={{ marginBottom: 12 }}><TrendingDown size={16}/> {t.dashboard?.totalExp || 'TOPLAM GİDER'}</div>
          <div className="stat-num" style={{ color: 'var(--red)', fontSize: 24 }}><AnimatedCounter value={totalExpense} suffix={` ${currency}`} /></div>
        </motion.div>
        <motion.div variants={fadeUp} className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)' }}>
          <div className="label" style={{ marginBottom: 12 }}><LayoutDashboard size={16}/> {t.dashboard?.remaining || 'KALAN ATIL NAKİT'}</div>
          <div className="stat-num" style={{ color: 'var(--green)', fontSize: 24 }}><AnimatedCounter value={remaining} suffix={` ${currency}`} /></div>
        </motion.div>
      </motion.div>

      {/* Collapsible Idle Cash Optimization Panel */}
      <motion.div 
        variants={fadeUp} 
        className="glass" 
        style={{ 
          border: '1px solid rgba(129,140,248,0.25)', 
          background: 'rgba(12,12,24,0.3)', 
          borderRadius: 16, 
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(129,140,248,0.03)'
        }}
      >
        <div 
          onClick={() => setIsIdlePanelExpanded(!isIdlePanelExpanded)}
          style={{ 
            padding: '20px 24px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.01)',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <TrendingUp size={20} color="var(--accent)" />
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {lang === 'tr' ? 'Atıl Para Analizi & Kalkan Projeksiyonu' : 'Idle Cash Analysis & Wealth Shield Projection'}
                <span className={`badge ${remaining > 0 ? 'badge-warning' : 'badge-success'}`} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {remaining > 0 
                    ? (lang === 'tr' ? 'Atıl Nakit Tespit Edildi' : 'Idle Cash Detected') 
                    : (lang === 'tr' ? 'Kalkan %100 Aktif' : 'Shield 100% Active')}
                </span>
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text2)', marginTop: 2 }}>
                {lang === 'tr' 
                  ? 'Paranın zamana ve enflasyona karşı koruma kalkanını simüle etmek için tıkla.' 
                  : 'Click to simulate your asset protection shield against time and inflation.'}
              </p>
            </div>
          </div>
          <div>
            {isIdlePanelExpanded ? <ChevronUp size={20} color="var(--text2)" /> : <ChevronDown size={20} color="var(--text2)" />}
          </div>
        </div>

        <AnimatePresence>
          {isIdlePanelExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.15)' }}
            >
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {(() => {
                  const idleAmount = remaining > 0 ? remaining : 0;
                  const monthlyLossRate = 0.045; // ~4.5% monthly inflation loss
                  const dailyLossRate = monthlyLossRate / 30;
                  
                  const dailyLoss = idleAmount * dailyLossRate;
                  const monthlyLoss = idleAmount * monthlyLossRate;

                  const monthlyYieldRate = 0.04; // ~48% annual yield optimization (~4% monthly)
                  const dailyYieldRate = monthlyYieldRate / 30;

                  const dailyYield = idleAmount * dailyYieldRate;
                  const monthlyYield = idleAmount * monthlyYieldRate;

                  return (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        
                        {/* Scenario A Card */}
                        <div className="glass" style={{ padding: 20, border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.02)', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <AlertTriangle size={18} color="var(--red)" />
                            <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--red)' }}>
                              {lang === 'tr' ? 'Senaryo A: Boşta Bırakma (Kayıp Güç)' : 'Scenario A: Keep Idle (Power Loss)'}
                            </h4>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: 16 }}>
                            {lang === 'tr'
                              ? 'Paran boşta, sıfır getirili vadesiz hesaplarda beklediğinde her geçen saniye enflasyon canavarı karşısında erir.'
                              : 'When your cash sits idle in zero-yield accounts, it constantly loses purchasing power due to inflation.'}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Günlük Kayıp:' : 'Daily Loss:'}</span>
                              <span style={{ fontWeight: 700, color: 'var(--red)' }}>-{dailyLoss.toFixed(2)} {currency}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Aylık Kayıp:' : 'Monthly Loss:'}</span>
                              <span style={{ fontWeight: 700, color: 'var(--red)' }}>-{monthlyLoss.toFixed(2)} {currency}</span>
                            </div>
                          </div>
                          {idleAmount > 0 && (
                            <div style={{ marginTop: 16, height: 3, background: 'rgba(239,68,68,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'var(--red)' }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Scenario B Card */}
                        <div className="glass" style={{ padding: 20, border: '1px solid rgba(52,211,153,0.2)', background: 'rgba(52,211,153,0.02)', textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                            <ShieldCheck size={18} color="var(--green)" />
                            <h4 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--green)' }}>
                              {lang === 'tr' ? 'Senaryo B: Siber Kalkan (Getiri Gücü)' : 'Scenario B: Wealth Shield (Active Yield)'}
                            </h4>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: 16 }}>
                            {lang === 'tr'
                              ? 'Nakitini aktif fonlarda değerlendirip abonelik ve ödeme tarihlerini saniyelerle optimize ettiğinde oluşan koruma.'
                              : 'The wealth protection shield created by utilizing high-yield options and dynamics timeline optimization.'}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Günlük Korunan:' : 'Daily Protected:'}</span>
                              <span style={{ fontWeight: 700, color: 'var(--green)' }}>+{dailyYield.toFixed(2)} {currency}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                              <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Aylık Korunan:' : 'Monthly Protected:'}</span>
                              <span style={{ fontWeight: 700, color: 'var(--green)' }}>+{monthlyYield.toFixed(2)} {currency}</span>
                            </div>
                          </div>
                          {idleAmount > 0 && (
                            <div style={{ marginTop: 16, height: 3, background: 'rgba(52,211,153,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', background: 'var(--green)' }}
                              />
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Summary Banner */}
                      <div className="glass" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(129,140,248,0.02)', border: '1px solid rgba(129,140,248,0.1)', flexWrap: 'wrap', gap: 10, borderRadius: 8, textAlign: 'left' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                          {lang === 'tr' 
                            ? 'Boşta duran paranın tamamını aktif kalkan kapsamına alarak aylık net ' 
                            : 'By shielding your idle cash, you secure a net monthly asset protection of '}
                          <strong style={{ color: 'var(--accent)' }}>{(monthlyYield + monthlyLoss).toFixed(2)} {currency}</strong>
                          {lang === 'tr' ? ' korumuş olursun.' : ' against zero-yield loss.'}
                        </span>
                        <span style={{ fontSize: '10px', fontFamily: 'var(--mono)', color: 'var(--accent)', fontWeight: 800 }}>
                          {lang === 'tr' ? 'AKTİF KORUMA RADARI' : 'ACTIVE WEALTH RADAR'}
                        </span>
                      </div>
                    </>
                  );
                })()}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          <motion.div variants={fadeUp}><ExpenseChart expenses={combinedExpenses} currency={currency} salary={income} /></motion.div>
          <motion.div variants={fadeUp}><ExpenseList expenses={combinedExpenses} currency={currency} /></motion.div>
          <motion.div variants={fadeUp}><SubscriptionTracker expenses={combinedExpenses} currency={currency} /></motion.div>
        </div>
        <div style={{ position: 'sticky', top: 24, minWidth: 0 }}>
          <motion.div variants={fadeUp} className="glass" style={{ padding: '32px 24px', height: 'calc(100vh - 200px)', maxHeight: 800, display: 'flex', flexDirection: 'column', border: '1px solid rgba(129,140,248,0.2)', boxShadow: '0 0 40px rgba(129,140,248,0.05)', overflow: 'hidden' }}>
            <AIChat financialData={financialDataForAI} />
          </motion.div>
        </div>
      </div>
      <motion.div variants={fadeUp} style={{ width: '100%', marginTop: 0 }}><div className="glass" style={{ padding: 24 }}><MonthlyCalendar expenses={combinedExpenses} dailyBalances={dailyBalances} /></div></motion.div>
    </motion.div>
  );
}
