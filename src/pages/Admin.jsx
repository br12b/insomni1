import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, X, Plus, Trash2 } from 'lucide-react';

const DEFAULT_CARDS = [
  { emoji: '📅', title: 'Ödeme Günü Neden Önemli?', desc: 'Maaş günün ile harcama günlerin arasındaki farkı optimize et.' },
  { emoji: '🔄', title: 'Abonelikler Küçük Ama Etkili', desc: 'Aylık abonelikler yıllık bazda ciddi rakamlara ulaşır.' },
  { emoji: '⚡', title: 'Atıl Nakit Tuzağı', desc: 'Paranı faizsiz hesapta tutmak yerine değerlendir.' }
];

export default function Admin({ onClose }) {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("insomni_onboarding_cards");
    return saved ? JSON.parse(saved) : DEFAULT_CARDS;
  });
  const [showAria, setShowAria] = useState(() => localStorage.getItem("insomni_hide_aria") !== "true");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
    localStorage.setItem("insomni_hide_aria", showAria ? "false" : "true");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addCard = () => setCards([...cards, { emoji: '💡', title: 'Yeni Bilgi', desc: 'Açıklama yazısı...' }]);
  const removeCard = (index) => setCards(cards.filter((_, i) => i !== index));
  const updateCard = (index, field, val) => {
    const next = [...cards];
    next[index][field] = val;
    setCards(next);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,12,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <div style={{ padding: 24, borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Settings className="text-primary" size={20} />
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Onboarding Yönetimi</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm"><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Bilgi Kartları</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cards.map((card, i) => (
                <div key={i} className="glass" style={{ padding: 16, background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <input className="input" style={{ width: 50, textAlign: 'center' }} value={card.emoji} onChange={e => updateCard(i, 'emoji', e.target.value)} />
                    <input className="input" style={{ flex: 1 }} value={card.title} onChange={e => updateCard(i, 'title', e.target.value)} />
                    <button onClick={() => removeCard(i)} className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}><Trash2 size={16} /></button>
                  </div>
                  <textarea className="input" style={{ width: '100%', height: 60, resize: 'none', fontSize: 12 }} value={card.desc} onChange={e => updateCard(i, 'desc', e.target.value)} />
                </div>
              ))}
              <button onClick={addCard} className="btn btn-secondary" style={{ borderStyle: 'dashed' }}><Plus size={16} /> Yeni Kart Ekle</button>
            </div>
          </div>

          <div className="glass" style={{ padding: 20, border: '1px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/aria_profile.png" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                <span style={{ fontWeight: 700 }}>Aria Bilgilendirmesi</span>
              </div>
              <input type="checkbox" checked={showAria} onChange={e => setShowAria(e.target.checked)} style={{ width: 20, height: 20 }} />
            </div>
          </div>
        </div>

        <div style={{ padding: 24, borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', height: 48, justifyContent: 'center' }}>
            {saved ? 'Değişiklikler Kaydedildi!' : <><Save size={18} /> Ayarları Mühürle</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}