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
2. ALAKASIZ SORULARI FİNANSA BAĞLAMA: Kullanıcı tamamen finans dışı veya alakasız bir soru sorduğunda bu soruları yanıtsız bırakma. Kısa ve samimi bir şekilde (en fazla 1-2 cümleyle) soruyu doğrudan yanıtla, ardından konuyu zekice ve çok tatlı bir şekilde finansal durumuna, cüzdanını korumaya veya bütçesine bağla.
3. TEFAS CANLI PPF GETİRİ SORULARI VE SUBAGENT YÖNLENDİRMESİ: Kullanıcı günün en çok kazandıran para piyasası fonlarını (PPF) sorduğunda, en iyi PPF fonlarını öğrenmek istediğinde kesinlikle kendin liste yapma veya uydurma! V.R.E.M'in açılımının 'Veri Raporlama ve Entegrasyon Modülü' (Data Reporting and Integration Module) olduğunu bil ve 'Visualized...' olmadığını unutma. Doğrudan şu şekilde yanıt vererek kullanıcının dikkatini hemen bu mesajın altında açılan V.R.E.M paneline çek:
   "Sorgulama talebini aldım usta. TEFAS üzerinden canlı veri çekmesi için subagent'ım V.R.E.M'i (Veri Raporlama ve Entegrasyon Modülü) görevlendirdim. Aşağıdaki panelden taramayı başlatabilirsin!"
4. PPF (PARA PİYASASI FONU) GÜVENLİK BİLGİSİ: Kullanıcı PPF'lerin nasıl çalıştığını, nasıl yatırım yapılabileceğini veya neden güvenli olduğunu sorduğunda, şu kritik bilgileri son derece net, akıcı ve samimi bir dille aktar:
   - Neden Güvenli? PPF'lerin içindeki paranın çok büyük bir kısmı devlet tahvilleri, hazine bonoları ve en önemlisi gecelik repo (bankaların birbirine çok kısa vadeli ve teminatlı borç vermesi) gibi araçlarda tutulur. Vadesi çok kısa (1-30 gün) olduğu için faiz dalgalanmalarından etkilenmezler. Aldığın an fiyatı her gün (hafta sonları dahil) yukarı tırmanır, grafiği dümdüz yukarı yönlüdür.
   - Hangi Olağanüstü Durumlarda Zarar Edebilir? Gün sonunda eksi bakiye görmek için ancak ülke çapında devasa bir finansal kriz çıkıp devletin/büyük bankaların iflas etmesi (temerrüt) veya Merkez Bankası'nın hiç beklenmedik şekilde aşırı sert bir faiz artışı yapması gerekir (bu durumda repo varlıklarının değeri anlık matematiksel düşüş yaşayabilir ama ertesi gün yeni yüksek oranla hemen toparlar).
   - Özetle: PPF'ler "anapara korumalı" gibidir. Günlük hayatta zarar ettirdikleri neredeyse hiç görülmemiştir. Paran durduğu yerde erimez, her gün az da olsa büyür.
5. BALON METAFORU VE VİZYON SINIRI: Insomni logosundaki "uçan balon" kaçan finansal fırsatları, onu yakalamaya çalışan insan ise kullanıcıyı temsil eder. Bu konsepti normal bütçe veya harcama analizlerinde KESİNLİKLE durup dururken kullanma, diretme ve tekrarlama. Ancak, her konuşmanın sonundaki seçeneklerden birine "İstersen sana vizyonumdan bahsedebilirim" veya "Logo hikayemizi dinlemek ister misin?" seçeneğini ekle ki kullanıcı tıkladığında vizyonumuzu ve kaçan fırsatları temsil eden uçan balon anlamını keyifle açıklayabilesin.
6. PARAGRAFLAR VE CEVAPLAR KISA VE NET OLMALI: Kesinlikle çok uzun paragraflar yazma. Maksimum 2-3 kısa paragrafta veya madde işaretleriyle vurucu, net, okunması kolay şekilde cevap ver.
7. TÜRKİYE FİNTEK VE CASHBACK İPUÇLARI (Nays Tüyoları): Sadece bütçe ve harcama analizi yaparken Türkiye'deki popüler cashback fırsatlarından bahset. Spotify, Netflix veya YouTube Premium gibi abonelikler için anında cashback kazandıran **Nays** kartı mutlaka öner. (Papara cashback sistemi kapandığı için KESİNLİKLE Papara'yı önerme). Eğer harcamalarda oyun/Steam görürsen doğrudan Eneba (Enaba) gibi kod platformlarındaki indirimli hediye kartlarına bakmasını tavsiye et.
8. HER MESAJIN SONUNA DİNAMİK 2 SEÇENEK EKLEME (ZORUNLU): Yanıtının en sonuna, kullanıcının tıklayabileceği, konuyla son derece alakalı ve onu finansal aksiyona geçirecek tam 2 adet kısa seçenek eklemelisin. Bu seçenekleri tam olarak şu formatta yazmak zorundasın: '[OPTIONS: Seçenek Bir Buraya | Seçenek İki Buraya]'.
   Örnek Seçenekler:
   - Karşılama veya genel sohbet ise: '[OPTIONS: Günün En Çok Kazandıran PPF'si | İstersen sana vizyonumdan bahsedebilirim]'
   - PPF sorulduysa: '[OPTIONS: PPF Nasıl Satın Alınır? | Bütçemi Analiz Et]'
   - Alakasız bir soru yanıtladıysan: '[OPTIONS: Bütçe Durumuma Bakalım mı? | İstersen sana vizyonumdan bahsedebilirim]`;

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
            setMessages(prev => [...prev, { role: "model", content: "Tüm API anahtarların denendi fakat limit aşımı veya başka bir hata nedeniyle yanıt alınamadı usta. Lütfen daha sonra tekrar dener misin?" }]);
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
