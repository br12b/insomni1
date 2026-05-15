export default async function handler(req, res) {
  try {
    const customBalance = "48,250.00"; 
    
    // Adding some mock transactions to demonstrate animations
    const mockTransactions = [
      { id: 1, raw: "GRNT-STARBUCKS-IST", clean: "Starbucks Coffee", amount: "-185.00", category: "GIDA", type: "SPENDING" },
      { id: 2, raw: "GRNT-MIGROS-SANAL", clean: "Migros Sanal Market", amount: "-1,565.00", category: "MARKET", type: "SPENDING" }
    ];

    return res.status(200).json({ 
      status: 'Connected',
      message: 'Garanti Veri Hattı Aktif!',
      balance: customBalance,
      iban: "TR620006200029500006291296",
      transactions: mockTransactions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Banka veri hattında kopukluk oluştu.' });
  }
}
