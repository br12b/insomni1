import React from 'react';
import { 
  Gamepad2, 
  ShoppingCart, 
  KeyRound, 
  Home, 
  Car, 
  Receipt, 
  CreditCard, 
  Sparkles,
  Tv2,
  Music,
  Film,
  Cloud,
  Zap,
  Flame,
  Droplet,
  Globe,
  Smartphone,
  Coffee,
  Ticket,
  Fuel,
  Info,
  CalendarDays
} from 'lucide-react';

const iconMap = {
  // Brand Overrides
  '🎬': Film,
  '🎧': Music,
  '📺': Tv2,
  '☁️': Cloud,
  '⚡': Zap,
  '🔥': Flame,
  '💧': Droplet,
  '🌐': Globe,
  '📱': Smartphone,
  '☕': Coffee,
  '🔑': KeyRound,
  '🕹️': Gamepad2,
  '🎟️': Ticket,
  '⛽': Fuel,
  '🚕': Car,
  '🍏': ShoppingCart,
  // Main Categories
  '🎮': Gamepad2,
  '🛒': ShoppingCart,
  '🏠': Home,
  '🚗': Car,
  '📄': Receipt,
  '💳': CreditCard,
  '🛍️': Sparkles,
  '📅': CalendarDays
};

export default function PremiumIcon({ iconStr, size = 16, color = 'currentColor', style = {} }) {
  const IconComponent = iconMap[iconStr] || Info;
  
  return (
    <span 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        verticalAlign: 'middle',
        color: color,
        ...style 
      }}
    >
      <IconComponent 
        size={size} 
        style={{ 
          strokeWidth: 2.2,
          filter: `drop-shadow(0 0 6px ${color}45)`,
          transition: 'all 0.3s ease'
        }} 
      />
    </span>
  );
}
