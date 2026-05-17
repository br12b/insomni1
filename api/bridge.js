// Insomni Secured Universal Bridge - V9 (Strict ID-Based Routing with Serverless KV Persistence)

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
      
      // Fetch existing traffic log from public KV store to persist across serverless containers!
      let currentLog = [];
      try {
        const getRes = await fetch(`https://kvdb.io/Y3xy1UE1e8s8vTQfVx4qzz/${targetId}`);
        if (getRes.ok) {
          const textData = await getRes.text();
          currentLog = JSON.parse(textData) || [];
        }
      } catch (e) {
        currentLog = [];
      }

      // Prepend and slice to 50
      const updatedLog = [newEntry, ...currentLog].slice(0, 50);

      // Write back to KV store
      try {
        await fetch(`https://kvdb.io/Y3xy1UE1e8s8vTQfVx4qzz/${targetId}`, {
          method: 'POST',
          body: JSON.stringify(updatedLog)
        });
      } catch (e) {
        console.error("KV write error", e);
      }
    }
  }

  // Frontend Polling (Sadece eslesen ID'leri getir)
  if (req.method === 'GET' && !req.query.text) {
    const filterId = req.query.id;
    if (!filterId) return res.status(200).json({ history: [] }); // ID yoksa veri de yok
    
    let history = [];
    try {
      const getRes = await fetch(`https://kvdb.io/Y3xy1UE1e8s8vTQfVx4qzz/${filterId}`);
      if (getRes.ok) {
        const textData = await getRes.text();
        history = JSON.parse(textData) || [];
      }
    } catch (e) {
      history = [];
    }
    
    return res.status(200).json({ history });
  }

  return res.status(200).json({ status: 'Processed' });
}
