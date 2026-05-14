import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  CreditCard, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Wallet,
  Clock,
  PieChart,
  Target
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { 
  findIdleCashOpportunity, 
  getSubscriptionBreakdown, 
  optimizeExpenseTiming,
  getCashFlowSummary
} from '../lib/financialTools';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function OpportunityCard({ icon: Icon, title, desc, value, color, action, lang }) {
  return (
    <motion.div variants={itemVariants} className="glass" 
      style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 16, border: `1px solid ${color}33`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: `${color}08`, filter: 'blur(20px)' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{lang === 'tr' ? 'Potansiyel Kazanç' : 'Potential Gain'}</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: color }}>{value}</div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: 'var(--text0)' }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{desc}</p>
      </div>

      <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', padding: '0 0', height: 'auto', color: color, gap: 6, marginTop: 10 }}>
        {action} <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}

export default function Opportunities({ expenses = [], salaryData = null }) {
  const { lang } = useLanguage();
  
  const financialData = useMemo(() => ({
    salary: salaryData?.income || 0,
    expenses,
    dailyBalances: Array.from({ length: 30 }, (_, i) => ({ balance: (salaryData?.income || 50000) * 0.4 }))
  }), [expenses, salaryData]);

  const idleCash = useMemo(() => findIdleCashOpportunity(financialData), [financialData]);
  const subscriptions = useMemo(() => getSubscriptionBreakdown(financialData), [financialData]);
  const timing = useMemo(() => optimizeExpenseTiming(financialData), [financialData]);
  const summary = useMemo(() => getCashFlowSummary(financialData), [financialData]);

  const optimizationScore = useMemo(() => {
    let score = 85;
    if (subscriptions.salaryPercent > 10) score -= 15;
    if (idleCash.monthlyYield > 1000) score -= 10;
    if (timing.hasSuggestions) score -= 5;
    return Math.max(score, 40);
  }, [subscriptions, idleCash, timing]);

  return (
    <div style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>
            {lang === 'tr' ? 'Fırsat Analiz Merkezi' : 'Opportunity Hub'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6 }}>
            {lang === 'tr' ? 'R.E.M nakit akışındaki her kuruşu senin için optimize eder.' : 'R.E.M optimizes every penny in your cash flow.'}
          </p>
        </div>
        <div className="glass" style={{ padding: '15px 25px', display: 'flex', alignItems: 'center', gap: 15, border: '1px solid var(--accent-dim)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1 }}>{lang === 'tr' ? 'Verimlilik Puanı' : 'Efficiency Score'}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)' }}>%{optimizationScore}</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid var(--bg2)', borderTopColor: 'var(--accent)', transform: 'rotate(45deg)' }} />
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        
        <OpportunityCard 
          icon={Wallet}
          color="var(--accent)"
          title={lang === 'tr' ? 'Atıl Nakit Röntgeni' : 'Idle Cash X-Ray'}
          desc={lang === 'tr' 
            ? `Boşta duran ₺${idleCash.avgIdleBalance.toLocaleString('tr-TR')} bakiyen var. Bunu PPF ile değerlendirerek pasif gelir yaratabilirsin.`
            : `You have ₺${idleCash.avgIdleBalance.toLocaleString('tr-TR')} sitting idle. Invest it in MMF to generate passive income.`}
          value={lang === 'tr' ? `₺${idleCash.monthlyYield}/ay` : `₺${idleCash.monthlyYield}/mo`}
          action={lang === 'tr' ? 'PPF Stratejisini Gör' : 'See MMF Strategy'}
          lang={lang}
        />

        <OpportunityCard 
          icon={PieChart}
          color="var(--amber)"
          title={lang === 'tr' ? 'Abonelik Optimizasyonu' : 'Subscription Pulse'}
          desc={lang === 'tr'
            ? `Aboneliklerin maaşının %${subscriptions.salaryPercent}'ine ulaştı. Kullanmadığın servisleri eleyerek tasarruf edebilirsin.`
            : `Your subscriptions reached ${subscriptions.salaryPercent}% of income. Save by cutting unused services.`}
          value={lang === 'tr' ? `₺${subscriptions.totalAnnual.toLocaleString('tr-TR')}/yıl` : `₺${subscriptions.totalAnnual.toLocaleString('tr-TR')}/yr`}
          action={lang === 'tr' ? 'Abonelikleri Yönet' : 'Manage Subscriptions'}
          lang={lang}
        />

        <OpportunityCard 
          icon={Clock}
          color="var(--green)"
          title={lang === 'tr' ? 'Zamanlama Sihirbazı' : 'Timing Wizard'}
          desc={lang === 'tr'
            ? `Ödemelerini maaş gününden sonraya kaydırarak nakit akışını iyileştirebilir ve ek faiz geliri kazanabilirsin.`
            : `Shift your payments to after payday to improve cash flow and earn extra interest income.`}
          value={lang === 'tr' ? `+₺${timing.totalMonthlyGain}/ay` : `+₺${timing.totalMonthlyGain}/mo`}
          action={lang === 'tr' ? 'Planlamayı Optimize Et' : 'Optimize Schedule'}
          lang={lang}
        />

        <motion.div variants={itemVariants} className="glass" 
          style={{ gridColumn: '1 / -1', padding: '30px', background: 'linear-gradient(135deg, rgba(129,140,248,0.1), rgba(16,185,129,0.05))', border: '1px solid var(--accent-dim)', display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={30} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
              {lang === 'tr' ? 'R.E.M Stratejik Öneri' : 'R.E.M Strategic Recommendation'} 
              <Sparkles size={16} color="var(--amber)" />
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>
              {lang === 'tr'
                ? `Toplam optimizasyon potansiyelin yıllık ₺${(idleCash.annualYield + subscriptions.totalAnnual).toLocaleString('tr-TR')} seviyesinde. Bu miktar, mevcut hedeflerinden birini tam 4 ay erkene çekebilir.`
                : `Your total optimization potential is ₺${(idleCash.annualYield + subscriptions.totalAnnual).toLocaleString('tr-TR')} per year. This could pull one of your goals forward by 4 months.`}
            </p>
          </div>
          <button className="btn btn-primary" style={{ height: 48, padding: '0 24px' }}>
            {lang === 'tr' ? 'Hemen Uygula' : 'Apply Now'}
          </button>
        </motion.div>

      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} color="var(--green)" /> {lang === 'tr' ? 'Doğrulanmış Banka Fırsatları' : 'Verified Bank Offers'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          <div className="glass" style={{ padding: '20px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>NAYS</div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 15 }}>Aboneliklerde %50 İade</h4>
            <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>Netflix, Spotify ve YouTube ödemelerinde anında nakit iade.</p>
          </div>
          <div className="glass" style={{ padding: '20px', border: '1px solid var(--glass-border)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', marginBottom: 8 }}>GARANTİ</div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 15 }}>Market Harcaması Bonus</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: 'var(--green)', fontWeight: 800, fontSize: 12 }}>
              <TrendingUp size={14} /> 400₺ BONUS
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
