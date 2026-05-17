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

// Secure date parser that parses numbers, strings, and full ISO date objects beautifully!
const getExpenseDay = (dateVal) => {
  if (!dateVal) return 15;
  const strVal = dateVal.toString().trim();
  
  // If it's a simple day number/string
  const num = parseInt(strVal);
  if (!isNaN(num) && num >= 1 && num <= 31 && !strVal.includes('-') && !strVal.includes('T')) {
    return num;
  }
  
  // If it is a full ISO Date string (e.g. 2026-05-12T19:24:11Z)
  const parsedDate = new Date(strVal);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.getDate();
  }
  
  return 15; // default fallback
};

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

  // Drag and Drop implementation to update expense date and trigger instant reactive balance recalculation
  const handleExpenseDateChange = (expenseId, newDay) => {
    const targetId = parseFloat(expenseId) || expenseId;
    const parsedDay = parseInt(newDay) || 15;

    // 1. Check inside user custom expensesData
    const isNormalExpense = expensesData.some(e => e.id === targetId);
    if (isNormalExpense) {
      const updated = expensesData.map(e => e.id === targetId ? { ...e, date: parsedDay } : e);
      setExpensesData(updated);
      localStorage.setItem('insomni_expenses', JSON.stringify(updated));
    } else {
      // 2. Check inside synced REM transactions
      const localSynced = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
      const isSyncedExpense = localSynced.some(e => e.id === targetId || e.id === expenseId);
      if (isSyncedExpense) {
        const updated = localSynced.map(e => (e.id === targetId || e.id === expenseId) ? { ...e, day: parsedDay } : e);
        localStorage.setItem('insomni_synced_txs', JSON.stringify(updated));
        setSyncedTxs(updated);
      }
    }
  };

  const financialDataForAI = {
    salary: { income, currency },
    expenses: combinedExpenses,
    totalExpense,
    remaining
  };

  // Cumulative balance flow calculated strictly across 31 full days
  let runningBalance = income;
  const dailyBalances = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const dayExps = combinedExpenses.filter(e => getExpenseDay(e.date) === day);
    const dayTotal = dayExps.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    runningBalance -= dayTotal;
    return { day, balance: runningBalance, isNegative: runningBalance < 0 };
  });

  const salaryDay = salaryData?.day || 1;

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, minWidth: 0 }}>
          <motion.div variants={fadeUp}><ExpenseChart expenses={combinedExpenses} currency={currency} salary={income} /></motion.div>
          <motion.div variants={fadeUp}><ExpenseList expenses={combinedExpenses} currency={currency} /></motion.div>
          <motion.div variants={fadeUp}><SubscriptionTracker expenses={combinedExpenses} currency={currency} /></motion.div>

          {/* Collapsible Idle Cash Optimization Panel - Clean, elegant & matching native UI relocated here */}
          <motion.div 
            variants={fadeUp} 
            className="glass" 
            style={{ 
              padding: 24, 
              border: '1px solid var(--glass-border)', 
              borderRadius: 16, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 16 
            }}
          >
            <div 
              onClick={() => setIsIdlePanelExpanded(!isIdlePanelExpanded)}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <TrendingUp size={18} color="var(--accent)" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {lang === 'tr' ? 'Atıl Para Optimizasyon Analizi' : 'Idle Cash Optimization Analysis'}
                  {remaining > 0 && (
                    <span className="badge badge-warning" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {lang === 'tr' ? 'Atıl Nakit Var' : 'Idle Cash Detected'}
                    </span>
                  )}
                </h3>
              </div>
              <div>
                {isIdlePanelExpanded ? <ChevronUp size={16} color="var(--text2)" /> : <ChevronDown size={16} color="var(--text2)" />}
              </div>
            </div>

            <AnimatePresence>
              {isIdlePanelExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, borderTop: '1px solid var(--glass-border)', marginTop: 12 }}>
                    
                    {(() => {
                      const idleAmount = remaining > 0 ? remaining : 0;
                      const monthlyLossRate = 0.045; // ~4.5% monthly inflation
                      const dailyLossRate = monthlyLossRate / 30;
                      
                      const dailyLoss = idleAmount * dailyLossRate;
                      const monthlyLoss = idleAmount * monthlyLossRate;

                      const monthlyYieldRate = 0.04; // ~4% monthly high-yield
                      const dailyYieldRate = monthlyYieldRate / 30;

                      const dailyYield = idleAmount * dailyYieldRate;
                      const monthlyYield = idleAmount * monthlyYieldRate;

                      // Extract large payments (rent, bills, subscriptions above 1000, or top 2 highest expenses)
                      const largePayments = combinedExpenses.filter(e => parseFloat(e.amount || 0) >= 1000);
                      const targetedExpenses = largePayments.length > 0 
                        ? largePayments 
                        : [...combinedExpenses].sort((a,b) => parseFloat(b.amount || 0) - parseFloat(a.amount || 0)).slice(0, 2);

                      const totalLargeExpense = targetedExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
                      
                      // Calculate Timing Arbitrage Potential using a distinct variable name
                      const plannerDailyYieldRate = 0.04 / 30; // 4% monthly yield / 30 days
                      
                      const arbitrageDetails = targetedExpenses.map(e => {
                        const day = getExpenseDay(e.date);
                        const daysActive = Math.max(1, day - 1); // Money stays in fund until day of payment
                        const amount = parseFloat(e.amount || 0); // Convert amount strictly to Number to prevent .toFixed crashes!
                        const potentialEarning = amount * plannerDailyYieldRate * daysActive;
                        return { ...e, daysActive, potentialEarning, amount }; // Overwrite amount with float
                      });

                      const totalArbitrageGain = arbitrageDetails.reduce((sum, e) => sum + e.potentialEarning, 0);

                      return (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                            
                            {/* Scenario 1 Card */}
                            <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid var(--glass-border)', textAlign: 'left' }}>
                              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--red)' }}>
                                {lang === 'tr' ? '1. Vadesiz Hesap (Enflasyon Kaybı)' : '1. Zero-Yield Account (Inflation Loss)'}
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Günlük Kayıp:' : 'Daily Loss:'}</span>
                                  <span style={{ fontWeight: 600, color: 'var(--red)' }}>-{dailyLoss.toFixed(2)} {currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Aylık Kayıp:' : 'Monthly Loss:'}</span>
                                  <span style={{ fontWeight: 600, color: 'var(--red)' }}>-{monthlyLoss.toFixed(2)} {currency}</span>
                                </div>
                              </div>
                            </div>

                            {/* Scenario 2 Card */}
                            <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid var(--glass-border)', textAlign: 'left' }}>
                              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px 0', color: 'var(--green)' }}>
                                {lang === 'tr' ? '2. Aktif Getiri (Potansiyel Kazanım)' : '2. Active Yield (Potential Gain)'}
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Günlük Getiri:' : 'Daily Yield:'}</span>
                                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>+{dailyYield.toFixed(2)} {currency}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ color: 'var(--text2)' }}>{lang === 'tr' ? 'Aylık Getiri:' : 'Monthly Yield:'}</span>
                                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>+{monthlyYield.toFixed(2)} {currency}</span>
                                </div>
                              </div>
                            </div>

                          </div>

                          {/* Summary Banner */}
                          <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.015)', borderRadius: 8, fontSize: '12px', color: 'var(--text2)', lineHeight: 1.4, textAlign: 'left', border: '1px solid var(--glass-border)' }}>
                            {lang === 'tr' 
                              ? 'Atıl durumdaki nakdinizi değerlendirerek enflasyon kaybını durdurabilir ve aylık net ' 
                              : 'By optimizing your idle cash, you can prevent inflation loss and secure a monthly yield of '}
                            <strong style={{ color: 'var(--accent)' }}>{(monthlyYield + monthlyLoss).toFixed(2)} {currency}</strong>
                            {lang === 'tr' ? ' kazanç sağlayabilirsiniz.' : ' net gain.'}
                          </div>

                          {/* Dynamic Arbitrage Planning Section */}
                          <div style={{ marginTop: 8, paddingTop: 16, borderTop: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Calendar size={16} />
                              {lang === 'tr' ? 'Gelecek Ay Otonom Yönetim & Arbitraj Planı' : 'Next Month Autonomous Yield Plan'}
                            </h4>
                            
                            {targetedExpenses.length === 0 ? (
                              <p style={{ fontSize: '12px', color: 'var(--text2)', margin: 0 }}>
                                {lang === 'tr' 
                                  ? 'Planlama yapılabilmesi için sisteme en az bir harcama girilmelidir.' 
                                  : 'Enter at least one expense to activate autonomous monthly planning.'}
                              </p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <p style={{ fontSize: '12px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                                  {lang === 'tr'
                                    ? `Sisteminizdeki en yüksek ödemeleri analiz ettik. Maaş gününüzden ödeme gününe kadar geçecek sürede bu tutarları aktif nemalandırarak elde edeceğiniz zamanlama avantajı planı:`
                                    : `We analyzed your highest monthly commitments. By keeping these sums active until the exact due date, here is your timing arbitrage roadmap:`}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {arbitrageDetails.map((exp, idx) => (
                                    <div key={idx} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.01)', borderRadius: 8, border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                      <div style={{ fontSize: '12px' }}>
                                        <strong style={{ color: 'var(--text1)' }}>{exp.name}</strong>
                                        <span style={{ color: 'var(--text2)', marginLeft: 8 }}>
                                          {lang === 'tr' 
                                            ? `(Ayın ${getExpenseDay(exp.date)}. günü, ${parseFloat(exp.amount || 0).toFixed(2)} ${currency})` 
                                            : `(Day ${getExpenseDay(exp.date)} of month, ${parseFloat(exp.amount || 0).toFixed(2)} ${currency})`}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: '12px', color: 'var(--green)', fontWeight: 700 }}>
                                        {lang === 'tr' 
                                          ? `+${parseFloat(exp.potentialEarning || 0).toFixed(2)} ${currency} (${exp.daysActive} Gün Kazanım)` 
                                          : `+${parseFloat(exp.potentialEarning || 0).toFixed(2)} ${currency} (${exp.daysActive} Days Active)`}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div style={{ padding: 12, background: 'rgba(129,140,248,0.03)', borderRadius: 8, border: '1px solid rgba(129,140,248,0.15)', fontSize: '12px', lineHeight: 1.5, color: 'var(--text1)' }}>
                                  <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--accent)' }}>
                                    {lang === 'tr' ? '💡 GELECEK AY AKSİYON REHBERİ' : '💡 NEXT MONTH ACTION GUIDE'}
                                  </div>
                                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <li>
                                      {lang === 'tr'
                                        ? `Büyük harcama kalemlerinizin toplamı olan `
                                        : `Your major recurring bills totaling `}
                                      <strong style={{ color: 'var(--text1)' }}>{totalLargeExpense.toFixed(2)} {currency}</strong>
                                      {lang === 'tr'
                                        ? ` tutarını maaş gününde vadesiz hesapta tutmak yerine, yukarıda listelenen ödeme günlerine kadar aktif fonda blokeli tutun.`
                                        : ` should not sit idle. Block them in yield accounts until the listed due dates.`}
                                    </li>
                                    <li>
                                      {lang === 'tr'
                                        ? `Bu zamanlama taktiğiyle sadece büyük ödemelerinizden gelecek ay ekstradan `
                                        : `By executing this timing arbitrage next month, you secure an extra net gain of `}
                                      <strong style={{ color: 'var(--green)' }}>{totalArbitrageGain.toFixed(2)} {currency}</strong>
                                      {lang === 'tr'
                                        ? ` pasif getiri elde ederek vadesiz erimesini durduracaksınız.`
                                        : ` solely from bills that would otherwise sit zero-yield.`}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
        <div style={{ position: 'sticky', top: 24, minWidth: 0 }}>
          <motion.div variants={fadeUp} className="glass" style={{ padding: '32px 24px', height: 'calc(100vh - 200px)', maxHeight: 800, display: 'flex', flexDirection: 'column', border: '1px solid rgba(129,140,248,0.2)', boxShadow: '0 0 40px rgba(129,140,248,0.05)', overflow: 'hidden' }}>
            <AIChat financialData={financialDataForAI} />
          </motion.div>
        </div>
      </div>
      <motion.div variants={fadeUp} style={{ width: '100%', marginTop: 0 }}><div className="glass" style={{ padding: 24 }}><MonthlyCalendar expenses={combinedExpenses} dailyBalances={dailyBalances} salaryDay={salaryDay} onExpenseDateChange={handleExpenseDateChange} /></div></motion.div>
    </motion.div>
  );
}
