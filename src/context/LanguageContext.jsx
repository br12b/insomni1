import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    currency: 'â‚º',
    landing: {
      badge: 'PPF OdaklÄ± â€” Gunluk %0.150 Faiz',
      title1: 'Atil nakdin',
      titleAccent: 'gercek maliyeti',
      title2: 'nedir?',
      desc: "Finansal kaygıların uykunuzu kaçırmasına izin vermeyin. R.E.M. ile boşta duran paranızı saniyeler içinde optimize edin ve huzurla uyuyun.",
      cta: 'R.E.M ile Analize Basla',
      stat1: 'Ort. Firsat Maliyeti',
      stat2: 'Piyasa PPF Orani',
      stat3: 'Analiz Suresi',
      stat3Val: ' gun',
      feature1: 'Time Gap Analizi',
      feature1Desc: 'Maas ile harcama arasindaki her atil gunu takip eder',
      feature2: 'PPF Entegrasyonu',
      feature2Desc: 'Paranizin gunluk %0.14-0.16 faizle ne kazandirdigini gosterir',
      feature3: 'R.E.M AI',
      feature3Desc: 'Finansal verinizi analiz eden kisisel AI danismaniniz',
      feature4: 'Abonelik Takibi',
      feature4Desc: 'Netflix, Spotify ve diger planlarin gercek yillik maliyeti',
      ariaIntro: 'Nakit akisinizi beraber optimize edelim.'
    },
    opportunities: {
      title: 'FÄ±rsat Merkezi',
      desc: 'HarcamalarÄ±nÄ±za gÃ¶re en iyi cashback ve kampanya eÅŸleÅŸmeleri.',
      smartMatch: 'R.E.M AkÄ±llÄ± EÅŸleÅŸme',
      allCampaigns: 'TÃ¼m Kampanyalar',
      matchFound: 'EÅŸleÅŸme Bulundu!',
      noMatch: 'HenÃ¼z harcama analizi yapÄ±lmadÄ±.',
      platform: 'Platform',
      potentialGain: 'Potansiyel KazanÃ§',
      categories: {
        all: 'Hepsi',
        shopping: 'AlÄ±ÅŸveriÅŸ',
        food: 'Yemek',
        subscription: 'Abonelik',
        travel: 'Seyahat'
      }
    },
    onboarding: {
      profileTitle: 'Komuta Merkezine HoÅŸ Geldin',
      profileDesc: 'Analize baÅŸlamadan Ã¶nce sana nasÄ±l hitap etmemi istersin?',
      profilePlaceholder: 'Ä°sminizi yazÄ±n...',
      salaryTitle: 'Gelir Bilgileri',
      salaryDesc: 'AylÄ±k net maaÅŸÄ±nÄ±zÄ± ve yattÄ±ÄŸÄ± gÃ¼nÃ¼ belirtin.',
      salaryLabel: 'Net MaaÅŸ (AylÄ±k)',
      dateLabel: 'MaaÅŸ GÃ¼nÃ¼ (1-31)',
      expenseTitle: 'Harcama Listesi',
      expenseDesc: 'DÃ¼zenli harcamalarÄ±nÄ±zÄ± ekleyin.',
      expenseLabel: 'Harcama AdÄ±',
      amountLabel: 'Tutar',
      dateExpLabel: 'Tarih',
      addBtn: 'Ekle',
      popular: 'PopÃ¼ler:',
      suggestKira: 'Kira',
      suggestKredi: 'Kredi KartÄ±',
      suggestAbonelik: 'Abonelik',
    },
    dashboard: {
      welcome: 'HoÅŸ Geldin',
      healthScore: 'Finansal SaÄŸlÄ±k',
      healthDesc: 'Skorun geÃ§en aya gÃ¶re %5 arttÄ±.',
      totalBalance: 'Toplam VarlÄ±k',
      monthlyExpenses: 'AylÄ±k Gider',
      opportunityCost: 'FÄ±rsat Maliyeti',
      opportunityDesc: 'PPF (Para PiyasasÄ± Fonu) ile kazanÄ±labilecek tutar.',
      subscriptions: 'Aktif Abonelikler',
      manage: 'YÃ¶net',
      aiAdvisor: 'R.E.M AI DanÄ±ÅŸman',
      aiPlaceholder: 'Ä°stediÄŸiniz soruyu yazÄ±n...',
      send: 'GÃ¶nder'
    },
    common: {
      back: 'Geri',
      next: 'Ä°leri',
      finish: 'Tamamla',
      loading: 'YÃ¼kleniyor...',
      save: 'Kaydet'
    }
  },
  en: {
    currency: '$',
    landing: {
      badge: 'PPF Focused â€” Daily 0.150% Interest',
      title1: 'What is the',
      titleAccent: 'real cost',
      title2: 'of unused cash?',
      desc: "Don't let financial anxiety keep you awake. Optimize your unused cash in seconds with R.E.M. and sleep peacefully.",
      cta: 'Start Analysis with R.E.M',
      stat1: 'Avg. Opportunity Cost',
      stat2: 'Market PPF Rate',
      stat3: 'Analysis Period',
      stat3Val: ' days',
      feature1: 'Time Gap Analysis',
      feature1Desc: 'Tracks every idle day between income and expenses',
      feature2: 'PPF Integration',
      feature2Desc: 'Shows what your money earns with daily 0.14-0.16% interest',
      feature3: 'R.E.M AI',
      feature3Desc: 'Your personal AI advisor analyzing financial data',
      feature4: 'Subscription Tracking',
      feature4Desc: 'The real annual cost of Netflix, Spotify, and more',
      ariaIntro: 'Letâ€™s optimize your cash flow together.'
    },
    opportunities: {
      title: 'Opportunity Hub',
      desc: 'Best cashback and campaign matches based on your spending.',
      smartMatch: 'R.E.M Smart Match',
      allCampaigns: 'All Campaigns',
      matchFound: 'Match Found!',
      noMatch: 'No spending analysis yet.',
      platform: 'Platform',
      potentialGain: 'Potential Gain',
      categories: {
        all: 'All',
        shopping: 'Shopping',
        food: 'Food',
        subscription: 'Subscription',
        travel: 'Travel'
      }
    },
    onboarding: {
      profileTitle: 'Welcome to Command Center',
      profileDesc: 'Before we start, how should R.E.M address you?',
      profilePlaceholder: 'Enter your name...',
      salaryTitle: 'Income Details',
      salaryDesc: 'Specify your monthly net salary and payment date.',
      salaryLabel: 'Net Salary (Monthly)',
      dateLabel: 'Salary Day (1-31)',
      expenseTitle: 'Expense List',
      expenseDesc: 'Add your recurring expenses.',
      expenseLabel: 'Expense Name',
      amountLabel: 'Amount',
      dateExpLabel: 'Date',
      addBtn: 'Add',
      popular: 'Popular:',
      suggestKira: 'Rent',
      suggestKredi: 'Credit Card',
      suggestAbonelik: 'Subscription',
    },
    dashboard: {
      welcome: 'Welcome Back',
      healthScore: 'Financial Health',
      healthDesc: 'Your score increased by 5% since last month.',
      totalBalance: 'Total Assets',
      monthlyExpenses: 'Monthly Expenses',
      opportunityCost: 'Opportunity Cost',
      opportunityDesc: 'Potential earnings with Money Market Funds (PPF).',
      subscriptions: 'Active Subscriptions',
      manage: 'Manage',
      aiAdvisor: 'R.E.M AI Advisor',
      aiPlaceholder: 'Type your question...',
      send: 'Send'
    },
    common: {
      back: 'Back',
      next: 'Next',
      finish: 'Finish',
      loading: 'Loading...',
      save: 'Save'
    }
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('tr');

  const t = translations[lang];

  const toggleLang = () => {
    setLang(prev => prev === 'tr' ? 'en' : 'tr');
  };

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
