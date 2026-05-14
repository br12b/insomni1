import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
export function useTheme() {
  const [theme, setTheme] = useState(() => storage.getTheme());
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); storage.setTheme(theme); }, [theme]);
  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return { theme, toggle, isDark: theme === 'dark' };
}