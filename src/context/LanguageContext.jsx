import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  tr: {
    currency: '₺',
    landing: {
      badge: 'PPF Odaklı — Gunluk %0.150 Faiz',
      title1: 'Atil nakdin',
      titleAccent: 'gercek maliyeti',
      title2: 'nedir?',
      desc: "Maasin hesapta oturdugu her gun Para Piyasasi Fonlarinda (PPF) degerlendirilmis olabilirdi. Insomni bu kaybi kurus kurus hesaplar.",
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
      title: 'Fırsat Merkezi',
      desc: 'Harcamalarınıza göre en iyi cashback ve kampanya eşleşmeleri.',
      smartMatch: 'R.E.M Akıllı Eşleşme',
      allCampaigns: 'Tüm Kampanyalar',
      matchFound: 'Eşleşme Bulundu!',
      noMatch: 'Henüz harcama analizi yapılmadı.',
      platform: 'Platform',
      potentialGain: 'Potansiyel Kazanç',
      categories: {
        all: 'Hepsi',
        shopping: 'Alışveriş',
        food: 'Yemek',
        subscription: 'Abonelik',
        travel: 'Seyahat'
      }
    },
    onboarding: {
      profileTitle: 'Komuta Merkezine Hoş Geldin',
      profileDesc: 'Analize başlamadan önce sana nasıl hitap etmemi istersin?',
      profilePlaceholder: 'İsminizi yazın...',
      salaryTitle: 'Gelir Bilgileri',
      salaryDesc: 'Aylık net maaşınızı ve yattığı günü belirtin.',
      salaryLabel: 'Net Maaş (Aylık)',
      dateLabel: 'Maaş Günü (1-31)',
      expenseTitle: 'Harcama Listesi',
      expenseDesc: 'Düzenli harcamalarınızı ekleyin.',
      expenseLabel: 'Harcama Adı',
      amountLabel: 'Tutar',
      dateExpLabel: 'Tarih',
      addBtn: 'Ekle',
      popular: 'Popüler:',
      suggestKira: 'Kira',
      suggestKredi: 'Kredi Kartı',
      suggestAbonelik: 'Abonelik',
    },
    dashboard: {
      welcome: 'Hoş Geldin',
      healthScore: 'Finansal Sağlık',
      healthDesc: 'Skorun geçen aya göre %5 arttı.',
      totalBalance: 'Toplam Varlık',
      monthlyExpenses: 'Aylık Gider',
      opportunityCost: 'Fırsat Maliyeti',
      opportunityDesc: 'PPF (Para Piyasası Fonu) ile kazanılabilecek tutar.',
      subscriptions: 'Aktif Abonelikler',
      manage: 'Yönet',
      aiAdvisor: 'R.E.M AI Danışman',
      aiPlaceholder: 'İstediğiniz soruyu yazın...',
      send: 'Gönder'
    },
    common: {
      back: 'Geri',
      next: 'İleri',
      finish: 'Tamamla',
      loading: 'Yükleniyor...',
      save: 'Kaydet'
    }
  },
  en: {
    currency: '$',
    landing: {
      badge: 'PPF Focused — Daily 0.150% Interest',
      title1: 'What is the',
      titleAccent: 'real cost',
      title2: 'of idle cash?',
      desc: "Every day your salary sits idle, it could have been growing with Money Market Funds (PPF). Insomni calculates this loss.",
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
      ariaIntro: 'Let’s optimize your cash flow together.'
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
