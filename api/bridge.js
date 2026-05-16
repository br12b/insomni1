// Insomni Cyber Bridge - Ultimate Bypass V1
let trafficLog = [];

export default async function handler(req, res) {
  // Hem GET hem POST verisini yakala
  const text = req.query.text || (req.body && (req.body.text || req.body)) || "SİNYAL BOŞ";
  
  if (text !== "SİNYAL BOŞ") {
    const newEntry = {
      text: typeof text === 'string' ? text : JSON.stringify(text),
      source: "Cyber Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    trafficLog = [newEntry, ...trafficLog].slice(0, 10);
  }

  // Frontend veriyi buradan çekecek
  if (req.method === 'GET' && !req.query.text) {
    return res.status(200).json({ history: trafficLog });
  }

  return res.status(200).json({ status: 'Transmitted', id: Math.random() });
}
