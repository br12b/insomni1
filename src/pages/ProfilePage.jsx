import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Fingerprint, LogOut, Check, Edit3, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { storage } from '../lib/storage';

export default function ProfilePage({ name, onReset, onUpdateName }) {
  const { lang, t } = useLanguage();
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(() => storage.load('profile_img_' + name, null));
  const [omniId, setOmniId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);

  useEffect(() => {
    let savedId = localStorage.getItem('insomni_bridge_id');
    if (!savedId) {
      savedId = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem('insomni_bridge_id', savedId);
    }
    setOmniId(savedId);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        storage.save('profile_img_' + name, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (tempName.trim() && tempName !== name) {
      onUpdateName(tempName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'var(--bg0)' }}>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 700, textAlign: 'center' }}
      >
        {/* PHOTO UPLOAD CIRCLE */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 32 }}>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => fileInputRef.current.click()}
            style={{ 
              width: 180, height: 180, borderRadius: '50%', 
              background: 'var(--bg1)', border: '4px solid var(--accent)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              cursor: 'pointer', overflow: 'hidden', boxShadow: '0 0 60px rgba(129,140,248,0.25)',
              position: 'relative'
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={80} color="var(--accent)" />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.2s' }} className="hover-overlay">
              <Camera color="#fff" size={32} />
            </div>
          </motion.div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" />
        </div>

        {/* IDENTITY INFO */}
        <div style={{ marginBottom: 60 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            {isEditing ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input 
                  autoFocus
                  className="input"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  style={{ fontSize: 32, fontWeight: 900, textAlign: 'center', width: 'auto', minWidth: 200, padding: '10px 20px', borderRadius: 16 }}
                />
                <button onClick={saveName} className="btn btn-primary btn-icon btn-sm" style={{ borderRadius: '50%' }}><Check size={18} /></button>
                <button onClick={() => { setTempName(name); setIsEditing(false); }} className="btn btn-ghost btn-icon btn-sm" style={{ borderRadius: '50%' }}><X size={18} /></button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <h1 style={{ fontSize: 72, fontWeight: 950, letterSpacing: '-0.05em', margin: 0, lineHeight: 1 }}>{name}</h1>
                <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-icon" style={{ borderRadius: '50%', color: 'var(--text2)' }}>
                  <Edit3 size={24} />
                </button>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div className="glass" style={{ padding: '8px 24px', borderRadius: 100, fontSize: 14, fontWeight: 800, color: 'var(--text1)', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--glass-border)' }}>
              <Fingerprint size={16} color="var(--accent)" /> OMNI ID: {omniId}
            </div>
            <div className="glass" style={{ padding: '8px 24px', borderRadius: 100, fontSize: 14, fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(16,185,129,0.2)' }}>
              <Check size={16} /> ACTIVE AGENT
            </div>
          </div>
        </div>

        {/* CORE ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: 40, width: '100%' }}>
          <button onClick={onReset} className="btn btn-ghost" style={{ color: '#f87171', gap: 12, fontWeight: 800, fontSize: 14, padding: '16px 32px', borderRadius: 100, background: 'rgba(248,113,113,0.05)' }}>
            <LogOut size={18} /> LOG OUT PROFILE
          </button>
        </div>
      </motion.div>

      <style>{`
        .hover-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
