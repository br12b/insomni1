// Insomni Universal Bridge - V6 (MacroDroid + Telegram Webhook)
let trafficLog = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let text = "SİNYAL BOŞ";
  let source = "Cyber Bridge";

  // 1. TELEGRAM WEBHOOK TESPİTİ
  if (req.body && req.body.message && req.body.message.text) {
    text = req.body.message.text;
    source = "Telegram Bot";
  } 
  // 2. MACRODROID POST TESPİTİ
  else if (req.method === 'POST') {
    if (req.body && typeof req.body === 'object') {
      text = req.body.text || JSON.stringify(req.body);
    } else if (req.body) {
      text = req.body;
    }
    source = "Otonom Bridge";
  } 
  // 3. GET TESPİTİ
  else if (req.query.text) {
    text = req.query.text;
    source = "URL Bridge";
  }

  if (text && text !== "SİNYAL BOŞ") {
    const newEntry = {
      text: String(text).trim(),
      source: source,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    trafficLog = [newEntry, ...trafficLog].slice(0, 10);
  }

  if (req.method === 'GET' && !req.query.text) {
    return res.status(200).json({ history: trafficLog });
  }

  return res.status(200).json({ status: 'Captured', source: source });
}
