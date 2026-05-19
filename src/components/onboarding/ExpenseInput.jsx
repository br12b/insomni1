import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ArrowRight, Upload, RefreshCw, Loader2, Calendar, Gamepad2, Utensils, Trophy, Car, ChevronDown, ChevronUp, Lightbulb, Sparkles, Download, Bot } from 'lucide-react';
import { parseBankStatement } from '../../lib/pdfParser';
import { useLanguage } from '../../context/LanguageContext';

const uid = () => Math.random().toString(36).slice(2,9);

export default function ExpenseInput({ onComplete }) {
  const { lang, t } = useLanguage();
  const [expenses, setExpenses] = useState([]);
  const PRESETS = lang === "tr" ? [
    { name: "Kira", amount: "", date: "5", type: "expense" },
    { name: "Elektrik", amount: "", date: "10", type: "expense" },
    { name: "Doğalgaz", amount: "", date: "12", type: "expense" },
    { name: "Netflix", amount: "189", date: "3", type: "subscription", isSubscription: true },
    { name: "Spotify", amount: "69", date: "3", type: "subscription", isSubscription: true },
  ] : [
    { name: "Rent", amount: "", date: "5", type: "expense" },
    { name: "Electricity", amount: "", date: "10", type: "expense" },
    { name: "Gas", amount: "", date: "12", type: "expense" },
    { name: "Netflix", amount: "14.99", date: "3", type: "subscription", isSubscription: true },
    { name: "Spotify", amount: "9.99", date: "3", type: "subscription", isSubscription: true },
  ];
  const [scanning, setScanning] = useState(false);
  const [scanMsg, setScanMsg] = useState('');
  const [scanPct, setScanPct] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const [dynamicCards, setDynamicCards] = useState(() => {
    const saved = localStorage.getItem("insomni_onboarding_cards");
    if (saved) return JSON.parse(saved);
    return lang === "tr" ? [
      { emoji: '📅', title: 'Ödeme Günü Neden Önemli?', desc: 'Maaş günün ile harcama günlerin arasındaki farkı optimize et.' },
      { emoji: '🔄', title: 'Abonelikler Küçük Ama Etkili', desc: 'Aylık abonelikler yıllık bazda ciddi rakamlara ulaşır.' },
      { emoji: '⚡', title: 'Atıl Nakit Tuzağı', desc: 'Paranı faizsiz hesapta tutmak yerine değerlendir.' }
    ] : [
      { emoji: '📅', title: 'Payment Dates', desc: 'Optimize the gap between salary and expenses.' },
      { emoji: '🔄', title: 'Subscriptions', desc: 'Small monthly costs add up annually.' },
      { emoji: '⚡', title: 'Idle Cash', desc: 'Dont let your money sit in zero-yield accounts.' }
    ];
  });

  const [showAria, setShowAria] = useState(() => localStorage.getItem("insomni_hide_aria") !== "true");
  const [showTip, setShowTip] = useState(false);
  const [showPdfList, setShowPdfList] = useState(false);
  const [dragHover, setDragHover] = useState(false);
  const [showDemoList, setShowDemoList] = useState(false);

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem("insomni_onboarding_cards");
      if (saved) setDynamicCards(JSON.parse(saved));
      setShowAria(localStorage.getItem("insomni_hide_aria") !== "true");
    };
    const timer = setInterval(sync, 1000);
    return () => clearInterval(timer);
  }, []);

  const addExpense = (preset = null) => {
    setExpenses(p => [...p, preset ? { ...preset, id: uid(), amount: preset.amount || '' } : { id: uid(), name: '', amount: '', date: '1', type: 'expense', isSubscription: false }]);
  };

  const update = (id, field, val) => setExpenses(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));
  const remove = (id) => setExpenses(p => p.filter(e => e.id !== id));



  const handlePdfUpload = async (file) => {
    if (!file) return;
    setScanning(true); setScanPct(0); setScanMsg('');
    try {
      const parsed = await parseBankStatement(file, (pct, msg) => { setScanPct(pct); setScanMsg(msg); });
      setExpenses(parsed.map(e => ({ ...e, id: uid() })));
    } finally { setScanning(false); }
  };

  const loadDemoProfile = (profileName) => {
    setScanning(true);
    setScanPct(0);
    setScanMsg(lang === 'tr' ? 'Demo profil verileri çözümleniyor...' : 'Decoding demo profile data...');
    
    // Simulate real scanning progress of the pre-compiled profile PDFs
    let pct = 0;
    const interval = setInterval(() => {
      pct += 25;
      setScanPct(pct);
      if (pct === 25) {
        setScanMsg(lang === 'tr' ? 'Banka imzası doğrulanıyor...' : 'Verifying bank digital signature...');
      } else if (pct === 50) {
        setScanMsg(lang === 'tr' ? 'İşlem geçmişi sınıflandırılıyor...' : 'Classifying transaction logs...');
      } else if (pct === 75) {
        setScanMsg(lang === 'tr' ? 'Finansal kimlik (Persona) çıkartılıyor...' : 'Extracting financial identity...');
      } else if (pct >= 100) {
        clearInterval(interval);
        
        let demoExpenses = [];
        if (profileName === 'Mert Oyuncu') {
          demoExpenses = [
            { name: "Steam Games", amount: "780", date: "12", type: "expense", isSubscription: false },
            { name: "Xbox Game Pass", amount: "209", date: "3", type: "subscription", isSubscription: true },
            { name: "YouTube Premium", amount: "110", date: "3", type: "subscription", isSubscription: true },
            { name: "Netflix Premium", amount: "229", date: "3", type: "subscription", isSubscription: true },
            { name: "Spotify Duo", amount: "129", date: "3", type: "subscription", isSubscription: true },
            { name: "ChatGPT Plus", amount: "680", date: "3", type: "subscription", isSubscription: true },
            { name: "Starbucks Coffee", amount: "180", date: "15", type: "expense", isSubscription: false },
            { name: "GetirYemek", amount: "380", date: "8", type: "expense", isSubscription: false },
            { name: "BP Fuel Station", amount: "2200", date: "18", type: "expense", isSubscription: false },
            { name: "Site Aidati", amount: "1500", date: "10", type: "expense", isSubscription: false }
          ];
          localStorage.setItem("insomni_secure_bridge_meta", "KEY:Mert Oyuncu|5,2,0,1,1,4");
        } else if (profileName === 'Selin Gurme') {
          demoExpenses = [
            { name: "Sahibinden Kira Odemesi", amount: "15000", date: "5", type: "expense", isSubscription: false },
            { name: "Migros Sanal Market", amount: "2100", date: "14", type: "expense", isSubscription: false },
            { name: "Starbucks Coffee", amount: "320", date: "10", type: "expense", isSubscription: false },
            { name: "GetirYemek", amount: "580", date: "22", type: "expense", isSubscription: false },
            { name: "Macrocenter Gourmet", amount: "1400", date: "18", type: "expense", isSubscription: false },
            { name: "Yemeksepeti Siparis", amount: "620", date: "25", type: "expense", isSubscription: false },
            { name: "Uber Yolculuk", amount: "450", date: "7", type: "expense", isSubscription: false },
            { name: "Netflix Premium", amount: "229", date: "3", type: "subscription", isSubscription: true },
            { name: "Evidea Mobilya", amount: "2800", date: "12", type: "expense", isSubscription: false }
          ];
          localStorage.setItem("insomni_secure_bridge_meta", "KEY:Selin Gurme|1,5,4,2,2,2");
        } else if (profileName === 'Ahmet Tasarruf') {
          demoExpenses = [
            { name: "Kira Odemesi", amount: "12500", date: "5", type: "expense", isSubscription: false },
            { name: "A101 Market", amount: "450", date: "15", type: "expense", isSubscription: false },
            { name: "Netflix Premium", amount: "229", date: "3", type: "subscription", isSubscription: true },
            { name: "Spotify Duo", amount: "129", date: "3", type: "subscription", isSubscription: true }
          ];
          localStorage.setItem("insomni_secure_bridge_meta", "KEY:Ahmet Tasarruf|0,1,2,1,1,1");
        } else if (profileName === 'Can Gezgin') {
          demoExpenses = [
            { name: "Shell Akaryakit", amount: "4500", date: "10", type: "expense", isSubscription: false },
            { name: "BP Fuel Station", amount: "3500", date: "22", type: "expense", isSubscription: false },
            { name: "Uber Yolculuk", amount: "650", date: "7", type: "expense", isSubscription: false },
            { name: "BiTaksi", amount: "180", date: "14", type: "expense", isSubscription: false },
            { name: "Istanbulkart Yukleme", amount: "300", date: "5", type: "expense", isSubscription: false },
            { name: "GetirYemek", amount: "380", date: "18", type: "expense", isSubscription: false },
            { name: "Starbucks Coffee", amount: "180", date: "25", type: "expense", isSubscription: false },
            { name: "Spotify Duo", amount: "129", date: "3", type: "subscription", isSubscription: true }
          ];
          localStorage.setItem("insomni_secure_bridge_meta", "KEY:Can Gezgin|1,3,0,1,5,2");
        }
        
        setExpenses(demoExpenses.map(e => ({ ...e, id: uid() })));
        setScanning(false);
      }
    }, 250);
  };

  const submit = () => {
    const valid = expenses.filter(e => e.name && parseFloat(e.amount) > 0);
    onComplete(valid);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div className="glass" style={{ padding: '40px 44px', marginBottom: 20 }}>
            <span className="badge badge-accent" style={{ marginBottom: 8, display: 'inline-flex' }}>{lang === 'tr' ? 'Adım 2 / 2' : 'Step 2 / 2'}</span>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{t.onboarding.expenseTitle}</h2>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>{lang === 'tr' ? 'Manuel girin ya da banka ekstrenizi yükleyin.' : 'Enter manually or upload PDF.'}</p>
            


            {/* 💡 PDF Generator Onboarding Expandable Tip Banner */}
            <div className="glass" style={{ 
              background: 'rgba(129, 140, 248, 0.02)', 
              border: '1px solid rgba(129, 140, 248, 0.25)', 
              borderRadius: 12, 
              marginBottom: 20, 
              fontSize: 12, 
              color: 'var(--text1)',
              textAlign: 'left',
              overflow: 'hidden'
            }}>
              <button 
                type="button"
                onClick={() => setShowTip(!showTip)}
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  padding: '12px 16px', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  color: 'var(--accent)',
                  fontWeight: 800,
                  fontSize: '12px',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Lightbulb size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> {lang === 'tr' ? 'Test Ekstresi Kılavuzu & Örnek PDF İndir' : 'Test Statement Guide & Sample PDF Download'}
                </span>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8 }}>
                  {showTip ? (lang === 'tr' ? 'Gizle ▲' : 'Hide ▲') : (lang === 'tr' ? 'Göster ▼' : 'Show ▼')}
                </span>
              </button>
              
              <AnimatePresence>
                {showTip && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(129, 140, 248, 0.1)' }}
                  >
                    <p style={{ margin: '12px 0 8px 0', color: 'var(--text2)', lineHeight: 1.5 }}>
                      {lang === 'tr' 
                        ? 'Banka ekstresi analiz yeteneğimizi en üst düzeyde test etmek için hazır bir dosyanız yoksa aşağıdaki yöntemlerden birini kullanabilirsiniz. En sağlıklı sonuçlar için lütfen sisteminizde python dosyasını çalıştırarak kendi özel ekstrelerinizi üretin!'
                        : 'If you do not have a statement ready to test the AI parser, you can use one of the methods below. For the healthiest and most accurate analysis results, please use statements generated by the Ekstre Pro tool!'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                      <div style={{ marginTop: 12 }}>
                        <button 
                          type="button"
                          onClick={() => setShowPdfList(!showPdfList)}
                          style={{ 
                            width: '100%', 
                            background: 'rgba(129, 140, 248, 0.03)', 
                            border: '1px solid rgba(129, 140, 248, 0.2)', 
                            borderBottom: showPdfList ? 'none' : '1px solid rgba(129, 140, 248, 0.2)',
                            borderRadius: showPdfList ? '8px 8px 0 0' : '8px', 
                            padding: '12px 16px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            cursor: 'pointer',
                            color: 'var(--accent)',
                            fontWeight: 800,
                            fontSize: '12px',
                            textAlign: 'left',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Download size={14} color="var(--accent)" style={{ flexShrink: 0 }} /> {lang === 'tr' ? 'Yöntem A: Örnek PDF Dosyalarını İndir (4 Adet)' : 'Method A: Download Sample PDFs (4 files)'}
                          </span>
                          <span style={{ fontSize: '9px', opacity: 0.8 }}>
                            {showPdfList ? '▲' : '▼'}
                          </span>
                        </button>

                        <AnimatePresence>
                          {showPdfList && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              style={{ 
                                overflow: 'hidden', 
                                background: 'rgba(129, 140, 248, 0.01)', 
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                borderRadius: '0 0 8px 8px', 
                                border: '1px solid rgba(129, 140, 248, 0.2)',
                                borderTop: 'none',
                                padding: '16px',
                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.03)'
                              }}
                            >
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                                <a href="/samples/ekstre_kamil_ozkundura.pdf" download="Banka_Ekstresi_Ornek_1.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Download size={12} color="var(--green)" /> {lang === 'tr' ? 'Örnek Ekstre No 1' : 'Sample Statement No 1'}
                                </a>
                                <a href="/samples/ekstre_kemal_ozbegen.pdf" download="Banka_Ekstresi_Ornek_2.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Download size={12} color="var(--green)" /> {lang === 'tr' ? 'Örnek Ekstre No 2' : 'Sample Statement No 2'}
                                </a>
                                <a href="/samples/ekstre_sami_soylu.pdf" download="Banka_Ekstresi_Ornek_3.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Download size={12} color="var(--green)" /> {lang === 'tr' ? 'Örnek Ekstre No 3' : 'Sample Statement No 3'}
                                </a>
                                <a href="/samples/ekstre_selami_ozsahiner.pdf" download="Banka_Ekstresi_Ornek_4.pdf" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'underline', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                  <Download size={12} color="var(--green)" /> {lang === 'tr' ? 'Örnek Ekstre No 4' : 'Sample Statement No 4'}
                                </a>
                              </div>

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                        <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Bot size={16} color="var(--accent)" /> {lang === 'tr' ? 'Yöntem B: Yerel Python Dosyasını Çalıştırın' : 'Method B: Run Local Python File'}</strong>
                        <p style={{ margin: '4px 0 8px 0', color: 'var(--text2)' }}>
                          {lang === 'tr' 
                            ? 'Terminalinizden projenin yerelinde yer alan python dosyasını çalıştırarak saniyeler içinde kendi adınıza özel, zengin içerikli test ekstreleri oluşturabilirsiniz:'
                            : 'Run the python file in your local project workspace to dynamically generate personalized simulation PDFs in seconds:'}
                        </p>
                        <code style={{ 
                          background: 'var(--accent-dim)', 
                          color: 'var(--accent)', 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          fontFamily: 'var(--mono)',
                          fontSize: 11,
                          display: 'inline-block'
                        }}>
                          python scripts/ekstre_pro.py
                        </code>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div 
              onDragOver={e => { e.preventDefault(); setDragOver(true); }} 
              onDragLeave={() => setDragOver(false)} 
              onDrop={e => { e.preventDefault(); setDragOver(false); handlePdfUpload(e.dataTransfer.files[0]); }} 
              onMouseEnter={() => setDragHover(true)}
              onMouseLeave={() => setDragHover(false)}
              onClick={() => { if (!scanning) document.getElementById('pdfInput').click(); }} 
              style={{ 
                border: dragOver || dragHover ? '2px dashed var(--accent)' : '2px dashed rgba(129, 140, 248, 0.2)', 
                borderRadius: 16, 
                padding: '36px 24px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                marginBottom: 24, 
                background: dragOver 
                  ? 'rgba(129, 140, 248, 0.08)' 
                  : (dragHover ? 'rgba(129, 140, 248, 0.04)' : 'rgba(255, 255, 255, 0.01)'),
                boxShadow: dragOver || dragHover 
                  ? '0 0 20px rgba(129, 140, 248, 0.08), inset 0 0 12px rgba(129, 140, 248, 0.02)' 
                  : 'inset 0 0 12px rgba(255, 255, 255, 0.01)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <input id="pdfInput" type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => handlePdfUpload(e.target.files[0])} />
              {scanning ? (
                <div>
                  <Loader2 size={24} color="var(--accent)" style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{scanMsg}</div>
                </div>
              ) : (
                <div><Upload size={24} color="var(--text2)" style={{ marginBottom: 8 }} /><div style={{ fontSize: 13, color: 'var(--text2)' }}>{lang === 'tr' ? 'PDF banka ekstreni bırak veya tıkla' : 'Drop PDF or click'}</div></div>
              )}
            </div>

            {/* 🚀 Quick Demo Profil Yükleyici (Tek Tıklama Modu - Expandable!) */}
            <div style={{ 
              marginBottom: 28, 
              background: 'rgba(255, 255, 255, 0.01)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 16,
              overflow: 'hidden' 
            }}>
              <button
                type="button"
                onClick={() => setShowDemoList(!showDemoList)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--text1)',
                  fontWeight: 800,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)' }}>
                  <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0 }} /> {lang === 'tr' ? 'Tek Tıkla Hazır Demo Profillerini Yükle' : 'Load Pre-compiled Demo Profiles'}
                </span>
                <span style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center' }}>
                  {showDemoList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              <AnimatePresence>
                {showDemoList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.03)', overflow: 'hidden' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                      <button 
                        type="button" 
                        onClick={() => loadDemoProfile('Mert Oyuncu')} 
                        className="btn btn-sm btn-ghost" 
                        style={{ 
                          background: 'rgba(129, 140, 248, 0.03)', 
                          border: '1px solid rgba(129, 140, 248, 0.15)', 
                          padding: '16px', 
                          height: 'auto', 
                          borderRadius: 12, 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 12,
                          textAlign: 'left', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(129, 140, 248, 0.03)'
                        }}
                      >
                        <div style={{ 
                          background: 'rgba(129, 140, 248, 0.1)', 
                          border: '1px solid rgba(129, 140, 248, 0.2)', 
                          borderRadius: 10, 
                          width: 38, 
                          height: 38, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Gamepad2 size={20} color="var(--accent)" />
                        </div>
                        <div>
                          <strong style={{ fontSize: 13, color: 'var(--accent)', display: 'block' }}>Mert Oyuncu</strong>
                          <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, display: 'block' }}>{lang === 'tr' ? 'Steam, Xbox, Dijital Abonelikler' : 'Steam, Xbox, Digital Subs'}</span>
                        </div>
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={() => loadDemoProfile('Selin Gurme')} 
                        className="btn btn-sm btn-ghost" 
                        style={{ 
                          background: 'rgba(244, 63, 94, 0.03)', 
                          border: '1px solid rgba(244, 63, 94, 0.15)', 
                          padding: '16px', 
                          height: 'auto', 
                          borderRadius: 12, 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 12,
                          textAlign: 'left', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(244, 63, 94, 0.03)'
                        }}
                      >
                        <div style={{ 
                          background: 'rgba(244, 63, 94, 0.1)', 
                          border: '1px solid rgba(244, 63, 94, 0.2)', 
                          borderRadius: 10, 
                          width: 38, 
                          height: 38, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Utensils size={20} color="#f43f5e" />
                        </div>
                        <div>
                          <strong style={{ fontSize: 13, color: '#f43f5e', display: 'block' }}>Selin Gurme</strong>
                          <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, display: 'block' }}>{lang === 'tr' ? 'Macrocenter, Starbucks, Yemek' : 'Macrocenter, Starbucks, Food'}</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => loadDemoProfile('Ahmet Tasarruf')} 
                        className="btn btn-sm btn-ghost" 
                        style={{ 
                          background: 'rgba(16, 185, 129, 0.03)', 
                          border: '1px solid rgba(16, 185, 129, 0.15)', 
                          padding: '16px', 
                          height: 'auto', 
                          borderRadius: 12, 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 12,
                          textAlign: 'left', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.03)'
                        }}
                      >
                        <div style={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          border: '1px solid rgba(16, 185, 129, 0.2)', 
                          borderRadius: 10, 
                          width: 38, 
                          height: 38, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Trophy size={20} color="#10b981" />
                        </div>
                        <div>
                          <strong style={{ fontSize: 13, color: '#10b981', display: 'block' }}>Ahmet Tasarruf</strong>
                          <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, display: 'block' }}>{lang === 'tr' ? 'Minimalist Yaşam, Yüksek Birikim' : 'Minimal Living, High Savings'}</span>
                        </div>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => loadDemoProfile('Can Gezgin')} 
                        className="btn btn-sm btn-ghost" 
                        style={{ 
                          background: 'rgba(245, 158, 11, 0.03)', 
                          border: '1px solid rgba(245, 158, 11, 0.15)', 
                          padding: '16px', 
                          height: 'auto', 
                          borderRadius: 12, 
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 12,
                          textAlign: 'left', 
                          cursor: 'pointer', 
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.03)'
                        }}
                      >
                        <div style={{ 
                          background: 'rgba(245, 158, 11, 0.1)', 
                          border: '1px solid rgba(245, 158, 11, 0.2)', 
                          borderRadius: 10, 
                          width: 38, 
                          height: 38, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Car size={20} color="#f59e0b" />
                        </div>
                        <div>
                          <strong style={{ fontSize: 13, color: '#f59e0b', display: 'block' }}>Can Gezgin</strong>
                          <span style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2, display: 'block' }}>{lang === 'tr' ? 'Yakıt, Uber, Seyahat Harcamaları' : 'BP, Uber, Travel Expenses'}</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <AnimatePresence>
                {expenses.map((exp) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 70px auto auto', gap: 8, alignItems: 'center' }}>
                    <input className="input" placeholder={lang === 'tr' ? "Harcama" : "Expense"} value={exp.name} onChange={e => update(exp.id, 'name', e.target.value)} style={{ fontSize: 13 }} />
                    <input className="input" type="number" placeholder="0" value={exp.amount} onChange={e => update(exp.id, 'amount', e.target.value)} style={{ fontSize: 13 }} />
                    <input className="input" type="number" value={exp.date} onChange={e => update(exp.id, 'date', e.target.value)} style={{ fontSize: 13, textAlign: 'center' }} />
                    <button onClick={() => update(exp.id, 'isSubscription', !exp.isSubscription)} className={'btn btn-sm ' + (exp.isSubscription ? 'btn-accent' : 'btn-ghost')}><RefreshCw size={12} /></button>
                    <button onClick={() => remove(exp.id)} className="btn btn-sm btn-ghost" style={{ color: 'var(--red)' }}><Trash2 size={12} /></button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--glass-border)' }}>
                <div className="label" style={{ marginBottom: 12, fontSize: 11, fontWeight: 800, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1 }}>{lang === 'tr' ? 'Hızlı Ekle' : 'Quick Add'}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => addExpense(p)} className="chip" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '6px 12px', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      {p.isSubscription ? <RefreshCw size={11} /> : null} {p.name}
                    </button>
                  ))}
                  <button onClick={() => addExpense()} className="chip" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '6px 12px', borderRadius: 100, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <Plus size={11} /> {lang === 'tr' ? 'Boş Ekle' : 'Empty'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <motion.button onClick={submit} whileHover={{ scale: 1.02 }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>{lang === 'tr' ? "Dashboard'a Git" : "Go to Dashboard"} <ArrowRight size={17} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}
