export const getSector = (name, lang = 'tr') => {
  const n = name.toLowerCase();
  
  // Brand-specific custom icon override for rich calendar logo variety!
  let customIcon = null;
  if (n.includes('netflix') || n.includes('netlix')) customIcon = '🎬';
  else if (n.includes('spotify')) customIcon = '🎧';
  else if (n.includes('youtube')) customIcon = '📺';
  else if (n.includes('apple') || n.includes('icloud')) customIcon = '☁️';
  else if (n.includes('elektrik')) customIcon = '⚡';
  else if (n.includes('doğalgaz') || n.includes('dogalgaz')) customIcon = '🔥';
  else if (n.includes('su')) customIcon = '💧';
  else if (n.includes('internet') || n.includes('türk telekom') || n.includes('superonline')) customIcon = '🌐';
  else if (n.includes('gsm') || n.includes('turkcell') || n.includes('vodafone')) customIcon = '📱';
  else if (n.includes('starbucks') || n.includes('kahve') || n.includes('nescafe')) customIcon = '☕';
  else if (n.includes('kira')) customIcon = '🔑';
  else if (n.includes('steam')) customIcon = '🕹️';
  else if (n.includes('eneba')) customIcon = '🎟️';
  else if (n.includes('yakıt') || n.includes('benzin') || n.includes('shell') || n.includes('opet') || n.includes('petrol')) customIcon = '⛽';
  else if (n.includes('taksi') || n.includes('uber')) customIcon = '🚕';
  else if (n.includes('market') || n.includes('migros') || n.includes('getir') || n.includes('carrefour') || n.includes('bim') || n.includes('a101') || n.includes('şok') || n.includes('sok')) customIcon = '🍏';

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
      icon: customIcon || '🎮'
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
      icon: customIcon || '🛒'
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
      icon: customIcon || '🏠'
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
      icon: customIcon || '🚗'
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
      icon: customIcon || '📄'
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
      icon: customIcon || '💳'
    };
  }
  
  return {
    name: lang === 'tr' ? 'Diğer' : 'Other',
    color: '#6b7280',
    icon: customIcon || '🛍️'
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
