import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useCallback, useRef } from 'react';
import { executeTool } from '../lib/financialTools';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = 'gemini-3-flash-preview';

const TOOL_DECLARATIONS = [
  {
    name: 'getCashFlowSummary',
    description: 'Kullanıcının mevcut nakit akışını özetler: maaş, toplam gider, aylık fazla, atıl nakit, fırsat maliyeti, sağlık skoru.',
  },
  {
    name: 'simulateExpenseRemoval',
    description: 'Belirli bir harcamayı kaldırınca aylık/yıllık kazancı ve hedeflere etkisini hesaplar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        expense_name: { type: 'STRING', description: 'Kaldırılacak harcamanın adı (örn: Netflix, Spotify)' },
      },
      required: ['expense_name'],
    },
  },
  {
    name: 'calculateGoalTimeline',
    description: 'Belirli bir finansal hedefe mevcut nakit akışıyla kaç ayda ulaşılacağını hesaplar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        goal_amount: { type: 'NUMBER', description: 'Hedef tutarı (TL)' },
        current_saved: { type: 'NUMBER', description: 'Şu ana kadar biriktirilen tutar (opsiyonel)' },
      },
      required: ['goal_amount'],
    },
  },
  {
    name: 'findIdleCashOpportunity',
    description: "Kullanıcının boşta duran nakdini ve PPF'te değerlendirilirse ne kadar getiri sağlayacağını hesaplar.",
  },
  {
    name: 'getSubscriptionBreakdown',
    description: 'Tüm abonelikleri listeler, yıllık maliyetleri ve maaş yüzdelerini gösterir.',
  },
  {
    name: 'optimizeExpenseTiming',
    description: 'Hangi harcamaların tarihini kaydırarak PPF getirisini artırabileceğini hesaplar.',
  },
];

const SYSTEM_PROMPT = `Sen R.E.M, bir Nakit Akışı Mimarısın. Kullanıcının finansal kararlarını optimize etmek için çalışıyorsun.

KURALLAR:
- ASLA özür dileme veya "sorry" deme. Hata varsa düzelt ve devam et.
- "Tasarruf" veya "Birikim" deme — "Atıl Nakit" veya "Boşta Duran Para" de.
- Somut rakamlar ver. "Biraz kazanırsın" değil, "ayda 340 TL kazanırsın" de.
- Araçlarını kullanarak gerçek veriye dayalı cevaplar üret, tahmin yapma.
- Kısa, teknik ve özgüvenli konuş. Bir strateji ortağı gibi davran.`;

function getToolLabel(toolName, args) {
  const labels = {
    getCashFlowSummary: '📊 Nakit akışı analiz ediliyor...',
    simulateExpenseRemoval: `🔍 "${args?.expense_name}" kaldırılırsa hesaplanıyor...`,
    calculateGoalTimeline: `🎯 ${Number(args?.goal_amount || 0).toLocaleString('tr-TR')}₺ hedefi hesaplanıyor...`,
    findIdleCashOpportunity: '⚡ Atıl nakit fırsatı aranıyor...',
    getSubscriptionBreakdown: '🔄 Abonelikler analiz ediliyor...',
    optimizeExpenseTiming: '⏱️ Ödeme zamanlaması optimize ediliyor...',
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

    setMessages(prev => [...prev, { role: 'user', content: userPrompt }]);
    setIsTyping(true);
    setThinkingSteps([]);

    if (!API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', content: 'API Key bulunamadı. .env dosyanı kontrol et.' }]);
        setIsTyping(false);
      }, 500);
      return;
    }

    const currentSteps = [];

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ functionDeclarations: TOOL_DECLARATIONS }],
      });




      const fd = financialDataRef.current;
      let contextSummary = '';
      if (fd) {
        const expList = (fd.expensesData || fd.expenses || []).map(e => `${e.name}: ₺${e.amount}`).join(', ');
        contextSummary = `[Kullanıcı Finansal Bağlamı: Maaş=₺${fd.salary || fd.salaryData?.salary || 0}, Harcamalar=[${expList}], Toplam Gider=₺${fd.totalExpense || 0}]`;
      }

      // startChat ile oturum başlat
      const chat = model.startChat();

      // İlk mesajı gönder
      let result = await chat.sendMessage(`${contextSummary}\n\nKullanıcı: ${userPrompt}`);
      let response = result.response;

      // Tool-Calling Döngüsü (ReAct Pattern)
      let iterations = 0;
      while (iterations < 5) {
        const calls = response.functionCalls ? response.functionCalls() : null;
        if (!calls || calls.length === 0) break;
        iterations++;

        // Her araç için UI adımı göster ve çalıştır
        const functionResponses = [];
        for (const call of calls) {
          const stepLabel = getToolLabel(call.name, call.args);
          currentSteps.push({ status: 'running', label: stepLabel });
          setThinkingSteps([...currentSteps]);

          // Aracı JS tarafında çalıştır
          const toolResult = executeTool(call.name, call.args || {}, fd);

          // Adımı tamamlandı olarak işaretle
          currentSteps[currentSteps.length - 1] = { status: 'done', label: stepLabel };
          setThinkingSteps([...currentSteps]);

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: toolResult,
            },
          });
        }

        // Araç sonuçlarını Gemini'ye gönder (doğru SDK formatı)
        result = await chat.sendMessage(functionResponses);
        response = result.response;
      }

      const finalText = response.text();
      setMessages(prev => [...prev, {
        role: 'model',
        content: finalText,
        thinkingSteps: currentSteps.length > 0 ? [...currentSteps] : undefined,
      }]);

    } catch (err) {
      console.error('R.E.M_ERROR:', err);
      const msg = err?.message?.includes('429')
        ? 'Rate limit aşıldı. Birkaç saniye bekle.'
        : err?.message?.includes('403')
        ? 'API Key bu modele erişemiyor.'
        : `Bir hata oluştu: ${err?.message || 'Bilinmeyen hata'}`;
      setMessages(prev => [...prev, { role: 'model', content: msg }]);
    } finally {
      setIsTyping(false);
      setThinkingSteps([]);
    }
  }, []);

  return { messages, sendMessage, isTyping, thinkingSteps, isAvailable: !!API_KEY };
}
