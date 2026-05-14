const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const projectDir = "C:\\Users\\emreb\\.gemini\\antigravity\\brain\\842cf0eb-2136-462f-81ea-3f80fd642547\\cashedge-v2";
const envPath = path.join(projectDir, '.env');

async function testWorkingModels() {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const apiKeyMatch = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

        const genAI = new GoogleGenerativeAI(apiKey);
        
        const models = ["gemini-2.0-flash", "gemini-flash-latest", "gemini-3-flash-preview"];
        
        for (const mName of models) {
            console.log(`\nTesting ${mName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: mName });
                const result = await model.generateContent("Merhaba, sen kimsin? (Kisa cevap)");
                const response = await result.response;
                console.log(`✅ ${mName} CALISIYOR:`, response.text());
            } catch (err) {
                console.log(`❌ ${mName} hata:`, err.message);
            }
        }
    } catch (e) {
        console.error("Hata:", e.message);
    }
}

testWorkingModels();
