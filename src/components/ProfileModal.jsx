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
        
                {/* LEFT SIDE - R.E.M VISUAL (FLOATING & TEXT) */}
        <div style={{ 
          flex: 1.3, // Slightly more space for the bigger R.E.M
          background: 'var(--bg1)', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', // Stack image and text
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRight: '1px solid var(--glass-border)',
          overflow: 'hidden',
          padding: 40
        }}>
           <motion.div
             animate={{ 
               y: [0, -15, 0], // Floating motion
             }}
             transition={{ 
               duration: 6, 
               repeat: Infinity, 
               ease: "easeInOut" 
             }}
             style={{ 
               width: '100%', 
               display: 'flex', 
               flexDirection: 'column', 
               alignItems: 'center' 
             }}
           >
             <motion.img 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1.25, opacity: 1 }} // Enlarged to 1.25x
               transition={{ duration: 0.8 }}
               src="/rem_avatar.webp" 
               alt="R.E.M Front" 
               style={{ 
                 width: '90%', 
                 height: 'auto', 
                 objectFit: 'contain',
                 filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.15))'
               }} 
             />
             
             {/* Text below R.E.M */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               style={{ marginTop: 20, textAlign: 'center' }}
             >
               <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--accent)', letterSpacing: 2, textTransform: 'uppercase' }}>
                 R.E.M Intelligence
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 }}>
                 <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                 <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', letterSpacing: 1 }}>ZONAL AI ACTIVATED</span>
               </div>
             </motion.div>
           </motion.div>

           {/* Subtle Shadow below the floating orb */}
           <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.1, 0.2] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             style={{ 
               position: 'absolute', 
               bottom: '20%', 
               width: 120, 
               height: 20, 
               background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, transparent 70%)',
               filter: 'blur(5px)'
             }}
           />
        </div>{/* RIGHT SIDE - FORM */}
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
