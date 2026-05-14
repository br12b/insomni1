import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  TrendingDown, 
  TrendingUp,
  MessageSquare,
  Clock
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Calendar({ financialData }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 15)); // Start May 15, 2026
  const [selectedDay, setSelectedDay] = useState(15);

  const daysInMonth = 31;
  const startDay = new Date(2026, 4, 1).getDay(); // May 2026 starts on Friday

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }, (_, i) => i);

  // Simulated daily data
  const getDailyData = (day) => {
    if (day === 15) return { expense: 245, income: 0, notes: 'Migros Market alışverişi yapıldı.' };
    if (day === 14) return { expense: 59, income: 0, notes: 'Spotify üyeliği yenilendi.' };
    if (day === 1) return { expense: 0, income: 45000, notes: 'Maaş ödemesi hesaba geçti.' };
    return { expense: 0, income: 0, notes: 'Harcama girişi yok.' };
  };

  const selectedData = getDailyData(selectedDay);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 40px 40px 40px', overflowY: 'auto' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40, marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 950, margin: 0, letterSpacing: '-0.02em' }}>
            Financial <span style={{ color: 'var(--accent)' }}>Journal</span>
          </h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0 0' }}>Daily Ledger & Record Tracking</p>
        </div>
        <div className="glass" style={{ padding: '12px 24px', borderRadius: 100, display: 'flex', alignItems: 'center', gap: 16 }}>
          <ChevronLeft size={20} style={{ cursor: 'pointer' }} />
          <span style={{ fontWeight: 900, fontSize: 16 }}>MAYIS 2026</span>
          <ChevronRight size={20} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32, flex: 1 }}>
        
        {/* CALENDAR GRID */}
        <div className="glass" style={{ padding: 32, borderRadius: 32, border: '1px solid var(--accent-dim)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, textAlign: 'center', marginBottom: 20 }}>
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
              <div key={d} style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 1 }}>{d.toUpperCase()}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12 }}>
            {blanks.map(b => <div key={`b-${b}`} />)}
            {days.map(d => {
              const data = getDailyData(d);
              const isToday = d === 15;
              const isSelected = d === selectedDay;
              
              return (
                <motion.div 
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    aspectRatio: '1/1', borderRadius: 16, border: isSelected ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                    background: isSelected ? 'var(--accent-dim)' : 'rgba(255,255,255,0.02)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer'
                  }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: isSelected ? 'var(--accent)' : 'var(--text1)' }}>{d}</span>
                  {data.expense > 0 && <div style={{ position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />}
                  {data.income > 0 && <div style={{ position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />}
                  {isToday && <div style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, fontWeight: 900, color: 'var(--accent)' }}>BUGÜN</div>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* DAY DETAILS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass" 
              style={{ padding: 40, border: '1px solid var(--accent-dim)', background: 'linear-gradient(135deg, rgba(129,140,248,0.05), transparent)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                 <div style={{ fontSize: 24, fontWeight: 900 }}>{selectedDay} Mayıs 2026</div>
                 <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', fontSize: 11, fontWeight: 800 }}>DETAYLAR</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                 <div className="glass" style={{ padding: 20, background: 'rgba(16,185,129,0.05)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#10b981', marginBottom: 8 }}>GÜNLÜK GELİR</div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{selectedData.income} ₺</div>
                 </div>
                 <div className="glass" style={{ padding: 20, background: 'rgba(239,68,68,0.05)' }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>GÜNLÜK GİDER</div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>{selectedData.expense} ₺</div>
                 </div>
              </div>

              <div style={{ marginBottom: 32 }}>
                 <div style={{ fontSize: 12, fontWeight: 900, color: 'var(--text2)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MessageSquare size={14} /> R.E.M GÜNLÜK NOTU
                 </div>
                 <div style={{ fontSize: 14, color: 'var(--text1)', lineHeight: 1.6, fontStyle: 'italic', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                    "{selectedData.notes}"
                 </div>
              </div>

              <button className="btn btn-ghost" style={{ width: '100%', gap: 10, border: '1px dashed var(--glass-border)', padding: '16px' }}>
                 <Plus size={18} /> Yeni Kayıt Ekle
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="glass" style={{ padding: 32 }}>
             <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Clock size={18} color="var(--accent)" /> Yaklaşan Ödemeler
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { name: 'Kira Ödemesi', date: '20 Mayıs', amount: '12.500' },
                  { name: 'İnternet Faturası', date: '22 Mayıs', amount: '450' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{item.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: 'var(--accent)' }}>{item.amount} ₺</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
