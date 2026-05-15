export default async function handler(req, res) {
  const { GARANTI_CLIENT_ID } = process.env;
  const redirectUri = 'https://insomni.vercel.app/remsync';
  
  // Garanti BBVA OAuth2 Authorization URL
  const authUrl = `https://apimarket.garantibbva.com.tr/oauth/authorize?response_type=code&client_id=${GARANTI_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=ais_account_information`;

  return res.status(200).json({ 
    status: 'Ready',
    redirectUrl: authUrl
  });
}
