import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingDown, LayoutDashboard, Plus } from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import AIChat from '../components/dashboard/AIChat';
import MonthlyCalendar from '../components/dashboard/MonthlyCalendar';
import SubscriptionTracker from '../components/dashboard/SubscriptionTracker';
import ExpenseChart from '../components/dashboard/ExpenseChart';
import ExpenseList from '../components/dashboard/ExpenseList';
import { useLanguage } from '../context/LanguageContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard({ salaryData, expensesData = [], profileName }) {
  const { lang, t } = useLanguage();
  const [syncedTxs, setSyncedTxs] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
    setSyncedTxs(data);
  }, []);

  // SİBER RAKAM AYIKLAMA MOTORU (TR FORMATI İÇİN)
  const parseRemAmount = (val) => {
    if (!val) return 0;
    const cleaned = val.toString().replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const syncedTotal = syncedTxs.reduce((acc, tx) => acc + parseRemAmount(tx.amount), 0);
  const totalExpense = (expensesData?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0) + syncedTotal;
  const income = salaryData?.salary || 0;
  const currency = salaryData?.currency || '₺';
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

  const dailyBalances = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dayExps = combinedExpenses.filter(e => parseInt(e.date) === day);
    const dayTotal = dayExps.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    return { day, balance: income - dayTotal, isNegative: (income - dayTotal) < 0 };
  });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} style={{ paddingTop: '4vh', paddingBottom: 80, paddingLeft: 'max(20px, 5vw)', paddingRight: 'max(20px, 5vw)', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1600, margin: '0 auto', width: '100%', overflowX: 'hidden' }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>Hoş Geldin, {profileName || 'Kullanıcı'}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Finansal durumunun güncel özeti ve AI içgörüleri.</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={18} /> {lang === 'tr' ? 'Harcama Ekle' : 'Add Expense'}</button>
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
        </div>
        <div style={{ position: 'sticky', top: 24, minWidth: 0 }}>
          <motion.div variants={fadeUp} className="glass" style={{ padding: '32px 24px', height: 'calc(100vh - 200px)', maxHeight: 800, display: 'flex', flexDirection: 'column', border: '1px solid rgba(129,140,248,0.2)', boxShadow: '0 0 40px rgba(129,140,248,0.05)', overflow: 'hidden' }}>
            <AIChat financialData={{ salaryData, expensesData: combinedExpenses, totalExpense, remaining }} />
          </motion.div>
        </div>
      </div>
      <motion.div variants={fadeUp} style={{ width: '100%', marginTop: 0 }}><div className="glass" style={{ padding: 24 }}><MonthlyCalendar expenses={combinedExpenses} dailyBalances={dailyBalances} /></div></motion.div>
    </motion.div>
  );
}
