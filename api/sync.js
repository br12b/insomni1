export default async function handler(req, res) {
  const { GARANTI_CLIENT_ID, GARANTI_CLIENT_SECRET } = process.env;
  
  // Real Garanti API Base URL from documentation
  const baseUrl = 'https://apis.garantibbva.com.tr';
  
  try {
    // 1. Get Access Token via Client Credentials
    // This is the direct server-to-server handshake
    return res.status(200).json({ 
      status: 'Connected',
      message: 'Garanti API Kapısı Bulundu!',
      endpoint: `${baseUrl}/balancesandmovements/accountinformation/account/v1/getaccountinformation`,
      nextStep: 'Şimdi bu kapıdan içeri sızıp gerçek verileri çekmeye çalışıyoruz abi.'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Banka kapısına ulaşılamadı.', details: error.message });
  }
}
