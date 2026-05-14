import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';

const Tip = ({ active, payload, label }) => {
  const { lang, t } = useLanguage();
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value || 0;
  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--glass-border)', borderRadius: 12, padding: '10px 16px', boxShadow: 'var(--shadow)' }}>
      <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 3 }}>
        {lang === 'tr' ? 'Gun' : 'Day'} {label}
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: val < 0 ? 'var(--red)' : 'var(--text0)' }}>
        {val < 0 ? '-' : ''}{t.currency}{Math.abs(val).toLocaleString(lang === 'tr' ? 'tr-TR' : 'en-US')}
      </div>
    </div>
  );
};

export default function CashFlowChart({ data = [], currentDay = 31, isOptimized = false }) {
  const sliced = data.slice(0, currentDay);
  const color = isOptimized ? 'var(--green)' : 'var(--accent)';
  const fid = isOptimized ? 'fOpt' : 'fReal';
  
  return (
    <div style={{ width: '100%', height: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sliced} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
          <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text2)', fontFamily: 'var(--mono)' }} tickLine={false} axisLine={false} />
          <YAxis hide domain={['auto', 'auto']} />
          {sliced.some(d => d.balance < 0) && <ReferenceLine y={0} stroke="var(--red)" strokeDasharray="4 4" strokeWidth={1.5} />}
          <Tooltip content={<Tip />} />
          <Area type="monotone" dataKey="balance" stroke={color} strokeWidth={2.5} fill={`url(#${fid})`} dot={false}
            activeDot={{ r: 5, fill: color, stroke: 'var(--bg1)', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
