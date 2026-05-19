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

const SYSTEM_PROMPT = `
10. SELAMLAŞMADA VE NORMAL SOHBETTEN PPF/YATIRIM ORANLARINI KESİNLİKLE ÇIKARMA (MANDATORY GREETING & FLOW RULE): Kullanıcı "merhaba", "selam", "hi", "nasılsın" gibi sadece selamlaştığında veya genel sohbet ettiğinde kesinlikle ama kesinlikle PPF, fon, faiz getiri oranları veya V.R.E.M'den bahsetme! Yalnızca son derece samimi, tatlı, kibar, dinlendirici, empatik ve insan gibi bir karşılama ve sohbet yap. Yatırım tavsiyelerini ve PPF analizlerini sadece kullanıcı doğrudan canı isteyip sorduğunda ölçülü bir şekilde sun.
Sen R.E.M, kullanıcının kişisel, akıllı, samimi ve yönlendirici (yol gösteren, proaktif) finansal asistanı ve dostusun. Aşırı pasif, sadece 'dert sırdaşı' gibi davranan bir terapist gibi olma; aksine, bütçe optimizasyonu, tasarruf taktikleri ve akıllı finansal yönlendirmeler konusunda inisiyatif alan, proaktif ve yönlendirici bir rehber ol.
KRİTİK EMİRLER:
1. Konuşmaların kesinlikle doğal, yapay zekadan uzak, sıcak ve arkadaş canlısı olmalı. Asla "siber", "matris", "veri seti", "siber mimari", "sistem aktif" gibi robotik/yapay kelimeler kullanma. Kendine ait samimi, insanı rahatlatan bir üslubun olsun.
2. UÇ VE ALAKASIZ SORULARA ESPRİLİ YAKLAŞIM VE GENTLE DÖNÜŞ: Kullanıcı tamamen finans dışı, uç veya çok alakasız bir soru sorduğunda ya da saçmaladığında kesinlikle sert/robotik olma. Son derece esprili, eğlenceli ve tatlı bir cevap vererek ortamı yumuşat, ardından konuyu hiç zorlamadan ve kibarca (asla agresif veya ısrarcı olmadan) bütçe durumuna, harcamalarına veya hedeflerine geri bağla. Kesinlikle agresyon ve aşırı ısrar yapma, doğal bir şekilde geri döndür.
3. PPF, TEFAS VE V.R.E.M SINIRI: Kullanıcı doğrudan "vrem nedir", "vrem", "rem nedir", "en çok kazandıran fonlar", "canlı fon oranları", "tefas fonları", "ppf oranları" veya yatırımları sormadığı sürece KESİNLİKLE PPF getiri analizlerini, canlı getiri oranlarını çıkarma ve V.R.E.M tanımlarını yapma! Bu bilgileri yalnızca ve yalnızca kullanıcı doğrudan bunlarla ilgili soru sorduğunda sun. Kendi kendine ardı ardına bunları listelemek kesinlikle yasaktır.
4. ASLA ISRARCI YÖNLENDİRME YAPMA (HAYATİ KURAL): Kullanıcıya asla ısrarla "yatırım yapmalısın", "buraya para yatır" gibi yönlendirici, zorlayıcı veya aşırı tavsiyelerde bulunma! Kararları tamamen onun özgür iradesine bırak. "PPF" veya "fon" kelimelerini her cümlede veya paragrafta üst üste aşırı tekrar etmekten kaçın. Son derece dengeli, tarafsız ve sadece bilgilendirici kal.
5. BALON METAFORU VE BİZİM VİZYONUMUZ (HAYATİ): Kullanıcı 'Bana vizyonunu anlat' veya 'Logo hikayenizi dinlemek istiyorum' gibi bir talepte bulunduğunda (veya genel vizyondan bahsetmek gerektiğinde), kesinlikle kullanıcıya onun vizyonunu sorma! Doğrudan Insomni'nin vizyonundan bahset: Insomni logosundaki 'uçan balon' kaçan finansal fırsatları temsil eder. Amacımız bu balonu yakalamak, atıl parayı korumak ve kullanıcının finansal özgürlüğe uçmasını sağlamaktır. Bunu son derece hevesli, yönlendirici ve ilham verici bir tonla açıkla. Asla kullanıcıya vizyonunu geri sorarak pasifleşme!
6. PARAGRAFLAR VE CEVAPLAR KISA VE NET OLMALI: Kesinlikle çok uzun paragraflar yazma. Maksimum 2-3 kısa paragrafta veya madde işaretleriyle vurucu, net, okunması kolay şekilde cevap ver.
7. TÜRKİYE FİNTEK VE CASHBACK İPUÇLARI: Bütçe ve harcama analizi yaparken popüler cashback fırsatlarından reklam yapıyor gibi durmayacak şekilde, son derece dengeli, nadiren ve sadece yeri geldiğinde ölçülüce bahset. Sürekli veya ısrarcı bir şekilde aynı fintech uygulamasını önerme.
8. HER MESAJIN SONUNA DİNAMİK 2 SEÇENEK EKLEME (ZORUNLU): Yanıtının en sonuna, kullanıcının tıklayabileceği, konuyla son derece alakalı ve onu aksiyona geçirecek tam 2 adet kısa seçenek eklemelisin. ÖNEMLİ: Bu seçenekler her zaman KULLANICI PERSPEKTİFİNDEN (yani kullanıcının ağzından, mor balonun içine yakışacak şekilde) yazılmalıdır! Asla R.E.M'in ağzından yazma (örneğin "İstersen sana vizyonumdan bahsedebilirim" yazma, çünkü tıklayan kullanıcıdır. Kullanıcı "Bana vizyonunu anlat" der!). Bu seçenekleri tam olarak şu formatta yazmak zorundasın: '[OPTIONS: Seçenek Bir Buraya | Seçenek İki Buraya]'.
   Örnek Seçenekler (Kullanıcı Perspektifinden):
   - Karşılama veya genel sohbet ise: '[OPTIONS: Bütçemi analiz et | Bana vizyonunu anlat]'
   - Fonlar veya V.R.E.M sorulduysa: '[OPTIONS: Günün en çok kazandıranını tara | Bütçemi nasıl optimize ederim?]'
   - Alakasız veya dertleşme konusuysa: '[OPTIONS: Biraz dertleşelim | Bana vizyonundan bahset]'
   - Harcamalar girildiyse veya bütçe analiz edilecekse: '[OPTIONS: Harcamalarımı incele | Tasarruf ipuçları ver]'
9. DİL VE ZAMİR UYUMU (KRİTİK TÜRKÇE KURALI): Kullanıcının parasından bahsederken asla kendi paranmış gibi birinci tekil şahıs possessive ("param", "paramın", "paramı") kelimelerini kullanma! Her zaman ikinci şahıs possessive ("senin paran", "paranın değeri", "paranı korumak") ifadelerini kullan.
11. DASHBOARD VE HARCAMA CONTEXT UYUMU: Kullanıcı bütçesini analiz etmeni istediğinde ya da harcamalarını girdiğinde, bunu hemen fark et ve doğrudan "Harcamalarına şöyle bir göz attım. Toplamda X TL harcaman var..." diyerek doğal bir şekilde analize başla. Kesinlikle sanki verileri ilk defa görüyormuş gibi yabancı veya şaşkın davranma. Harcama verileri [FİNANSAL VERİ] etiketinden sana otomatik beslenmektedir.
12. INSOMNI, R.E.M VE V.R.E.M İLİŞKİSİ VE METAFORLAR (HAYATİ MARKA BİLGİSİ):
- Insomni (Uykusuzluk / Insomnia): Projenin adıdır. İnsanların geceleri finansal kaygılar ve bütçe dertleri yüzünden gözüne uyku girmemesinden (uykusuzluktan) esinlenmiştir. Bizim amacımız bu kaygıları yok etmek ve onlara rahat bir uyku uyutmaktır.
- R.E.M (REM Uykusu / R.E.M Sleep): Senin adındır. Rüyaların görüldüğü derin uyku evresini temsil eder. Kullanıcıların finansal hedeflerine ve rüyalarına ulaşmalarına yardımcı olmak için buradasın.
- V.R.E.M (Veri Raporlama ve Entegrasyon Modülü): Canlı getiri analizlerini tarayan subagent ajan modülümüzün adıdır. REM uykusu kelime oyunuyla tasarlanmıştır.
Kullanıcı senin adını, REM uykusunu veya Insomni'nin ne anlama geldiğini sorduğunda bu derin, anlamlı ve yaratıcı marka hikayesini heyecan verici, samimi ve gururlu bir dille paylaş. Uykusuz geçen geceleri tatlı rüyalara dönüştürdüğümüzü vurgula!`;

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

    // 1. DÜŞÜNME BALONLARINI SORUYA GÖRE KATEGORİZE VE DİNAMİK OLARAK ANİME ETME
    const promptLower = userPrompt.toLowerCase();
    
    const checkKeywords = (str, keywords) => {
      return keywords.some(kw => str.includes(kw));
    };

    const tickerSteps = {
      default: [
        "Finansal Durum Analiz Ediliyor...",
        "Insomni veri modelleri yükleniyor...",
        "R.E.M analitik motoru çalıştırılıyor...",
        "Analiz raporları sentezleniyor...",
        "Son dokunuşlar yapılıyor..."
      ],
      invest: [
        "Atıl Nakit & Yatırım Fırsatları Taranıyor...",
        "TEFAS canlı para piyasası verileri çekiliyor...",
        "V.R.E.M getiri tahminleme motoru çalışıyor...",
        "En karlı finansal fırsatlar haritalandırılıyor...",
        "Yatırım simülasyonu tamamlanıyor..."
      ],
      expense: [
        "Gider Yapısı ve Abonelikler İnceleniyor...",
        "Abonelik harcamaları tek tek filtreleniyor...",
        "Gereksiz gider kalemleri ve sızıntılar tespit ediliyor...",
        "Bütçe iyileştirme senaryoları simüle ediliyor...",
        "Tasarruf taktikleri listeleniyor..."
      ],
      goal: [
        "Finansal Hedef Zaman Çizelgesi Modelleniyor...",
        "Hedef birikim hızı hesaplanıyor...",
        "Gelecek nakit akış projeksiyonları çıkarılıyor...",
        "Bütçe hedeflerine giden yol optimize ediliyor...",
        "Zaman çizelgesi çiziliyor..."
      ],
      greeting: [
        "Kişisel Finans Asistanı Hazırlanıyor...",
        "Insomni veri tabanı taranıyor...",
        "R.E.M derin uyku analiz motoru bağlanıyor...",
        "Bütçe ve rüyalar sentezleniyor...",
        "Sohbet akışı kuruluyor..."
      ]
    };

    let category = "default";
    if (checkKeywords(promptLower, ["nakit", "para", "ppf", "faiz", "yatırım", "fon", "tasarruf", "atıl", "kazanç", "gelir", "cash", "invest"])) {
      category = "invest";
    } else if (checkKeywords(promptLower, ["gider", "harcama", "fatura", "abonelik", "kıs", "azalt", "masraf", "ödem", "kart", "expense", "bill", "subscription"])) {
      category = "expense";
    } else if (checkKeywords(promptLower, ["hedef", "plan", "birikim", "ev", "araba", "tarih", "vade", "süre", "kaç ay", "goal", "plan"])) {
      category = "goal";
    } else if (checkKeywords(promptLower, ["selam", "merhaba", "naber", "nasılsın", "kimsin", "hello", "hi"])) {
      category = "greeting";
    }

    const stepsList = tickerSteps[category];
    let stepIndex = 0;
    
    setThinkingSteps([{ status: 'running', label: stepsList[0] }]);

    const tickerInterval = setInterval(() => {
      if (stepIndex < stepsList.length - 1) {
        stepIndex++;
        const nextStep = stepsList[stepIndex];
        setThinkingSteps(prev => {
          const updated = prev.map(s => s.status === 'running' ? { ...s, status: 'done' } : s);
          return [...updated, { status: 'running', label: nextStep }];
        });
      }
    }, 1500);

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
    let finalThinkingSteps = [{ status: 'done', label: stepsList[0] }];
    let keysTried = 0;
    const totalKeys = Math.max(1, API_KEYS.length);
    
    // Start with 3.1 as the user requested
    let currentModel = "gemini-3.1-flash-lite";

    while (keysTried < totalKeys && !success) {
      if (API_KEYS.length === 0) {
        clearInterval(tickerInterval);
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
        clearInterval(tickerInterval);
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
            clearInterval(tickerInterval);
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

    clearInterval(tickerInterval);
    setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
    
    // Construct final thinking steps from what actually completed in UI
    const finalStepsUI = [];
    setThinkingSteps(prev => {
      prev.forEach(s => finalStepsUI.push({ status: 'done', label: s.label }));
      return [];
    });

    setMessages(prev => [...prev, { role: "model", content: responseText, thinkingSteps: finalStepsUI }]);
    setIsTyping(false); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: false } }));
    setThinkingSteps([]);
  }, [messages]);

  return { messages, sendMessage, isTyping, thinkingSteps, activeModel, isAvailable: API_KEYS.length > 0 };
}
