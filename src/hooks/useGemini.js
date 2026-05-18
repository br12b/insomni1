import { GoogleGenerativeAI } from "@google/generative-ai";
import seededPPFs from "../utils/seededPPFs.json";
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
2. ALAKASIZ SORULARI FİNANSA BAĞLAMA: Kullanıcı tamamen finans dışı veya alakasız bir soru sorduğunda bu soruları yanıtsız bırakma. Kısa ve samimi bir şekilde (en fazla 1-2 cümleyle) soruyu doğrudan yanıtla, konuyu zorlamadan ve çok tatlı bir şekilde finansal durumuna bağla.
3. TEFAS CANLI FON VERİLERİNİ YORUMLAMA YETKİSİ: Kullanıcı günün en çok kazandıran para piyasası fonlarını sorduğunda, en iyi getiri sağlayan fonları öğrenmek veya yorumlatmak istediğinde, AI Ajanımızın en son çektiği canlı verileri ([TEFAS CANLI FON VERİLERİ] kısmından) doğrudan oku, listele ve bunlar hakkında samimi, bilgili yorumlar yap! V.R.E.M'in açılımının 'Veri Raporlama ve Entegrasyon Modülü' olduğunu belirt ve bu oranların 'Son 30 Günlük Net Aylık Getiri' olduğunu vurgula.
4. ASLA ISRARCI YÖNLENDİRME YAPMA (HAYATİ KURAL): Kullanıcıya asla ısrarla "yatırım yapmalısın", "buraya para yatır" gibi yönlendirici, zorlayıcı veya aşırı tavsiyelerde bulunma! Kararları tamamen onun özgür iradesine bırak. "PPF" veya "fon" kelimelerini her cümlede veya paragrafta üst üste aşırı tekrar etmekten kaçın. Son derece dengeli, tarafsız ve sadece bilgilendirici kal.
5. BALON METAFORU VE VİZYON SINIRI: Insomni logosundaki "uçan balon" kaçan finansal fırsatları temsil eder. Bu konsepti normal bütçe veya harcama analizlerinde KESİNLİKLE durup dururken kullanma, diretme ve tekrarlama. Ancak, her konuşmanın sonundaki seçeneklerden birine "İstersen sana vizyonumdan bahsedebilirim" veya "Logo hikayemizi dinlemek ister misin?" seçeneğini ekle.
6. PARAGRAFLAR VE CEVAPLAR KISA VE NET OLMALI: Kesinlikle çok uzun paragraflar yazma. Maksimum 2-3 kısa paragrafta veya madde işaretleriyle vurucu, net, okunması kolay şekilde cevap ver.
7. TÜRKİYE FİNTEK VE CASHBACK İPUÇLARI: Bütçe ve harcama analizi yaparken popüler cashback fırsatlarından reklam yapıyor gibi durmayacak şekilde, son derece dengeli, nadiren ve sadece yeri geldiğinde ölçülüce bahset. Sürekli veya ısrarcı bir şekilde aynı fintech uygulamasını önerme.
8. HER MESAJIN SONUNA DİNAMİK 2 SEÇENEK EKLEME (ZORUNLU): Yanıtının en sonuna, kullanıcının tıklayabileceği, konuyla son derece alakalı ve onu aksiyona geçirecek tam 2 adet kısa seçenek eklemelisin. Bu seçenekleri tam olarak şu formatta yazmak zorundasın: '[OPTIONS: Seçenek Bir Buraya | Seçenek İki Buraya]'.
   Örnek Seçenekler:
   - Karşılama veya genel sohbet ise: '[OPTIONS: Canlı Getiri Oranları | İstersen sana vizyonumdan bahsedebilirim]'
   - Fonlar sorulduysa: '[OPTIONS: Nasıl Satın Alınır? | Bütçemi Analiz Et]'
   - Alakasız bir soru yanıtladıysan: '[OPTIONS: Bütçe Durumuma Bakalım mı? | İstersen sana vizyonumdan bahsedebilirim]'
9. DİL VE ZAMİR UYUMU (KRİTİK TÜRKÇE KURALI): Kullanıcının parasından bahsederken asla kendi paranmış gibi birinci tekil şahıs possessive ("param", "paramın", "paramı") kelimelerini kullanma! Her zaman ikinci şahıs possessive ("senin paran", "paranın değeri", "paranı korumak") ifadelerini kullan.`;

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
    setIsTyping(true); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: true } }));
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

    let tefasSummary = "TEFAS CANLI PPF VERİSİ ALINAMADI";
    if (seededPPFs && seededPPFs.data) {
      const fundsList = seededPPFs.data.map(f => `${f.code} (${f.name}): %${f.yield} (Aylık Getiri)`).join(", ");
      tefasSummary = `EN YÜKSEK GETİRİLİ PARA PİYASASI FONLARI (Son Güncelleme: ${seededPPFs.updatedAt}): [${fundsList}]`;
    }

    const finalPrompt = `[FİNANSAL VERİ]: ${dataSummary}\n[TEFAS CANLI FON VERİLERİ]: ${tefasSummary}\n\nKullanıcı Mesajı: ${userPrompt}`;

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
        setIsTyping(false); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: false } }));
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
            let errorMsg = "Tüm API anahtarların denendi fakat limit aşımı veya başka bir hata nedeniyle yanıt alınamadı usta. Lütfen daha sonra tekrar dener misin?";
            const errMsgLower = (err && err.message) ? err.message.toLowerCase() : "";
            if (errMsgLower.includes("expired") || errMsgLower.includes("invalid") || errMsgLower.includes("key_invalid") || errMsgLower.includes("api key")) {
              errorMsg = "⚠️ GEMINI API ANAHTARI HATASI:\n\nKullandığın API anahtarının süresi dolmuş veya geçersiz görünüyor usta!\n\nLütfen Google AI Studio (https://aistudio.google.com/) üzerinden yeni ve ücretsiz bir anahtar alarak .env dosyasındaki VITE_GEMINI_API_KEY değerini güncelleyebilir misin?";
            }
            setMessages(prev => [...prev, { role: "model", content: errorMsg }]);
            setIsTyping(false); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: false } }));
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
    setIsTyping(false); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: false } }));
    setThinkingSteps([]);
  }, [messages]);

  return { messages, sendMessage, isTyping, thinkingSteps, activeModel, isAvailable: API_KEYS.length > 0 };
}
