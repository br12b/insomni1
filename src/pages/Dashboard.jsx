import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Zap, Target, RefreshCw } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import CashFlowChart from '../components/dashboard/CashFlowChart';
import ExpenseAnalysis from '../components/dashboard/ExpenseAnalysis';
import GoalsList from '../components/dashboard/GoalsList';
import AIChat from '../components/dashboard/AIChat';

export default function Dashboard({ salaryData, expensesData, profileName }) {
  const [syncedTxs, setSyncedTxs] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
    setSyncedTxs(saved);
  }, []);

  const allExpenses = [
    ...(expensesData || []),
    ...syncedTxs.map(tx => ({
      name: tx.clean || tx.raw,
      amount: tx.amount.replace(/[^0-9,]/g, '').replace(',', '.'),
      category: tx.category,
      isSynced: true
    }))
  ];

  const totalExpense = allExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const netBalance = parseFloat(salaryData?.income || 0) - totalExpense;

  const financialData = {
    salary: salaryData,
    expenses: allExpenses,
    totalExpense: totalExpense,
    netBalance: netBalance,
    opportunityCost: (netBalance * 0.51) / 12
  };

  return (
    <div style={{ padding: '0 40px 40px 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatCard title="Aylık Gelir" value={`${salaryData?.income || 0} ${salaryData?.currency}`} icon={<Wallet size={20} />} trend="+0%" />
        <StatCard title="Toplam Gider" value={`${totalExpense.toLocaleString()} ${salaryData?.currency}`} icon={<ArrowDownRight size={20} />} trend={`${((totalExpense / (salaryData?.income || 1)) * 100).toFixed(1)}%`} negative />
        <StatCard title="Net Birikim" value={`${netBalance.toLocaleString()} ${salaryData?.currency}`} icon={<TrendingUp size={20} />} trend="Potansiyel" />
        <StatCard title="Fırsat Maliyeti" value={`${financialData.opportunityCost.toLocaleString(undefined, {maximumFractionDigits:0})} ${salaryData?.currency}`} icon={<Zap size={20} />} subText="Aylık Kayıp" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: 32 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="glass" style={{ padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Aylık Nakit Akışı (Timelapse)</h2>
              <div style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} /> Tahminleme Aktif
              </div>
            </div>
            <CashFlowChart income={salaryData?.income || 0} expenses={allExpenses} />
          </div>
          <ExpenseAnalysis expenses={allExpenses} salary={salaryData?.income || 0} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div className="glass" style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column' }}>
            <AIChat financialData={financialData} />
          </div>
          <GoalsList netBalance={netBalance} currency={salaryData?.currency} />
        </div>
      </div>
    </div>
  );
}