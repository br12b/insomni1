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
  Target,
  ShoppingBag,
  Tv,
  Music,
  Play
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

  const optimizationScore = useMemo(() => {
    let score = 95;
    if (subscriptions.salaryPercent > 10) score -= 15;
    if (idleCash.monthlyYield > 1000) score -= 10;
    if (timing.hasSuggestions) score -= 5;
    return Math.max(score, 40);
  }, [subscriptions, idleCash, timing]);

  // Dynamic Cashback Matching Logic
  const cashbackOpportunities = useMemo(() => {
    const list = [];
    const lowerExpenses = expenses.map(e => e.name.toLowerCase());

    if (lowerExpenses.some(e => e.includes('netflix'))) {
      list.push({
        id: 'netflix',
        brand: 'NETFLIX',
        icon: Tv,
        color: '#E50914',
        title: lang === 'tr' ? 'Netflix %50 Cashback' : 'Netflix 50% Cashback',
        desc: lang === 'tr' ? `Netflix harcamanı fark ettim! Nays kart ile ödemende her ay %50 iade alabilirsin.` : `I noticed your Netflix expense! Get 50% cashback every month with Nays card.`
      });
    }

    if (lowerExpenses.some(e => e.includes('spotify'))) {
      list.push({
        id: 'spotify',
        brand: 'SPOTIFY',
        icon: Music,
        color: '#1DB954',
        title: lang === 'tr' ? 'Spotify %50 Cashback' : 'Spotify 50% Cashback',
        desc: lang === 'tr' ? `Müzik keyfini ucuza getir. Spotify ödemelerinde %50 iade fırsatını kaçırma.` : `Enjoy music for less. Don't miss the 50% cashback on Spotify payments.`
      });
    }

    if (lowerExpenses.some(e => e.includes('Play'))) {
      list.push({
        id: 'Play',
        brand: 'Play',
        icon: Play,
        color: '#FF0000',
        title: lang === 'tr' ? 'Play Premium Cashback' : 'Play Premium Cashback',
        desc: lang === 'tr' ? `Play Premium üyeliğin için %50 iade alarak tasarruf edebilirsin.` : `Save by getting 50% cashback for your Play Premium membership.`
      });
    }

    if (expenses.some(e => (e.category || '').toLowerCase() === 'market' || e.name.toLowerCase().includes('migros') || e.name.toLowerCase().includes('carrefour'))) {
      list.push({
        id: 'market',
        brand: 'MARKET',
        icon: ShoppingBag,
        color: '#10B981',
        title: lang === 'tr' ? 'Market Harcaması Bonusu' : 'Grocery Shopping Bonus',
        desc: lang === 'tr' ? `Market alışverişlerini Garanti Bonus ile yaparak ayda 400 TL'ye kadar bonus kazanabilirsin.` : `Earn up to 400 TL bonus per month by doing your market shopping with Garanti Bonus.`
      });
    }

    return list;
  }, [expenses, lang]);

  return (
    <div style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, paddingTop: 40 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>
            {lang === 'tr' ? 'Fırsat Analiz Merkezi' : 'Opportunity Hub'}
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 6 }}>
            {lang === 'tr' ? 'R.E.M harcamalarını analiz etti ve sana özel fırsatları çıkardı.' : 'R.E.M analyzed your expenses and found tailored opportunities.'}
          </p>
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
          action={lang === 'tr' ? 'Stratejiyi Uygula' : 'Apply Strategy'}
          lang={lang}
        />

        <OpportunityCard 
          icon={PieChart}
          color="var(--amber)"
          title={lang === 'tr' ? 'Abonelik Optimizasyonu' : 'Subscription Pulse'}
          desc={lang === 'tr'
            ? `Aboneliklerin maaşının %${subscriptions.salaryPercent}'ine ulaştı. R.E.M kullanmadığın servisleri eleyebileceğini düşünüyor.`
            : `Your subscriptions reached ${subscriptions.salaryPercent}% of income. R.E.M thinks you can cut unused services.`}
          value={lang === 'tr' ? `₺${subscriptions.totalAnnual.toLocaleString('tr-TR')}/yıl` : `₺${subscriptions.totalAnnual.toLocaleString('tr-TR')}/yr`}
          action={lang === 'tr' ? 'Detayları Gör' : 'See Details'}
          lang={lang}
        />


      </motion.div>

      {/* Dynamic Cashback Feed */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <ShieldCheck size={20} color="var(--green)" /> {lang === 'tr' ? 'Sana Özel Cashback Fırsatları' : 'Personalized Cashback Offers'}
        </h2>
        
        {cashbackOpportunities.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {cashbackOpportunities.map(opp => (
              <motion.div key={opp.id} whileHover={{ y: -5 }} className="glass" style={{ padding: '20px', border: '1px solid var(--glass-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.1 }}><opp.icon size={40} color={opp.color} /></div>
                <div style={{ fontSize: 12, fontWeight: 800, color: opp.color, marginBottom: 8, letterSpacing: 1 }}>{opp.brand}</div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 800 }}>{opp.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{opp.desc}</p>
                <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', gap: 6, color: opp.color, fontSize: 12, fontWeight: 800 }}>
                  <TrendingUp size={14} /> {lang === 'tr' ? 'AKTİF FIRSAT' : 'ACTIVE OPPORTUNITY'}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass" style={{ padding: '40px', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
            <p style={{ color: 'var(--text2)', fontSize: 14, margin: 0 }}>
              {lang === 'tr' ? 'Harcamaların için şu an eşleşen özel bir cashback fırsatı bulunamadı.' : 'No matching cashback opportunities found for your expenses right now.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}






