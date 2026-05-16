import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { getSubscriptions, parseAmount } from '../../lib/calculations';
import { useLanguage } from '../../context/LanguageContext';

const COLORS = ['#818cf8','#34d399','#fbbf24','#f87171','#a78bfa','#60a5fa'];

export default function SubscriptionTracker({ expenses = [], salary = 0 }) {
  const { lang, t } = useLanguage();
  const subs = getSubscriptions(expenses);
  const total = subs.reduce((s, e) => s + parseAmount(e.amount), 0);
  const pct = salary > 0 ? Math.round((total / salary) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={16} color="var(--accent)" />
          </div>
          <div>
            <div className="label">{t.dashboard.subscriptions}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>
              {subs.length} {lang === 'tr' ? 'aktif plan' : 'active plans'}
            </div>
          </div>
        </div>
        <span className="badge badge-accent">%{pct} {lang === 'tr' ? 'maaÅŸ' : 'salary'}</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {subs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text2)', fontSize: 13 }}>
            {lang === 'tr' ? 'HenÃ¼z abonelik eklenmedi' : 'No subscriptions added yet'}
          </div>
        )}
        {subs.map((sub, i) => {
          const amt = parseAmount(sub.amount);
          const color = COLORS[i % COLORS.length];
          return (
            <motion.div key={sub.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--glass-border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.name}</div>
                <div className="progress-bar" style={{ marginTop: 4 }}>
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: (total > 0 ? (amt/total)*100 : 0) + '%' }} transition={{ duration: 0.7, delay: i*0.06 }} style={{ background: color }} />
                </div>
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color, flexShrink: 0 }}>
                {t.currency}{amt.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ paddingTop: 12, borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="label">{lang === 'tr' ? 'AylÄ±k Toplam' : 'Monthly Total'}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700 }}>
            {t.currency}{total.toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="label">{lang === 'tr' ? 'YÄ±llÄ±k Maliyet' : 'Annual Cost'}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>
            {t.currency}{(total*12).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
          </div>
        </div>
      </div>
    </div>
  );
}
