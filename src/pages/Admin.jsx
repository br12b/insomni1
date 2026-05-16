import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, RefreshCw, Save, Terminal, Sparkles, MousePointer2, Undo2, ChevronDown, Check, X, ImagePlus } from 'lucide-react';
import { useAdminUI } from '../hooks/useAdminUI';
import { useTheme } from '../hooks/useTheme';
import Landing from './Landing';
import Dashboard from './Dashboard';
import Opportunities from './Opportunities';

const MOCK_LOGS = [
  { time: '04:52:11', level: 'INFO', msg: 'System initialized.' },
  { time: '04:53:05', level: 'WARN', msg: 'Draft mode active.' },
];

export default function Admin({ onClose }) {
  const { settings, updateSetting, updateLayout, undoLayout, resetSettings, commitSettings, revertToSaved, addCustomElement, updateLandingFeature } = useAdminUI();
  const { isDark } = useTheme();
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [activeTab, setActiveTab] = useState('editor'); // 'ui' or 'editor'
  const [activePage, setActivePage] = useState('landing');
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      const randomLogs = [
        'Syncing UI telemetry...',
        'Drag controls ready.',
        'Ping from internal API: 12ms',
      ];
      setLogs(prev => [...prev.slice(-10), { time: timeStr, level: 'INFO', msg: randomLogs[Math.floor(Math.random() * randomLogs.length)] }]);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Global Ctrl+Z Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        const success = undoLayout();
        if (success) {
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
          setLogs(prev => [...prev.slice(-10), { time: timeStr, level: 'WARN', msg: 'Undo Action (Ctrl+Z) executed.' }]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undoLayout]);

  const handleSave = () => {
    commitSettings();
    setShowSavedMsg(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    setLogs(prev => [...prev.slice(-10), { time: timeStr, level: 'SUCCESS', msg: 'Changes committed to memory.' }]);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  const handleRevert = () => {
    revertToSaved();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    setLogs(prev => [...prev.slice(-10), { time: timeStr, level: 'WARN', msg: 'Draft discarded. Reverted to last save.' }]);
  };

  const handleAddImage = () => {
    const url = window.prompt("Yeni eklenecek görselin adresini (URL) girin:\nÖrn: /insomni.png veya https://...", "/insomni.png");
    if (url) {
      addCustomElement('image', url);
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      setLogs(prev => [...prev.slice(-10), { time: timeStr, level: 'SUCCESS', msg: `Custom image added: ${url}` }]);
    }
  };

  const mockSalary = { income: 50000, currency: '₺' };
  const mockExpenses = [{ id: '1', name: 'Kira', amount: 15000, category: 'Barınma' }];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'var(--bg0)', overflow: 'hidden' }}>
      
      {/* 1:1 BACKGROUND PREVIEW (FULL SCREEN) */}
      <div style={{ position: 'absolute', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'auto', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
         {activePage === 'landing' && <Landing editMode={true} />}
         {activePage === 'dashboard' && <Dashboard salaryData={mockSalary} expensesData={mockExpenses} profileName="Admin" editMode={true} />}
         {activePage === 'opportunities' && <Opportunities expenses={mockExpenses} editMode={true} />}
      </div>

      {/* FLOATING ADMIN PANELS OVERLAY */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10000 }}>
        
        {/* TOP BAR / HEADER (Floating) */}
        <div className="glass" style={{ 
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', 
          display: 'flex', gap: 16, alignItems: 'center', padding: '12px 24px', 
          borderRadius: 100, border: '1px solid var(--glass-border)', pointerEvents: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 16, borderRight: '1px solid var(--glass-border)' }}>
            <Settings size={18} color="var(--accent)" />
            <span style={{ fontWeight: 800 }}>Draft Mode</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActiveTab('editor'); // tabs: editor, ui, onboarding} className={`btn btn-sm ${activeTab === 'editor' ? 'btn-primary' : 'btn-ghost'}`} style={{ borderRadius: 100 }}>
              <MousePointer2 size={14} /> Viewport
            </button>
            <button onClick={() => setActiveTab("ui")} className={`btn btn-sm ${activeTab === "ui" ? "btn-primary" : "btn-ghost"}`} style={{ borderRadius: 100 }}><Sparkles size={14} /> UI</button><button onClick={() => setActiveTab("onboarding")} className={`btn btn-sm ${activeTab === "onboarding" ? "btn-primary" : "btn-ghost"}`} style={{ borderRadius: 100 }}><LayoutDashboard size={14} /> Onboarding</button>
          </div>

          {/* PAGE SELECTOR */}
          <div style={{ position: 'relative', marginLeft: 8 }}>
            <select 
              value={activePage} 
              onChange={(e) => setActivePage(e.target.value)}
              className="input"
              style={{ padding: '6px 32px 6px 16px', borderRadius: 100, height: 'auto', background: 'rgba(0,0,0,0.2)', border: 'none', cursor: 'pointer', appearance: 'none', fontSize: 13, fontWeight: 600 }}
            >
              <option value="landing">Landing</option>
              <option value="dashboard">Dashboard</option>
              <option value="opportunities">Opportunities</option>
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm btn-icon" style={{ marginLeft: 8, borderRadius: 100 }} title="Exit Admin">
            <X size={16} />
          </button>
        </div>

        {/* FLOATING SIDEBAR (RIGHT) */}
        <motion.div 
          initial={{ x: 400 }} animate={{ x: 0 }}
          className="glass" 
          style={{ 
            position: 'absolute', top: 90, right: 20, bottom: 20, width: 340, 
            borderRadius: 'var(--r-lg)', border: '1px solid var(--glass-border)',
            display: 'flex', flexDirection: 'column', pointerEvents: 'auto',
            boxShadow: '-10px 0 40px rgba(0,0,0,0.3)', overflow: 'hidden'
          }}>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {activeTab === 'editor' ? (
              <>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 16 }}>Controls</h3>
                  <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6, background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12 }}>
                    <p style={{ margin: '0 0 8px 0' }}>• <strong>Click</strong> objects to show Transform Gizmo (G, S).</p>
                    <p style={{ margin: '0 0 8px 0' }}>• <strong>Drag</strong> objects directly to move them.</p>
                    <p style={{ margin: '0' }}>• Press <strong>Ctrl+Z</strong> to undo.</p>
                  </div>
                </div>

                <div>
                   <button onClick={handleAddImage} className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, borderStyle: 'dashed' }}>
                     <ImagePlus size={16} /> Add Custom Image
                   </button>
                </div>

                <div>
                                  {/* LANDING FEATURES EDITOR */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 16 }}>Landing Features</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {settings.landingFeatures?.map(feature => (
                      <div key={feature.id} className="glass" style={{ padding: 14, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                           <div style={{ flex: 1 }}>
                             <label style={{ fontSize: 9, color: 'var(--text2)', display: 'block', marginBottom: 2 }}>Başlık</label>
                             <input className="input" style={{ padding: '4px 8px', fontSize: 11, height: 'auto' }} 
                                value={feature.title} onChange={e => updateLandingFeature(feature.id, { title: e.target.value })} />
                           </div>
                           <div style={{ width: 80 }}>
                             <label style={{ fontSize: 9, color: 'var(--text2)', display: 'block', marginBottom: 2 }}>İkon</label>
                             <select className="input" style={{ padding: '4px 8px', fontSize: 10, height: 'auto', appearance: 'auto' }}
                                value={feature.icon} onChange={e => updateLandingFeature(feature.id, { icon: e.target.value })}>
                               <option value="Clock">Saat</option>
                               <option value="TrendingUp">Grafik</option>
                               <option value="Sparkles">Yıldız</option>
                               <option value="Shield">Kalkan</option>
                               <option value="Zap">Şimşek</option>
                             </select>
                           </div>
                        </div>
                        <label style={{ fontSize: 9, color: 'var(--text2)', display: 'block', marginBottom: 2 }}>Açıklama</label>
                        <textarea className="input" style={{ padding: '4px 8px', fontSize: 10, height: 40, resize: 'none' }}
                          value={feature.desc} onChange={e => updateLandingFeature(feature.id, { desc: e.target.value })} />
                      </div>
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 16 }}>Scale Overrides</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label className="label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Aria Scale</span>
                      <span>{settings.layout?.landing_aria?.scale || 1}x</span>
                    </label>
                    <input type="range" min="0.5" max="2" step="0.05" value={settings.layout?.landing_aria?.scale || 1} 
                      onChange={e => updateLayout('landing_aria', { scale: parseFloat(e.target.value) })} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>R.E.M Scale</span>
                      <span>{settings.layout?.landing_remSmall?.scale || 1}x</span>
                    </label>
                    <input type="range" min="0.5" max="2" step="0.05" value={settings.layout?.landing_remSmall?.scale || 1} 
                      onChange={e => updateLayout('landing_remSmall', { scale: parseFloat(e.target.value) })} style={{ width: '100%' }} />
                  </div>
                </div>
              </>
                        ) : activeTab === 'onboarding' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 8 }}>Onboarding Cards</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {JSON.parse(localStorage.getItem("insomni_onboarding_cards") || '[]').map((card, i) => (
                    <div key={i} className="glass" style={{ padding: 12, background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <input className="input" style={{ width: 40, height: 32, padding: 0, textAlign: 'center' }} value={card.emoji} onChange={e => {
                          const cards = JSON.parse(localStorage.getItem("insomni_onboarding_cards"));
                          cards[i].emoji = e.target.value;
                          localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
                          setLogs(prev => [...prev, { time: 'Now', level: 'INFO', msg: 'Card emoji updated.' }]);
                        }} />
                        <button className="btn btn-icon btn-sm" style={{ color: 'var(--red)' }} onClick={() => {
                          const cards = JSON.parse(localStorage.getItem("insomni_onboarding_cards"));
                          cards.splice(i, 1);
                          localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
                          setLogs(prev => [...prev, { time: 'Now', level: 'WARN', msg: 'Card deleted.' }]);
                        }}><X size={14} /></button>
                      </div>
                      <input className="input" style={{ fontSize: 12, marginBottom: 8 }} value={card.title} onChange={e => {
                        const cards = JSON.parse(localStorage.getItem("insomni_onboarding_cards"));
                        cards[i].title = e.target.value;
                        localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
                      }} />
                      <textarea className="input" style={{ fontSize: 11, height: 60 }} value={card.desc} onChange={e => {
                        const cards = JSON.parse(localStorage.getItem("insomni_onboarding_cards"));
                        cards[i].desc = e.target.value;
                        localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
                      }} />
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ borderStyle: 'dashed' }} onClick={() => {
                    const cards = JSON.parse(localStorage.getItem("insomni_onboarding_cards") || '[]');
                    cards.push({ emoji: '💡', title: 'New Tip', desc: 'Add advice here...' });
                    localStorage.setItem("insomni_onboarding_cards", JSON.stringify(cards));
                  }}><Plus size={14} /> Add Card</button>
                </div>

                <div className="glass" style={{ padding: 16, border: '1px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                        <img src="/aria_profile.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>Show ARIA Tip</span>
                    </div>
                    <input type="checkbox" checked={localStorage.getItem("insomni_hide_aria") !== "true"} onChange={e => {
                      localStorage.setItem("insomni_hide_aria", e.target.checked ? "false" : "true");
                      setLogs(prev => [...prev, { time: 'Now', level: 'INFO', msg: 'ARIA visibility toggled.' }]);
                    }} />
                  </div>
                </div>
              </div>
              <>
                <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 8 }}>Theme Configuration</h3>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 8 }}>Primary Accent Color</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input type="color" value={settings.accentColor} onChange={e => updateSetting('accentColor', e.target.value)} 
                      style={{ width: 32, height: 32, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent' }} />
                    <code style={{ background: 'var(--bg2)', padding: '4px 8px', borderRadius: 6, fontSize: 12 }}>{settings.accentColor}</code>
                  </div>
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 8 }}>Grid Opacity ({settings.gridOpacity})</label>
                  <input type="range" min="0" max="0.2" step="0.005" value={settings.gridOpacity} 
                    onChange={e => updateSetting('gridOpacity', e.target.value)} style={{ width: '100%' }} />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 8 }}>Border Radius ({settings.borderRadius})</label>
                  <input type="range" min="0" max="32" step="1" value={parseInt(settings.borderRadius)} 
                    onChange={e => updateSetting('borderRadius', `${e.target.value}px`)} style={{ width: '100%' }} />
                </div>
              </>
            )}

            <div style={{ flex: 1 }} />

            {/* LOGS */}
            <div>
               <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text2)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                 <Terminal size={12}/> Event Logs
               </h3>
               <div style={{ background: '#0c0c0e', borderRadius: 8, padding: 12, height: 120, overflowY: 'auto', fontFamily: 'var(--mono)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {logs.map((log, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
                    <span style={{ 
                      color: log.level === 'SUCCESS' ? '#34d399' : log.level === 'ERROR' ? '#f87171' : log.level === 'WARN' ? '#fbbf24' : '#60a5fa',
                      fontWeight: 700
                    }}>{log.level}</span>
                    <span style={{ color: '#d4d4d8' }}>{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ACTIONS */}
          <div style={{ padding: 24, borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <button onClick={undoLayout} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }} title="Undo (Ctrl+Z)">
                <Undo2 size={14} /> Undo
              </button>
              <button onClick={handleRevert} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center', color: '#f87171' }}>
                <RefreshCw size={14} /> Discard All
              </button>
            </div>
            <button onClick={handleSave} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', height: 48 }}>
              {showSavedMsg ? <><Check size={18}/> Saved!</> : <><Save size={18} /> Save Changes</>}
            </button>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
