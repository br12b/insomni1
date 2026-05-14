import React, { createContext, useState, useEffect, useRef } from 'react';

export const AdminUIContext = createContext(null);

const DEFAULT_SETTINGS = {
  accentColor: '#5b5fc7',
  accentColorDark: '#818cf8',
  gridOpacity: '0.055',
  gridOpacityDark: '0.04',
  borderRadius: '16px',
  layout: {
    landing_aria: { x: 0, y: 0, scale: 1 },
    landing_remSmall: { x: 0, y: 0, scale: 1 }
  },
  landingFeatures: [
    { id: 1, icon: 'Clock', title: 'Time Gap Analizi', desc: 'Maaş ile harcama arasındaki her atıl günü takip eder' },
    { id: 2, icon: 'TrendingUp', title: 'PPF Entegrasyonu', desc: 'Paranızın günlük %0.14-0.16 faizle ne kazandırdığını gösterir' },
    { id: 3, icon: 'Sparkles', title: 'R.E.M AI', desc: 'Finansal verinizi analiz eden kişisel AI danışmanınız' },
    { id: 4, icon: 'Shield', title: 'Abonelik Takibi', desc: 'Netflix, Spotify ve diğer planların gerçek yıllık maliyeti' }
  ],
  customElements: []
};

const loadFromStorage = () => {
  const saved = localStorage.getItem('insomni_admin_ui');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (!parsed.layout) parsed.layout = DEFAULT_SETTINGS.layout;
    if (!parsed.customElements) parsed.customElements = DEFAULT_SETTINGS.customElements;
    return parsed;
  }
  return DEFAULT_SETTINGS;
};

export function AdminUIProvider({ children }) {
  const [settings, setSettings] = useState(loadFromStorage);
  const historyRef = useRef([]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', settings.accentColor);
    root.style.setProperty('--grid-line', `rgba(0,0,0,${settings.gridOpacity})`);
    root.style.setProperty('--r-md', settings.borderRadius);
    root.style.setProperty('--r-lg', `${parseInt(settings.borderRadius) * 1.5}px`);
    root.style.setProperty('--r-xl', `${parseInt(settings.borderRadius) * 2}px`);

    const styleId = 'admin-ui-overrides';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
      :root {
        --accent: ${settings.accentColor} !important;
        --grid-line: rgba(0,0,0,${settings.gridOpacity}) !important;
      }
      [data-theme='dark'] {
        --accent: ${settings.accentColorDark} !important;
        --grid-line: rgba(255,255,255,${settings.gridOpacityDark}) !important;
      }
    `;
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateLayout = (elementId, layoutData, saveHistory = true) => {
    setSettings(prev => {
      if (saveHistory) {
        historyRef.current.push(JSON.parse(JSON.stringify({ layout: prev.layout, customElements: prev.customElements })));
        if (historyRef.current.length > 20) historyRef.current.shift();
      }
      return {
        ...prev,
        layout: {
          ...prev.layout,
          [elementId]: { ...(prev.layout[elementId] || {x:0, y:0, scale:1}), ...layoutData }
        }
      };
    });
  };

  const addCustomElement = (type, src) => {
    const newId = `custom_${Date.now()}`;
    setSettings(prev => {
      historyRef.current.push(JSON.parse(JSON.stringify({ layout: prev.layout, customElements: prev.customElements })));
      return {
        ...prev,
        customElements: [...prev.customElements, { id: newId, type, src }],
        layout: {
          ...prev.layout,
          [newId]: { x: 0, y: 0, scale: 1 } // Initialize at center
        }
      };
    });
    return newId;
  };

  const undoLayout = () => {
    if (historyRef.current.length === 0) return false;
    const previousState = historyRef.current.pop();
    setSettings(prev => ({
      ...prev,
      layout: previousState.layout,
      customElements: previousState.customElements || prev.customElements
    }));
    return true;
  };

  const commitSettings = () => {
    localStorage.setItem('insomni_admin_ui', JSON.stringify(settings));
    return true;
  };

  const revertToSaved = () => {
    const savedSettings = loadFromStorage();
    historyRef.current = [];
    setSettings(savedSettings);
  };

  const resetSettings = () => {
    historyRef.current.push(JSON.parse(JSON.stringify({ layout: settings.layout, customElements: settings.customElements })));
    setSettings(DEFAULT_SETTINGS);
  };

  const updateLandingFeature = (id, data) => {
    setSettings(prev => ({
      ...prev,
      landingFeatures: prev.landingFeatures.map(f => f.id === id ? { ...f, ...data } : f)
    }));
  };

  const value = {
    settings,
    updateSetting,
    updateLayout,
    addCustomElement,
    undoLayout,
    commitSettings,
    revertToSaved,
    resetSettings,
    updateLandingFeature
  };

  return (
    <AdminUIContext.Provider value={value}>
      {children}
    </AdminUIContext.Provider>
  );
}
