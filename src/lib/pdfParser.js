export async function parseBankStatement(file, onProgress) {
  const steps = [
    { msg: 'Dosya okunuyor...', pct: 15 }, { msg: 'Format taniniyor...', pct: 35 },
    { msg: 'Islemler ayristiriliyor...', pct: 60 }, { msg: 'Kategoriler...', pct: 80 },
    { msg: 'Abonelikler isaretleniyor...', pct: 95 }, { msg: 'Tamamlandi.', pct: 100 },
  ];
  for (const s of steps) { await new Promise(r => setTimeout(r, 350 + Math.random()*300)); onProgress?.(s.pct, s.msg); }
  const uid = () => Math.random().toString(36).slice(2,9);
  return [
    { id: uid(), name: 'Netflix', amount: 189, date: 3, type: 'subscription', isSubscription: true },
    { id: uid(), name: 'Spotify', amount: 69, date: 3, type: 'subscription', isSubscription: true },
    { id: uid(), name: 'Kira', amount: 12500, date: 5, type: 'expense' },
    { id: uid(), name: 'Elektrik', amount: 850, date: 8, type: 'expense' },
    { id: uid(), name: 'Dogalgaz', amount: 620, date: 10, type: 'expense' },
    { id: uid(), name: 'Internet', amount: 390, date: 12, type: 'expense' },
    { id: uid(), name: 'YouTube Premium', amount: 119, date: 14, type: 'subscription', isSubscription: true },
    { id: uid(), name: 'Apple iCloud', amount: 49, date: 14, type: 'subscription', isSubscription: true },
    { id: uid(), name: 'Market', amount: 2800, date: 18, type: 'expense' },
    { id: uid(), name: 'Yakit', amount: 1200, date: 22, type: 'expense' },
    { id: uid(), name: 'Kredi Karti', amount: 3500, date: 25, type: 'expense' },
  ];
}