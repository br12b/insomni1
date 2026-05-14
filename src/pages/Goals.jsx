import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Trash2, Zap, Coffee, Car, Home, Smartphone, Plane, GraduationCap, Diamond } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { calculateGoalTimeline } from '../lib/financialTools';

const STORAGE_KEY = 'insomni_goals';

const EMOJI_CATEGORIES = [
  { icon: Smartphone, label: 'Teknoloji', emoji: '📱' },
  { icon: Plane, label: 'Tatil', emoji: '✈️' },
  { icon: Home, label: 'Ev', emoji: '🏠' },
  { icon: Car, label: 'Araç', emoji: '🚗' },
  { icon: GraduationCap, label: 'Eğitim', emoji: '🎓' },
  { icon: Diamond, label: 'Lüks', emoji: '💎' },
  { icon: Coffee, label: 'Diğer', emoji: '☕' },
];

function GoalCard({ goal, onDelete, financialData, lang }) {
  const progress = goal.targetAmount > 0 ? Math.min(100, (goal.savedAmount / goal.targetAmount) * 100) : 0;
  const timeline = calculateGoalTimeline(financialData, goal.targetAmount, goal.savedAmount);
  const remaining = goal.targetAmount - goal.savedAmount;

  // 3 Strateji hesapla
  const strategies = [
    {
      label: lang === 'tr' ? '🐢 Konforlu' : '🐢 Comfortable',
      desc: lang === 'tr' ? 'Mevcut harcamalar değişmez' : 'No changes to expenses',
      months: timeline.possible ? timeline.months : null,
      color: 'var(--green)',
    },
    {
      label: lang === 'tr' ? '⚡ Optimize' : '⚡ Optimized',
      desc: lang === 'tr' ? 'PPF + zamanlama optimizasyonu' : 'PPF + timing optimization',
      months: timeline.possible ? Math.max(1, Math.ceil(timeline.months * 0.8)) : null,
      color: 'var(--accent)',
    },
    {
      label: lang === 'tr' ? '🚀 Agresif' : '🚀 Aggressive',
      desc: lang === 'tr' ? 'Gereksiz harcamalar kesilirse' : 'Cut unnecessary expenses',
      months: timeline.possible ? Math.max(1, Math.ceil(timeline.months * 0.6)) : null,
      color: 'var(--amber)',
    },
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass"
      style={{ padding: '24px 28px', border: '1px solid var(--glass-border)' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 32 }}>{goal.emoji}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.02em' }}>{goal.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>
              {lang === 'tr' ? 'Hedef:' : 'Target:'} <b style={{ color: 'var(--text0)' }}>₺{goal.targetAmount.toLocaleString('tr-TR')}</b>
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(goal.id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)', opacity: 0.6 }}>
          <Trash2 size={14} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
            ₺{goal.savedAmount.toLocaleString('tr-TR')} / ₺{goal.targetAmount.toLocaleString('tr-TR')}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>%{progress.toFixed(0)}</span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: 'var(--bg2)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, var(--accent), var(--green))' }}
          />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
          {lang === 'tr' ? 'Kalan:' : 'Remaining:'} ₺{remaining.toLocaleString('tr-TR')}
        </div>
      </div>

      {/* Strategy Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        {strategies.map((s, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: 'var(--bg2)', border: `1px solid ${s.color}22`, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>
              {s.months ? `${s.months} ay` : '—'}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, lineHeight: 1.3 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* R.E.M Insight */}
      {timeline.possible && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <Zap size={14} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
            <b style={{ color: 'var(--accent)' }}>R.E.M:</b>{' '}
            {lang === 'tr'
              ? `PPF getirisi dahil aylık ₺${timeline.effectiveSurplus?.toLocaleString('tr-TR')} ile bu hedefe ${timeline.targetDate} itibarıyla ulaşabilirsin. PPF katkısı toplamda ₺${timeline.ppfTotalBoost?.toLocaleString('tr-TR')} ekstra kazandırır.`
              : `With ₺${timeline.effectiveSurplus?.toLocaleString('tr-TR')}/mo including PPF, you can reach this goal by ${timeline.targetDate}. PPF adds ₺${timeline.ppfTotalBoost?.toLocaleString('tr-TR')} in total.`}
          </div>
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
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="glass" style={{ padding: '36px', width: '100%', maxWidth: 480, border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <Target size={20} color="var(--accent)" />
          <h3 style={{ fontWeight: 800, fontSize: 20 }}>{lang === 'tr' ? 'Yeni Hedef' : 'New Goal'}</h3>
        </div>

        {/* Emoji Seçici */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 10 }}>{lang === 'tr' ? 'Kategori' : 'Category'}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EMOJI_CATEGORIES.map(c => (
              <button key={c.emoji} onClick={() => setEmoji(c.emoji)} type="button"
                style={{ fontSize: 22, width: 44, height: 44, borderRadius: 10, border: `2px solid ${emoji === c.emoji ? 'var(--accent)' : 'var(--glass-border)'}`, background: emoji === c.emoji ? 'var(--accent-dim)' : 'var(--bg2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.emoji}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>{lang === 'tr' ? 'Hedef Adı' : 'Goal Name'}</label>
            <input className="input" placeholder={lang === 'tr' ? 'örn: Macbook Pro M4' : 'e.g. Macbook Pro M4'} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>{lang === 'tr' ? 'Hedef Tutarı (₺)' : 'Target Amount (₺)'}</label>
            <input className="input" type="text" inputMode="decimal" placeholder="85.000" value={amount} onChange={e => setAmount(e.target.value)} />
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>{lang === 'tr' ? 'Şu An Var mı? (opsiyonel)' : 'Currently Saved? (optional)'}</label>
            <input className="input" type="text" inputMode="decimal" placeholder="0" value={saved} onChange={e => setSaved(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
              {lang === 'tr' ? 'Vazgeç' : 'Cancel'}
            </button>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              <Target size={15} /> {lang === 'tr' ? 'Hedef Belirle' : 'Set Goal'}
            </motion.button>
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

  const addGoal = (g) => setGoals(prev => [g, ...prev]);
  const deleteGoal = (id) => setGoals(prev => prev.filter(g => g.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 40px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>
            {lang === 'tr' ? 'Hedeflerim' : 'My Goals'}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>
            {lang === 'tr'
              ? 'R.E.M, mevcut nakit akışınla her hedefe ne zaman ulaşacağını hesaplar.'
              : 'R.E.M calculates when you can reach each goal with your current cash flow.'}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> {lang === 'tr' ? 'Yeni Hedef' : 'New Goal'}
        </motion.button>
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass" style={{ padding: '60px', textAlign: 'center', border: '2px dashed var(--glass-border)' }}>
          <Target size={40} color="var(--text2)" style={{ marginBottom: 16, opacity: 0.5 }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            {lang === 'tr' ? 'Henüz hedef yok' : 'No goals yet'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24 }}>
            {lang === 'tr'
              ? 'İlk hedefinizi belirleyin. R.E.M sizin için en hızlı yolu hesaplayacak.'
              : 'Set your first goal. R.E.M will calculate the fastest path for you.'}
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={15} /> {lang === 'tr' ? 'İlk Hedefimi Belirle' : 'Set My First Goal'}
          </button>
        </motion.div>
      )}

      {/* Goal Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
        <AnimatePresence>
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} financialData={financialData} lang={lang} />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <GoalModal onAdd={addGoal} onClose={() => setShowModal(false)} lang={lang} />}
      </AnimatePresence>
    </motion.div>
  );
}
