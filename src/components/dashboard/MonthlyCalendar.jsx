import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { parseAmount } from '../../lib/calculations';
import { useLanguage } from '../../context/LanguageContext';
import { getSector } from '../../utils/sectors';
import PremiumIcon from '../ui/PremiumIcon';
import { Calendar } from 'lucide-react';


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

// Secure month parser to map expenses to their correct month
const getExpenseMonth = (dateVal) => {
  if (!dateVal) return new Date().getMonth();
  const strVal = dateVal.toString().trim();
  if (strVal.includes('-') || strVal.includes('T')) {
    const parsedDate = new Date(strVal);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getMonth();
    }
  }
  return 4; // default to May (active month under analysis)
};

// Secure year parser
const getExpenseYear = (dateVal) => {
  if (!dateVal) return 2026;
  const strVal = dateVal.toString().trim();
  if (strVal.includes('-') || strVal.includes('T')) {
    const parsedDate = new Date(strVal);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.getFullYear();
    }
  }
  return 2026; // default to active 2026
};

function ExpBadge({ exp, onDragStart, lang, currency }) {
  const sector = getSector(exp.name, lang);
  return (
    <div draggable onDragStart={e => { e.dataTransfer.setData('expId', exp.id); onDragStart?.(exp.id); }}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 4, 
        padding: '3px 8px', 
        borderRadius: 8,
        background: `${sector.color}15`,
        color: sector.color,
        border: `1px solid ${sector.color}35`,
        fontSize: 10, 
        fontWeight: 700, 
        cursor: 'grab', 
        userSelect: 'none', 
        marginTop: 3,
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap', 
        maxWidth: '100%',
        boxShadow: `0 2px 6px ${sector.color}08`
      }}
      title={exp.name + ' (' + sector.name + '): ' + currency + parseAmount(exp.amount).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}>
      <PremiumIcon iconStr={sector.icon} size={10} color={sector.color} />
      <span>{exp.name.length > 9 ? exp.name.slice(0,9) + '..' : exp.name}</span>
    </div>
  );
}

export default function MonthlyCalendar({ expenses = [], salaryDay = 1, income = 0, onExpenseDateChange }) {
  const { lang, t } = useLanguage();
  const [dropTarget, setDropTarget] = useState(null);
  const [dropSuccess, setDropSuccess] = useState(null);

  // Dynamic calendar states to navigate manual months and years backwards and forwards all the way to 2026!
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026); // Default 2026

  const MONTHS = lang === 'tr'
    ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const WEEKDAYS = lang === 'tr'
    ? ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // Dynamic Gregorian Calendar grid logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayIndex = (() => {
    const rawIndex = new Date(currentYear, currentMonth, 1).getDay();
    return rawIndex === 0 ? 6 : rawIndex - 1; // Align to Monday as 0
  })();

  // Generate dynamic active balances for navigated month
  let runningBalance = 0;
  const activeDailyBalances = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    
    // Bounding the salary deposit strictly to May 2026 so it is not duplicated in other months!
    const isSalary = day === salaryDay && currentMonth === 4 && currentYear === 2026;
    if (isSalary) {
      runningBalance += income;
    }
    
    // Filter expenses that match BOTH this day AND this navigated month/year
    const dayExps = expenses.filter(e => {
      const expD = getExpenseDay(e.date);
      const expM = getExpenseMonth(e.date);
      const expY = getExpenseYear(e.date);
      
      const isSimpleDay = !e.date.toString().includes('-') && !e.date.toString().includes('T');
      if (isSimpleDay) {
        // Bound simple days strictly to May 2026 so they don't clone across other months!
        return expD === day && currentMonth === 4 && currentYear === 2026;
      }
      return expD === day && expM === currentMonth && expY === currentYear;
    });

    const dayTotal = dayExps.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    runningBalance -= dayTotal;
    return { day, balance: runningBalance, dayTotal, isNegative: runningBalance < 0, dayExps };
  });

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Dynamic Month/Year Selector with Navigation Arrows */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text1)', letterSpacing: '-0.02em', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color="var(--accent)" style={{ filter: 'drop-shadow(0 0 6px rgba(129,140,248,0.4))' }} /> {MONTHS[currentMonth]} {currentYear}
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={prevMonth}
            style={{ 
              background: 'rgba(129, 140, 248, 0.06)', 
              border: '1px solid rgba(129, 140, 248, 0.25)', 
              borderRadius: 8, 
              padding: '6px 12px', 
              color: 'var(--accent)', 
              cursor: 'pointer',
              fontWeight: 800,
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(129, 140, 248, 0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(129, 140, 248, 0.06)'}
          >
            ◀
          </button>
          <button 
            onClick={nextMonth}
            style={{ 
              background: 'rgba(129, 140, 248, 0.06)', 
              border: '1px solid rgba(129, 140, 248, 0.25)', 
              borderRadius: 8, 
              padding: '6px 12px', 
              color: 'var(--accent)', 
              cursor: 'pointer',
              fontWeight: 800,
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(129, 140, 248, 0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(129, 140, 248, 0.06)'}
          >
            ▶
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, textAlign: 'center' }}>
        {WEEKDAYS.map((w, idx) => (
          <div key={idx} style={{ fontSize: 10, fontWeight: 900, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {w}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        
        {/* Monday Padding empty slots */}
        {Array.from({ length: startDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} style={{ minHeight: 92, background: 'transparent' }} />
        ))}

        {/* Dynamic Month Days */}
        {activeDailyBalances.map(d => {
          // Bounding payday display strictly to May 2026!
          const isSalary = d.day === salaryDay && currentMonth === 4 && currentYear === 2026;
          const isDropping = dropTarget === d.day;
          const isSuccess = dropSuccess === d.day;
          
          const isToday = currentYear === 2026 && currentMonth === 4 && d.day === 18;
          const hasExpenses = d.dayTotal > 0;

          return (
            <motion.div key={d.day}
              whileHover={{ scale: 1.03, zIndex: 20 }}
              onDragOver={e => { e.preventDefault(); setDropTarget(d.day); }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={e => handleDrop(e, d.day)}
              animate={isSuccess ? { boxShadow: ['0 0 0 0 transparent','0 0 20px 6px var(--green)','0 0 0 0 transparent'] } : {}}
              style={{
                padding: '10px 8px', 
                borderRadius: 12, 
                minHeight: 92,
                border: isToday
                  ? '2px solid var(--accent)'
                  : (isDropping ? '1.5px solid var(--accent)' : isSuccess ? '1.5px solid var(--green)' : hasExpenses ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)'),
                background: isDropping 
                  ? 'var(--accent-dim)' 
                  : (isSalary ? 'var(--green-dim)' : hasExpenses ? 'rgba(239, 68, 68, 0.02)' : 'rgba(255, 255, 255, 0.02)'),
                boxShadow: isToday ? '0 0 15px rgba(129, 140, 248, 0.15)' : 'none',
                overflow: 'hidden', 
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? 'var(--accent)' : 'var(--text2)', fontFamily: 'var(--mono)' }}>
                  {d.day}
                </span>
                {isSalary && <span style={{ fontSize: 8, color: 'var(--green)', fontWeight: 700 }}>{lang === 'tr' ? 'MAAŞ' : 'PAYDAY'}</span>}
              </div>
              
              {/* O GÜN NE KADAR HARCAMA YAPILDIĞI KIRMIZI OLARAK GÖSTERİLSİN */}
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 800, color: '#ef4444', marginBottom: 2 }}>
                {hasExpenses ? `-${t.currency}${d.dayTotal.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}` : ''}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
                {isSalary && income > 0 && (
                  <div
                    style={{
                      display: 'inline-flex',
                      padding: '2px 7px',
                      borderRadius: 8,
                      background: 'rgba(16,185,129,0.15)',
                      color: '#10b981',
                      fontSize: 10,
                      fontWeight: 800,
                      marginTop: 3,
                      border: '1px solid rgba(16,185,129,0.25)',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                      boxShadow: '0 0 10px rgba(16,185,129,0.1)'
                    }}
                  >
                    +{Math.round(income).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} {t.currency}
                  </div>
                )}
                {d.dayExps.map(exp => <ExpBadge key={exp.id || exp.name} exp={exp} onDragStart={() => {}} lang={lang} currency={t.currency} />)}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
