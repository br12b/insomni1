import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <motion.button onClick={toggle} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
      className="btn btn-icon btn-ghost" title={isDark ? 'Acik tema' : 'Koyu tema'}>
      <motion.div key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} transition={{ duration: 0.22 }}>
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
      </motion.div>
    </motion.button>
  );
}