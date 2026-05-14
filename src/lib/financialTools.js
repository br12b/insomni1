import { BBVA_DAILY_RATE } from './calculations';

/**
 * ARIA Tool Kit â€” Her fonksiyon Gemini'nin Ã§aÄŸÄ±rabileceÄŸi bir araÃ§tÄ±r.
 * GerÃ§ek finansal veriye dayalÄ± hesaplamalar yapar.
 */

export function getCashFlowSummary(financialData) {
  const { salary = 0, expenses = [], dailyBalances = [], opportunityCost = 0, healthScore = 0 } = financialData || {};
  const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const monthlySurplus = salary - totalExpenses;
  const avgBalance = dailyBalances.length
    ? dailyBalances.reduce((s, d) => s + d.balance, 0) / dailyBalances.length
    : 0;
  const negativeDays = dailyBalances.filter(d => d.isNegative).length;

  return {
    salary,
    totalExpenses,
    monthlySurplus,
    avgIdleBalance: Math.round(avgBalance),
    opportunityCost: Math.round(opportunityCost),
    healthScore,
    negativeDays,
    ppfMonthlyPotential: Math.round(Math.max(0, avgBalance) * BBVA_DAILY_RATE * 30),
  };
}

export function simulateExpenseRemoval(financialData, expenseName) {
  const { salary = 0, expenses = [], goals = [] } = financialData || {};
  const name = (expenseName || '').toLowerCase();
  const target = expenses.find(e => (e.name || '').toLowerCase().includes(name));
  if (!target) return { found: false, message: `"${expenseName}" adÄ±nda bir harcama bulunamadÄ±.` };

  const monthlyGain = parseFloat(target.amount) || 0;
  const annualGain = monthlyGain * 12;
  const ppfBonus = Math.round(monthlyGain * BBVA_DAILY_RATE * 30 * 12);

  // Goal impact hesapla
  const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const currentSurplus = salary - totalExpenses;
  const newSurplus = currentSurplus + monthlyGain;

  const goalImpacts = goals.map(g => {
    const remaining = (g.targetAmount || 0) - (g.savedAmount || 0);
    const oldMonths = remaining > 0 && currentSurplus > 0 ? Math.ceil(remaining / currentSurplus) : null;
    const newMonths = remaining > 0 && newSurplus > 0 ? Math.ceil(remaining / newSurplus) : null;
    const saved = oldMonths && newMonths ? oldMonths - newMonths : null;
    return { goalName: g.name, savedMonths: saved };
  }).filter(g => g.savedMonths > 0);

  return {
    found: true,
    expenseName: target.name,
    monthlyGain,
    annualGain,
    ppfBonus,
    totalYearlyBenefit: annualGain + ppfBonus,
    goalImpacts,
  };
}

export function calculateGoalTimeline(financialData, goalAmount, currentSaved = 0) {
  const { salary = 0, expenses = [] } = financialData || {};
  const totalExpenses = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const monthlySurplus = salary - totalExpenses;
  const avgIdle = Math.max(0, monthlySurplus);
  const ppfMonthly = Math.round(avgIdle * BBVA_DAILY_RATE * 30);
  const effectiveSurplus = monthlySurplus + ppfMonthly;
  const remaining = goalAmount - currentSaved;

  if (effectiveSurplus <= 0) {
    return { possible: false, message: 'Mevcut gider yapÄ±sÄ±yla bu hedefe ulaÅŸmak mÃ¼mkÃ¼n gÃ¶rÃ¼nmÃ¼yor. Giderleri azaltman gerekiyor.' };
  }

  const months = Math.ceil(remaining / effectiveSurplus);
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);

  return {
    possible: true,
    months,
    targetDate: targetDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
    monthlySurplus: Math.round(monthlySurplus),
    ppfMonthly,
    effectiveSurplus: Math.round(effectiveSurplus),
    ppfTotalBoost: Math.round(ppfMonthly * months),
  };
}

export function findIdleCashOpportunity(financialData) {
  const { dailyBalances = [], expenses = [], salary = 0 } = financialData || {};
  const positiveDays = dailyBalances.filter(d => d.balance > 0);
  const avgIdle = positiveDays.length
    ? positiveDays.reduce((s, d) => s + d.balance, 0) / positiveDays.length
    : 0;
  const dailyYield = avgIdle * BBVA_DAILY_RATE;
  const monthlyYield = dailyYield * 30;
  const annualYield = dailyYield * 365;
  const idleDays = positiveDays.length;

  return {
    avgIdleBalance: Math.round(avgIdle),
    idleDays,
    dailyYield: Math.round(dailyYield * 100) / 100,
    monthlyYield: Math.round(monthlyYield),
    annualYield: Math.round(annualYield),
    recommendation: monthlyYield > 500
      ? 'Bu miktar PPF iÃ§in kesinlikle deÄŸerlendirilebilir.'
      : 'AtÄ±l nakdin gÃ¶rece dÃ¼ÅŸÃ¼k, daha fazla optimizasyon gerekiyor.',
  };
}

export function getSubscriptionBreakdown(financialData) {
  const { expenses = [], salary = 0 } = financialData || {};
  const subs = expenses.filter(e => e.isSubscription || (e.category || '').toLowerCase().includes('abone'));
  const totalMonthly = subs.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const salaryPercent = salary > 0 ? ((totalMonthly / salary) * 100).toFixed(1) : 0;

  return {
    subscriptions: subs.map(e => ({
      name: e.name,
      monthly: parseFloat(e.amount) || 0,
      annual: Math.round((parseFloat(e.amount) || 0) * 12),
    })),
    totalMonthly: Math.round(totalMonthly),
    totalAnnual: Math.round(totalMonthly * 12),
    salaryPercent,
    verdict: salaryPercent > 10
      ? 'Abonelikler maaÅŸÄ±nÄ±n %10\'unu aÅŸÄ±yor. GÃ¶zden geÃ§irmen Ã¶neriliyor.'
      : 'Abonelik harcamalarÄ± makul seviyede.',
  };
}

export function optimizeExpenseTiming(financialData) {
  const { expenses = [], salaryDay = 1, salary = 0 } = financialData || {};
  const suggestions = [];
  let potentialGain = 0;

  expenses.forEach(e => {
    const expDay = parseInt(e.date) || 1;
    const daysAfterSalary = expDay > salaryDay ? expDay - salaryDay : 31 - salaryDay + expDay;
    const amount = parseFloat(e.amount) || 0;

    if (daysAfterSalary < 3 && amount > 500) {
      const gainIfDelayed = Math.round(amount * BBVA_DAILY_RATE * 7);
      suggestions.push({
        expense: e.name,
        currentDay: expDay,
        suggestedDay: Math.min(expDay + 7, 28),
        weeklyGain: gainIfDelayed,
      });
      potentialGain += gainIfDelayed;
    }
  });

  return {
    suggestions,
    totalMonthlyGain: potentialGain,
    hasSuggestions: suggestions.length > 0,
  };
}

// Tool dispatcher â€” Gemini'nin dÃ¶ndÃ¼rdÃ¼ÄŸÃ¼ araÃ§ adÄ±nÄ± Ã§alÄ±ÅŸtÄ±rÄ±r
export function getAggregateGoalStats(financialData, goals = []) {
  if (!goals.length) return { totalTarget: 0, totalSaved: 0, overallProgress: 0 };
  const totalTarget = goals.reduce((s, g) => s + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((s, g) => s + (g.savedAmount || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  return {
    totalTarget,
    totalSaved,
    overallProgress: Math.round(overallProgress),
    goalCount: goals.length,
  };
}

export function executeTool(toolName, args, financialData) {
  switch (toolName) {
    case 'getCashFlowSummary':
      return getCashFlowSummary(financialData);
    case 'simulateExpenseRemoval':
      return simulateExpenseRemoval(financialData, args.expense_name);
    case 'calculateGoalTimeline':
      return calculateGoalTimeline(financialData, args.goal_amount, args.current_saved || 0);
    case 'findIdleCashOpportunity':
      return findIdleCashOpportunity(financialData);
    case 'getSubscriptionBreakdown':
      return getSubscriptionBreakdown(financialData);
    case 'optimizeExpenseTiming':
      return optimizeExpenseTiming(financialData);
    default:
      return { error: `Bilinmeyen araÃ§: ${toolName}` };
  }
}

