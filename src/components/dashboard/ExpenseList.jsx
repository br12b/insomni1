import React from 'react';
import { List, Receipt, CreditCard, ShoppingCart, Video, Coffee } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ExpenseList({ expenses = [], currency = '₺' }) {
  const { lang } = useLanguage();

  if (!expenses || expenses.length === 0) return null;

  const sorted = [...expenses].sort((a, b) => b.amount - a.amount);

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('netflix') || n.includes('spotify') || n.includes('youtube')) return <Video size={16} color="#a855f7" />;
    if (n.includes('yemek') || n.includes('market')) return <ShoppingCart size={16} color="#22c55e" />;
    if (n.includes('kahve') || n.includes('starbucks')) return <Coffee size={16} color="#f59e0b" />;
    return <CreditCard size={16} color="var(--text2)" />;
  };

  return (
    <div className="glass" style={{ padding: 24, border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <List size={18} color="var(--text1)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{lang === 'tr' ? 'Tüm Harcamalar' : 'All Expenses'}</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sorted.map((exp, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ padding: 10, borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
                {getIcon(exp.name)}
              </div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{exp.name}</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>{exp.amount.toLocaleString()} {currency}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
