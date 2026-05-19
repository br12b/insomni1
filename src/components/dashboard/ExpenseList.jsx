import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getSector } from '../../utils/sectors';
import PremiumIcon from '../ui/PremiumIcon';


export default function ExpenseList({ expenses = [], currency = '₺' }) {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!expenses || expenses.length === 0) return null;

  // Group and sort expenses by Sector
  const grouped = expenses.reduce((acc, exp) => {
    const sector = getSector(exp.name, lang);
    if (!acc[sector.name]) {
      acc[sector.name] = {
        name: sector.name,
        color: sector.color,
        icon: sector.icon,
        total: 0,
        items: []
      };
    }
    acc[sector.name].total += parseFloat(exp.amount || 0);
    acc[sector.name].items.push(exp);
    return acc;
  }, {});

  const sectorsSorted = Object.values(grouped).sort((a, b) => b.total - a.total);

  return (
    <div className="glass" style={{ padding: '16px 20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
      
      {/* CLICKABLE HEADER */}
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
          <span style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 700, marginLeft: 4 }}>({expenses.length})</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown size={16} color="var(--text2)" />
        </motion.div>
      </div>
      
      {/* SECTOR GROUPED COMPACT LIST AREA */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {sectorsSorted.map((sec, i) => (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.01)', 
                borderRadius: 16, 
                border: '1px solid rgba(255,255,255,0.02)',
                padding: '12px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                {/* Sector Title and Total */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: 10, 
                      background: `${sec.color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: `1px solid ${sec.color}25`
                    }}>
                      <PremiumIcon iconStr={sec.icon} size={16} color={sec.color} />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 14, color: sec.color }}>{sec.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700 }}>({sec.items.length})</span>
                  </div>
                  <span style={{ fontWeight: 900, fontSize: 14, fontFamily: 'var(--mono)', color: 'var(--text1)' }}>
                    {sec.total.toLocaleString()} {currency}
                  </span>
                </div>

                {/* Sub-items under Sector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 12, borderLeft: `1px dashed ${sec.color}20` }}>
                  {sec.items.sort((a, b) => b.amount - a.amount).map((exp, j) => (
                    <div key={exp.id || j} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '4px 8px', 
                      background: 'rgba(255,255,255,0.005)', 
                      borderRadius: 8,
                      fontSize: 12
                    }}>
                      <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{exp.name}</span>
                      <span style={{ color: 'var(--text1)', fontWeight: 700, fontFamily: 'var(--mono)' }}>
                        {exp.amount.toLocaleString()} {currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
