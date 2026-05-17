import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useCallback, useRef } from "react";

// Multi-key support parsing from single comma-separated variable VITE_GEMINI_API_KEYS
const API_KEYS_STR = import.meta.env.VITE_GEMINI_API_KEYS || import.meta.env.VITE_GEMINI_API_KEY || "";
const API_KEYS = API_KEYS_STR ? API_KEYS_STR.split(",").map(k => k.trim()).filter(Boolean) : [];

// API Key rotation active index tracked at module level
let activeKeyIndex = 0;

const TOOL_DECLARATIONS = [
  { 
    name: "simulateExpenseRemoval", 
    description: "Kullanici dogrudan bir harcamanin bütçeden cikarilmasini simüle etmek istediginde cagrilir. Harcamanin adini parametre olarak alir.", 
    parameters: { type: "OBJECT", properties: { expense_name: { type: "STRING", description: "Kaldirilacak harcamanin tam adi" } }, required: ["expense_name"] } 
  },
  { 
    name: "calculateGoalTimeline", 
    description: "Kullanici dogrudan bir finansal hedefe ulasma süresini hesaplamak istediginde cagrilir. Hedef tutarini parametre olarak alir.", 
    parameters: { type: "OBJECT", properties: { goal_amount: { type: "NUMBER", description: "Hedefin toplam tutari (TL cinsinden)" } }, required: ["goal_amount"] } 
  }
];

const SYSTEM_PROMPT = `Sen R.E.M, kullanıcının kişisel, samimi ve son derece bilgili finansal danışmanı ve dostusun.
KRİTİK EMİRLER:
1. Konuşmaların kesinlikle doğal, yapay zekadan uzak, sıcak ve arkadaş canlısı olmalı. Asla "siber", "matris", "veri seti", "siber mimari", "sistem aktif" gibi robotik/yapay kelimeler kullanma. Kendine ait samimi, insanı rahatlatan bir üslubun olsun.
2. ALAKASIZ ANALİZ YAPMA: Sana her mesajda [FİNANSAL VERİ] bloğu iletilse dahi, eğer kullanıcı doğrudan bütçesini, harcamalarını veya finansal durumunu sormuyorsa ya da genel/alakasız sorular soruyorsa (örn. "resim üretebiliyor musun", "nasılsın", "nerelisin", "neden alakasız cevap verdin" gibi genel/sohbet veya sitem soruları), finansal analiz yapmaya KESİNLİKLE kalkışma. Bütçe rakamlarını, kirayı veya Spotify'ı sıralama. Sadece kullanıcının sorduğu genel konuya odaklan ve samimi bir şekilde o konuyu yanıtla. Finansal verileri sadece konu bütçe/harcama/tasarruf olduğunda analiz et.
3. ARAÇ KULLANIMI: Araçları (simulateExpenseRemoval, calculateGoalTimeline) sadece ve sadece kullanıcı doğrudan bir harcamanın çıkarılmasını simüle etmeni veya bir hedefin süresini hesaplamanı talep ettiğinde çağır. Genel sohbet sorularında kesinlikle bu araçları tetikleme.
4. BALON METAFORU KISITLAMASI: Insomni logosundaki "uçan balon" kaçan finansal fırsatları, onu yakalamaya çalışan insan ise kullanıcıyı temsil eder. Bu balon metaforunu ve logomuzun anlamını SADECE ve SADECE kullanıcı doğrudan logoyu, vizyonumuzu veya anlamını sorduğunda açıkla. Normal günlük sohbetlerde, bütçe analizlerinde veya genel sorularda balon lafını KESİNLİKLE durup dururken kullanma, diretme ve tekrarlama.
5. PARAGRAFLAR VE CEVAPLAR KISA VE NET OLMALI: Kesinlikle çok uzun paragraflar yazma. Maksimum 2-3 kısa paragrafta veya madde işaretleriyle vurucu, net, okunması kolay şekilde cevap ver.
6. TÜRKİYE FİNTEK VE GETİRİ İPUÇLARI: Sadece bütçe ve harcama analizi yaparken Türkiye'deki popüler cashback fırsatlarından bahset (örn. Spotify/Netflix için Nays veya Papara). Eğer harcamalarda oyun/Steam görürsen doğrudan Eneba (Enaba) gibi kod platformlarındaki indirimli hediye kartlarına bakmasını tavsiye et.`;

export function useGemini() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [activeModel, setActiveModel] = useState("3.1");
  const financialDataRef = useRef(null);

  const executeTool = async (call, fd) => {
    const { name, args } = call;
    const income = parseFloat(fd?.salary?.income || 0);
    const totalExp = fd?.totalExpense || 0;
    const netSavings = income - totalExp;

    if (name === "simulateExpenseRemoval") {
      const expName = args.expense_name || "";
      const exps = fd?.expenses || [];
      const found = exps.find(e => e.name.toLowerCase().includes(expName.toLowerCase()));
      if (found) {
        const amt = parseFloat(found.amount || 0);
        return { success: true, removedExpense: found.name, savedAmount: amt, newNetSavings: netSavings + amt };
      }
      return { success: false, error: "Harcama bulunamadi." };
    }
    else if (name === "calculateGoalTimeline") {
      const goal = args.goal_amount || 0;
      if (netSavings <= 0) return { error: "Aylik net tasarruf yok veya negatif." };
      const months = Math.ceil(goal / netSavings);
      return { goalAmount: goal, currentMonthlySavings: netSavings, monthsRequired: months };
    }
    return { error: "Bilinmeyen arac." };
  };

  const sendMessage = useCallback(async (userPrompt, financialData) => {
    if (!userPrompt.trim()) return;
    if (financialData) financialDataRef.current = financialData;

    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setIsTyping(true);
    setThinkingSteps([]);

    // 1. DÜŞÜNME BALONLARINI SORUYA GÖRE KATEGORİZE ETME
    const promptLower = userPrompt.toLowerCase();
    let analysisStepLabel = "Finansal Durum Analiz Ediliyor...";

    const checkKeywords = (str, keywords) => {
      return keywords.some(kw => str.includes(kw));
    };

    if (checkKeywords(promptLower, ["nakit", "para", "ppf", "faiz", "yatırım", "fon", "tasarruf", "atıl", "kazanç", "gelir", "cash", "invest"])) {
      analysisStepLabel = "Atıl Nakit & Yatırım Fırsatları Taranıyor...";
    } else if (checkKeywords(promptLower, ["gider", "harcama", "fatura", "abonelik", "kıs", "azalt", "masraf", "ödem", "kart", "expense", "bill", "subscription"])) {
      analysisStepLabel = "Gider Yapısı ve Abonelikler İnceleniyor...";
    } else if (checkKeywords(promptLower, ["hedef", "plan", "birikim", "ev", "araba", "tarih", "vade", "süre", "kaç ay", "goal", "plan"])) {
      analysisStepLabel = "Finansal Hedef Zaman Çizelgesi Modelleniyor...";
    } else if (checkKeywords(promptLower, ["selam", "merhaba", "naber", "nasılsın", "kimsin", "hello", "hi"])) {
      analysisStepLabel = "Kişisel Finans Asistanı Hazırlanıyor...";
    }

    setThinkingSteps([{ status: 'running', label: analysisStepLabel }]);

    const fd = financialDataRef.current;
    let dataSummary = "VERİ YOK";
    if (fd) {
      const exps = (fd.expenses || []).map(e => `${e.name}: ${e.amount} TL`).join(", ");
      dataSummary = `MAAŞ: ${fd.salary?.income || 0}, TOPLAM GİDER: ${fd.totalExpense || 0}, DETAYLI HARCAMALAR: [${exps}]`;
    }

    const finalPrompt = `[FİNANSAL VERİ]: ${dataSummary}\n\nKullanıcı Mesajı: ${userPrompt}`;

    // API Key loop with auto fallback failover
    let success = false;
    let responseText = "";
    let finalThinkingSteps = [{ status: 'done', label: analysisStepLabel }];
    let keysTried = 0;
    const totalKeys = Math.max(1, API_KEYS.length);
    
    // Start with 3.1 as the user requested
    let currentModel = "gemini-3.1-flash-lite";

    while (keysTried < totalKeys && !success) {
      if (API_KEYS.length === 0) {
        setMessages(prev => [...prev, { role: "model", content: "Lütfen Netlify veya Vercel üzerinde VITE_GEMINI_API_KEYS veya VITE_GEMINI_API_KEY tanımla usta!" }]);
        setIsTyping(false);
        setThinkingSteps([]);
        return;
      }

      const currentKey = API_KEYS[activeKeyIndex];

      try {
        if (currentModel === "gemini-3.1-flash-lite") {
          setActiveModel("3.1");
        } else {
          setActiveModel("2.5");
        }

        const genAI = new GoogleGenerativeAI(currentKey);
        const model = genAI.getGenerativeModel({ 
          model: currentModel, 
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: TOOL_DECLARATIONS }] 
        });

        // TAM GERÇEK ZAMANLI SOHBET HAFIZASI (Conversational Memory)
        const formattedHistory = messages.map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const chat = model.startChat({ history: formattedHistory });
        
        let result = await chat.sendMessage(finalPrompt);
        let response = result.response;
        
        let iters = 0;
        while (response.functionCalls() && iters < 3) {
          const calls = response.functionCalls();
          const functionResponses = [];
          
          for (const call of calls) {
            const stepLabel = call.name === "calculateGoalTimeline" ? "Hedef Süresi Hesaplanıyor..." :
                              call.name === "simulateExpenseRemoval" ? "Harcama Senaryosu Çıkarılıyor..." :
                              "Detaylı Analiz Yapılıyor...";
            
            setThinkingSteps(prev => [...prev, { status: 'running', label: stepLabel }]);
            
            const apiResponse = await executeTool(call, fd);
            functionResponses.push({
              functionResponse: { name: call.name, response: apiResponse }
            });
            
            setThinkingSteps(prev => prev.map((s, i) => i === prev.length - 1 ? { ...s, status: 'done' } : s));
            finalThinkingSteps.push({ status: 'done', label: stepLabel });
          }
          
          result = await chat.sendMessage(functionResponses);
          response = result.response;
          iters++;
        }

        responseText = response.text();
        success = true;
      } catch (err) {
        console.warn(`API Key Index ${activeKeyIndex} with model ${currentModel} failed:`, err);
        
        // 1. DÜŞÜŞ KADEMESİ: Eğer 3.1 ile hata alırsak, AYNI anahtarda önce 2.5'e düşüp tekrar deneriz!
        if (currentModel === "gemini-3.1-flash-lite") {
          currentModel = "gemini-2.5-flash";
          setActiveModel("2.5");
          
          setThinkingSteps(prev => [
            ...prev.map(s => s.status === 'running' ? { ...s, status: 'done' } : s),
            { status: 'running', label: "Switched to 2.5 (Aynı Sunucuda Model Düşürülüyor...)" }
          ]);
          await new Promise(r => setTimeout(r, 800));
          continue; // Döngüyü kırmadan AYNI anahtarla (activeKeyIndex artmadan) yeni modelle tekrar dene!
        } else {
          // 2. KADEME: Eğer zaten 2.5'teydik ve yine hata aldıysak, şimdi sıradaki YEDEK anahtara geçiyoruz!
          activeKeyIndex = (activeKeyIndex + 1) % API_KEYS.length;
          keysTried++;
          
          if (keysTried >= totalKeys) {
            setMessages(prev => [...prev, { role: "model", content: "Tüm API anahtarların denendi fakat limit aşımı veya başka bir hata nedeniyle yanıt alınamadı usta. Lütfen daha sonra tekrar dener misin?" }]);
            setIsTyping(false);
            setThinkingSteps([]);
            return;
          }

          setThinkingSteps(prev => [
            ...prev.map(s => s.status === 'running' ? { ...s, status: 'done' } : s),
            { status: 'running', label: "Yedek Sunucuya Geçiliyor (Limit Bypass)..." }
          ]);
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
    setMessages(prev => [...prev, { role: "model", content: responseText, thinkingSteps: finalThinkingSteps }]);
    setIsTyping(false);
    setThinkingSteps([]);
  }, [messages]);

  return { messages, sendMessage, isTyping, thinkingSteps, activeModel, isAvailable: API_KEYS.length > 0 };
}
