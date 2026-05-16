import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useCallback, useRef } from "react";
import { executeTool } from "../lib/financialTools";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-3.1-flash-lite";

const TOOL_DECLARATIONS = [
  { name: "getCashFlowSummary", description: "Kullanicinin nakit akisini ozetler." },
  { name: "simulateExpenseRemoval", description: "Harcama kaldirinca kazanci hesaplar.", parameters: { type: "OBJECT", properties: { expense_name: { type: "STRING" } }, required: ["expense_name"] } },
  { name: "calculateGoalTimeline", description: "Hedefe kac ayda ulasilacagini hesaplar.", parameters: { type: "OBJECT", properties: { goal_amount: { type: "NUMBER" } }, required: ["goal_amount"] } }
];

const SYSTEM_PROMPT = `Sen R.E.M, bir Nakit Akışı Mimarısın. ASLA özür dileme. Kısa, teknik ve özgüvenli konuş. Turkce karakterleri kusursuz kullan. Maas 0 olsa bile abonelikler uzerinden analiz yap.`;

function getToolLabel(toolName, args) {
  const labels = {
    getCashFlowSummary: '📊 Nakit akışı analiz ediliyor...',
    simulateExpenseRemoval: `🔍 "${args?.expense_name}" simüle ediliyor...`,
    calculateGoalTimeline: `🎯 Hedef hesabı yapılıyor...`,
  };
  return labels[toolName] || `🔧 ${toolName} çalıştırılıyor...`;
}

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
    setThinkingSteps([]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME, 
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }] 
      });

      const fd = financialDataRef.current;
      let context = "Veri yok.";
      if (fd && ( (fd.salary && fd.salary.income >= 0) || (fd.expenses && fd.expenses.length > 0) )) {
        const exps = (fd.expenses || []).map(e => `${e.name}: ${e.amount}`).join(", ");
        context = `[FINANSAL DURUM: Maas=${fd.salary?.income || 0}, Gider=${fd.totalExpense || 0}, Harcamalar=[${exps}]]`;
      }

      const chat = model.startChat();
      let result = await chat.sendMessage(`${context}\n\nKullanıcı: ${userPrompt}`);
      let response = result.response;

      let currentSteps = [];
      let iterations = 0;
      while (iterations < 5) {
        const calls = response.functionCalls ? response.functionCalls() : null;
        if (!calls || calls.length === 0) break;
        iterations++;

        const functionResponses = [];
        for (const call of calls) {
          const stepLabel = getToolLabel(call.name, call.args);
          currentSteps.push({ status: "running", label: stepLabel });
          setThinkingSteps([...currentSteps]);
          const toolResult = executeTool(call.name, call.args || {}, fd);
          currentSteps[currentSteps.length - 1] = { status: "done", label: stepLabel };
          setThinkingSteps([...currentSteps]);
          functionResponses.push({ functionResponse: { name: call.name, response: toolResult } });
        }
        result = await chat.sendMessage(functionResponses);
        response = result.response;
      }

      setMessages(prev => [...prev, { 
        role: "model", 
        content: response.text(),
        thinkingSteps: currentSteps.length > 0 ? [...currentSteps] : undefined 
      }]);
    } catch (err) {
      console.error("R.E.M_ERROR:", err);
      setMessages(prev => [...prev, { role: "model", content: `Siber bir hata oluştu: ${err.message}` }]);
    } finally {
      setIsTyping(false);
      setThinkingSteps([]);
    }
  }, []);

  return { messages, sendMessage, isTyping, thinkingSteps, isAvailable: true };
}
