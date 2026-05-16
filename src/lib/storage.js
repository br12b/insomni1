const P = 'ce_v2_';
export const storage = {
  save(k, v) { try { localStorage.setItem(P+k, JSON.stringify(v)); } catch(_){} },
  load(k, fb=null) { try { const r=localStorage.getItem(P+k); return r!==null ? JSON.parse(r) : fb; } catch(_){ return fb; } },
  remove(k) { try { localStorage.removeItem(P+k); } catch(_){} },
  saveProfile(p,t,d) { this.save('p_'+p+'_'+t, d); },
  loadProfile(p,t,fb=null) { return this.load('p_'+p+'_'+t, fb); },
  getCurrentProfile() { return this.load('current_profile',''); },
  setCurrentProfile(n) { this.save('current_profile', n); },
  getTheme() { return this.load('theme','light'); },
  setTheme(t) { this.save('theme', t); },
};
