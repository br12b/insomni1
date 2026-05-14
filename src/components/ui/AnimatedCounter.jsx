import React, { useEffect, useRef, useState } from 'react';
export default function AnimatedCounter({ value, prefix='', suffix='', decimals=0, duration=900 }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null); const start = useRef(null); const from = useRef(0);
  useEffect(() => {
    const target = parseFloat(value) || 0;
    const fromVal = from.current;
    if (raf.current) cancelAnimationFrame(raf.current);
    start.current = null;
    const animate = (ts) => {
      if (!start.current) start.current = ts;
      const pct = Math.min((ts - start.current) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setDisplay(fromVal + (target - fromVal) * ease);
      if (pct < 1) raf.current = requestAnimationFrame(animate); else from.current = target;
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <span>{prefix}{display.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}