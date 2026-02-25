import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Home, 
  Shield, 
  Music, 
  Zap, 
  LayoutDashboard, 
  Bell, 
  Upload, 
  Power, 
  X,
  Lock,
  Check,
  Box,
  ChevronRight
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'bot-archive-v2';

// Mot de passe Panel Admin (SHA-256 de "admin123")
const ADMIN_PASSWORD_HASH = "240be518ebb87208f7188b3a95d0ce8333e330a1306b8258529f7833a6138980";

const App = () => {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [bots, setBots] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Auth initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Data fetching
  useEffect(() => {
    if (!user) return;
    
    const botsRef = collection(db, 'artifacts', appId, 'public', 'data', 'bots');
    const unsubBots = onSnapshot(botsRef, 
      (snapshot) => {
        setBots(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => console.error("Bots fetch error:", error)
    );

    const suggRef = collection(db, 'artifacts', appId, 'public', 'data', 'suggestions');
    const unsubSugg = onSnapshot(suggRef, 
      (snapshot) => {
        setSuggestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => console.error("Suggestions fetch error:", error)
    );

    return () => { unsubBots(); unsubSugg(); };
  }, [user]);

  const handleAdminLogin = async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode(passwordInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashed = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (hashed === ADMIN_PASSWORD_HASH) { 
      setIsAdmin(true); 
      setView('admin-dashboard'); 
    } else {
      setPasswordInput('');
    }
  };

  const getIcon = (cat) => {
    switch(cat) {
      case 'Modération': return <Shield size={24} className="text-black" />;
      case 'Musique': return <Music size={24} className="text-white" />;
      default: return <Zap size={24} className="text-white" />;
    }
  };

  const filteredBots = useMemo(() => {
    return bots.filter(b => {
      const matchSearch = (b.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'Tous' || b.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [bots, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Grid Background Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40" 
           style={{
             backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }}>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-6 md:px-12 bg-black/80 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
          {/* Logo Box as requested */}
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Box className="text-black size-4" fill="currentColor" />
          </div>
          <span className="font-bold tracking-tighter text-xl uppercase">BOT.ARCHIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <button onClick={() => setView('home')} className="hover:text-white transition">Bibliothèque</button>
          <button className="hover:text-white transition">À propos</button>
          <button className="hover:text-white transition">API</button>
        </div>
        <button 
          onClick={() => setView('suggest')}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold transition"
        >
          Soumettre un Bot
        </button>
      </nav>

      <main className="relative z-10 pt-40 pb-40 px-6 max-w-7xl mx-auto">
        
        {view === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="text-center mb-24">
              <span className="inline-block px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                Accès Anticipé v2.0
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-[#adadad] bg-clip-text text-transparent">
                L'archive des <br className="hidden md:block" /> intelligences.
              </h1>
              <p className="max-w-2xl mx-auto text-neutral-400 text-lg md:text-xl font-medium leading-relaxed mb-10">
                Explorez une collection organisée des meilleurs bots et outils IA. 
                Une interface épurée pour une puissance décuplée.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm w-full sm:w-auto hover:bg-[#e5e5e5] transition-all hover:scale-105 active:scale-95">
                  Explorer la liste
                </button>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Rechercher un outil..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-full py-4 pl-12 pr-6 text-sm outline-none focus:border-neutral-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
              {['Tous', 'Modération', 'Utilitaire', 'Musique', 'Divertissement'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-white text-black border-white' : 'text-neutral-400 hover:text-white border-[#1f1f1f]'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Bots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBots.length === 0 ? (
                <div className="col-span-full py-20 text-center text-neutral-500 italic">Aucun bot ne correspond à votre recherche.</div>
              ) : (
                filteredBots.map(bot => (
                  <div key={bot.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 rounded-[2rem] flex flex-col justify-between h-64 hover:border-[#444] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${bot.category === 'Modération' ? 'bg-white' : 'bg-[#111] border border-[#222]'}`}>
                          {getIcon(bot.category)}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded ${bot.category === 'Modération' ? 'bg-blue-500/10 text-blue-500' : 'bg-white/5 text-neutral-400'}`}>
                          {bot.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{bot.name}</h3>
                      <p className="text-neutral-500 text-sm line-clamp-2">{bot.desc}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-[10px] font-bold text-neutral-600">v{bot.version || '1.0.0'}</span>
                      <a href={bot.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center hover:bg-white hover:text-black transition-all">
                        <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {view === 'admin-login' && (
          <div className="max-w-xs mx-auto text-center pt-24 animate-in zoom-in duration-300">
            <div className="bg-[#111] border border-[#222] size-16 mx-auto rounded-2xl flex items-center justify-center mb-8">
              <Lock className="text-neutral-500" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-8 tracking-tighter uppercase">Administration</h2>
            <input 
              type="password" 
              placeholder="Mot de passe"
              className="w-full bg-[#111] border border-[#222] rounded-xl p-4 text-center mb-4 outline-none focus:border-neutral-500 transition"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            <button onClick={handleAdminLogin} className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">Connexion</button>
          </div>
        )}

        {view === 'admin-dashboard' && (
          <div className="animate-in slide-in-from-right duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <LayoutDashboard size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tighter uppercase">Gestion Bots</h2>
              </div>
              <button onClick={() => { setIsAdmin(false); setView('home'); }} className="text-neutral-500 hover:text-red-500 transition-colors">
                <Power size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="bg-[#0a0a0a] border border-[#1f1f1f] p-8 rounded-[2rem]">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Upload size={18} className="text-blue-500" /> Publier un Bot
                </h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const f = new FormData(e.target);
                  await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bots'), {
                    name: f.get('n'), url: f.get('u'), category: f.get('c'), desc: f.get('d'), version: f.get('v') || '1.0.0', createdAt: Date.now()
                  });
                  e.target.reset();
                }} className="space-y-4">
                  <input name="n" placeholder="Nom du bot" className="w-full bg-black border border-[#222] rounded-xl p-4 text-sm outline-none focus:border-blue-500" required />
                  <div className="flex gap-4">
                    <input name="u" placeholder="Lien / URL" className="flex-1 bg-black border border-[#222] rounded-xl p-4 text-sm outline-none focus:border-blue-500" required />
                    <input name="v" placeholder="v1.0.0" className="w-24 bg-black border border-[#222] rounded-xl p-4 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <select name="c" className="w-full bg-black border border-[#222] rounded-xl p-4 text-sm outline-none focus:border-blue-500 appearance-none">
                    <option value="Modération">Modération</option>
                    <option value="Musique">Musique</option>
                    <option value="Utilitaire">Utilitaire</option>
                    <option value="Divertissement">Divertissement</option>
                  </select>
                  <textarea name="d" placeholder="Description courte" className="w-full bg-black border border-[#222] rounded-xl p-4 text-sm outline-none focus:border-blue-500 h-24" required></textarea>
                  <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">Ajouter à l'archive</button>
                </form>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Bell size={18} className="text-blue-500" /> Requêtes Utilisateurs
                </h3>
                <div className="space-y-3">
                  {suggestions.length === 0 ? (
                    <div className="border border-dashed border-[#222] p-12 rounded-[2rem] text-center text-neutral-600 italic text-sm">Aucune requête en attente</div>
                  ) : (
                    suggestions.map(s => (
                      <div key={s.id} className="bg-[#0a0a0a] border border-[#1f1f1f] p-5 rounded-2xl flex justify-between items-center">
                        <div className="max-w-[60%]">
                          <p className="font-bold text-sm truncate">{s.name}</p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">{s.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            const {id, ...rest} = s;
                            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'bots'), {...rest, createdAt: Date.now()});
                            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'suggestions', id));
                          }} className="p-2 bg-white text-black rounded-lg"><Check size={14} /></button>
                          <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'suggestions', s.id))} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><X size={14} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 border-t border-[#1f1f1f] pt-8">
                   <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-widest">Bots Actifs</h3>
                   <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {bots.map(b => (
                        <div key={b.id} className="flex items-center justify-between text-xs py-2 border-b border-[#111]">
                          <span className="font-medium text-neutral-300">{b.name}</span>
                          <button onClick={() => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'bots', b.id))} className="text-neutral-600 hover:text-red-500"><X size={14} /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {view === 'suggest' && (
          <div className="max-w-md mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-4xl font-black mb-8 tracking-tighter text-gradient bg-gradient-to-b from-white to-[#adadad] bg-clip-text text-transparent">Soumettre un projet</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.target);
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'suggestions'), {
                name: f.get('n'), url: f.get('u'), category: f.get('c'), desc: f.get('d'), version: '1.0.0', suggestedAt: Date.now()
              });
              setView('home');
            }} className="space-y-4">
               <input name="n" placeholder="Nom du Bot" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 text-sm outline-none focus:border-neutral-500 transition" required />
               <input name="u" placeholder="Lien (Discord/Web)" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 text-sm outline-none focus:border-neutral-500 transition" required />
               <select name="c" className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 text-sm outline-none focus:border-neutral-500 transition appearance-none">
                <option value="Modération">Modération</option>
                <option value="Musique">Musique</option>
                <option value="Utilitaire">Utilitaire</option>
                <option value="Divertissement">Divertissement</option>
              </select>
               <textarea name="d" placeholder="Brève description..." className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-5 text-sm outline-none focus:border-neutral-500 transition h-32" required></textarea>
               <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setView('home')} className="flex-1 text-xs font-bold text-neutral-500 uppercase">Annuler</button>
                <button type="submit" className="flex-[2] bg-white text-black py-4 rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-transform">Envoyer la requête</button>
               </div>
            </form>
          </div>
        )}
      </main>

      {/* Mobile Bar Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-black/80 backdrop-blur-xl border border-white/5 rounded-2xl z-50 flex items-center justify-around px-2 shadow-2xl">
        <button onClick={() => setView('home')} className={`w-12 h-12 flex items-center justify-center transition ${view === 'home' ? 'text-white' : 'text-neutral-500'}`}>
          <Home size={22} />
        </button>
        <button onClick={() => setView('home')} className="w-12 h-12 flex items-center justify-center text-neutral-500">
          <Search size={22} />
        </button>
        <button 
          onClick={() => {
            if (isAdmin) setView('admin-dashboard');
            else setView('admin-login');
          }} 
          className={`w-12 h-12 flex items-center justify-center transition ${isAdmin || view === 'admin-login' ? 'text-blue-500' : 'text-neutral-500'}`}
        >
          <Plus size={22} />
        </button>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f1f1f; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;

