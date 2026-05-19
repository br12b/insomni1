// Insomni Otonom Webhook Kapısı - V6 (Foolproof Telegram Bot and Android SMS Bridge Gateway)
let notificationQueue = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    let rawText = "";
    let source = "Unknown Bridge";
    let body = req.body;

    // Safe JSON parsing if needed
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        rawText = body;
      }
    }

    // Telegram Bot Message Parsing
    if (body && body.message && body.message.text) {
      rawText = body.message.text;
      source = "Telegram Bot";
    } 
    // Android Bridge or direct API POST
    else if (body && body.text) {
      rawText = body.text;
      source = body.source || "Otonom Bridge";
    } 
    // Fallback direct JSON payload
    else if (body && typeof body === 'object') {
      rawText = body.text || JSON.stringify(body);
      source = "Android Bridge";
    } 
    // Raw body string
    else if (body) {
      rawText = String(body);
      source = "Otonom Bridge";
    }

    if (rawText) {
      // ID Extraction: check if there's a 3-6 digit ID at the beginning of the message
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

        // Write to KeyVal persistent cloud store to bypass Serverless statelessness
        let currentLog = [];
        try {
          const getRes = await fetch(`https://keyvalue.immanuel.co/api/KeyVal/GetValue/s30yicqv/${targetId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
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

        const updatedLog = [newEntry, ...currentLog].slice(0, 50);

        try {
          const encodedVal = encodeURIComponent(JSON.stringify(updatedLog));
          await fetch(`https://keyvalue.immanuel.co/api/KeyVal/UpdateValue/s30yicqv/${targetId}?value=${encodedVal}`, {
            method: 'POST',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: ''
          });
        } catch (e) {
          console.error("KV write error in webhook handler", e);
        }

        notificationQueue = [newEntry, ...notificationQueue].slice(0, 10);
        return res.status(200).json({ status: 'Captured', id: newEntry.id, targetId });
      }
    }

    // Default response if no match or rawText
    const simpleEntry = {
      text: rawText || "Empty payload",
      source: source,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    notificationQueue = [simpleEntry, ...notificationQueue].slice(0, 10);
    return res.status(200).json({ status: 'Captured', id: simpleEntry.id });
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      history: notificationQueue,
      serverTime: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
