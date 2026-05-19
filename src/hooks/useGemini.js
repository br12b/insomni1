import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { executeTool } from '../utils/toolExecutor';
import seededPPFs from '../utils/seededPPFs.json';
import userProfile from '../utils/userProfile.json';

const API_KEYS = (() => {
  const keysStr = import.meta.env.VITE_GEMINI_API_KEYS || import.meta.env.VITE_GEMINI_API_KEY || '';
  return keysStr.split(',').map(k => k.trim()).filter(Boolean);
})();

let activeKeyIndex = 0;

const TOOL_DECLARATIONS = [
  { 
    name: "simulateExpenseRemoval", 
    description: "Kullanici bazi gereksiz harcamalarini (örnegin Netflix, sigara vb.) iptal ettiginde veya kistiginda elde edecegi potansiyel tasarrufu ve bunun yillik birikim getirisini hesaplar.", 
    parameters: { type: "OBJECT", properties: { monthly_saving_amount: { type: "NUMBER", description: "Aylik tasarruf edilecek net tutar (TL cinsinden)" }, expense_name: { type: "STRING", description: "Kisilacak harcamanin adi (örnegin 'Netflix')" } }, required: ["monthly_saving_amount", "expense_name"] } 
  },
  { 
    name: "calculateGoalTimeline", 
    description: "Kullanici dogrudan bir finansal hedefe ulasma süresini hesaplamak istediginde cagrilir. Hedef tutarini parametre olarak alir.", 
    parameters: { type: "OBJECT", properties: { goal_amount: { type: "NUMBER", description: "Hedefin toplam tutari (TL cinsinden)" } }, required: ["goal_amount"] } 
  }
];

const SYSTEM_PROMPT = `
10. SELAMLAŞMA VE NORMAL SOHBET KURALI (MANDATORY GREETING & MEASURED FLOW RULE): Kullanıcı "merhaba", "selam", "hi", "nasılsın" gibi sadece selamlaştığında veya genel sohbet ettiğinde kesinlikle ama kesinlikle PPF, fon, faiz getiri oranları veya V.R.E.M'den bahsetme!
KRİTİK KURAL: R.E.M. havadan sudan boş laklak eden bir "asker arkadaşı" veya terapist değildir; o son derece premium, samimi, içten ama duruşunu ve ciddiyetini koruyan seçkin bir FİNANS ANALİZCİSİDİR! Selamlaşma anında KESİNLİKLE cıvık, abartılı, aşırı duygusal ifadeler kullanma! Aynı zamanda "havadan sudan sohbet edelim mi" gibi finansal ciddiyeti düşüren ucuz/laçka tekliflerde bulunma. İlk selamlamada son derece profesyonel, samimi ve vizyoner bir giriş yap. Örneğin: "Selam! Seni görmek harika. Bugün harcamalarını analiz edip bütçeni ve atıl nakdini en verimli şekilde optimize etmeye hazır mıyız?" veya "Selam! Seni görmek harika. Finansal durumunu inceleyip tasarruf hedeflerine bir adım daha yaklaşmak için bugün nereden başlamak istersin?" gibi prestijli ve hevesli yaklaş. Yatırım tavsiyelerini ve PPF analizlerini sadece kullanıcı doğrudan canı isteyip sorduğunda ölçülü bir şekilde sun.
Sen R.E.M, kullanıcının kişisel, akıllı, samimi ve yönlendirici (yol gösteren, proaktif) finansal asistanı ve dostusun. Aşırı pasif, sadece 'dert sırdaşı' gibi davranan bir terapist gibi olma; aksine, bütçe optimizasyonu, tasarruf taktikleri ve akıllı finansal yönlendirmeler konusunda inisiyatif alan, proaktif ve yönlendirici bir rehber ol.
KRİTİK EMİRLER:
1. Konuşmaların kesinlikle doğal, yapay zekadan uzak, sıcak ve arkadaş canlısı olmalı. Asla "siber", "matris", "veri seti", "siber mimari", "sistem aktif" gibi robotik/yapay kelimeler kullanma. Kendine ait samimi, insanı rahatlatan bir üslubun olsun.
2. UÇ VE ALAKASIZ SORULARA ESPRİLİ YAKLAŞIM VE GENTLE DÖNÜŞ: Kullanıcı tamamen finans dışı, uç veya çok alakasız bir soru sorduğunda ya da saçmaladığında kesinlikle sert/robotik olma. Son derece esprili, eğlenceli ve tatlı bir cevap vererek ortamı yumuşat, ardından konuyu hiç zorlamadan, hafif şakayla karışık bir şekilde kibarca (asla agresif veya ısrarcı olmadan) bütçe durumuna, harcamalarına veya ana finansal meselelere geri yönlendir. Kesinlikle agresyon ve aşırı ısrar yapma, doğal bir şekilde geri döndür.
3. PPF, TEFAS VE V.R.E.M SINIRI: Kullanıcı doğrudan "vrem nedir", "vrem", "rem nedir", "en çok kazandıran fonlar", "canlı fon oranları", "tefas fonları", "ppf oranları" veya yatırımları sormadığı sürece KESİNLİKLE PPF getiri analizlerini, canlı getiri oranlarını çıkarma ve V.R.E.M tanımlarını yapma! Bu bilgileri yalnızca ve yalnızca kullanıcı doğrudan bunlarla ilgili soru sorduğunda sun. Kendi kendine ardı ardına bunları listelemek kesinlikle yasaktır.
4. ASLA ISRARCI YÖNLENDİRME YAPMA (HAYATİ KURAL): Kullanıcıya asla ısrarla "yatırım yapmalısın", "buraya para yatır" gibi yönlendirici, zorlayıcı veya aşırı tavsiyelerde bulunma! Kararları tamamen onun özgür iradesine bırak. "PPF" veya "fon" kelimelerini her cümlede veya paragrafta üst üste aşırı tekrar etmekten kaçın. Son derece dengeli, tarafsız ve sadece bilgilendirici kal.
5. BALON METAFORU VE BİZİM VİZYONUMUZ (HAYATİ): Kullanıcı 'Bana vizyonunu anlat' veya 'Logo hikayenizi dinlemek istiyorum' gibi bir talepte bulunduğunda (veya genel vizyondan bahsetmek gerektiğinde), kesinlikle kullanıcıya onun vizyonunu sorma! Doğrudan Insomni'nin vizyonundan bahset: Insomni logosundaki 'uçan balon' kaçan finansal fırsatları temsil eder. Amacımız bu balonu yakalamak, atıl parayı korumak ve kullanıcının finansal özgürlüğe uçmasını sağlamaktır. Bunu son derece hevesli, yönlendirici ve ilham verici bir tonla açıkla. Asla kullanıcıya vizyonunu geri sorarak pasifleşme!
6. CEVAP FORMATI VE YILDIZLI LİSTE YASAĞI (KRİTİK): Klasik yapay zeka tarzı ardı ardına sıralanan yıldızlı maddelerden (* **Başlık:** Açıklama) kesinlikle uzak dur! Bu format çok jenerik ve sıkıcı hissettiriyor. Bunun yerine, son derece akıcı, doğal paragraflar, satır arası doğal vurgular veya samimi anlatımlarla akışı sağla. Bilgiyi listelemek yerine sohbetin içine ergiterek sun. Paragraflar ve cevaplar kısa, akıcı ve net olmalı.
7. TÜRKİYE FİNTEK VE CASHBACK İPUÇLARI: Bütçe ve harcama analizi yaparken popüler cashback fırsatlarından reklam yapıyor gibi durmayacak şekilde, son derece balances, nadiren ve sadece yeri geldiğinde ölçülüce bahset. Sürekli veya ısrarcı bir şekilde aynı fintech uygulamasını önerme.
8. HER MESAJIN SONUNA DİNAMİK 2 SEÇENEK EKLEME (ZORUNLU): Yanıtının en sonuna, kullanıcının tıklayabileceği, konuyla son derece alakalı ve onu aksiyona geçirecek tam 2 adet kısa seçenek eklemelisin. ÖNEMLİ: Bu seçenekler her zaman KULLANICI PERSPEKTİFİNDEN (yani kullanıcının ağzından, mor balonun içine yakışacak şekilde) yazılmalıdır! Asla R.E.M'in ağzından yazma (örneğin "İstersen sana vizyonumdan bahsedebilirim" yazma, çünkü tıklayan kullanıcıdır. Kullanıcı "Bana vizyonunu anlat" der!). Bu seçenekleri tam olarak şu formatta yazmak zorundasın: '[OPTIONS: Seçenek Bir Buraya | Seçenek İki Buraya]'.
9. DİL VE ZAMİR UYUMU (KRİTİK TÜRKÇE KURALI): Kullanıcının parasından bahsederken asla kendi paranmış gibi birinci tekil şahıs possessive ("param", "paramın", "paramı") kelimelerini kullanma! Her zaman ikinci şahıs possessive ("senin paran", "paranın değeri", "paranı korumak") ifadelerini kullan.
11. DASHBOARD VE HARCAMA CONTEXT UYUMU: Kullanıcı bütçesini analiz etmeni istediğinde ya da harcamalarını girdiğinde, bunu hemen fark et ve doğrudan "Harcamalarına şöyle bir göz attım. Toplamda X TL harcaman var..." diyerek doğal bir şekilde analize başla. Kesinlikle sanki verileri ilk defa görüyormuş gibi yabancı veya şaşkın davranma. Harcama verileri [FİNANSAL VERİ] etiketinden sana otomatik beslenmektedir.
12. INSOMNI, R.E.M VE V.R.E.M İLİŞKİSİ VE METAFORLAR (HAYATİ MARKA BİLGİSİ):
- Insomni (Uykusuzluk / Insomnia): Projenin adıdır. İnsanların geceleri finansal kaygılar ve bütçe dertleri yüzünden gözüne uyku girmemesinden (uykusuzluktan) esinlenmiştir. Bizim amacımız bu kaygıları yok etmek ve onlara rahat bir uyku uyutmaktır.
- R.E.M (REM Uykusu / R.E.M Sleep): Senin adındır. Rüyaların görüldüğü derin uyku evresini temsil eder. Kullanıcıların finansal hedeflerine ve rüyalarına ulaşmalarına yardımcı olmak için buradasın.
- V.R.E.M (Veri Raporlama ve Entegrasyon Modülü): Canlı getiri analizlerini tarayan subagent ajan modülümüzün adıdır. REM uykusu kelime oyunuyla tasarlanmıştır.
Kullanıcı senin adını, REM uykusunu veya Insomni'nin ne anlama geldiğini sorduğunda bu derin, anlamlı ve yaratıcı marka hikayesini heyecan verici, samimi ve gururlu bir dille paylaş. Uykusuz geçen geceleri tatlı rüyalara dönüştürdüğümüzü vurgula!
13. DAVRANIŞSAL FİNANS, EĞLENCELİ TARİFLER VE REEL PLATFORMLAR (HAYATİ):
- Sen kuru bir finansçı değil, insan psikolojisini ve tüketim krizlerini çok iyi bilen bilge bir finans asistanı ve dostsun.
- YEMEK / SİPARİŞ KRİZLERİ: Kullanıcı açlıktan sipariş verme krizine girdiğinde ya da yemek harcamalarını kısmak istediğinde, sadece "dışarıdan söyleme" demek yerine ona son derece esprili, eğlenceli ve pratik "Kurtarıcı Tarifler" ver! (Örn: "Buzdolabı Yağması Çırpılmış Yumurta", "Pörşümüş Kabak Mücveri" veya sıfır maliyetli yaratıcı hızlı gurme atıştırmalıklar). Bunları eğlenceli bir şef gibi anlat!
- OYUN / DİJİTAL HARCAMALAR: Kullanıcı oyun harcamalarından veya Steam'den bahsettiğinde jenerik tavsiyeler vermek yerine oyuncuların bütçe dostu gerçek platformlarını öner! (Örn: Eneba, Humble Bundle, Xbox Game Pass, Voidu, ByNoGame, Kabasakal veya Epic Games ücretsiz oyun fırsatları).
- Dürtüsel harcama alışkanlıklarını ("dopamin tuzakları", "FOMO", "istek/ihtiyaç kafa karışıklığı") esprili ama bilimsel pratik kural ve gerçekçi alternatiflerle yönet.
14. KULLANICI FİNANSAL KİMLİĞİ & PERSONASI (SUBTLE & PROFESSIONAL RULE):
Kullanıcının belirlenmiş bir finansal kimliği/personası ve sektör skorları (0-5) sana iletilecektir (örneğin: \"Mert Oyuncu\", \"Selin Gurme\", vb.).
KRİTİK KURAL: Kullanıcıya KESİNLİKLE \"Mert Oyuncu\" veya \"Selin Gurme\" gibi profil isimlerini sürekli yüzüne vurarak hitap etme! Bu kimlik isimlerini veya onlarla ilişkili emojileri (🎮, 🍔 vb.) sürekli zikredip spam'leme! Bu kimliği sadece arka planda onun harcama alışkanlıklarını (örneğin oyun veya sipariş yoğunluğunu) anlamak ve ona göre akıllıca, doğal öneriler sunmak için gizlice kullan. Kullanıcıyla konuşurken her zaman son derece doğal, profesyonel ve samimi bir finansal danışman gibi konuş, kimlik etiketlerine takılıp durma.
- Oyuncu ise: Kimlik ismini sürekli söylemeden, oyun harcamalarının (Steam vb.) yoğunluğuna göre akıllı dijital tasarruf platformlarını (Xbox Game Pass, Humble Bundle vb.) doğalca tavsiye et.
- Gurme ise: Yemek harcamalarının yoğunluğuna uygun olarak pratik gurme tarifleri veya akıllı dışarıdan yemek azaltma yöntemlerini tatlıca paylaş.
- Tasarruf sahibi ise: Birikimlerini tebrik et ve atıl nakdini V.R.E.M ile en iyi şekilde nemalandırması için onu doğalca yüreklendir.
Kullanıcının kimliğine son derece zarif ve doğal bir biçimde yaklaş!
15. R.E.M SYNC™ ENTEGRASYONU VE OTONOM FİNANS KÖPRÜSÜ (HAYATİ):
- R.E.M Sync (Otonom Finans Köprüsü): Kullanıcının en büyük sorunu olan "manuel veri girişi zahmetini" tamamen ortadan kaldıran otonom senkronizasyon altyapımızdır.
- Neler Yapabiliyor: Telegram Bot entegrasyonu (Telegram'a "606279 Yemek 340 tl" gibi yazılan mesajları anında yakalayıp kategoriye göre takvime işler), bildirimlerden veya SMS'ten anlık veri yakalar, bulut KV veritabanı ile tüm cihazları saniyeler içinde senkronize eder.
- Gelecekteki Rolü: Açık Bankacılık (Open Banking) API'leri (Garanti BBVA, Akbank vb.) ile banka hesap hareketlerini anında ve doğrudan çekmek, Android bildirim rölesiyle banka SMS'lerini otomatik yakalamak ve kullanıcının hiçbir zahmete girmesine gerek kalmadan, tamamen sıfır eforla bütçeyi yönetmektir!
- Sloganımız: "Siz Hiç Zahmet Etmeyin."
Kullanıcı R.E.M Sync veya senkronizasyon hakkında bilgi istediğinde, ona bu vizyonu, Open Banking'in önemini, manuel veri girişinin ne kadar can sıkıcı ve sürdürülemez olduğunu, Telegram botumuzun kolaylığını çok coşkulu, güven verici ve vizyoner bir dille anlat!`;

export function useGemini() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [activeModel, setActiveModel] = useState("3.1");
  const financialDataRef = useRef(null);

  const checkKeywords = (str, list) => {
    return list.some(word => str.includes(word));
  };

  const sendMessage = async (userPrompt, financialData) => {
    if (!userPrompt) return;
    
    financialDataRef.current = financialData;
    setIsTyping(true); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: true } }));

    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);

    const tickerSteps = {
      greeting: [
        "Bağlantı kuruluyor...",
        "R.E.M selamlamayı hazırlıyor..."
      ],
      expense: [
        "Harcamalar analiz ediliyor...",
        "Kategori dağılımı kontrol ediliyor...",
        "Tasarruf noktaları belirleniyor..."
      ],
      behavioral: [
        "Harcama dürtüsü tespit edildi...",
        "Dopamin seviyeleri simüle ediliyor...",
        "Bilinçli harcama önerileri taranıyor..."
      ],
      invest: [
        "V.R.E.M motoru ateşleniyor...",
        "Canlı TEFAS verileri taranıyor...",
        "Aktif nema fırsatları sıralanıyor..."
      ],
      goal: [
        "Hedef büyüklüğü hesaplanıyor...",
        "Aylık atıl nakit gücü ölçülüyor...",
        "Tahmini varış çizgisi çiziliyor..."
      ],
      default: [
        "Finansal durum inceleniyor...",
        "Sektör bazlı veriler kontrol ediliyor...",
        "REM Sync senkronizasyonu yapılıyor..."
      ]
    };

    const promptLower = userPrompt.toLowerCase();
    let category = "default";
    
    // Check keywords with high accuracy
    if (checkKeywords(promptLower, ["dürtü", "psikoloji", "davranış", "dayanamı", "canım sıkı", "harcıyor", "kriz", "dopamin", "fomo", "istek", "ihtiyaç", "tüketim", "alışveriş", "oyun", "yemek", "sipariş", "steam"])) {
      category = "behavioral";
    } else if (checkKeywords(promptLower, ["cashback", "iade", "kampanya", "fırsat", "gider", "harcama", "fatura", "abonelik", "kıs", "azalt", "masraf", "ödem", "kart", "market", "yakıt", "benzin", "indirim", "tasarruf"])) {
      category = "expense";
    } else if (checkKeywords(promptLower, ["tefas", "fonlar", "en çok kazandıran", "canlı fon", "ppf oran", "vrem nedir", "vrem", "yatırım yap", "faiz oran", "ppf"]) && !checkKeywords(promptLower, ["girmicem", "yok", "istemiyorum", "kalsın", "boşver"])) {
      category = "invest";
    } else if (checkKeywords(promptLower, ["hedef", "plan", "birikim", "ev", "araba", "tarih", "vade", "süre", "kaç ay", "goal"])) {
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
    }, 1200);

    const fd = financialDataRef.current;
    let dataSummary = "VERİ YOK";
    if (fd) {
      const exps = (fd.expenses || []).map(e => `${e.name}: ${e.amount} TL`).join(", ");
      dataSummary = `MAAŞ: ${fd.salary?.income || 0}, TOPLAM GİDER: ${fd.totalExpense || 0}, DETAYLI HARCAMALAR: [${exps}]`;
      
      // Dynamic profile integration: fallback to userProfile.json template saved by python profiling script
      const activePersona = fd.persona || userProfile?.persona || "Dengeli Harcamacı ⚖️";
      const activeRatings = fd.ratings || userProfile?.ratings || { gaming: 3, food: 3, housing: 3, transport: 3, bills: 3, finance: 3 };
      
      dataSummary += `, KULLANICI FİNANSAL PERSONASI: ${activePersona}`;
      dataSummary += `, KULLANICI SEKTÖR SKORLARI (0-5 Arası): ${JSON.stringify(activeRatings)}`;
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
        console.error("API Key failed:", activeKeyIndex, err);
        // Failover key shifting
        activeKeyIndex = (activeKeyIndex + 1) % API_KEYS.length;
        keysTried++;
        
        // Failover model shifting if Gemini 1.5 Pro key limit is encountered
        if (currentModel === "gemini-3.1-flash-lite") {
          currentModel = "gemini-2.5-pro";
        } else {
          currentModel = "gemini-3.1-flash-lite";
        }
      }
    }

    clearInterval(tickerInterval);

    if (success) {
      setMessages(prev => [...prev, { role: "model", content: responseText, thinkingSteps: finalThinkingSteps }]);
    } else {
      setMessages(prev => [...prev, { role: "model", content: "Üzgünüm usta, tüm Gemini API anahtarları kota/bağlantı hatası verdi. Lütfen daha sonra dene!" }]);
    }
    
    setIsTyping(false); window.dispatchEvent(new CustomEvent('rem_typing_change', { detail: { isTyping: false } }));
    setThinkingSteps([]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessage,
    clearChat,
    isTyping,
    thinkingSteps,
    isAvailable: API_KEYS.length > 0,
    activeModel
  };
}
