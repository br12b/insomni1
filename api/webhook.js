// Insomni Otonom Webhook Kapısı - V3 (Log Destekli)
let notificationQueue = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, source } = req.body;
    
    const newEntry = {
      text: text || "BOŞ VERİ",
      source: source || "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    // Son 10 bildirimi tutuyoruz
    notificationQueue = [newEntry, ...notificationQueue].slice(0, 10);
    
    return res.status(200).json({ status: 'Captured', id: newEntry.id });
  } 
  
  if (req.method === 'GET') {
    return res.status(200).json({
      history: notificationQueue,
      serverTime: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
