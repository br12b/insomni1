import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ExpenseChart({ expenses = [], currency = 'â‚º', salary = 0 }) {
  const { lang } = useLanguage();

  // Generate 30-day timeline
  // Assuming salary comes in on day 1
  const timelineData = [];
  let currentBalance = salary;
  
  // We'll distribute expenses across the month randomly for the visual timelapse effect
  // if they don't have dates. For now, we simulate their occurrence.
  const expenseValues = expenses.map(e => e.amount);
  
  // Simple distribution: subtract a bit every day to simulate cash flow
  for (let i = 1; i <= 30; i++) {
    // If it's a specific day, we drop the balance
    // For demo purposes, we spread expenses evenly across the first 25 days
    let dailyDrop = 0;
    if (i <= 25 && expenses.length > 0) {
      const index = i % expenses.length;
      if (i % 3 === 0) dailyDrop = expenses[index].amount;
    }
    
    currentBalance = Math.max(0, currentBalance - dailyDrop);
    
    timelineData.push({
      day: `${i}`,
      balance: currentBalance
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass" style={{ padding: '12px 16px', border: '1px solid rgba(129,140,248,0.3)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <p style={{ margin: 0, color: 'var(--text2)', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
            {lang === 'tr' ? `GÃ¼n ${label}` : `Day ${label}`}
          </p>
          <p style={{ margin: 0, color: 'var(--accent)', fontSize: 16, fontWeight: 900 }}>
            {payload[0].value.toLocaleString()} {currency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass" style={{ padding: 24, border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', height: 380, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, position: 'relative', zIndex: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(129,140,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={18} color="var(--accent)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{lang === 'tr' ? 'AylÄ±k Nakit AkÄ±ÅŸÄ± (Timelapse)' : 'Monthly Cash Flow Timelapse'}</div>
      </div>
      
      <div style={{ flex: 1, width: '100%', minHeight: 0, marginLeft: -20, position: 'relative', zIndex: 10 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
            <XAxis dataKey="day" stroke="var(--text2)" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
            <YAxis stroke="var(--text2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}`} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 100, background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />
    </div>
  );
}
