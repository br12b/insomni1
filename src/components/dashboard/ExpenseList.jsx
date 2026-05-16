import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, CreditCard, ShoppingCart, Video, Coffee, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ExpenseList({ expenses = [], currency = '₺' }) {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!expenses || expenses.length === 0) return null;

  const sorted = [...expenses].sort((a, b) => b.amount - a.amount);

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('netflix') || n.includes('spotify') || n.includes('youtube')) return <Video size={14} color="#a855f7" />;
    if (n.includes('yemek') || n.includes('market')) return <ShoppingCart size={14} color="#22c55e" />;
    if (n.includes('kahve') || n.includes('starbucks')) return <Coffee size={14} color="#f59e0b" />;
    return <CreditCard size={14} color="var(--text2)" />;
  };

  return (
    <div className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
      
      {/* CLICKABLE HEADER - AS REQUESTED */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <List size={16} color="var(--accent)" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{lang === 'tr' ? 'Harcama Analizi' : 'Expense Analysis'}</div>
          <span style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 700, marginLeft: 4 }}>({sorted.length})</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={16} color="var(--text2)" />
        </motion.div>
      </div>
      
      {/* COMPACT LIST AREA */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            {sorted.map((exp, i) => (
              <div key={exp.id || i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '10px 14px', 
                background: 'rgba(255,255,255,0.015)', 
                borderRadius: 12, 
                border: '1px solid rgba(255,255,255,0.01)' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getIcon(exp.name)}
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{exp.name}</span>
                </div>
                <span style={{ fontWeight: 800, fontSize: 14 }}>{exp.amount.toLocaleString()} {currency}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
