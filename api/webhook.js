// Insomni Otonom Webhook Kapısı - V5 (Ultimate Compatibility)
let notificationQueue = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let text = "VERI ALINAMADI";
    
    // Eğer veri JSON gelmişse
    if (req.body && typeof req.body === 'object') {
      text = req.body.text || JSON.stringify(req.body);
    } 
    // Eğer veri düz metin gelmişse
    else if (req.body) {
      text = req.body;
    }

    const newEntry = {
      text: text,
      source: "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    notificationQueue = [newEntry, ...notificationQueue].slice(0, 10);
    
    return res.status(200).json({ status: 'Captured', id: newEntry.id });
  } 
  
  if (req.method === 'GET') {
    return res.status(200).json({
      history: notificationQueue,
      serverTime: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
