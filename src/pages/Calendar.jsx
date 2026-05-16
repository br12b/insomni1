import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, MessageSquare, 
  Clock, Wallet, ShoppingBag, Coffee, Play, Smartphone, BellRing, Activity, TrendingDown, ArrowRight
} from 'lucide-react';

const IconMap = ({ name, color }) => {
  const props = { color, size: 18 };
  if (name === 'Coffee') return <Coffee {...props} />;
  if (name === 'Play') return <Play {...props} />;
  if (name === 'Smartphone') return <Smartphone {...props} />;
  if (name === 'ShoppingBag') return <ShoppingBag {...props} />;
  if (name === 'BellRing') return <BellRing {...props} />;
  return <ShoppingBag {...props} />;
};

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(15);
  const [syncedTxs, setSyncedTxs] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('insomni_synced_txs') || '[]');
    setSyncedTxs(data);
  }, []);

  const daysInMonth = 31;
  const startDay = new Date(2026, 4, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }, (_, i) => i);

  const getDailyData = (day) => {
    const localMatches = syncedTxs.filter(tx => tx.day === day || (!tx.day && day === 15));
    let totalExpense = localMatches.reduce((acc, tx) => acc + parseFloat(tx.amount.replace(/[^\d.,]/g, '').replace(',', '.')), 0);
    if (day === 15) totalExpense += 245;
    return { expense: totalExpense, income: day === 1 ? 45000 : 0, txs: localMatches };
  };

  const selectedData = getDailyData(selectedDay);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto' }}>
      <div style={{ marginBottom: 40, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>Financial <span style={{ color: '#6366f1' }}>Journal</span></h1>
          <p style={{ color: '#64748b', fontWeight: 600, marginTop: 4 }}>Siber Veri & Günlük Harcama Analizi</p>
        </div>
        <div className="glass" style={{ padding: '12px 28px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 20, border: '1px solid rgba(0,0,0,0.03)' }}>
          <ChevronLeft size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
          <span style={{ fontWeight: 950, fontSize: 16, color: '#1e293b' }}>MAYIS 2026</span>
          <ChevronRight size={20} color="#94a3b8" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, flex: 1 }}>
        <div className="glass" style={{ padding: 40, borderRadius: 44, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16, textAlign: 'center', marginBottom: 32 }}>
            {['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'].map(d => <div key={d} style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16 }}>
            {blanks.map(b => <div key={`b-${b}`} />)}
            {days.map(d => {
              const data = getDailyData(d);
              const isSelected = d === selectedDay;
              return (
                <motion.div key={d} onClick={() => setSelectedDay(d)} whileHover={{ scale: 1.05 }}
                  style={{ aspectRatio: '1/1', borderRadius: 20, border: isSelected ? '2px solid #6366f1' : '1px solid #f1f5f9', background: isSelected ? 'linear-gradient(135deg, #6366f105, #6366f115)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', boxShadow: isSelected ? '0 15px 30px rgba(99, 102, 241, 0.1)' : 'none' }}>
                  <span style={{ fontSize: 18, fontWeight: 950, color: isSelected ? '#6366f1' : '#1e293b' }}>{d}</span>
                  {data.expense > 0 && <div style={{ position: 'absolute', bottom: 8, width: 5, height: 5, borderRadius: '50%', background: '#ef4444' }} />}
                  {data.income > 0 && <div style={{ position: 'absolute', bottom: 8, width: 5, height: 5, borderRadius: '50%', background: '#10b981' }} />}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <AnimatePresence mode="wait">
            <motion.div key={selectedDay} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="glass" style={{ padding: 40, borderRadius: 44, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(0,0,0,0.02)', boxShadow: '0 40px 80px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                 <div style={{ fontSize: 26, fontWeight: 950, color: '#1e293b' }}>{selectedDay} Mayıs 2026</div>
                 <Activity size={24} color="#6366f1" />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
                 <div style={{ padding: 24, borderRadius: 28, background: '#10b98108', border: '1px solid #10b98110' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#10b981', marginBottom: 10 }}>TOPLAM GELİR</div>
                    <div style={{ fontSize: 24, fontWeight: 950, color: '#064e3b' }}>{selectedData.income.toLocaleString()} ₺</div>
                 </div>
                 <div style={{ padding: 24, borderRadius: 28, background: '#ef444408', border: '1px solid #ef444410' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: '#ef4444', marginBottom: 10 }}>TOPLAM GİDER</div>
                    <div style={{ fontSize: 24, fontWeight: 950, color: '#7f1d1d' }}>-{selectedData.expense.toLocaleString()} ₺</div>
                 </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                 <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', marginBottom: 20, letterSpacing: '0.1em' }}>GÜNLÜK AKIŞ</div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {selectedData.txs.map((tx, i) => (
                      <div key={i} style={{ padding: 20, borderRadius: 24, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${tx.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconMap name={tx.icon} color={tx.color} /></div>
                            <div>
                               <div style={{ fontSize: 15, fontWeight: 900, color: '#1e293b' }}>{tx.clean}</div>
                               <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginTop: 2 }}>{tx.category}</div>
                            </div>
                         </div>
                         <div style={{ fontSize: 16, fontWeight: 950, color: '#ef4444' }}>{tx.amount}</div>
                      </div>
                    ))}
                    {selectedDay === 15 && selectedData.txs.length === 0 && (
                      <div style={{ padding: 20, borderRadius: 24, background: '#f8fafc', border: '1px solid #f1f5f9', fontStyle: 'italic', color: '#94a3b8', fontSize: 13 }}>Sadece manuel girisler mevcut.</div>
                    )}
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
