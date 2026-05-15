// Insomni Otonom Webhook Kapısı
// Bu API, Android Bridge veya dış sistemlerden gelen bildirimleri yakalar.
let lastNotification = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, source } = req.body;
    
    // R.E.M Analizine gönderilmek üzere veriyi saklıyoruz
    lastNotification = {
      text,
      source: source || "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    return res.status(200).json({ status: 'Captured', id: lastNotification.id });
  } 
  
  if (req.method === 'GET') {
    // Frontend'in yeni bildirim var mı diye sorması için
    const data = lastNotification;
    // lastNotification = null; // Okunduktan sonra temizle (opsiyonel)
    return res.status(200).json(data || { status: 'Waiting' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
