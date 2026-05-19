import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MessageSquare, 
  Clock, Wallet, ShoppingBag, Coffee, Play, Smartphone, BellRing, Activity, 
  Landmark, Radio, FileText, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, 
  Target, Sparkles, Zap, ShieldCheck, Globe
} from 'lucide-react';
import { getSector } from '../utils/sectors';

const IconMap = ({ name, color, type }) => {
  const props = { color, size: 18 };
  if (type === 'BALANCE') return <Wallet {...props} />;
  if (name === 'Coffee') return <Coffee {...props} />;
  if (name === 'Play') return <Play {...props} />;
  if (name === 'Smartphone') return <Smartphone {...props} />;
  if (name === 'BellRing') return <BellRing {...props} />;
  return <ShoppingBag {...props} />;
};

const SourceIcon = ({ source }) => {
  if (source === 'BANKA GATEWAY' || source === 'BANK GATEWAY') return <Landmark size={10} />;
  if (source === 'OTONOM KÖPRÜ' || source === 'AUTONOMOUS BRIDGE') return <Radio size={10} />;
  return null;
};

export default function Calendar({ financialData }) {
  const { lang, t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [syncedData, setSyncedData] = useState([]);

  // Dynamic month & year state to navigate manual backwards and forwards all the way back to 2026!
  const [currentMonth, setCurrentMonth] = useState(4); // May (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);

  const MONTHS = lang === 'tr'
    ? ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK']
    : ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

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

  useEffect(() => {
    // 1. Load R.E.M Synced Transactions
    const synced = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
    
    // Deduplicate synced transactions by unique ID to prevent multi-sync clone duplication!
    const seenIds = new Set();
    const uniqueSynced = synced.filter(item => {
      if (!item.id) return true;
      if (seenIds.has(item.id)) return false;
      seenIds.add(item.id);
      return true;
    });

    // 2. Use reactive expensesData passed down from parent App state (Direct Information Bridge!)
    const userExpenses = financialData?.expensesData || [];
    
    // 3. Map user expenses to the calendar schema
    const mappedUserExpenses = userExpenses.map(e => {
      const sector = getSector(e.name, lang);
      return {
        id: e.id,
        clean: e.name,
        amount: `-${e.amount}`,
        day: parseInt(e.date) || 15,
        date: e.date, // simple day or full ISO
        category: sector.name, // Display Sector name in category
        type: 'TRANSACTION',
        source: lang === 'tr' ? 'BANKA GATEWAY' : 'BANK GATEWAY',
        color: sector.color, // Display Sector color
        icon: 'ShoppingBag'
      };
    });

    const combined = [
      ...uniqueSynced,
      ...mappedUserExpenses
    ];
    setSyncedData(Array.isArray(combined) ? combined : []);
  }, [lang, financialData]);

  const parseCurrency = (str) => {
    if (!str) return 0;
    const cleaned = str.toString().replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    return Math.abs(parseFloat(cleaned)) || 0;
  };

  const getExpenseMonth = (item) => {
    if (item.date) {
      const strVal = item.date.toString().trim();
      const num = parseInt(strVal);
      if (!isNaN(num) && num >= 1 && num <= 31 && !strVal.includes('-') && !strVal.includes('T')) {
        return 4; // May default (active analysis month)
      }
      const p = new Date(item.date);
      if (!isNaN(p.getTime())) return p.getMonth();
    }
    return 4; // May default
  };

  const getExpenseYear = (item) => {
    if (item.date) {
      const strVal = item.date.toString().trim();
      const num = parseInt(strVal);
      if (!isNaN(num) && num >= 1 && num <= 31 && !strVal.includes('-') && !strVal.includes('T')) {
        return 2026; // 2026 default (active analysis year)
      }
      const p = new Date(item.date);
      if (!isNaN(p.getTime())) return p.getFullYear();
    }
    return 2026; // 2026 default
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = (() => {
    const raw = new Date(currentYear, currentMonth, 1).getDay();
    return raw === 0 ? 6 : raw - 1; // Monday aligned
  })();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const salaryDay = financialData?.salaryData?.day || financialData?.salaryData?.date || 1;
  const salaryIncome = financialData?.salaryData?.income || financialData?.salaryData?.salary || 0;

  const getDailyData = (day) => {
    const isSalaryDay = day === salaryDay && currentMonth === 4 && currentYear === 2026;

    const dailyItems = syncedData.filter(d => {
      const itemD = d.day || 15;
      const itemM = getExpenseMonth(d);
      const itemY = getExpenseYear(d);
      
      const isSimpleDay = !d.date?.toString().includes('-') && !d.date?.toString().includes('T');
      if (isSimpleDay) {
        // Bound simple days strictly to May 2026 so they don't clone across other months!
        return itemD === day && currentMonth === 4 && currentYear === 2026;
      }
      return itemD === day && itemM === currentMonth && itemY === currentYear;
    });

    const txs = dailyItems.filter(d => d.type === 'TRANSACTION');
    
    // Add custom onboarding salary if this is the bounded salary day
    const items = [...dailyItems];
    if (isSalaryDay && salaryIncome > 0) {
      const formattedSalary = `+${Math.round(salaryIncome).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')} ${t.currency || '₺'}`;
      items.push({
        id: 'onboarding-salary',
        clean: lang === 'tr' ? 'Maaş Ödemesi' : 'Salary Payment',
        amount: formattedSalary,
        day: salaryDay,
        category: lang === 'tr' ? 'Maaş' : 'Salary',
        type: 'BALANCE',
        source: lang === 'tr' ? 'OTONOM KÖPRÜ' : 'AUTONOMOUS BRIDGE',
        color: '#10b981',
        icon: 'Wallet'
      });
    }

    const expense = txs.reduce((acc, tx) => acc + parseCurrency(tx.amount), 0);
    const balanceItems = items.filter(d => d.type === 'BALANCE');
    const income = balanceItems.reduce((acc, b) => acc + parseCurrency(b.amount), 0);

    return { expense, income, items };
  };

  const monthlyStats = days.reduce((acc, d) => {
    const data = getDailyData(d);
    return { income: acc.income + data.income, expense: acc.expense + data.expense };
  }, { income: 0, expense: 0 });

  const selectedData = getDailyData(selectedDay);

  const MONTH_NAMES_DISPLAY = lang === 'tr'
    ? ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#fcfdfe' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 40px 20px 40px' }}>
        <div style={{ marginBottom: 40, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 38, fontWeight: 950, margin: 0, letterSpacing: '-0.04em', color: '#1e293b' }}>
              {lang === 'tr' ? <>Finansal <span style={{ color: '#6366f1' }}>Takvim</span></> : <>Financial <span style={{ color: '#6366f1' }}>Calendar</span></>}
            </h1>
          </div>
          <div className="glass" style={{ padding: '12px 28px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 24, border: '1px solid #f1f5f9', background: '#fff' }}>
            <ChevronLeft size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={prevMonth} />
            <span style={{ fontWeight: 950, fontSize: 14, letterSpacing: '0.05em', color: '#1e293b' }}>{MONTHS[currentMonth]} {currentYear}</span>
            <ChevronRight size={18} color="#64748b" style={{ cursor: 'pointer' }} onClick={nextMonth} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, marginBottom: 40 }}>
          <div className="glass" style={{ padding: 40, borderRadius: 48, background: '#fff', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, textAlign: 'center', marginBottom: 32 }}>
              {(lang === 'tr' ? ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).map(d => <div key={d} style={{ fontSize: 11, fontWeight: 950, color: '#cbd5e1' }}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
              {blanks.map(b => <div key={`b-${b}`} />)}
              {days.map(d => {
                const data = getDailyData(d);
                const isSelected = d === selectedDay;
                return (
                  <motion.div key={d} onClick={() => setSelectedDay(d)} whileHover={{ scale: 1.05 }}
                    style={{ 
                      aspectRatio: '1/1', 
                      borderRadius: 20, 
                      border: isSelected ? '2px solid #6366f1' : (data.expense > 0 ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid #f1f5f9'), 
                      background: isSelected ? '#6366f108' : (data.expense > 0 ? 'rgba(239, 68, 68, 0.01)' : '#fff'), 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      position: 'relative', 
                      cursor: 'pointer' 
                    }}>
                    <span style={{ fontSize: 18, fontWeight: 950, color: isSelected ? '#6366f1' : '#1e293b' }}>{d}</span>
                    
                    {/* O GÜN NE KADAR HARCAMA YAPILDIĞI KIRMIZI VE EKSİ OLARAK GÖSTERİLSİN */}
                    {data.expense > 0 && (
                      <span style={{ fontSize: 9, fontWeight: 900, color: '#ef4444', marginTop: 1, fontFamily: 'var(--mono)' }}>
                        -{t.currency}{data.expense.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                    )}

                    <div style={{ position: 'absolute', bottom: 6, display: 'flex', gap: 3 }}>
                      {data.expense > 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />}
                      {data.income > 0 && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <AnimatePresence mode="wait">
              <motion.div key={`${selectedDay}-${currentMonth}-${currentYear}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} 
                className="glass" style={{ padding: 40, borderRadius: 48, background: '#fff', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                  <div><div style={{ fontSize: 11, fontWeight: 900, color: '#6366f1', letterSpacing: '0.1em' }}>{lang === 'tr' ? 'SEÇİLİ GÜN' : 'SELECTED DAY'}</div><div style={{ fontSize: 28, fontWeight: 950, color: '#1e293b' }}>{selectedDay} {MONTH_NAMES_DISPLAY[currentMonth]} {currentYear}</div></div>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}><Activity size={20} color="#6366f1" /></div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                   <div style={{ padding: 20, borderRadius: 24, background: '#10b98105', border: '1px solid #10b98115' }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#10b981', marginBottom: 6 }}>{lang === 'tr' ? 'GELİR' : 'INCOME'}</div>
                      <div style={{ fontSize: 22, fontWeight: 950, color: '#064e3b' }}>{t.currency || '₺'}{selectedData.income.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
                   </div>
                   <div style={{ padding: 20, borderRadius: 24, background: '#ef444405', border: '1px solid #ef444415' }}>
                      <div style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', marginBottom: 6 }}>{lang === 'tr' ? 'GİDER' : 'EXPENSE'}</div>
                      <div style={{ fontSize: 22, fontWeight: 950, color: '#7f1d1d' }}>-{t.currency || '₺'}{selectedData.expense.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
                   </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   {selectedData.items.map((item, i) => {
                     const sector = getSector(item.clean, lang);
                     return (
                       <div key={i} style={{ padding: 18, borderRadius: 20, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                             {/* Render Sector Emoji inside dynamic colored glass badge */}
                             <div style={{ 
                               width: 44, 
                               height: 44, 
                               borderRadius: 12, 
                               background: item.type === 'BALANCE' ? '#10b98110' : `${sector.color}15`, 
                               display: 'flex', 
                               alignItems: 'center', 
                               justifyContent: 'center',
                               fontSize: 20,
                               border: item.type === 'BALANCE' ? '1px solid #10b98125' : `1px solid ${sector.color}25`
                             }}>
                               {item.type === 'BALANCE' ? '💰' : sector.icon}
                             </div>
                             <div>
                               <div style={{ fontSize: 16, fontWeight: 950, color: '#1e293b' }}>{item.clean}</div>
                               <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                                 <span style={{ color: item.type === 'BALANCE' ? '#10b981' : sector.color, fontWeight: 900 }}>
                                   {item.type === 'BALANCE' ? item.category : sector.name}
                                 </span> • <SourceIcon source={item.source} /> {item.source}
                               </div>
                             </div>
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 950, color: item.type === 'BALANCE' ? '#10b981' : '#ef4444' }}>{item.amount}</div>
                       </div>
                     );
                   })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div style={{ height: 100, background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', padding: '0 60px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#10b98110', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} color="#10b981" /></div>
              <div><div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>{lang === 'tr' ? 'AYLIK TOPLAM GELİR' : 'MONTHLY TOTAL INCOME'}</div><div style={{ fontSize: 24, fontWeight: 950, color: '#10b981' }}>{t.currency || '₺'}{monthlyStats.income.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ef444410', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingDown size={20} color="#ef4444" /></div>
              <div><div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>{lang === 'tr' ? 'AYLIK TOPLAM GİDER' : 'MONTHLY TOTAL EXPENSE'}</div><div style={{ fontSize: 24, fontWeight: 950, color: '#ef4444' }}>-{t.currency || '₺'}{monthlyStats.expense.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div></div>
            </div>
          </div>

          <div style={{ padding: '12px 32px', borderRadius: 20, background: '#6366f1', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 950, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>{lang === 'tr' ? 'AYLIK NET DURUM' : 'MONTHLY NET STATUS'}</div>
              <div style={{ fontSize: 28, fontWeight: 950, color: '#fff' }}>{t.currency || '₺'}{(monthlyStats.income - monthlyStats.expense).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={18} color="#fff" fill="#fff" /></div>
          </div>
      </div>
    </motion.div>
  );
}
