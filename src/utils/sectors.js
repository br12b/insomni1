export const getSector = (name, lang = 'tr') => {
  const n = name.toLowerCase();
  
  if (
    n.includes('steam') || 
    n.includes('eneba') || 
    n.includes('humble') || 
    n.includes('playstation') || 
    n.includes('xbox') || 
    n.includes('epic') || 
    n.includes('game') || 
    n.includes('kabasakal') || 
    n.includes('bynogame') || 
    n.includes('riot') || 
    n.includes('valorant') || 
    n.includes('nintendo') || 
    n.includes('oyun') || 
    n.includes('pubg') ||
    n.includes('ea play') ||
    n.includes('ubisoft')
  ) {
    return {
      name: lang === 'tr' ? 'Oyun/Eğlence' : 'Gaming/Entertainment',
      color: '#a855f7',
      icon: '🎮'
    };
  }
  
  if (
    n.includes('yemek') || 
    n.includes('market') || 
    n.includes('starbucks') || 
    n.includes('kahve') || 
    n.includes('migros') || 
    n.includes('getir') || 
    n.includes('carrefour') || 
    n.includes('bim') || 
    n.includes('a101') || 
    n.includes('sok') || 
    n.includes('şok') || 
    n.includes('restoran') || 
    n.includes('gıda') ||
    n.includes('fırın') ||
    n.includes('yemeksepeti') ||
    n.includes('trendyol yemek') ||
    n.includes('gurme')
  ) {
    return {
      name: lang === 'tr' ? 'Gıda/Market' : 'Food/Groceries',
      color: '#22c55e',
      icon: '🛒'
    };
  }
  
  if (
    n.includes('kira') || 
    n.includes('rent') || 
    n.includes('ev') || 
    n.includes('konut') || 
    n.includes('depozito') ||
    n.includes('emlak')
  ) {
    return {
      name: lang === 'tr' ? 'Barınma/Kira' : 'Housing/Rent',
      color: '#ef4444',
      icon: '🏠'
    };
  }
  
  if (
    n.includes('yakıt') || 
    n.includes('benzin') || 
    n.includes('shell') || 
    n.includes('opet') || 
    n.includes('petrol') || 
    n.includes('uber') || 
    n.includes('taksi') || 
    n.includes('metro') || 
    n.includes('otobüs') || 
    n.includes('bilet') || 
    n.includes('ulaşım') || 
    n.includes('yol') ||
    n.includes('otopark')
  ) {
    return {
      name: lang === 'tr' ? 'Ulaşım/Yakıt' : 'Transport/Fuel',
      color: '#3b82f6',
      icon: '🚗'
    };
  }
  
  if (
    n.includes('elektrik') || 
    n.includes('doğalgaz') || 
    n.includes('dogalgaz') || 
    n.includes('netflix') || 
    n.includes('netlix') || 
    n.includes('spotify') || 
    n.includes('youtube') || 
    n.includes('internet') || 
    n.includes('icloud') || 
    n.includes('apple') || 
    n.includes('fatura') || 
    n.includes('su') || 
    n.includes('gsm') || 
    n.includes('turkcell') || 
    n.includes('vodafone') || 
    n.includes('telekom') || 
    n.includes('abonelik') ||
    n.includes('disney') ||
    n.includes('prime video')
  ) {
    return {
      name: lang === 'tr' ? 'Fatura/Abonelik' : 'Bills/Subscriptions',
      color: '#f59e0b',
      icon: '📄'
    };
  }
  
  if (
    n.includes('kredi') || 
    n.includes('kart') || 
    n.includes('borç') || 
    n.includes('vergi') || 
    n.includes('finans') ||
    n.includes('banka') ||
    n.includes('faiz')
  ) {
    return {
      name: lang === 'tr' ? 'Finans/Borç' : 'Finance/Debt',
      color: '#ec4899',
      icon: '💳'
    };
  }
  
  return {
    name: lang === 'tr' ? 'Diğer' : 'Other',
    color: '#6b7280',
    icon: '🛍️'
  };
};

export const SECTOR_LIST = (lang = 'tr') => [
  { id: 'gaming', name: lang === 'tr' ? 'Oyun/Eğlence' : 'Gaming/Entertainment', color: '#a855f7', icon: '🎮' },
  { id: 'food', name: lang === 'tr' ? 'Gıda/Market' : 'Food/Groceries', color: '#22c55e', icon: '🛒' },
  { id: 'housing', name: lang === 'tr' ? 'Barınma/Kira' : 'Housing/Rent', color: '#ef4444', icon: '🏠' },
  { id: 'transport', name: lang === 'tr' ? 'Ulaşım/Yakıt' : 'Transport/Fuel', color: '#3b82f6', icon: '🚗' },
  { id: 'bills', name: lang === 'tr' ? 'Fatura/Abonelik' : 'Bills/Subscriptions', color: '#f59e0b', icon: '📄' },
  { id: 'finance', name: lang === 'tr' ? 'Finans/Borç' : 'Finance/Debt', color: '#ec4899', icon: '💳' },
  { id: 'other', name: lang === 'tr' ? 'Diğer' : 'Other', color: '#6b7280', icon: '🛍️' }
];
