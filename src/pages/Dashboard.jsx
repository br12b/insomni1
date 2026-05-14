import React from 'react';
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

  const totalExpense = expensesData?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0;
  const income = salaryData?.salary || 0;
  const currency = salaryData?.currency || '₺';
  const remaining = income - totalExpense;

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}
      style={{ 
        paddingTop: '4vh', 
        paddingBottom: 80, 
        paddingLeft: 'max(20px, 5vw)',
        paddingRight: 'max(20px, 5vw)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: 32,
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
        overflowX: 'hidden'
      }}>
      
      {/* Header */}
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.03em' }}>
            Hoş Geldin, {profileName || 'Kullanıcı'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 15 }}>Finansal durumunun güncel özeti ve AI içgörüleri.</p>
        </div>
        <button className="btn btn-primary btn-sm"><Plus size={18} /> {lang === 'tr' ? 'Harcama Ekle' : 'Add Expense'}</button>
      </motion.div>

      {/* Stats Row */}
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

      {/* Main Content: 50/50 Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>
        
        {/* ROW 1 LEFT: Chart */}
        <motion.div variants={fadeUp} style={{ minWidth: 0 }}>
          <ExpenseChart expenses={expensesData} currency={currency} salary={income} />
        </motion.div>

        {/* ROW 1 RIGHT: AI Chat */}
        <motion.div variants={fadeUp} className="glass" style={{ 
          padding: '32px 24px', 
          minHeight: 450, 
          display: 'flex', 
          flexDirection: 'column', 
          border: '1px solid rgba(129,140,248,0.2)', 
          boxShadow: '0 0 40px rgba(129,140,248,0.05)' 
        }}>
          <AIChat financialData={{ salaryData, expensesData }} />
        </motion.div>

        {/* ROW 2 LEFT: Expense List */}
        <motion.div variants={fadeUp} style={{ minWidth: 0 }}>
          <ExpenseList expenses={expensesData} currency={currency} />
        </motion.div>

        {/* ROW 2 RIGHT: Subscriptions */}
        <motion.div variants={fadeUp} style={{ minWidth: 0 }}>
          <SubscriptionTracker expenses={expensesData} currency={currency} />
        </motion.div>

      </div>

      {/* Bottom Row: Full-Width Calendar */}
      <motion.div variants={fadeUp} style={{ width: '100%', marginTop: 8 }}>
        <div className="glass" style={{ padding: 24 }}>
          <MonthlyCalendar expenses={expensesData} />
        </div>
      </motion.div>

    </motion.div>
  );
}
