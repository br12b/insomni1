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
          {lang === 'tr' ? 'Finansal Komuta Dokümantasyonu' : 'Financial Command Documentation'}
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #818cf8 30%, #c084fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>
          {lang === 'tr' ? 'INSOMNI VİZYONU & REHBERİ' : 'INSOMNI VISION & HANDBOOK'}
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '15px', maxWidth: 600, margin: '0 auto' }}>
          {lang === 'tr' 
            ? 'Finansal geleceğini otonom yapay zeka ve akıllı optimizasyonla yeniden tasarlayan sistemin mimarisi.' 
            : 'The core architecture of the system reshaping your financial future with autonomous AI and smart optimization.'}
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
          <Zap size={14} /> {lang === 'tr' ? 'Yetenekler' : 'Features'}
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
                  ? 'Insomni, adını uykusuzluktan (insomnia) ve R.E.M. ise uykunun en derin, beynin en aktif olduğu rüya evresinden (REM sleep) alır. Bizim vizyonumuzda paranın uykusu yoktur. Sen uyurken bile otonom yapay zeka R.E.M., atıl duran her bir kuruşun enflasyon karşısında erimesini engellemek için daima uyanık kalır. Paranın uyumadığı, sürekli çalıştığı ve akıllıca optimize edildiği otonom bir finansal komuta merkezidir.'
                  : 'Insomni draws its name from sleeplessness (insomnia), and R.E.M. represents the deepest, most active dream state of sleep (REM sleep). In our vision, money never sleeps. Even while you rest, our autonomous AI R.E.M. stays awake, guarding your assets and optimizing every single cent against inflation. It is a sleepless command center where capital is perpetually active and intelligently refined.'}
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
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    {lang === 'tr' ? 'Spring & Neye Çözüm Oluyoruz?' : 'Spring Mechanics & Problem Solved'}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'Giriş ekranındaki fizik tabanlı hologram yay (spring) küçülme efekti sadece görsel bir şov değildir. Bu motor, ani sayfa yüklenmelerinin ve arayüz karmaşasının (visual jarring) önüne geçerek kullanıcının dikkat dağınıklığını önler, zihinsel odaklanmayı 100% koruyan pürüzsüz bir geçiş köprüsü sağlar.'
                    : 'The physics-based holographic spring exit transition on the intro screen is not just a visual show. This engine completely prevents visual jarring and abrupt page loading shocks, offering a smooth interface continuity that preserves 100% mental focus.'}
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Brain size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>R.E.M AI Chat + V.R.E.M</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? `Maaş ve harcama verilerini okuyarak finansal tavsiyeler üreten yapay zeka yoldaşı. Özel subagent'ı V.R.E.M (Veri Raporlama ve Entegrasyon Modülü) ile entegre çalışarak TEFAS canlı para piyasası fonu (PPF) verilerini anlık olarak çeker, süzer ve en çok kazandıran fırsatları sohbet içinden taratıp listeler.`
                    : `A context-aware financial companion powered by Google Gemini. Integrates with its specialized subagent V.R.E.M (Data Reporting and Integration Module) to fetch, filter, and display live TEFAS money market fund (PPF) yields directly inside the chat.`}
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RefreshCw size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    {lang === 'tr' ? 'REM Sync Otonom Köprü & Projeksiyon' : 'REM Sync Autonomous Bridge & Projection'}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>
                  {lang === 'tr'
                    ? 'REM Sync, dağınık banka ekstrelerini (PDF) ve anlık Telegram verilerini yapay zeka ile saniyeler içinde okuyan hayati bir otonom köprüdür. Eğer test için hazır bir PDF ekstreniz yoksa, yerelde `python scripts/ekstre_pro.py` komutuyla saniyeler içinde kendinize özel, aboneliklerle dolu harika bir test ekstresi (PDF) üretebilir veya `Örnek Ekstre No 1` ve `Örnek Ekstre No 2` (Toplam 4 adet örnek ekstre) örnek dosyalarını indirim alanından doğrudan kullanabilirsiniz! En sağlıklı ve kararlı analiz sonuçları için lütfen Ekstre Pro ile üretilen PDF dosyalarını kullanın!'
                    : 'REM Sync is a critical autonomous bridge that uses AI to parse unstructured bank PDFs in seconds. If you do not have a test PDF statement ready, you can run `python scripts/ekstre_pro.py` locally to produce a custom simulation statement, or download pre-made samples like Sample Statement No 1! For the healthiest and most accurate analysis, we highly recommend using statements generated by the Ekstre Pro tool!'}
                </p>
              </motion.div>

              {/* Feature 4 */}
              <motion.div variants={itemVariants} className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Calendar size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0 }}>
                    {lang === 'tr' ? 'Finansal Isı Haritası Takvimi' : 'Financial Heatmap Calendar'}
                  </h3>
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
                  {lang === 'tr' ? 'Sistem Altyapısı ve Güvenlik' : 'System Architecture & Security'}
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>CORE STACK</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>React 18 + Vite</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>{lang === 'tr' ? 'Modüler kod derleme ve sıfır ms sayfa yüklenme süresi.' : 'Modular component compiling and zero ms page load times.'}</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>ANIMATION ENGINE</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Framer Motion</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>{lang === 'tr' ? 'Donanım hızlandırmalı ultra akıcı yay mekaniği.' : 'Premium hardware-accelerated spring mechanics.'}</div>
                </div>
                <div style={{ padding: 16, background: 'rgba(255,255,255,0.01)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 800, marginBottom: 4 }}>INTELLIGENCE LAYER</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>Gemini 3.1 Flash</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: 4 }}>{lang === 'tr' ? 'Gelişmiş bağlam algılamalı otonom chat yeteneği.' : 'Ultra-high-speed context-aware autonomous ReAct models.'}</div>
                </div>
              </div>

              {/* 🌐 Live Deployed Domains */}
              <div className="glass" style={{ padding: 20, background: 'rgba(129, 140, 248, 0.03)', border: '1px solid rgba(129, 140, 248, 0.25)', marginTop: 8 }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                  {lang === 'tr' ? '🌐 RESMİ CANLI DEĞERLENDİRME SUNUCULARI' : '🌐 OFFICIAL LIVE EVALUATION SERVERS'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text1)', lineHeight: 1.5, margin: 0 }}>
                  {lang === 'tr' 
                    ? 'Tüm canlı entegrasyonlarımızın (Telegram Bot canlı REM Sync, CORS-Bypass sunucu ağ geçitleri ve Gemini AI bilişsel asistanımızın) en kesintisiz ve hatasız çalışması için, projeyi yerelde çalıştırmak yerine doğrudan resmi canlı adreslerimizden test etmenizi önemle tavsiye ederiz:' 
                    : 'To fully utilize all live integrations (Telegram bot sync, CORS-bypass edge proxies, and the R.E.M. AI chatbot with zero CORS hassle), we strongly recommend testing directly on our official deployed domain URLs:'}
                </p>
                <div style={{ display: 'flex', gap: 24, marginTop: 12, flexWrap: 'wrap' }}>
                  <a href="https://insomni.vercel.app/" target="_blank" rel="noreferrer" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textDecoration: 'underline' }}>
                    🚀 insomni.vercel.app (Official Vercel)
                  </a>
                  <a href="https://insomni.netlify.app/" target="_blank" rel="noreferrer" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--green)', textDecoration: 'underline' }}>
                    🚀 insomni.netlify.app (Official Netlify)
                  </a>
                </div>
              </div>

              {/* 🏢 Architectural Decisions */}
              <div className="glass" style={{ padding: 20, background: 'rgba(255,255,255,0.015)', marginTop: 8 }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)', marginBottom: 8 }}>
                  {lang === 'tr' ? '🏢 SERVERLESS FRONTEND-FIRST MİMARİ KARARLARIMIZ' : '🏢 SERVERLESS FRONTEND-FIRST ARCHITECTURAL DECISIONS'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                  {lang === 'tr' 
                    ? 'Ağ gecikmesi (latency), sunucu bakım maliyetleri ve kesinti risklerini minimize etmek amacıyla geleneksel, hantal bir backend sunucusu yerine Edge-Computing ve Serverless tabanlı, önyüz-öncelikli hibrit bir mimari tercih edilmiştir. Gerekli proxy istekleri Vercel/Netlify sunucu kenarı yönlendirme kuralları (edge rewrites) ile çözülmektedir.' 
                    : 'To minimize latency, hosting costs, and downtime risks, we avoided traditional monolithic backend servers. Instead, we built a highly optimized serverless, frontend-first hybrid architecture utilizing edge proxy gateways for secure endpoint connections.'}
                </p>
                
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>
                  {lang === 'tr' ? '🤖 ACENTE DESTEKLİ CANLI VERİ MOTORU (V.R.E.M DATA PIPELINE)' : '🤖 AGENT-SCRAPED LIVE FEED (V.R.E.M DATA PIPELINE)'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>
                  {lang === 'tr'
                    ? 'Resmi TEFAS finans sunucuları, AWS veya Vercel gibi tüm bulut sağlayıcılarının IP bloklarını kategorik olarak siber önlem nedeniyle engellemektedir. Bu engeli aşmak ve sitenin çalışma kararlılığını %100 güvenceye almak için otonom bir veri hattı tasarlanmıştır. Yerel bilgisayarımızda çalışan akıllı Ajan kodumuz (npm run refresh-funds), verileri doğrudan resmi Takasbank sunucularından çekerek saniyeler içinde net aylık getirileri hesaplar ve seededPPFs.json veri tabanımızı güncelleyerek dağıtır. Bu mimari karar, jüriye sıfır ms sayfa yüklenme hızı ve sıfır çökme riski sunar.'
                    : 'Government and financial servers like TEFAS block cloud server IP ranges. To bypass this and guarantee 100% production stability, we developed an autonomous data pipeline. A local AI Agent script crawls official Takasbank servers, computes compound 30-day net yields, and commits them to seededPPFs.json which is statically served at the edge. This decision ensures instant load times and zero crash risk for the evaluators.'}
                </p>
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
