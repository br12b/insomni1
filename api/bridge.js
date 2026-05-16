// Insomni Universal Cloud Bridge - V8 (ID-Based Multi-User Support)
let trafficLog = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let rawText = "";
  let source = "Unknown";

  // 1. TELEGRAM WEBHOOK
  if (req.body && req.body.message && req.body.message.text) {
    rawText = req.body.message.text;
    source = "Telegram Bot";
  } 
  // 2. MACRODROID / POST
  else if (req.method === 'POST') {
    if (req.body && typeof req.body === 'object') {
      rawText = req.body.text || JSON.stringify(req.body);
    } else if (req.body) {
      rawText = req.body;
    }
    source = "Otonom Bridge";
  } 
  // 3. GET
  else if (req.query.text) {
    rawText = req.query.text;
    source = "URL Bridge";
  }

  if (rawText) {
    // ID Ayıklama Mantığı: "842 Mesaj..." -> ID: 842, Mesaj: Mesaj...
    const match = String(rawText).match(/^(\d{3,6})\s+(.*)/);
    let targetId = "GUEST";
    let processedText = rawText;

    if (match) {
      targetId = match[1];
      processedText = match[2];
    }

    const newEntry = {
      text: String(processedText).trim(),
      targetId: targetId,
      source: source,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    trafficLog = [newEntry, ...trafficLog].slice(0, 50); // Daha geniş hafıza
  }

  // Frontend Polling (ID Filtreli)
  if (req.method === 'GET' && !req.query.text) {
    const filterId = req.query.id || "GUEST";
    const history = trafficLog.filter(entry => entry.targetId === filterId || entry.targetId === "GUEST");
    return res.status(200).json({ history });
  }

  return res.status(200).json({ status: 'Transmitted' });
}
