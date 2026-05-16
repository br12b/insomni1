import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Upload, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { parseBankStatement } from '../../lib/pdfParser';
import { useLanguage } from '../../context/LanguageContext';

const uid = () => Math.random().toString(36).slice(2,9);

export default function ExpenseInput({ onComplete }) {
  const { lang, t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [scanPct, setScanPct] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const PRESETS = lang === 'tr' ? [
    { name: 'Kira', amount: '', date: '5', type: 'expense' },
    { name: 'Elektrik', amount: '', date: '10', type: 'expense' },
    { name: 'Dogalgaz', amount: '', date: '12', type: 'expense' },
    { name: 'Netflix', amount: '189', date: '3', type: 'subscription', isSubscription: true },
    { name: 'Spotify', amount: '69', date: '3', type: 'subscription', isSubscription: true },
  ] : [
    { name: 'Rent', amount: '', date: '5', type: 'expense' },
    { name: 'Electricity', amount: '', date: '10', type: 'expense' },
    { name: 'Gas', amount: '', date: '12', type: 'expense' },
    { name: 'Netflix', amount: '14.99', date: '3', type: 'subscription', isSubscription: true },
    { name: 'Spotify', amount: '9.99', date: '3', type: 'subscription', isSubscription: true },
  ];

  const INFO_CARDS = lang === 'tr' ? [
    {
      emoji: 'ğŸ“…',
      title: 'Ã–deme GÃ¼nÃ¼ Neden Ã–nemli?',
      desc: 'MaaÅŸ gÃ¼nÃ¼n ile harcama gÃ¼nlerin arasÄ±ndaki fark, nakdinin ne kadar sÃ¼re boÅŸta beklediÄŸini belirler. Bu sÃ¼reyi optimize ederek PPF getirisini artÄ±rabilirsin.'
    },
    {
      emoji: 'ğŸ”„',
      title: 'Abonelikler KÃ¼Ã§Ã¼k Ama Etkili',
      desc: 'AylÄ±k 200-300 TL gibi gÃ¶rÃ¼nen abonelikler, yÄ±llÄ±k bazda 3.600 TL anlamÄ±na gelir. Insomni bunlarÄ± iÅŸaretleyerek sana tam gÃ¶rÃ¼nÃ¼rlÃ¼k saÄŸlar.'
    },
    {
      emoji: 'âš¡',
      title: 'AtÄ±l Nakit TuzaÄŸÄ±',
      desc: "TÃ¼rkiye'de ortalama bir Ã§alÄ±ÅŸan maaÅŸÄ±nÄ±n %40'Ä±nÄ± faizsiz hesapta tutuyor. Bu paranÄ±n PPF'te deÄŸerlendirilmesi yÄ±lda binlerce TL fark yaratÄ±r."
    },
  ] : [
    {
      emoji: 'ğŸ“…',
      title: 'Why Payment Date Matters',
      desc: 'The gap between your salary day and expense dates determines how long your cash sits idle. Optimizing this timing maximizes your money market returns.'
    },
    {
      emoji: 'ğŸ”„',
      title: 'Subscriptions Add Up Fast',
      desc: 'Subscriptions that seem small ($15-30/mo) add up to $360+ per year. Insomni flags them so you always have full visibility over recurring costs.'
    },
    {
      emoji: 'âš¡',
      title: 'The Idle Cash Trap',
      desc: 'The average person keeps 40% of their salary in a zero-yield account. Putting this money in a money market fund can create thousands in extra returns annually.'
    },
  ];

  const addExpense = (preset = null) => {
    setExpenses(p => [...p, preset
      ? { ...preset, id: uid(), amount: preset.amount || '' }
      : { id: uid(), name: '', amount: '', date: '1', type: 'expense', isSubscription: false }
    ]);
  };

  const update = (id, field, val) => setExpenses(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));
  const remove = (id) => setExpenses(p => p.filter(e => e.id !== id));

  const handlePdfUpload = async (file) => {
    if (!file) return;
    setScanning(true); setScanPct(0); setScanMsg('');
    try {
      const parsed = await parseBankStatement(file, (pct, msg) => { setScanPct(pct); setScanMsg(msg); });
      setExpenses(parsed.map(e => ({ ...e, id: uid() })));
    } finally { setScanning(false); }
  };

  const submit = () => {
    const valid = expenses.filter(e => e.name && parseFloat(e.amount) > 0 && parseInt(e.date) >= 1 && parseInt(e.date) <= 31);
    onComplete(valid);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* LEFT: The Form */}
        <div>
          <div className="glass" style={{ padding: '40px 44px', marginBottom: 20 }}>
            <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-flex' }}>
              {lang === 'tr' ? 'AdÄ±m 2 / 2' : 'Step 2 / 2'}
            </span>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
              {t.onboarding.expenseTitle}
            </h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>
              {lang === 'tr' ? 'Manuel girin ya da banka ekstrenizi yÃ¼kleyin.' : 'Enter manually or upload your bank statement.'}
            </p>

            {/* PDF Drop Zone */}
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handlePdfUpload(e.dataTransfer.files[0]); }}
              onClick={() => { if (!scanning) document.getElementById('pdfInput').click(); }}
              style={{ border: '2px dashed ' + (dragOver ? 'var(--accent)' : 'var(--glass-border)'),
                borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: 24,
                background: dragOver ? 'var(--accent-dim)' : 'var(--bg2)',
                transition: 'all 0.2s' }}>
              <input id="pdfInput" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handlePdfUpload(e.target.files[0])} />
              {scanning ? (
                <div>
                  <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, marginBottom: 6 }}>{scanMsg}</div>
                  <div style={{ height: 4, borderRadius: 9999, background: 'var(--glass-border)', overflow: 'hidden' }}>
                    <motion.div animate={{ width: scanPct + '%' }} transition={{ duration: 0.3 }}
                      style={{ height: '100%', background: 'var(--accent)', borderRadius: 9999 }} />
                  </div>
                </div>
              ) : (
                <div>
                  <Upload size={24} color="var(--text2)" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>
                    {lang === 'tr' ? 'PDF banka ekstreni bÄ±rak veya tÄ±kla' : 'Drop your bank statement PDF or click'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>
                    {lang === 'tr' ? 'Yapay Zeka ile otomatik tarama' : 'Automated scan with AI'}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div style={{ marginBottom: 20 }}>
              <div className="label" style={{ marginBottom: 10 }}>{lang === 'tr' ? 'HÄ±zlÄ± Ekle' : 'Quick Add'}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRESETS.map((p, i) => (
                  <button key={i} onClick={() => addExpense(p)} className="chip">
                    {p.isSubscription ? <RefreshCw size={11} /> : null} {p.name}
                  </button>
                ))}
                <button onClick={() => addExpense()} className="chip"><Plus size={11} /> {lang === 'tr' ? 'BoÅŸ Ekle' : 'Empty'}</button>
              </div>
            </div>

            {/* Expense List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {expenses.map((exp) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 110px 70px auto auto', gap: 8, alignItems: 'center' }}>
                    <input className="input" placeholder={t.onboarding.expenseLabel} value={exp.name} onChange={e => update(exp.id, 'name', e.target.value)} style={{ fontSize: 13, padding: '10px 12px' }} />
                    <input className="input" type="number" placeholder={t.onboarding.amountLabel} value={exp.amount} onChange={e => update(exp.id, 'amount', e.target.value)} style={{ fontSize: 13, padding: '10px 12px' }} />
                    <div style={{ position: 'relative' }}>
                      <Calendar size={13} color="var(--text2)" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input className="input" type="number" min="1" max="31" placeholder={lang === 'tr' ? 'GÃ¼n' : 'Day'} value={exp.date} onChange={e => update(exp.id, 'date', e.target.value)} style={{ fontSize: 13, padding: '10px 8px 10px 26px' }} />
                    </div>
                    <button onClick={() => update(exp.id, 'isSubscription', !exp.isSubscription)}
                      className={'btn btn-sm ' + (exp.isSubscription ? 'btn-accent' : 'btn-ghost')} title={lang === 'tr' ? 'Abonelik' : 'Subscription'}>
                      <RefreshCw size={12} />
                    </button>
                    <button onClick={() => remove(exp.id)} className="btn btn-sm btn-ghost" style={{ color: 'var(--red)' }}>
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <motion.button onClick={submit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
            {lang === 'tr' ? "Dashboard'a Git" : "Go to Dashboard"} ({expenses.length} {lang === 'tr' ? 'kalem' : 'items'}) <ArrowRight size={17} />
          </motion.button>
        </div>

        {/* RIGHT: Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 24 }}>
          {INFO_CARDS.map((card, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 + 0.2 }}
              whileHover={{ y: -3 }}
              className="glass"
              style={{ padding: '22px 24px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{card.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>{card.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>{card.desc}</div>
            </motion.div>
          ))}

          {/* ARIA Tip */}
        </div>

      </div>
    </motion.div>
  );
}
