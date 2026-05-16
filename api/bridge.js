// Insomni Cyber Bridge - V4 (Bulletproof)
let trafficLog = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let text = req.query.text || "SİNYAL BOŞ";

  if (req.method === 'POST') {
    if (typeof req.body === 'string') text = req.body;
    else if (req.body && req.body.text) text = req.body.text;
    else if (req.body) text = JSON.stringify(req.body);
  }

  if (text && text !== "SİNYAL BOŞ") {
    const newEntry = {
      text: String(text).trim(),
      source: req.method === 'GET' ? "URL Bridge" : "POST Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    trafficLog = [newEntry, ...trafficLog].slice(0, 10);
  }

  // Frontend buradan çekiyor
  if (req.method === 'GET' && !req.query.text) {
    return res.status(200).json({ history: trafficLog });
  }

  return res.status(200).json({ 
    status: 'Transmitted', 
    received: text.substring(0, 20),
    method: req.method 
  });
}
