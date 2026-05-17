import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Brain, Zap, RefreshCw, Calendar, Eye, HelpCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Docs() {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('vision');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '30px 40px', maxWidth: 1200, margin: '0 auto', width: '100%', gap: 32, overflowY: 'auto' }}>
      
      {/* Immersive Cyber Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative' }}>
        <span className="badge badge-accent" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          {lang === 'tr' ? 'Siber Komuta Dokümantasyonu' : 'Cyber Command Documentation'}
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #fff 30%, var(--text2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
          {lang === 'tr' ? 'INSOMNI VİZYONU & REHBERİ' : 'INSOMNI VISION & HANDBOOK'}
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '15px', maxWidth: 600, margin: '0 auto' }}>
          {lang === 'tr' 
            ? 'Finansal geleceğini otonom yapay zeka ve siber optimizasyonla yeniden tasarlayan sistemin mimarisi.' 
            : 'The core architecture of the system reshaping your financial future with autonomous AI and cyber optimization.'}
        </p>
      </motion.div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button 
          onClick={() => setActiveTab('vision')} 
          className={`btn btn-sm ${activeTab === 'vision' ? 'btn-accent' : 'btn-ghost'}`}
          style={{ gap: 8, padding: '10px 20px', borderRadius: 100 }}
        >
          <Flame size={14} /> {lang === 'tr' ? 'Felsefe & Vizyon' : 'Philosophy & Vision'}
        </button>
        <button 
          onClick={() => setActiveTab('features')} 
          className={`btn btn-sm ${activeTab === 'features' ? 'btn-accent' : 'btn-ghost'}`}
          style={{ gap: 8, padding: '10px 20px', borderRadius: 100 }}
        >
          <Zap size={14} /> {lang === 'tr' ? 'Siber Yetenekler' : 'Cyber Features'}
        </button>
        <button 
          onClick={() => setActiveTab('tech')} 
          className={`btn btn-sm ${activeTab === 'tech' ? 'btn-accent' : 'btn-ghost'}`}
          style={{ gap: 8, padding: '10px 20px', borderRadius: 100 }}
        >
          <ShieldCheck size={14} /> {lang === 'tr' ? 'Mimari & Teknoloji' : 'Architecture & Tech'}
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -10 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          {/* TAB 1: VISION */}
          {activeTab === 'vision' && (
            <motion.div variants={itemVariants} className="glass" style={{ padding: 40, border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.15, pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={20} color="var(--red)" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  {lang === 'tr' ? `"Don't miss the opportunities in your life"` : `"Don't miss the opportunities in your life"`}
                </h2>
              </div>

              <p style={{ color: 'var(--text1)', fontSize: '15px', lineHeight: '1.7', margin: 0 }}>
                {lang === 'tr'
                  ? 'Insomni, sıradan bir bütçe takip arayüzü değildir. O, atıl duran her bir kuruşun enflasyon canavarı karşısında erimesini engelleyen, finansal özgürlüğe siber bir hassasiyetle rehberlik eden otonom bir komuta merkezidir. Vizyonumuz, genç ve vizyoner kurucuların, üreticilerin ve geliştiricilerin paranın zaman içindeki değerini kontrol altına almalarını sağlamaktır.'
                  : 'Insomni is not a generic budget tracker. It is an autonomous financial command center engineered with cyber precision to prevent your hard-earned assets from dissolving under the forces of inflation. Our vision is to empower young builders, founders, and developers to master their cash flow and seize opportunities without friction.'}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 12 }}>
                <div className="glass" style={{ padding: 20, background: 'rgba(255,255,255,0.015)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                    {lang === 'tr' ? '1. Atıl Nakit Düşmandır' : '1. Idle Cash is the Enemy'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                    {lang === 'tr'
                      ? 'Faizsiz veya hareketsiz hesaplarda bekleyen paralar her saniye değer kaybeder. Insomni bunu anlık olarak hesaplar.'
                      : 'Money sitting in non-yield accounts loses power every second. Insomni tracks and quantifies this down to the millisecond.'}
                  </p>
                </div>
                <div className="glass" style={{ padding: 20, background: 'rgba(255,255,255,0.015)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                    {lang === 'tr' ? '2. Akıllı Zamanlama' : '2. Dynamic Timing'}
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                    {lang === 'tr'
                      ? 'Maaş alım gününüz ile abonelik ve büyük ödemelerinizin tarihleri arasındaki boşluğu optimize ederek likiditeyi zirvede tutarız.'
                      : 'By optimizing the timeline mismatch between salary dates and large bills, we maintain your liquidity at peak levels.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              
              {/* Feature 1 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Eye size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Holografik Arayüz (Intro)</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'Fizik tabanlı yay (spring) sönümleme motoruyla güçlendirilmiş, logoya doğru zarifçe kapanan sinematik siber hologram açılışı.'
                    : 'A cinematic cyber holographic intro with physics-modeled spring exit transitions that elegantly collapses into the header logo.'}
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Brain size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>R.E.M AI Chat</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'Maaş ve harcama verilerini canlı okuyan, otonom Google Gemini motoruyla sana dostça ve bilge finansal tavsiyeler üreten siber yoldaş.'
                    : 'A context-aware financial companion powered by Google Gemini that analyzes your active budget and guides you with wise advice.'}
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RefreshCw size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>REM Sync Otonom Köprü</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'Banka ekstrelerini (PDF) yapay zeka ile okuyan veya Telegram bot köprüsüyle harcamalarını komuta merkezine anlık işleyen siber veri hattı.'
                    : 'A high-performance bridge that parses bank statement PDFs or syncs offline chat messages into your live budget instantly.'}
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>Finansal Isı Haritası Takvimi</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'Harcamaların günlere göre dağılımını, bütçe sağlığını kırmızı ve yeşil ısı yoğunluğuyla görselleştiren dinamik takvim modülü.'
                    : 'An interactive daily calendar visualizer that colors budget health via red/green glowing micro-heatmaps dynamically.'}
                </p>
              </motion.div>

            </div>
          )}

          {/* TAB 3: TECH */}
          {activeTab === 'tech' && (
            <motion.div variants={itemVariants} className="glass" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(52,211,153,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="var(--green)" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>
                  {lang === 'tr' ? 'Siber Altyapı ve Güvenlik' : 'Cyber Architecture & Security'}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>CORE STACK</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>React 18 + Vite</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>Lightning fast modular component compiling.</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>ANIMATION ENGINE</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Framer Motion</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>Premium hardware-accelerated spring mechanics.</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>INTELLIGENCE LAYER</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Gemini 1.5 API</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>Context-aware autonomous ReAct agent models.</div>
                </div>
              </div>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Decorative Bottom Graphic */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: 'center', paddingTop: 20, borderTop: '1px solid var(--glass-border)', color: 'var(--text2)', fontSize: '11px', fontFamily: 'var(--mono)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>SECURE COMPILING STATUS: ACTIVE [200ms]</span>
        <span>INSOMNI SYSTEM CORE v2.4</span>
      </motion.div>

    </div>
  );
}
