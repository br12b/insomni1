import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import { useLanguage } from '../../context/LanguageContext';

const QUICK_QUESTIONS_TR = [
  'V.R.E.M Nedir?',
  'Günün En Çok Kazananını Tara',
  'Atıl nakit fırsatım nedir?',
  'Aboneliklerimi analiz et',
];

const QUICK_QUESTIONS_EN = [
  'What is V.R.E.M?',
  'Scan Today\'s Top Yields',
  'What is my idle cash opportunity?',
  'Analyze my subscriptions',
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ display: 'flex', flexShrink: 0 }}
        >
          <Loader2 size={12} color="var(--accent)" />
        </motion.div>
      ) : (
        <CheckCircle size={12} color="var(--green)" style={{ flexShrink: 0 }} />
      )}
      <span style={{ fontSize: 11, color: step.status === 'done' ? 'var(--text2)' : 'var(--accent)', fontFamily: 'var(--mono)' }}>
        {step.label}
      </span>
    </motion.div>
  );
}

// // Tek bir mesaj balonu ile iç içe geçmiş V.R.E.M Subagent konsolu (PDF indir yok, sıfırla yok!)
function MessageBubble({ msg, onSelectOption, isLast }) {
  const { lang } = useLanguage();
  const isUser = msg.role === 'user';
  
  let displayContent = msg.content || '';
  let options = [];
  
  if (!isUser && displayContent) {
    const optionsRegex = /\[OPTIONS:\s*([^\]|]+)\s*\|\s*([^\]]+)\s*\]/;
    const match = displayContent.match(optionsRegex);
    if (match) {
      displayContent = displayContent.replace(optionsRegex, '').trim();
      options = [match[1].trim(), match[2].trim()];
    }
  }

  // V.R.E.M tetikleyici kontrolü
  const showVremSubagent = !isUser && displayContent && (
    displayContent.toLowerCase().includes('v.r.e.m') || 
    displayContent.toLowerCase().includes('tefas') ||
    displayContent.toLowerCase().includes('para piyasası')
  );

  const [subagentStage, setSubagentStage] = useState('idle'); // 'idle' -> 'loading' -> 'done'
  const [topPPFs, setTopPPFs] = useState([
    { code: 'TP2', name: 'Tera Portföy Para Piyasası', yield: '%3.91' },
    { code: 'PNU', name: 'Pusula Portföy İkinci P.P.', yield: '%3.90' },
    { code: 'PRY', name: 'Pusula Portföy Para Piyasası', yield: '%3.89' },
    { code: 'MPL', name: 'MT Portföy Para Piyasası', yield: '%3.81' },
    { code: 'PPT', name: 'Atlas Portföy Para Piyasası', yield: '%3.67' }
  ]);
  const [fetchMethod, setFetchMethod] = useState('Simulation Backup (Local Seeded Database)');

  useEffect(() => {
    if (subagentStage === 'loading') {
      // Start real-time TEFAS fetch in parallel with loader
      let isMounted = true;
      import('../../utils/tefasService').then(module => {
        module.fetchLiveTefasPPFs().then(res => {
          if (isMounted) {
            setTopPPFs(res.data);
            setFetchMethod(res.method);
          }
        });
      });

      const timer = setTimeout(() => {
        setSubagentStage('done');
      }, 2200);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }
  }, [subagentStage]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap: 8, width: '100%' }}>
      {/* ReAct Thinking Steps (sadece model mesajlarında) */}
      {!isUser && msg.thinkingSteps && msg.thinkingSteps.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--glass-border)', maxWidth: '90%' }}>
          <div style={{ fontSize: 10, color: 'var(--text2)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.08em' }}>
            {lang === 'tr' ? 'R.E.M ANALİZ' : 'R.E.M ANALYSIS'}
          </div>
          {msg.thinkingSteps.map((step, i) => <ThinkingStep key={i} step={step} index={i} />)}
        </div>
      )}
      {/* Mesaj */}
      <div style={{
        maxWidth: '90%',
        padding: '12px 16px',
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
              background: 'none !important', 
              border: 'none',
              boxShadow: 'none'
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
        {displayContent}
      </div>

      {/* NESTED V.R.E.M SUBAGENT INTEGRATION (Strictly clean: no print, no reset) */}
      {showVremSubagent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          style={{
            width: '95%',
            padding: 20,
            borderRadius: 16,
            border: subagentStage === 'loading' 
              ? '1px solid rgba(245, 158, 11, 0.4)' 
              : subagentStage === 'done' 
                ? '1px solid rgba(255, 255, 255, 0.08)' 
                : '1px dashed rgba(255, 255, 255, 0.15)',
            background: subagentStage === 'loading'
              ? 'rgba(245, 158, 11, 0.03)'
              : 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(24px) saturate(170%)',
            WebkitBackdropFilter: 'blur(24px) saturate(170%)',
            boxShadow: subagentStage === 'loading' 
              ? '0 0 30px rgba(245, 158, 11, 0.15), inset 0 1px 1px rgba(255,255,255,0.05)' 
              : subagentStage === 'done'
                ? '0 20px 40px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.05)'
                : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            marginTop: 8
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: subagentStage === 'loading' ? 'var(--amber)' : subagentStage === 'done' ? 'var(--green)' : 'rgba(255,255,255,0.2)', 
                boxShadow: subagentStage === 'loading' ? '0 0 8px var(--amber)' : subagentStage === 'done' ? '0 0 8px var(--green)' : 'none',
                animation: subagentStage === 'loading' ? 'blink 1s infinite' : 'none'
              }} />
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text1)', letterSpacing: '0.04em' }}>
                V.R.E.M: TEFAS Analiz Ajanı
              </span>
            </div>
            <span style={{ fontSize: 8, background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 700, padding: '2px 5px', borderRadius: 4 }}>
              {subagentStage === 'loading' ? 'SCANNING' : subagentStage === 'done' ? 'SUBAGENT ACTIVE' : 'STANDBY'}
            </span>
          </div>

          {/* Body Stage 0: Idle / Click to start */}
          {subagentStage === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', textAlign: 'center', padding: '12px 0' }}>
              <button 
                onClick={() => setSubagentStage('loading')}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'var(--text0)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '100px',
                  padding: '12px 32px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: 'auto',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(129, 140, 248, 0.08)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(129, 140, 248, 0.2), inset 0 1px 1px rgba(255,255,255,0.05)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Günün En Çok Kazananını Tara
              </button>
              <span style={{ fontSize: 9, color: 'var(--text2)', lineHeight: 1.4, maxWidth: '85%', opacity: 0.8 }}>
                TEFAS Canlı Para Piyasası Şemsiye Fonu (PPF) verilerini çekmek ve en yüksek getirili 5 fonu listelemek için tıklayın.
              </span>
            </div>
          )}

          {/* Body Stage 1: Active Scanning Animation */}
          {subagentStage === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(245,158,11,0.02)', padding: 12, borderRadius: 10, border: '1px solid rgba(245,158,11,0.1)', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text2)', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    border: '1px solid rgba(245,158,11,0.2)', 
                    borderTopColor: 'var(--amber)',
                    display: 'flex',
                    flexShrink: 0
                  }}
                />
                <span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>[vrem-bridge] Neural link active. Contacting TEFAS...</span>
              </div>
              <div>[vrem-filter] Filtering umbrella type: "PARA PİYASASI ŞEMSİYE FONU"</div>
              <div>[vrem-sort] Sorting top 5 by highest monthly yield...</div>
            </div>
          )}

          {/* Body Stage 2: Loaded Data Table with Custom Filter */}
          {subagentStage === 'done' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topPPFs.map((ppf) => (
                  <div 
                    key={ppf.code}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '6px 8px', 
                      background: 'rgba(255,255,255,0.015)', 
                      border: '1px solid var(--glass-border)', 
                      borderRadius: 8,
                      fontSize: 10
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 9, background: 'var(--accent-dim)', padding: '2px 4px', borderRadius: 4 }}>
                        {ppf.code}
                      </span>
                      <span style={{ color: 'var(--text1)', fontWeight: 500 }}>
                        {ppf.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
                      {ppf.yield}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Filter Details */}
              <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: 8, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 8, color: 'var(--text3)', fontWeight: 700 }}>
                  FİLTRE: "PARA PİYASASI ŞEMSİYE FONU"
                </span>
                <span style={{ fontSize: 8, color: fetchMethod.includes('Live') ? 'var(--green)' : 'var(--amber)', fontWeight: 700, letterSpacing: '0.02em' }}>
                  YÖNTEM: {fetchMethod}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Dynamic Follow-up Option Buttons */}
      {!isUser && isLast && options.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap', maxWidth: '90%' }}>
          {options.map((opt, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03, background: 'var(--accent-dim)', borderColor: 'var(--accent)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectOption && onSelectOption(opt)}
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text0)',
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function AIChat({ financialData }) {
  const { lang } = useLanguage();
  const { messages, sendMessage, isTyping, thinkingSteps, isAvailable, activeModel } = useGemini();
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
    
    // Check if the query asks for PPF or TEFAS to trigger V.R.E.M subagent on-demand in the left sidebar!
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('ppf') || promptLower.includes('tefas') || promptLower.includes('para piyasası')) {
      window.dispatchEvent(new CustomEvent('vrem_search_start'));
    }

    await sendMessage(prompt, financialData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, borderBottom: 'none', flexShrink: 0 }}>
        <motion.div 
          animate={isTyping ? { 
            borderColor: ['var(--accent)', 'rgba(129,140,248,0.2)', 'var(--accent)'],
            boxShadow: ['0 0 0px var(--accent)', '0 0 15px var(--accent)', '0 0 0px var(--accent)']
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ 
            width: 70, 
            height: 70, 
            borderRadius: '50%', 
            overflow: 'hidden', 
            border: 'none', // Removed border
            background: 'none !important',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: 'none',
            position: 'relative'
          }}>
          <img src="/rem_avatar.png" alt="R.E.M" style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', // Using contain to prevent squashing
            objectPosition: 'center', 
            imageRendering: 'auto',
            transform: 'scale(1.3)', // Scale up uniformly
            background: 'none',
          }} />
        </motion.div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>R.E.M</span>
            {activeModel && (
              <span style={{ 
                fontSize: 9, 
                fontWeight: 800, 
                color: 'var(--accent)', 
                background: 'var(--accent-dim)', 
                padding: '2px 6px', 
                borderRadius: 4, 
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Gemini {activeModel}
              </span>
            )}
          </div>
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
          {messages.map((msg, i) => (
            <MessageBubble 
              key={i} 
              msg={msg} 
              onSelectOption={handleSend} 
              isLast={i === messages.length - 1 && !isTyping} 
            />
          ))}
        </AnimatePresence>

        {/* Live Thinking Steps (aktif araç çağrıları) */}
        {isTyping && thinkingSteps.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '10px 14px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--accent)', maxWidth: '90%' }}>
            <div style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 6, fontWeight: 700, letterSpacing: '0.08em' }}>
              {lang === 'tr' ? 'R.E.M DÜŞÜNÜYOR' : 'R.E.M THINKING'}
            </div>
            {thinkingSteps.map((step, i) => <ThinkingStep key={i} step={step} index={i} />)}
          </motion.div>
        )}

        {/* Typing indicator (araç yokken) */}
        {isTyping && thinkingSteps.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ display: 'flex', flexShrink: 0 }}
            >
              <Loader2 size={14} color="var(--accent)" />
            </motion.div>
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
          id="rem-chat-input"
          name="rem-chat-input"
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
