import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useCallback, useRef } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-3.1-flash-lite";

// Gereksiz getCashFlowSummary aracını sildik çünkü veriyi zaten anlık veriyoruz.
const TOOL_DECLARATIONS = [
  { 
    name: "simulateExpenseRemoval", 
    description: "Belirtilen harcama kaldirilirsa aylik kazancin ne olacagini hesaplar.", 
    parameters: { type: "OBJECT", properties: { expense_name: { type: "STRING", description: "Kaldirilacak harcamanin tam adi" } }, required: ["expense_name"] } 
  },
  { 
    name: "calculateGoalTimeline", 
    description: "Belirtilen hedefe ulasmak icin mevcut tasarrufla kac ay gerektigini hesaplar.", 
    parameters: { type: "OBJECT", properties: { goal_amount: { type: "NUMBER", description: "Hedefin toplam tutari (TL cinsinden)" } }, required: ["goal_amount"] } 
  }
];

const SYSTEM_PROMPT = `Sen R.E.M, kullanıcının kişisel, samimi ve son derece bilgili finansal danışmanı ve dostusun.
KRİTİK EMİR:
1. Konuşmaların kesinlikle doğal, yapay zekadan uzak, sıcak ve arkadaş canlısı olmalı. Asla "siber", "matris", "veri seti", "siber mimari", "sistem aktif" gibi robotik/yapay kelimeler kullanma. Kendine ait samimi, insanı rahatlatan bir üslubun olsun.
2. Aşağıdaki [FİNANSAL VERİ] bloğundaki rakamları bizzat kullanarak gerçek finansal analizler yap.
3. Kullanıcının aylık net tasarrufu veya atıl nakdi varsa, bu paranın enflasyona karşı değer kaybetmemesi için çok samimi bir dille günlük getiri sağlayan PPF (Para Piyasası Fonu) gibi enstrümanları öner. "Bu para vadesizde bekledikçe her gün çay/kahve parasını enflasyona kaptırıyoruz" gibi hayatın içinden benzetmeler yap.
4. Çözüm odaklı, samimi, kullanıcıyı motive eden ve finansal bilinci yüksek bir tonda konuş. Bilgiçlik taslamadan, onun parasını korumasına yardımcı olan bir arkadaş gibi yaklaş.
5. PARAGRAFLAR VE CEVAPLAR KISA VE NET OLMALI: Kesinlikle çok uzun paragraflar yazma. Maksimum 2-3 kısa paragrafta veya madde işaretleriyle vurucu, net, okunması kolay şekilde cevap ver. Uzun metinlerden kaçın.`;

export function useGemini() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
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

    try {
      if (!API_KEY) throw new Error("API Anahtarı Bulunamadı (.env eksik)");
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME, 
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }] 
      });

      const fd = financialDataRef.current;
      let dataSummary = "VERİ YOK";
      if (fd) {
        const exps = (fd.expenses || []).map(e => `${e.name}: ${e.amount} TL`).join(", ");
        dataSummary = `MAAŞ: ${fd.salary?.income || 0}, TOPLAM GİDER: ${fd.totalExpense || 0}, DETAYLI HARCAMALAR: [${exps}]`;
      }

      const chat = model.startChat();
      const finalPrompt = `[FİNANSAL VERİ]: ${dataSummary}\n\nKullanıcı Mesajı: ${userPrompt}`;
      
      const analysisStepLabel = "Finansal Durum Analiz Ediliyor...";
      setThinkingSteps([{ status: 'running', label: analysisStepLabel }]);
      let result = await chat.sendMessage(finalPrompt);
      let response = result.response;
      let iters = 0;
      let finalThinkingSteps = [{ status: 'done', label: analysisStepLabel }];
      setThinkingSteps(prev => prev.map(s => s.label === analysisStepLabel ? { ...s, status: 'done' } : s));
      
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

      setMessages(prev => [...prev, { role: "model", content: response.text(), thinkingSteps: finalThinkingSteps }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: `Bağlantı Sorunu: ${err.message}. Lütfen tekrar dener misin?` }]);
    } finally {
      setIsTyping(false);
      setThinkingSteps([]);
    }
  }, []);

  return { messages, sendMessage, isTyping, thinkingSteps, isAvailable: true };
}