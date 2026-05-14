import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Move, Maximize2, Sparkles, Percent, ShoppingBag, Coffee, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Opportunities({ expenses = [] }) {
  const { t } = useLanguage();

  const hasNetflix = expenses.some(e => e.name.toLowerCase().includes('netflix'));
  const hasSpotify = expenses.some(e => e.name.toLowerCase().includes('spotify'));
  const hasFood = expenses.some(e => e.amount > 2000);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      className="container" style={{ paddingTop: '5vh', paddingBottom: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Compass size={24} color="var(--accent)" />
        </div>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', margin: 0 }}>{t.opportunities.title}</h1>
          <p style={{ color: 'var(--text2)', margin: '4px 0 0 0' }}>{t.opportunities.desc}</p>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(145deg, rgba(30,27,36,0.9), rgba(20,18,24,0.95))', border: '1px solid var(--accent-dim)', borderRadius: 'var(--r-md)', padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--accent)', fontWeight: 800, marginBottom: 24 }}>
          <Sparkles size={20} /> {t.opportunities.smartMatch}
        </div>
        
        {expenses.length === 0 ? (
          <div style={{ color: 'var(--text2)' }}>{t.opportunities.noMatch}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {hasNetflix && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e5091420', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e50914' }}><Percent size={20}/></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Netflix %50 Cashback</div>
                    <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>"Nays" kart ile ödemelerde geçerli.</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>Detaylar <ArrowRight size={14}/></button>
              </div>
            )}
  
          {hasSpotify && (
            <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e' }}><Sparkles size={20}/></div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Spotify Cashback</h3>
              <p style={{ color: 'var(--text2)', fontSize: 13, flex: 1 }}>Nays kart ile ödemelerde aylık %50 iade (Max 100₺).</p>
              <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', marginTop: 8 }}>Kampanyayı Gör</button>
            </div>
          )}
          {hasFood && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f59e0b20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><Coffee size={20}/></div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Yemeksepeti İndirimi</div>
                    <div style={{ color: 'var(--text2)', fontSize: 13, marginTop: 4 }}>Yüksek yemek harcamanız var. Axess ile 50₺ indirim fırsatı.</div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }}>Detaylar <ArrowRight size={14}/></button>
              </div>
            )}
            {!hasNetflix && !hasFood && (
              <div style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={16}/> Harcamalarınız oldukça optimize!</div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20 }}>{t.opportunities.allCampaigns}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#10b98120', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><ShoppingBag size={20}/></div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Market Harcamaları</h3>
            <p style={{ color: 'var(--text2)', fontSize: 13, flex: 1 }}>Garanti Bonus ile 300₺ üzeri market alışverişine 30₺ bonus.</p>
            <div style={{ fontWeight: 800, color: 'var(--green)' }}>%10 Kazanç</div>
          </div>
          <div className="glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: '#3b82f620', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><Move size={20}/></div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Akaryakıt Kampanyası</h3>
            <p style={{ color: 'var(--text2)', fontSize: 13, flex: 1 }}>Maximum kart ile 4. akaryakıt alımına 100₺ MaxiPuan.</p>
            <div style={{ fontWeight: 800, color: '#3b82f6' }}>100₺ Kazanç</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
