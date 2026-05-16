// Insomni Cyber Bridge - V3 (Ultra Raw Capture)
let trafficLog = [];

export default async function handler(req, res) {
  let text = "SİNYAL BOŞ";

  if (req.method === 'POST') {
    // Ham veriyi yakala
    if (typeof req.body === 'string') {
      text = req.body;
    } else if (typeof req.body === 'object') {
      text = req.body.text || JSON.stringify(req.body);
    }
  } else if (req.query.text) {
    text = req.query.text;
  }

  // Veriyi kaydet
  if (text && text !== "SİNYAL BOŞ") {
    const newEntry = {
      text: String(text).trim(),
      source: "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    trafficLog = [newEntry, ...trafficLog].slice(0, 10);
  }

  // GET isteği ile logları dön
  if (req.method === 'GET' && !req.query.text) {
    return res.status(200).json({ 
      history: trafficLog,
      serverInfo: "V3_ACTIVE",
      now: new Date().toISOString()
    });
  }

  return res.status(200).json({ status: 'Captured', received: text.substring(0, 10) });
}
