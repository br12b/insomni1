// Insomni Cyber Bridge - V2 (Smart Parsing Support)
let trafficLog = [];

export default async function handler(req, res) {
  let text = "SİNYAL BOŞ";
  
  if (req.method === 'POST') {
    // Text/plain veya JSON her türlü veriyi metne çevir
    text = req.body;
    if (typeof text === 'object') {
      text = text.text || JSON.stringify(text);
    }
  } else if (req.query.text) {
    text = req.query.text;
  }

  if (text && text !== "SİNYAL BOŞ") {
    const newEntry = {
      text: String(text).trim(),
      source: "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    trafficLog = [newEntry, ...trafficLog].slice(0, 10);
  }

  if (req.method === 'GET' && !req.query.text) {
    return res.status(200).json({ history: trafficLog });
  }

  return res.status(200).json({ status: 'Captured', msg: 'Siber sinyal alındı' });
}
