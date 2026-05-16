import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Upload, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { parseBankStatement } from '../../lib/pdfParser';
import { useLanguage } from '../../context/LanguageContext';

const uid = () => Math.random().toString(36).slice(2,9);

export default function ExpenseInput({ onComplete }) {
  const { lang, t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const PRESETS = lang === "tr" ? [
    { name: "Kira", amount: "", date: "5", type: "expense" },
    { name: "Elektrik", amount: "", date: "10", type: "expense" },
    { name: "Doğalgaz", amount: "", date: "12", type: "expense" },
    { name: "Netflix", amount: "189", date: "3", type: "subscription", isSubscription: true },
    { name: "Spotify", amount: "69", date: "3", type: "subscription", isSubscription: true },
  ] : [
    { name: "Rent", amount: "", date: "5", type: "expense" },
    { name: "Electricity", amount: "", date: "10", type: "expense" },
    { name: "Gas", amount: "", date: "12", type: "expense" },
    { name: "Netflix", amount: "14.99", date: "3", type: "subscription", isSubscription: true },
    { name: "Spotify", amount: "9.99", date: "3", type: "subscription", isSubscription: true },
  ];
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [scanPct, setScanPct] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const [dynamicCards, setDynamicCards] = useState(() => {
    const saved = localStorage.getItem("insomni_onboarding_cards");
    if (saved) return JSON.parse(saved);
    return lang === "tr" ? [
      { emoji: '📅', title: 'Ödeme Günü Neden Önemli?', desc: 'Maaş günün ile harcama günlerin arasındaki farkı optimize et.' },
      { emoji: '🔄', title: 'Abonelikler Küçük Ama Etkili', desc: 'Aylık abonelikler yıllık bazda ciddi rakamlara ulaşır.' },
      { emoji: '⚡', title: 'Atıl Nakit Tuzağı', desc: 'Paranı faizsiz hesapta tutmak yerine değerlendir.' }
    ] : [
      { emoji: '📅', title: 'Payment Dates', desc: 'Optimize the gap between salary and expenses.' },
      { emoji: '🔄', title: 'Subscriptions', desc: 'Small monthly costs add up annually.' },
      { emoji: '⚡', title: 'Idle Cash', desc: 'Dont let your money sit in zero-yield accounts.' }
    ];
  });

  const [showAria, setShowAria] = useState(() => localStorage.getItem("insomni_hide_aria") !== "true");

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem("insomni_onboarding_cards");
      if (saved) setDynamicCards(JSON.parse(saved));
      setShowAria(localStorage.getItem("insomni_hide_aria") !== "true");
    };
    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, []);

  const addExpense = (preset = null) => {
    setExpenses(p => [...p, preset ? { ...preset, id: uid(), amount: preset.amount || '' } : { id: uid(), name: '', amount: '', date: '1', type: 'expense', isSubscription: false }]);
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
    const valid = expenses.filter(e => e.name && parseFloat(e.amount) > 0);
    onComplete(valid);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="glass" style={{ padding: '40px 44px', marginBottom: 20 }}>
            <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-flex' }}>{lang === 'tr' ? 'Adım 2 / 2' : 'Step 2 / 2'}</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{t.onboarding.expenseTitle}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>{lang === 'tr' ? 'Manuel girin ya da banka ekstrenizi yükleyin.' : 'Enter manually or upload PDF.'}</p>
            <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handlePdfUpload(e.dataTransfer.files[0]); }} onClick={() => { if (!scanning) document.getElementById('pdfInput').click(); }} style={{ border: '2px dashed var(--glass-border)', borderRadius: 16, padding: '24px', textAlign: 'center', cursor: 'pointer', marginBottom: 24, background: dragOver ? 'rgba(129,140,248,0.1)' : 'rgba(0,0,0,0.2)' }}>
              <input id="pdfInput" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handlePdfUpload(e.target.files[0])} />
              {scanning ? (
                <div>
                  <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{scanMsg}</div>
                </div>
              ) : (
                <div><Upload size={24} color="var(--text2)" style={{ marginBottom: 8 }} /><div style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'tr' ? 'PDF banka ekstreni bırak veya tıkla' : 'Drop PDF or click'}</div></div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {expenses.map((exp) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 70px auto auto', gap: 8, alignItems: 'center' }}>
                    <input className="input" placeholder="Harcama" value={exp.name} onChange={e => update(exp.id, 'name', e.target.value)} style={{ fontSize: 13 }} />
                    <input className="input" type="number" placeholder="0" value={exp.amount} onChange={e => update(exp.id, 'amount', e.target.value)} style={{ fontSize: 13 }} />
                    <input className="input" type="number" value={exp.date} onChange={e => update(exp.id, 'date', e.target.value)} style={{ fontSize: 13, textAlign: 'center' }} />
                    <button onClick={() => update(exp.id, 'isSubscription', !exp.isSubscription)} className={'btn btn-sm ' + (exp.isSubscription ? 'btn-accent' : 'btn-ghost')}><RefreshCw size={12} /></button>
                    <button onClick={() => remove(exp.id)} className="btn btn-sm btn-ghost" style={{ color: 'var(--red)' }}><Trash2 size={12} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button onClick={() => addExpense()} className="btn btn-secondary btn-sm" style={{ borderStyle: 'dashed', marginTop: 10 }}><Plus size={14} /> Harcama Ekle</button>
            </div>
          </div>
          <motion.button onClick={submit} whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>{lang === 'tr' ? "Dashboard'a Git" : "Go to Dashboard"} <ArrowRight size={17} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}