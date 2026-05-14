import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProfileModal({ initialName, onComplete }) {
  const { lang, t } = useLanguage();
  var [name, setName] = useState(initialName || '');
  var submit = function(e) { e.preventDefault(); if (name.trim()) onComplete(name.trim()); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      
      <div className="glass" style={{ 
        width: '100%', 
        maxWidth: 800, 
        display: 'flex', 
        overflow: 'hidden',
        padding: 0,
        minHeight: 500,
        border: '1px solid var(--accent)'
      }}>
        
        {/* LEFT SIDE - R.E.M VISUAL (FRONT FACING & CENTERED) */}
        <div style={{ 
          flex: 1.2, // Give a bit more space to R.E.M
          background: '#fff', 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', // Center vertically
          justifyContent: 'center', // Center horizontally
          borderRight: '1px solid var(--glass-border)',
          overflow: 'hidden'
        }}>
           <motion.img 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1.1, opacity: 1 }} // Enlarged to 1.1x
             transition={{ duration: 0.8, ease: "easeOut" }}
             src="/rem_avatar.png" 
             alt="R.E.M Front" 
             style={{ 
               width: '85%', // Make it large
               height: '85%', 
               objectFit: 'contain',
               filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.1))'
             }} 
           />
        </div>

        {/* RIGHT SIDE - FORM */}
        <div style={{ flex: 1, padding: '60px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>
            {lang === 'tr' ? 'Hoş Geldiniz' : 'Welcome'}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
            {lang === 'tr' ? 'Finansal verilerini R.E.M ile analiz ederek sana özel bir tasarruf ve kazanç planı oluşturacağız.' : 'We will create a special saving and earning plan for you by analyzing your financial data with R.E.M.'}
          </p>
          
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div className="label" style={{ marginBottom: 8 }}>{lang === 'tr' ? 'İSİM SOYİSİM' : 'FULL NAME'}</div>
              <input className="input" placeholder={t.onboarding.profilePlaceholder} value={name} onChange={function(e) { setName(e.target.value); }} autoFocus 
                style={{ fontSize: 18, padding: '16px 20px' }}
              />
            </div>
            
            <motion.button type="submit" disabled={!name.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn btn-primary" style={{ justifyContent: 'center', opacity: !name.trim() ? 0.5 : 1, padding: '18px', fontSize: 16 }}>
              {lang === 'tr' ? 'Haydi Başlayalım' : "Let's Start"} <ArrowRight size={20} />
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}