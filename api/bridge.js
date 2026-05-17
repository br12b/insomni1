// Insomni Secured Universal Bridge - V9 (Strict ID-Based Routing with Serverless KV Persistence)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let rawText = "";
  let source = "Unknown";
  let body = req.body;

  // Safe JSON Parsing for strings
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      // Keep as string if parsing fails
    }
  }

  if (body && body.message && body.message.text) {
    rawText = body.message.text;
    source = "Telegram Bot";
  } else if (body && body.text) {
    rawText = body.text;
    source = "Otonom Bridge";
  } else if (typeof body === 'string') {
    rawText = body;
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
        const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/s30yicqv/${targetId}`);
        if (getRes.ok) {
          const textData = await getRes.text();
          let parsedText = JSON.parse(textData);
          if (typeof parsedText === 'string') {
            currentLog = JSON.parse(parsedText) || [];
          } else {
            currentLog = parsedText || [];
          }
        }
      } catch (e) {
        currentLog = [];
      }

      // Prepend and slice to 50
      const updatedLog = [newEntry, ...currentLog].slice(0, 50);

      // Write back to KV store
      try {
        await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/s30yicqv/${targetId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
      const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/s30yicqv/${filterId}`);
      if (getRes.ok) {
        const textData = await getRes.text();
        let parsedText = JSON.parse(textData);
        if (typeof parsedText === 'string') {
          history = JSON.parse(parsedText) || [];
        } else {
          history = parsedText || [];
        }
      }
    } catch (e) {
      history = [];
    }
    
    return res.status(200).json({ history });
  }

  return res.status(200).json({ status: 'Processed' });
}
