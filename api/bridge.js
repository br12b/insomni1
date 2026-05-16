// Insomni Secured Universal Bridge - V9 (Strict ID-Based Routing)
let trafficLog = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let rawText = "";
  let source = "Unknown";

  if (req.body && req.body.message && req.body.message.text) {
    rawText = req.body.message.text;
    source = "Telegram Bot";
  } else if (req.method === 'POST') {
    rawText = req.body.text || (typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
    source = "Otonom Bridge";
  } else if (req.query.text) {
    rawText = req.query.text;
    source = "URL Bridge";
  }

  if (rawText) {
    // ID Ayiklama: Mesajin basinda 3-6 haneli sayi var mi?
    const match = String(rawText).match(/^(\d{3,6})\s+(.*)/);
    
    if (match) {
      const targetId = match[1];
      const processedText = match[2];

      const newEntry = {
        text: String(processedText).trim(),
        targetId: targetId,
        source: source,
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      };
      
      trafficLog = [newEntry, ...trafficLog].slice(0, 50);
    }
    // Eger ID yoksa, bu mesaj sistem tarafindan reddedilir (Loga eklenmez).
  }

  // Frontend Polling (Sadece eslesen ID'leri getir)
  if (req.method === 'GET' && !req.query.text) {
    const filterId = req.query.id;
    if (!filterId) return res.status(200).json({ history: [] }); // ID yoksa veri de yok
    
    const history = trafficLog.filter(entry => entry.targetId === filterId);
    return res.status(200).json({ history });
  }

  return res.status(200).json({ status: 'Processed' });
}
