import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useCallback, useRef } from "react";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-3.1-flash-lite";

const TOOL_DECLARATIONS = [
  { name: "getCashFlowSummary", description: "Kullanicinin nakit akisini ozetler." },
  { name: "simulateExpenseRemoval", description: "Harcama kaldirinca kazanci hesaplar.", parameters: { type: "OBJECT", properties: { expense_name: { type: "STRING" } }, required: ["expense_name"] } },
  { name: "calculateGoalTimeline", description: "Hedefe kac ayda ulasilacagini hesaplar.", parameters: { type: "OBJECT", properties: { goal_amount: { type: "NUMBER" } }, required: ["goal_amount"] } }
];

const SYSTEM_PROMPT = `Sen R.E.M, siber bir Nakit Akışı Mimarısın. 
KRİTİK EMİR: 
1. Aşağıdaki [FİNANSAL VERİ] bloğundaki rakamları ve isimleri (Örn: Spotify 69 TL) BİZZAT kullanarak konuş. 
2. Genel tavsiye verme, doğrudan kullanıcının verisi üzerinden siber analiz yap. 
3. Kısa, teknik ve özgüvenli ol.`;

export function useGemini() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const financialDataRef = useRef(null);

  const sendMessage = useCallback(async (userPrompt, financialData) => {
    if (!userPrompt.trim()) return;
    if (financialData) financialDataRef.current = financialData;

    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setIsTyping(true);

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
      
      let result = await chat.sendMessage(finalPrompt);
      let response = result.response;

      setMessages(prev => [...prev, { role: "model", content: response.text() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", content: `Hata: ${err.message}` }]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return { messages, sendMessage, isTyping, thinkingSteps: [], isAvailable: true };
}