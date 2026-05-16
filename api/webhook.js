// Insomni Otonom Webhook Kapısı - V4 (Debug Mode - Accepts Everything)
let notificationQueue = [];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Ne gelirse gelsin alıyoruz (Debug için)
    const rawData = req.body;
    const text = rawData.text || JSON.stringify(rawData) || "TANIMSIZ VERİ";
    
    const newEntry = {
      text: text,
      source: rawData.source || "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    notificationQueue = [newEntry, ...notificationQueue].slice(0, 10);
    console.log("Inbound Webhook:", newEntry);
    
    return res.status(200).json({ status: 'Captured', data: newEntry });
  } 
  
  if (req.method === 'GET') {
    return res.status(200).json({
      history: notificationQueue,
      serverTime: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
