import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Trash2, Zap, Smartphone, Plane, Home, Car, GraduationCap, Diamond, Coffee, ChevronRight, Activity, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { calculateGoalTimeline, getAggregateGoalStats } from '../lib/financialTools';

const STORAGE_KEY = 'insomni_goals';

const EMOJI_CATEGORIES = [
  { label: 'Teknoloji', emoji: '📱' },
  { label: 'Tatil', emoji: '✈️' },
  { label: 'Ev', emoji: '🏠' },
  { label: 'Araç', emoji: '🚗' },
  { label: 'Eğitim', emoji: '🎓' },
  { label: 'Lüks', emoji: '💎' },
  { label: 'Diğer', emoji: '☕' },
];

function GlobalRadar({ stats, lang }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (stats.overallProgress / 100) * circumference;

  return (
    <div className="glass" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: 40, marginBottom: 40, background: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(16,185,129,0.05))', border: '1px solid var(--accent-dim)' }}>
      <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
        <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="var(--bg2)" strokeWidth="12" />
          <motion.circle 
            cx="70" cy="70" r={radius} fill="transparent" 
            stroke="url(#radarGradient)" strokeWidth="12" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--green)" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--text0)' }}>%{stats.overallProgress}</span>
          <span style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1 }}>{lang === 'tr' ? 'Tamamlandı' : 'Complete'}</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{lang === 'tr' ? 'Genel İlerleme' : 'Overall Progress'}</h3>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 500 }}>
          {lang === 'tr' 
            ? `Toplamda ₺${stats.totalTarget.toLocaleString('tr-TR')} hedefinin ₺${stats.totalSaved.toLocaleString('tr-TR')} kısmına ulaştın. R.E.M tüm hedeflerini saniyeler içinde takip ediyor.`
            : `You have reached ₺${stats.totalSaved.toLocaleString('tr-TR')} of your ₺${stats.totalTarget.toLocaleString('tr-TR')} total goal. R.E.M tracks all your goals in real-time.`}
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 15 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase' }}>{lang === 'tr' ? 'Aktif Hedef' : 'Active Goals'}</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{stats.goalCount}</div>
          </div>
          <div style={{ width: 1, background: 'var(--glass-border)' }} />
          <div>
            <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase' }}>{lang === 'tr' ? 'Kalan Toplam' : 'Total Remaining'}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>₺{(stats.totalTarget - stats.totalSaved).toLocaleString('tr-TR')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ goal, index, financialData, lang }) {
  const timeline = calculateGoalTimeline(financialData, goal.targetAmount, goal.savedAmount);
  if (!timeline.possible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{ minWidth: 200, padding: '15px', borderRadius: 16, background: 'var(--bg2)', border: '1px solid var(--glass-border)', position: 'relative' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{goal.emoji}</div>
      <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{goal.name}</div>
      <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>{timeline.targetDate}</div>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>
        {index + 1}
      </div>
    </motion.div>
  );
}

function GoalCard({ goal, onDelete, financialData, lang }) {
  const progress = goal.targetAmount > 0 ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100) : 0;
  const timeline = calculateGoalTimeline(financialData, goal.targetAmount, goal.savedAmount);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="glass" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 28 }}>{goal.emoji}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{goal.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>₺{goal.targetAmount.toLocaleString('tr-TR')}</div>
          </div>
        </div>
        <button onClick={() => onDelete(goal.id)} className="btn btn-ghost btn-sm" style={{ opacity: 0.4 }}><Trash2 size={14} /></button>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
          <span style={{ color: 'var(--text2)' }}>%{progress.toFixed(0)}</span>
          <span style={{ fontWeight: 700, color: 'var(--green)' }}>{timeline.possible ? timeline.targetDate : '—'}</span>
        </div>
        <div style={{ height: 6, borderRadius: 10, background: 'var(--bg2)', overflow: 'hidden' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent)' }} />
        </div>
      </div>

      {timeline.possible && (
        <div style={{ padding: '10px', borderRadius: 10, background: 'rgba(129,140,248,0.05)', border: '1px dashed var(--accent-dim)', fontSize: 11, color: 'var(--text1)', display: 'flex', gap: 8 }}>
          <Zap size={12} color="var(--accent)" style={{ flexShrink: 0 }} />
          <span>
            {lang === 'tr' ? `Ayda ₺${timeline.effectiveSurplus.toLocaleString('tr-TR')} birikimle hedefe yaklaşıyorsun.` : `Saving ₺${timeline.effectiveSurplus.toLocaleString('tr-TR')}/mo towards your goal.`}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function GoalModal({ onAdd, onClose, lang }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [saved, setSaved] = useState('');
  const [emoji, setEmoji] = useState('📱');

  const submit = (e) => {
    e.preventDefault();
    const target = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!name || !target) return;
    onAdd({
      id: Math.random().toString(36).slice(2),
      name,
      targetAmount: target,
      savedAmount: parseFloat(saved) || 0,
      emoji,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(8px)' }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
        onClick={e => e.stopPropagation()}
        className="glass" style={{ padding: '36px', width: '100%', maxWidth: 440, border: '1px solid var(--glass-border)' }}>
        <h3 style={{ fontWeight: 900, fontSize: 22, marginBottom: 24 }}>{lang === 'tr' ? 'Yeni Hedef Belirle' : 'Set New Goal'}</h3>
        
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 25 }}>
          {EMOJI_CATEGORIES.map(c => (
            <button key={c.emoji} onClick={() => setEmoji(c.emoji)} type="button"
              style={{ fontSize: 24, width: 48, height: 48, borderRadius: 12, border: `2px solid ${emoji === c.emoji ? 'var(--accent)' : 'transparent'}`, background: emoji === c.emoji ? 'var(--accent-dim)' : 'var(--bg2)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {c.emoji}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <input className="input" placeholder={lang === 'tr' ? 'Hedef ismi...' : 'Goal name...'} value={name} onChange={e => setName(e.target.value)} autoFocus />
          <input className="input" placeholder={lang === 'tr' ? 'Hedef tutarı (₺)...' : 'Target amount (₺)...'} value={amount} onChange={e => setAmount(e.target.value)} />
          <input className="input" placeholder={lang === 'tr' ? 'Şu anki birikim (opsiyonel)...' : 'Current savings (optional)...'} value={saved} onChange={e => setSaved(e.target.value)} />
          
          <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>{lang === 'tr' ? 'İptal' : 'Cancel'}</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>{lang === 'tr' ? 'Hedefi Başlat' : 'Start Goal'}</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function Goals({ financialData }) {
  const { lang } = useLanguage();
  const [goals, setGoals] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const stats = useMemo(() => getAggregateGoalStats(financialData, goals), [financialData, goals]);
  const sortedGoals = useMemo(() => {
    return [...goals].sort((a, b) => {
      const tA = calculateGoalTimeline(financialData, a.targetAmount, a.savedAmount);
      const tB = calculateGoalTimeline(financialData, b.targetAmount, b.savedAmount);
      if (!tA.possible) return 1;
      if (!tB.possible) return -1;
      return tA.months - tB.months;
    });
  }, [goals, financialData]);

  const addGoal = (g) => setGoals(prev => [g, ...prev]);
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  return (
    <div style={{ padding: '20px 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>{lang === 'tr' ? 'Hedef Komuta Merkezi' : 'Goal Command Center'}</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6 }}>{lang === 'tr' ? 'R.E.M ile finansal geleceğini saniyeler içinde simüle et.' : 'Simulate your financial future in seconds with R.E.M.'}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ height: 48, padding: '0 24px' }}>
          <Plus size={18} /> {lang === 'tr' ? 'Yeni Hedef' : 'New Goal'}
        </button>
      </div>

      {goals.length > 0 ? (
        <>
          <GlobalRadar stats={stats} lang={lang} />
          
          <div style={{ marginBottom: 40 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Calendar size={16} color="var(--accent)" /> {lang === 'tr' ? 'Zaman Tüneli' : 'Timeline'}
            </h3>
            <div style={{ display: 'flex', gap: 15, overflowX: 'auto', paddingBottom: 10, paddingRight: 20 }} className="hide-scrollbar">
              {sortedGoals.map((g, i) => (
                <TimelineItem key={g.id} goal={g} index={i} financialData={financialData} lang={lang} />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            <AnimatePresence mode="popLayout">
              {goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} financialData={financialData} lang={lang} />
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass" style={{ padding: '80px', textAlign: 'center', border: '2px dashed var(--glass-border)' }}>
          <Activity size={48} color="var(--accent)" style={{ marginBottom: 20, opacity: 0.5 }} />
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{lang === 'tr' ? 'Radar Aktif Değil' : 'Radar Not Active'}</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14, maxWidth: 400, margin: '0 auto 30px' }}>
            {lang === 'tr' ? 'Henüz bir hedef belirlemedin. İlk hedefini eklediğinde R.E.M tüm vizyonunu bu sayfada canlandıracak.' : 'You haven\'t set a goal yet. Add your first goal and R.E.M will bring your entire vision to life on this page.'}
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0 30px' }}>
            <Target size={16} /> {lang === 'tr' ? 'İlk Hedefimi Başlat' : 'Start My First Goal'}
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && <GoalModal onAdd={addGoal} onClose={() => setShowModal(false)} lang={lang} />}
      </AnimatePresence>
    </div>
  );
}

