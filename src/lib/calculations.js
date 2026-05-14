export const BBVA_DAILY_RATE = parseFloat(import.meta.env.VITE_BBVA_DAILY_RATE) || 0.0017;
export const BBVA_ANNUAL_RATE = parseFloat(import.meta.env.VITE_BBVA_ANNUAL_RATE) || 62;

export function parseAmount(v) {
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  return parseFloat(String(v || '0').replace(/[^0-9.-]/g, '')) || 0;
}

export function calculateDailyBalances(salary, salaryDay, expenses) {
  const result = [];
  let balance = 0;
  const sal = parseAmount(salary);
  const salDay = parseInt(salaryDay) || 1;
  const exps = Array.isArray(expenses) ? expenses : [];
  for (let day = 1; day <= 31; day++) {
    if (day === salDay) balance += sal;
    const dayExpenses = exps.filter(e => parseInt(e.date) === day);
    dayExpenses.forEach(e => { balance -= parseAmount(e.amount); });
    const snap = Math.round(balance * 100) / 100;
    result.push({ day, balance: snap, expenses: dayExpenses, isNegative: snap < 0, dailyYield: snap > 0 ? Math.round(snap * BBVA_DAILY_RATE * 100) / 100 : 0 });
  }
  return result;
}

export function calculateOpportunityCost(db) {
  return Math.round(db.reduce((s, d) => s + (d.dailyYield || 0), 0) * 100) / 100;
}

export function calculateTimeGap(salaryDay, expenses) {
  const exps = Array.isArray(expenses) ? expenses : [];
  if (!exps.length) return { avgGap: 0, maxGap: 0, idleDays: 0 };
  const days = exps.map(e => parseInt(e.date) || 1).sort((a, b) => a - b);
  const gaps = days.map(d => d >= salaryDay ? d - salaryDay : 31 - salaryDay + d);
  return {
    avgGap: Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length),
    maxGap: Math.max(...gaps),
    idleDays: Math.max(0, days[0] - salaryDay),
  };
}

export function calculateHealthScore(db, salary) {
  if (!salary || !db.length) return 0;
  const sal = parseAmount(salary);
  if (!sal) return 0;
  const neg = (db.filter(d => d.isNegative).length / 31) * 50;
  const bals = db.map(d => d.balance);
  const mean = bals.reduce((s, v) => s + v, 0) / bals.length;
  const vp = Math.min(30, (Math.sqrt(bals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / bals.length) / sal) * 30);
  return Math.max(0, Math.min(100, Math.round(100 - neg - vp)));
}

export function optimizeExpenseDates(expenses, salaryDay) {
  const sal = parseInt(salaryDay) || 1;
  return expenses.map((e, i) => ({ ...e, _originalDate: e.date, date: Math.min(sal + 1 + (i % 3), 28) }));
}



export function getSubscriptions(expenses) {
  const keywords = ['netflix', 'spotify', 'youtube', 'premium', 'icloud', 'disney', 'amazon', 'prime', 'game pass', 'plus', 'abone', 'subscription', 'sigorta', 'kira', 'aidat', 'gym', 'fitness'];
  return (expenses || []).filter(e => {
    const desc = (e.description || '').toLowerCase();
    const cat = (e.category || '').toLowerCase();
    const isManualSub = e.type === 'subscription' || e.category === 'Abonelik' || e.isSubscription;
    return keywords.some(k => desc.includes(k) || cat.includes(k)) || isManualSub;
  });
}


export function getRegularExpenses(expenses) {
  return (expenses || []).filter(e => e.type !== 'subscription' && !e.isSubscription);
}

export function formatTL(amount, decimals = 0) {
  return parseAmount(amount).toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}