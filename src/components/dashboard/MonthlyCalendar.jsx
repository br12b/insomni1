import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { parseAmount } from '../../lib/calculations';

// Secure date parser that matches numbers, strings, and full ISO dates
const getExpenseDay = (dateVal) => {
  if (!dateVal) return 15;
  const strVal = dateVal.toString().trim();
  
  const num = parseInt(strVal);
  if (!isNaN(num) && num >= 1 && num <= 31 && !strVal.includes('-') && !strVal.includes('T')) {
    return num;
  }
  
  const parsedDate = new Date(strVal);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate.getDate();
  }
  
  return 15;
};

function ExpBadge({ exp, onDragStart }) {
  const isSub = exp.type === 'subscription';
  return (
    <div draggable onDragStart={e => { e.dataTransfer.setData('expId', exp.id); onDragStart?.(exp.id); }}
      style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: 8,
        background: isSub ? 'var(--accent-dim)' : 'var(--green-dim)',
        color: isSub ? 'var(--accent)' : 'var(--green)',
        fontSize: 10, fontWeight: 600, cursor: 'grab', userSelect: 'none', marginTop: 3,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}
      title={exp.name + ': TL' + parseAmount(exp.amount).toLocaleString('tr-TR')}>
      {exp.name.length > 9 ? exp.name.slice(0,9) + '..' : exp.name}
    </div>
  );
}

export default function MonthlyCalendar({ dailyBalances = [], expenses = [], salaryDay = 1, currentDay = 31, onExpenseDateChange }) {
  const [dropTarget, setDropTarget] = useState(null);
  const [dropSuccess, setDropSuccess] = useState(null);

  const handleDrop = useCallback((e, day) => {
    e.preventDefault();
    const expId = e.dataTransfer.getData('expId');
    if (expId && onExpenseDateChange) {
      onExpenseDateChange(expId, day);
      setDropSuccess(day);
      setTimeout(() => setDropSuccess(null), 800);
    }
    setDropTarget(null);
  }, [onExpenseDateChange]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {dailyBalances.map(d => {
        const isPast = d.day <= currentDay;
        const isSalary = d.day === salaryDay;
        const isDropping = dropTarget === d.day;
        const isSuccess = dropSuccess === d.day;
        const dayExps = expenses.filter(e => getExpenseDay(e.date) === d.day);
        return (
          <motion.div key={d.day}
            whileHover={isPast ? { scale: 1.03, zIndex: 20 } : {}}
            onDragOver={e => { e.preventDefault(); setDropTarget(d.day); }}
            onDragLeave={() => setDropTarget(null)}
            onDrop={e => handleDrop(e, d.day)}
            animate={isSuccess ? { boxShadow: ['0 0 0 0 transparent','0 0 20px 6px var(--green)','0 0 0 0 transparent'] } : {}}
            style={{
              padding: '10px 8px', borderRadius: 12, minHeight: 90,
              border: isDropping ? '1.5px solid var(--accent)' : isSuccess ? '1.5px solid var(--green)' : '1px solid var(--glass-border)',
              background: isDropping ? 'var(--accent-dim)' : isSalary ? 'var(--green-dim)' : d.isNegative ? 'var(--red-dim)' : isPast ? 'var(--bg2)' : 'transparent',
              opacity: isPast ? 1 : 0.28, overflow: 'hidden', transition: 'border-color 0.15s,background 0.15s',
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: d.day === currentDay ? 'var(--accent)' : 'var(--text2)', fontFamily: 'var(--mono)' }}>{d.day}</span>
              {isSalary && <span style={{ fontSize: 8, color: 'var(--green)', fontWeight: 700 }}>MAAS</span>}
            </div>
            {isPast && (
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: d.isNegative ? 'var(--red)' : 'var(--text0)', marginBottom: 2 }}>
                {d.isNegative ? '-' : ''}TL{Math.abs(d.balance).toLocaleString('tr-TR')}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
              {dayExps.map(exp => <ExpBadge key={exp.id || exp.name} exp={exp} onDragStart={() => {}} />)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
