import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SalaryInput({ onComplete }) {
  const { lang, t } = useLanguage();
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('1');
  const [err, setErr] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const s = parseFloat(salary.replace(/[^0-9.]/g, ''));
    if (!s || s < 1) { 
      setErr(lang === 'tr' ? 'Geçerli bir maaş giriniz.' : 'Please enter a valid salary.'); 
      return; 
    }
    const d = parseInt(date);
    if (!d || d < 1 || d > 31) { 
      setErr(lang === 'tr' ? 'Gün 1-31 arasında olmalı.' : 'Day must be between 1 and 31.'); 
      return; 
    }
    onComplete({ salary: s, date: d });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="glass" style={{ width: '100%', maxWidth: 520, padding: '48px' }}>
        <div style={{ marginBottom: 8 }}>
          <span className="badge badge-accent">
            {lang === 'tr' ? 'Adım 1 / 2' : 'Step 1 / 2'}
          </span>
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {t.onboarding.salaryTitle}
        </h2>
        <p style={{ color: 'var(--text2)', marginBottom: 36, fontSize: 14 }}>
          {t.onboarding.salaryDesc}
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>
              {t.onboarding.salaryLabel} ({t.currency})
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: 16, color: 'var(--text2)', fontWeight: 600 }}>
                {t.currency}
              </div>
              <input className="input" type="text" inputMode="decimal" placeholder="25.000"
                value={salary} onChange={e => setSalary(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label className="label" style={{ display: 'block', marginBottom: 8 }}>
              {t.onboarding.dateLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} color="var(--text2)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input className="input" type="number" min="1" max="31" placeholder="15"
                value={date} onChange={e => setDate(e.target.value)} style={{ paddingLeft: 40 }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>
              {lang === 'tr' ? "Örnek: Ayın 15'inde maaş yatıyorsa 15 girin." : "Example: If salary is paid on the 15th, enter 15."}
            </div>
          </div>
          {err && <div style={{ fontSize: 13, color: 'var(--red)', padding: '10px 14px', borderRadius: 10, background: 'var(--red-dim)' }}>{err}</div>}
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="btn btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
            {lang === 'tr' ? 'Harcamaları Gir' : 'Enter Expenses'} <ArrowRight size={17} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
