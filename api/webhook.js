// Insomni Otonom Webhook Kapısı - V2 (Daha kararlı)
let lastNotification = { text: "Sistem Hazır", id: "init" };

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, source } = req.body;
    
    // Gelen veri boşsa işlem yapma
    if (!text || text === "{sms_message}") {
      return res.status(400).json({ status: 'Empty Data' });
    }

    lastNotification = {
      text,
      source: source || "Android Bridge",
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };
    
    return res.status(200).json({ status: 'Captured', id: lastNotification.id });
  } 
  
  if (req.method === 'GET') {
    return res.status(200).json(lastNotification);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
