import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import { useLanguage } from '../../context/LanguageContext';

const QUICK_QUESTIONS_TR = [
  'Atıl nakit fırsatım nedir?',
  'Aboneliklerimi analiz et',
  'Harcama zamanlamam optimal mi?',
  'En büyük maliyet nerede?',
];

const QUICK_QUESTIONS_EN = [
  'What is my idle cash opportunity?',
  'Analyze my subscriptions',
  'Is my expense timing optimal?',
  'Where is my biggest cost?',
];

// Thinking step — tek bir ReAct adımı
function ThinkingStep({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
      {step.status === 'running' ? (
        <Loader2 size={12} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
      ) : (
        <CheckCircle size={12} color="var(--green)" style={{ flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 11, color: step.status === 'done' ? 'var(--text2)' : 'var(--accent)', fontFamily: 'var(--mono)' }}>
        {step.label}
      </span>
    </motion.div>
  );
}

// Tek bir mesaj balonu
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 6 }}>
      {/* ReAct Thinking Steps (sadece model mesajlarında) */}
      {!isUser && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--glass-border)', maxWidth: '90%' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
            R.E.M ANALIZ
          </div>
          {msg.thinkingSteps.map((step, i) => <ThinkingStep key={i} step={step} index={i} />)}
        </div>
      )}
      {/* Mesaj */}
      <div style={{
        maxWidth: '90%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--accent)' : 'var(--bg2)',
        color: isUser ? '#fff' : 'var(--text0)',
        fontSize: 13,
        lineHeight: 1.55,
        border: isUser ? 'none' : '1px solid var(--glass-border)',
        whiteSpace: 'pre-wrap',
      }}>
        {!isUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <div style={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              overflow: 'hidden', 
              flexShrink: 0, 
              background: '#fff', 
              border: '1px solid var(--glass-border)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <img src="/rem_avatar.png" alt="R.E.M" style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                objectPosition: 'center 20%',
                imageRendering: 'auto',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}>R.E.M</span>
          </div>
        )}
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AIChat({ financialData }) {
  const { lang } = useLanguage();
  const { messages, sendMessage, isTyping, thinkingSteps, isAvailable } = useGemini();
  const [input, setInput] = useState('');
  const messagesRef = useRef(null);
  const QUICK = lang === 'tr' ? QUICK_QUESTIONS_TR : QUICK_QUESTIONS_EN;

  useEffect(() => {
    if (messagesRef.current) { messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }
  }, [messages, isTyping, thinkingSteps]);

  const handleSend = async (text) => {
    const prompt = (text || input).trim();
    if (!prompt) return;
    setInput('');
    await sendMessage(prompt, financialData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: '1px solid var(--glass-border)', flexShrink: 0 }}>
        <motion.div 
          animate={isTyping ? { 
            borderColor: ['var(--accent)', 'rgba(129,140,248,0.2)', 'var(--accent)'],
            boxShadow: ['0 0 0px var(--accent)', '0 0 15px var(--accent)', '0 0 0px var(--accent)']
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ 
            width: 70, // Slightly bigger
            height: 70, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: '3px solid var(--accent)', // Cleaner border
            background: 'var(--bg0)', // Match background better
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 25px rgba(129,140,248,0.5)',
            position: 'relative'
          }}>
          <img src="/rem_avatar.png" alt="R.E.M" style={{ 
            width: '120%', // Scale up to fill the border completely
            height: '120%', 
            objectFit: 'cover', 
            objectPosition: 'center center', 
            imageRendering: 'auto',
            transform: 'scale(1.15)', // Zoom in to remove any white edges
          }} />
        </motion.div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>R.E.M</div>
          <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'blink 2s ease infinite' }} />
            {isAvailable ? (lang === 'tr' ? 'Araçlarla Aktif' : 'Active with Tools') : (lang === 'tr' ? 'Çevrimdışı' : 'Offline')}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
            {lang === 'tr'
              ? '👋 Merhaba! Finansal verilerini analiz etmek, harcamalarını simüle etmek veya hedef planlamak için sorularını sor.'
              : '👋 Hi! Ask me anything to analyze your finances, simulate expenses, or plan your goals.'}
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
        </AnimatePresence>

        {/* Live Thinking Steps (aktif araç çağrıları) */}
        {isTyping && thinkingSteps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--accent)', maxWidth: '90%' }}>
            <div style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.08em' }}>
              R.E.M DÜŞÜNÜYOR
            </div>
            {thinkingSteps.map((step, i) => <ThinkingStep key={i} step={step} index={i} />)}
          </motion.div>
        )}

        {/* Typing indicator (araç yokken) */}
        {isTyping && thinkingSteps.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Loader2 size={14} color="var(--accent)" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 11, color: 'var(--text2)' }}>R.E.M...</span>
          </div>
        )}

      </div>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {QUICK.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} className="chip" style={{ fontSize: 11 }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <input
          className="input"
          style={{ flex: 1, fontSize: 13, padding: '10px 14px' }}
          placeholder={lang === 'tr' ? 'İstediğini sor...' : 'Ask anything...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={isTyping}
        />
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleSend()}
          disabled={!input.trim() || isTyping}
          className="btn btn-primary"
          style={{ padding: '0 16px', flexShrink: 0 }}>
          <Send size={15} />
        </motion.button>
      </div>
    </div>
  );
}
