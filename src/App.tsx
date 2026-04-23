import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ChevronRight, ChevronLeft, RefreshCw, Search, Filter, CheckCircle2, Settings, X, Trash2, Plus, Minus, Menu, LogIn, LogOut, ShoppingCart } from 'lucide-react';
import { products, Product } from './data/products';
import { quizQuestions, Question } from './data/quiz';
import { auth, loginWithGoogle } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { saveBrandConfig, subscribeToBrandConfig, BrandConfig } from './services/configService';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';

const TulipIcon = ({ className }: { className?: string }) => (
  <img 
    src="https://images.unsplash.com/photo-1588613254750-cf5d69066667?q=80&w=200&auto=format&fit=crop" 
    alt="Tulip Icon" 
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
  />
);

const Logo = ({ icon, className }: { icon?: string, className?: string }) => {
  if (icon) {
    return <img src={icon} alt="Logo" className={`${className} object-contain`} referrerPolicy="no-referrer" />;
  }
  return <TulipIcon className={className} />;
};

type View = 'landing' | 'quiz' | 'results' | 'catalog' | 'about';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCart, setShowCart] = useState(false);
  
  // Brand Settings
  const [brandName, setBrandName] = useState(() => localStorage.getItem('brandName') || 'FLORAVIE');
  const [brandIcon, setBrandIcon] = useState(() => localStorage.getItem('brandIcon') || '');
  const [brandBg, setBrandBg] = useState(() => localStorage.getItem('brandBg') || '');
  const [brandSlogan, setBrandSlogan] = useState(() => localStorage.getItem('brandSlogan') || 'Cuidados para a vida');
  const [brandDescription, setBrandDescription] = useState(() => localStorage.getItem('brandDescription') || 'Uma marca destinada a adolescentes e pessoas com a pele madura. Descubra os produtos ideais para o seu momento através da nossa consultoria.');
  const [aboutTitle, setAboutTitle] = useState(() => localStorage.getItem('aboutTitle') || 'Quem Somos');
  const [aboutText1, setAboutText1] = useState(() => localStorage.getItem('aboutText1') || 'A FLORAVIE é uma Empresa Simulada da Escola do Sebrae. Nascemos do desejo de unir educação empreendedora com a paixão pelo cuidado pessoal.');
  const [aboutText2, setAboutText2] = useState(() => localStorage.getItem('aboutText2') || 'Embora nossos produtos sejam simulados para fins educacionais, nosso compromisso com a excelência e o aprendizado é real.');
  const [aboutImg1, setAboutImg1] = useState(() => localStorage.getItem('aboutImg1') || '');
  const [aboutImg2, setAboutImg2] = useState(() => localStorage.getItem('aboutImg2') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const ADMIN_EMAIL = "gabriela10840@edu.sebrae.com.br";
  const isEditor = user?.email === ADMIN_EMAIL;

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Load Brand Config from Firestore
  useEffect(() => {
    let isSubscribed = true;
    const unsubscribe = subscribeToBrandConfig((config) => {
      if (isSubscribed && config) {
        if (config.name) setBrandName(config.name);
        if (config.icon) setBrandIcon(config.icon);
        if (config.bg) setBrandBg(config.bg);
        if (config.slogan) setBrandSlogan(config.slogan);
        if (config.description) setBrandDescription(config.description);
        if (config.aboutTitle) setAboutTitle(config.aboutTitle);
        if (config.aboutText1) setAboutText1(config.aboutText1);
        if (config.aboutText2) setAboutText2(config.aboutText2);
        if (config.aboutImg1) setAboutImg1(config.aboutImg1);
        if (config.aboutImg2) setAboutImg2(config.aboutImg2);
      }
      setIsLoading(false);
    });
    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, []);

  const handleSaveSettings = async () => {
    if (!isEditor) {
      alert("Você precisa estar logada como administradora para salvar essas alterações permanentemente.");
      return;
    }

    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) saveBtn.innerText = "Salvando...";

    try {
      await saveBrandConfig({
        name: brandName,
        icon: brandIcon,
        bg: brandBg,
        slogan: brandSlogan,
        description: brandDescription,
        aboutTitle: aboutTitle,
        aboutText1: aboutText1,
        aboutText2: aboutText2,
        aboutImg1: aboutImg1,
        aboutImg2: aboutImg2
      });
      setShowSettings(false);
      alert("Configurações salvas com sucesso na nuvem! Agora elas estarão disponíveis em todos os dispositivos.");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar no banco de dados. Tente usar imagens menores ou verifique sua conexão.");
    } finally {
      if (saveBtn) saveBtn.innerText = "Salvar na Nuvem";
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      alert("Erro ao fazer login.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    localStorage.setItem('brandName', brandName);
    localStorage.setItem('brandIcon', brandIcon);
    localStorage.setItem('brandBg', brandBg);
    localStorage.setItem('brandSlogan', brandSlogan);
    localStorage.setItem('brandDescription', brandDescription);
    localStorage.setItem('aboutTitle', aboutTitle);
    localStorage.setItem('aboutText1', aboutText1);
    localStorage.setItem('aboutText2', aboutText2);
    localStorage.setItem('aboutImg1', aboutImg1);
    localStorage.setItem('aboutImg2', aboutImg2);
  }, [brandName, brandIcon, brandBg, brandSlogan, brandDescription, aboutTitle, aboutText1, aboutText2, aboutImg1, aboutImg2]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setShowCart(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for localStorage
        alert('A imagem é muito grande. Por favor, escolha uma imagem menor que 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category)));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const recommendations = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;

    const age = answers.age as string;
    const skinType = answers.skinType as string;
    const concern = answers.concerns as string;
    const goal = answers.goal as string;

    const findProduct = (id: string) => products.find(p => p.id === id)!;

    const items: { product: Product; explanation: string }[] = [];

    // 1. Limpeza
    if (concern === 'limpeza' || skinType === 'oleosa') {
      items.push({ 
        product: findProduct("13"), 
        explanation: "Ideal para remover profundamente as impurezas e o excesso de oleosidade sem ressecar." 
      });
    } else {
      items.push({ 
        product: findProduct("2"), 
        explanation: "Uma limpeza suave e equilibrada, perfeita para manter a hidratação natural da sua pele." 
      });
    }

    // 2. Tônico
    if (concern === 'sensivel' || concern === 'hidratacao' || age === 'madura') {
      items.push({ 
        product: findProduct("9"), 
        explanation: "Tônico nutritivo que ajuda a acalmar e preparar sua pele, devolvendo o viço natural." 
      });
    }

    // 3. Tratamento Principal (Baseado na Preocupação)
    if (concern === 'uniformizar') {
      items.push({ 
        product: findProduct("3"), 
        explanation: "Sérum com Vitamina C potente para iluminar sua pele e uniformizar o tom de forma eficaz." 
      });
    } else if (concern === 'oleosidade') {
      items.push({ 
        product: findProduct("6"), 
        explanation: "Controle preciso da oleosidade e redução da aparência dos poros com Niacinamida." 
      });
      items.push({ 
        product: findProduct("10"), 
        explanation: "Discos de tratamento práticos para combater a acne e manter os poros limpos." 
      });
    } else if (concern === 'antissinais') {
      items.push({ 
        product: findProduct("14"), 
        explanation: "Fatores de crescimento avançados para firmar a pele e combater sinais de envelhecimento." 
      });
    } else if (concern === 'sensivel') {
      items.push({ 
        product: findProduct("4"), 
        explanation: "Tratamento extremamente calmante para reduzir irritações e confortar a pele sensível." 
      });
    } else if (concern === 'hidratacao') {
      items.push({ 
        product: findProduct("15"), 
        explanation: "Óleo de Marula para uma reparação intensa e hidratação profunda que sua pele precisa." 
      });
    }

    // 4. Hidratação e Regeneração
    if (age === 'madura') {
      items.push({ 
        product: findProduct("8"), 
        explanation: "Creme com PDRN e Colágeno focado na regeneração e firmeza da pele madura." 
      });
    } else if (skinType === 'seca') {
      items.push({ 
        product: findProduct("1"), 
        explanation: "Hidratante rico em peptídeos para restaurar a elasticidade e manter a pele macia." 
      });
    } else {
      items.push({ 
        product: findProduct("11"), 
        explanation: "Sérum leve que proporciona luminosidade e hidratação sem pesar na pele." 
      });
    }

    // 5. Proteção (Essencial)
    items.push({ 
      product: findProduct("12"), 
      explanation: "Proteção solar indispensável para prevenir manchas e o envelhecimento precoce." 
    });

    // 6. Extras
    if (skinType === 'seca' || concern === 'hidratacao') {
      items.push({ 
        product: findProduct("7"), 
        explanation: "Cuidado especial para os lábios, mantendo-os hidratados e nutridos." 
      });
    }

    if (goal === 'kit') {
      items.push({ 
        product: findProduct("16"), 
        explanation: "A melhor forma de experimentar nossa rotina completa em tamanhos práticos." 
      });
    }

    return items;
  }, [answers]);

  const handleAnswer = (questionId: string, value: string, multiple?: boolean) => {
    if (multiple) {
      setAnswers(prev => {
        const current = (prev[questionId] as string[]) || [];
        const next = current.includes(value) 
          ? current.filter(v => v !== value) 
          : [...current, value];
        return { ...prev, [questionId]: next };
      });
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setView('results');
      }
    }
  };

  const nextStep = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setView('results');
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setView('quiz');
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswered = currentQuestion.multiple 
    ? (answers[currentQuestion.id] as string[])?.length > 0
    : !!answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-bg text-text-primary font-sans selection:bg-accent/10 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-[60px] md:py-8 flex justify-between items-center">
        <div 
          className="cursor-pointer flex items-center" 
          onClick={() => setView('landing')}
        >
          <Logo icon={brandIcon} className="text-accent w-10 h-10 md:w-12 md:h-12" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold font-opensauce text-text-secondary">
          <button 
            onClick={() => setView('catalog')}
            className={`hover:text-accent transition-colors ${view === 'catalog' ? 'text-accent' : ''}`}
          >
            Catálogo
          </button>
          <button 
            onClick={() => setView('about')}
            className={`hover:text-accent transition-colors ${view === 'about' ? 'text-accent' : ''}`}
          >
            Quem somos
          </button>
          <button 
            onClick={() => setView('landing')}
            className={`hover:text-accent transition-colors ${view === 'landing' ? 'text-accent' : ''}`}
          >
            Início
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-accent/10 rounded-full transition-colors text-accent"
              title="Ver Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-bg">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-accent/10 rounded-full transition-colors text-accent"
              title="Configurações da Marca"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-2 text-accent"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-accent text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-bg">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-accent"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white w-[80%] max-w-sm h-full shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-border flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Logo icon={brandIcon} className="w-8 h-8 text-accent" />
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-bg rounded-full transition-colors">
                    <X className="w-6 h-6 text-text-secondary" />
                  </button>
                </div>

                <div className="flex-grow py-8 px-6 space-y-6">
                  <button 
                    onClick={() => { setView('landing'); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left py-4 text-lg font-bold font-opensauce uppercase tracking-wider border-b border-border/50 ${view === 'landing' ? 'text-accent' : 'text-text-secondary'}`}
                  >
                    Início
                  </button>
                  <button 
                    onClick={() => { setView('about'); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left py-4 text-lg font-bold font-opensauce uppercase tracking-wider border-b border-border/50 ${view === 'about' ? 'text-accent' : 'text-text-secondary'}`}
                  >
                    Quem somos
                  </button>
                  <button 
                    onClick={() => { setView('catalog'); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left py-4 text-lg font-bold font-opensauce uppercase tracking-wider border-b border-border/50 ${view === 'catalog' ? 'text-accent' : 'text-text-secondary'}`}
                  >
                    Catálogo
                  </button>
                </div>

                <div className="p-6 border-t border-border bg-bg/30 space-y-4">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {user.photoURL && <img src={user.photoURL} alt="User" className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />}
                        <span className="text-[10px] font-bold text-text-secondary truncate max-w-[150px]">{user.email}</span>
                      </div>
                      <button onClick={handleLogout} className="text-accent">
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={handleLogin}
                      className="flex items-center gap-2 text-accent font-bold font-opensauce text-[10px] uppercase tracking-widest"
                    >
                      <LogIn className="w-4 h-4" />
                      Login Administrador
                    </button>
                  )}
                  <button 
                    onClick={() => { setShowSettings(true); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-text-secondary font-bold font-opensauce text-xs uppercase tracking-widest"
                  >
                    <Settings className="w-4 h-4" />
                    Configurações
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6 md:px-[60px] md:py-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center gap-10 py-20 px-4 rounded-[40px] overflow-hidden"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={brandBg || "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2000&auto=format&fit=crop"} 
                  alt="Background" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-bg/60 backdrop-blur-[2px]" />
              </div>

              <div className="relative z-10 space-y-4 max-w-3xl">
                <span className="text-[11px] font-opensauce text-accent font-bold">
                  {brandSlogan}
                </span>
                <h1 className="text-4xl md:text-7xl font-playful text-accent leading-tight uppercase">
                  Beleza real para todas as fases.
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
                  {brandDescription}
                </p>
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setView('quiz')}
                  className="bg-accent text-white px-10 py-4 rounded-full text-[11px] font-bold font-opensauce hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                >
                  Fazer Consultoria
                </button>
                <button 
                  onClick={() => setView('catalog')}
                  className="bg-white border border-border text-text-secondary px-10 py-4 rounded-full text-[11px] font-bold font-opensauce hover:border-accent hover:text-accent transition-all"
                >
                  Ver Catálogo
                </button>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-[900px] grid grid-cols-1 md:grid-cols-[1fr_350px] gap-10 md:gap-[80px]"
            >
              <section className="flex flex-col gap-8">
                <div>
                  <span className="text-[11px] font-opensauce text-text-secondary font-bold">Passo {currentQuestionIndex + 1} de {quizQuestions.length}</span>
                  <h1 className="text-4xl font-playful text-accent mt-2 uppercase">{currentQuestion.text}</h1>
                </div>

                <div className="flex flex-col gap-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.multiple 
                      ? (answers[currentQuestion.id] as string[])?.includes(option.value)
                      : answers[currentQuestion.id] === option.value;

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.multiple)}
                        className={`p-6 text-left bg-white border rounded-2xl transition-all flex justify-between items-center group ${isSelected ? 'border-accent shadow-md' : 'border-border hover:border-accent hover:shadow-sm'}`}
                      >
                        <span className={`text-lg font-medium ${isSelected ? 'text-accent' : 'text-text-primary'}`}>{option.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 relative flex items-center justify-center transition-colors ${isSelected ? 'border-accent' : 'border-border group-hover:border-accent'}`}>
                          <div className={`w-2.5 h-2.5 rounded-full bg-accent transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  {currentQuestionIndex > 0 && (
                    <button 
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="bg-white border border-border text-text-secondary px-8 py-4 rounded-full text-[11px] font-bold font-opensauce hover:border-accent hover:text-accent transition-all"
                    >
                      Voltar
                    </button>
                  )}
                  {currentQuestion.multiple && (
                    <button 
                      onClick={nextStep}
                      disabled={!isAnswered}
                      className={`px-10 py-4 rounded-full text-[11px] font-bold font-opensauce transition-all ${isAnswered ? 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                    >
                      Continuar
                    </button>
                  )}
                </div>
              </section>

              <aside className="border-t md:border-t-0 md:border-l border-border pt-10 md:pt-0 md:pl-10 flex flex-col gap-8">
                <div className="summary-section">
                  <div className="text-[12px] font-opensauce font-bold text-accent mb-6">Seu Perfil</div>
                  {quizQuestions.map((q) => {
                    const answer = answers[q.id];
                    let displayValue = 'Ainda não definido';
                    
                    if (answer) {
                      if (Array.isArray(answer)) {
                        displayValue = answer.map(val => q.options.find(o => o.value === val)?.label).join(', ');
                      } else {
                        displayValue = q.options.find(o => o.value === answer)?.label || 'Ainda não definido';
                      }
                    }

                    return (
                      <div key={q.id} className="mb-6">
                        <span className="text-[10px] text-text-secondary font-bold font-opensauce block mb-1">{q.text}</span>
                        <span className="text-base font-medium">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-accent/5 p-6 rounded-3xl text-sm leading-relaxed text-text-secondary border border-accent/10">
                  <strong className="text-accent block mb-2 font-opensauce text-[11px]">Por que perguntamos isso?</strong>
                  Entender sua fase de vida e preocupações nos ajuda a selecionar ingredientes que respeitam a sensibilidade da sua pele e entregam resultados reais.
                </div>
              </aside>
            </motion.div>
          )}

          {view === 'results' && recommendations && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-16"
            >
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-opensauce text-accent font-bold">Consultoria Especialista</span>
                  <h2 className="text-3xl md:text-5xl font-playful text-accent uppercase">Seus Produtos Ideais</h2>
                  <p className="text-text-secondary max-w-xl mx-auto">
                    Com base no seu perfil, selecionamos os produtos que trarão os melhores resultados para sua pele hoje.
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                  {quizQuestions.map(q => {
                    const answer = answers[q.id];
                    if (!answer) return null;
                    const labels = Array.isArray(answer) 
                      ? answer.map(val => q.options.find(o => o.value === val)?.label).join(', ')
                      : q.options.find(o => o.value === answer)?.label;
                    
                    return (
                      <div key={q.id} className="bg-accent/5 border border-accent/10 px-4 py-2 rounded-full flex flex-col items-center">
                        <span className="text-[8px] font-bold font-opensauce text-text-secondary uppercase">{q.text.split('?')[0]}</span>
                        <span className="text-[11px] font-medium text-accent">{labels}</span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={resetQuiz}
                  className="text-[11px] font-bold font-opensauce text-text-primary flex items-center gap-2 mx-auto hover:text-accent transition-colors pt-4"
                >
                  <RefreshCw className="w-4 h-4" /> Refazer Consultoria
                </button>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  {recommendations.map((item, idx) => (
                    <RecommendationItem 
                      key={idx} 
                      item={item} 
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center pt-10 border-t border-border">
                <button 
                  onClick={() => setView('catalog')}
                  className="bg-accent text-white px-10 py-4 rounded-full text-[11px] font-bold font-opensauce hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                >
                  Ver Todos os Produtos no Catálogo
                </button>
              </div>
            </motion.div>
          )}

          {view === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h2 className="text-3xl md:text-5xl font-playful text-accent uppercase">Catálogo</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text"
                      placeholder="BUSCAR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-6 py-3 bg-white border border-border rounded-full text-[10px] font-bold font-opensauce focus:outline-none focus:border-accent w-full sm:w-64"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-6 py-3 rounded-full text-[10px] font-bold font-opensauce transition-all ${!selectedCategory ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}
                    >
                      Todos
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-3 rounded-full text-[10px] font-bold font-opensauce whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-white border border-border text-text-secondary hover:border-accent'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard 
                      product={product} 
                      onSelect={setSelectedProductForModal}
                      onAddToCart={addToCart}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-4xl mx-auto space-y-12 py-10"
            >
              <div className="text-center space-y-4">
                <span className="text-[11px] font-opensauce text-accent font-bold uppercase tracking-widest">Nossa História</span>
                <h2 className="text-4xl md:text-6xl font-playful text-accent uppercase">{aboutTitle}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="grid grid-cols-1 gap-6">
                  <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
                    <img 
                      src={aboutImg1 || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Equipe 1" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
                  </div>
                  <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl">
                    <img 
                      src={aboutImg2 || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop"} 
                      alt="Equipe 2" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-playful text-accent uppercase">Beleza com Propósito</h3>
                    <p className="text-text-secondary leading-relaxed text-lg">
                      {aboutText1}
                    </p>
                    <p className="text-text-secondary leading-relaxed text-lg">
                      {aboutText2}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-border rounded-3xl space-y-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold font-opensauce text-[11px] uppercase text-accent">Pele Jovem</h4>
                      <p className="text-xs text-text-secondary">Fórmulas leves e eficazes para as primeiras rotinas de cuidado.</p>
                    </div>
                    <div className="p-6 bg-white border border-border rounded-3xl space-y-2">
                      <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold font-opensauce text-[11px] uppercase text-accent">Pele Madura</h4>
                      <p className="text-xs text-text-secondary">Nutrição profunda e ativos potentes para todas as fases da vida.</p>
                    </div>
                  </div>

                  <div className="p-8 bg-accent text-white rounded-[32px] shadow-xl shadow-accent/20">
                    <p className="font-medium italic text-lg leading-relaxed text-center">
                      "Produtos de qualidade, pensados para respeitar a individualidade de cada pele, desde a juventude até a maturidade."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Details Modal */}
        <AnimatePresence>
          {selectedProductForModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedProductForModal(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedProductForModal(null)}
                  className="absolute top-6 right-6 z-20 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full transition-colors shadow-sm"
                >
                  <X className="w-6 h-6 text-text-secondary" />
                </button>

                <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto">
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-bg/30 relative">
                    <img 
                      src={selectedProductForModal.imageUrl} 
                      alt={selectedProductForModal.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 px-4 py-2 rounded-full text-[10px] font-bold font-opensauce text-accent border border-accent/10 shadow-sm uppercase">
                        {selectedProductForModal.category}
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col space-y-6">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold font-opensauce text-text-secondary uppercase tracking-widest">{selectedProductForModal.brand}</span>
                      <h3 className="text-3xl md:text-4xl font-playful text-accent leading-tight uppercase">{selectedProductForModal.name}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h4 className="text-[10px] font-bold font-opensauce text-text-secondary uppercase tracking-wider">Sobre o Produto</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {selectedProductForModal.purpose}
                        </p>
                      </div>

                      <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 space-y-2">
                        <div className="flex items-center gap-2 text-accent">
                          <CheckCircle2 className="w-4 h-4" />
                          <h4 className="text-[10px] font-bold font-opensauce uppercase tracking-wider">Tratamento Recomendado</h4>
                        </div>
                        <p className="text-sm text-accent font-medium leading-relaxed italic">
                          "{selectedProductForModal.treatment}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Preço</span>
                        <span className="text-2xl font-bold text-accent">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedProductForModal.price)}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            addToCart(selectedProductForModal);
                            setSelectedProductForModal(null);
                          }}
                          className="bg-accent text-white px-8 py-4 rounded-full text-[11px] font-bold font-opensauce hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-playful text-accent uppercase">Configurações</h2>
                <div className="flex items-center gap-2">
                  {!user ? (
                    <button 
                      onClick={handleLogin}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-[9px] font-bold font-opensauce uppercase transition-all hover:bg-accent hover:text-white"
                    >
                      <LogIn className="w-3.5 h-3.5" /> Login
                    </button>
                  ) : (
                    <button 
                      onClick={handleLogout}
                      className="p-2 hover:bg-bg rounded-full transition-colors text-text-secondary"
                      title="Sair"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-bg rounded-full transition-colors">
                    <X className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                  <p className="text-[10px] font-bold font-opensauce text-accent uppercase text-center">
                    {isEditor ? "Modo Administrador Ativo" : "Faça login para editar as imagens"}
                  </p>
                </div>

                {isEditor && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Ícone da Marca</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center overflow-hidden">
                          <Logo icon={brandIcon} className="w-10 h-10 text-accent" />
                        </div>
                        <label className="flex-grow">
                          <div className="w-full p-4 bg-bg border border-border rounded-2xl cursor-pointer hover:border-accent transition-colors text-center text-[10px] font-bold font-opensauce text-text-secondary uppercase">
                            Escolher da Galeria
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, setBrandIcon)}
                            className="hidden"
                          />
                        </label>
                        {brandIcon && (
                          <button 
                            onClick={() => setBrandIcon('')}
                            className="p-4 bg-bg border border-border rounded-2xl text-accent hover:border-accent transition-colors"
                            title="Remover Ícone"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Fundo da Página Inicial</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center overflow-hidden">
                          <img 
                            src={brandBg || "https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=200&auto=format&fit=crop"} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <label className="flex-grow">
                          <div className="w-full p-4 bg-bg border border-border rounded-2xl cursor-pointer hover:border-accent transition-colors text-center text-[10px] font-bold font-opensauce text-text-secondary uppercase">
                            Escolher da Galeria
                          </div>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileUpload(e, setBrandBg)}
                            className="hidden"
                          />
                        </label>
                        {brandBg && (
                          <button 
                            onClick={() => setBrandBg('')}
                            className="p-4 bg-bg border border-border rounded-2xl text-accent hover:border-accent transition-colors"
                            title="Remover Fundo"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Fotos "Quem Somos" (2 Blocos)</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="aspect-video rounded-xl bg-bg border border-border overflow-hidden">
                            <img src={aboutImg1 || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <label className="block">
                            <div className="w-full py-2 bg-bg border border-border rounded-xl cursor-pointer hover:border-accent transition-colors text-center text-[9px] font-bold font-opensauce text-text-secondary uppercase">
                              Bloco 1
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAboutImg1)} className="hidden" />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <div className="aspect-video rounded-xl bg-bg border border-border overflow-hidden">
                            <img src={aboutImg2 || "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <label className="block">
                            <div className="w-full py-2 bg-bg border border-border rounded-xl cursor-pointer hover:border-accent transition-colors text-center text-[9px] font-bold font-opensauce text-text-secondary uppercase">
                              Bloco 2
                            </div>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAboutImg2)} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Nome da Marca (Logo)</label>
                  <input 
                    type="text" 
                    value={brandName} 
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent font-playful text-2xl text-accent uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Slogan (Topo)</label>
                  <input 
                    type="text" 
                    value={brandSlogan} 
                    onChange={(e) => setBrandSlogan(e.target.value)}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Descrição (Início)</label>
                  <textarea 
                    value={brandDescription} 
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={4}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent text-sm resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Título (Quem Somos)</label>
                  <input 
                    type="text" 
                    value={aboutTitle} 
                    onChange={(e) => setAboutTitle(e.target.value)}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Texto Bloco 1 (Quem Somos)</label>
                  <textarea 
                    value={aboutText1} 
                    onChange={(e) => setAboutText1(e.target.value)}
                    rows={3}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent text-sm resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Texto Bloco 2 (Quem Somos)</label>
                  <textarea 
                    value={aboutText2} 
                    onChange={(e) => setAboutText2(e.target.value)}
                    rows={3}
                    className="w-full p-4 bg-bg border border-border rounded-2xl focus:outline-none focus:border-accent text-sm resize-none"
                  />
                </div>
                <button 
                  id="save-settings-btn"
                  onClick={handleSaveSettings}
                  className={`w-full py-4 rounded-full font-bold font-opensauce text-[11px] transition-all ${isEditor ? 'bg-accent text-white hover:bg-accent-hover' : 'bg-border text-text-secondary cursor-not-allowed'}`}
                >
                  {isEditor ? 'Salvar na Nuvem' : 'Somente Leitura'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-border flex justify-between items-center bg-bg/20">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-accent" />
                  <h2 className="text-2xl font-playful text-accent uppercase">Meu Carrinho</h2>
                  {cartCount > 0 && (
                    <span className="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-bg rounded-full transition-colors">
                  <X className="w-6 h-6 text-text-secondary" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 bg-bg rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-10 h-10 text-border" />
                    </div>
                    <p className="text-text-secondary font-medium">Seu carrinho está vazio.</p>
                    <button 
                      onClick={() => { setShowCart(false); setView('catalog'); }}
                      className="text-accent font-bold font-opensauce text-[11px] uppercase hover:underline"
                    >
                      Explorar Catálogo
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-bold text-text-primary uppercase leading-tight">{item.product.name}</h4>
                            <p className="text-[10px] text-text-secondary uppercase">{item.product.brand}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-text-secondary hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-lg scale-90 -ml-2">
                            <button 
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="px-2 py-1 hover:bg-bg transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="px-2 py-1 hover:bg-bg transition-colors border-l border-border"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-bold text-accent text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-border bg-bg/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold font-opensauce text-text-secondary uppercase">Subtotal</span>
                    <span className="text-xl font-bold text-accent">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      const url = `https://www.instagram.com/floravie.skin/`;
                      window.open(url, '_blank');
                    }}
                    className="w-full bg-accent text-white py-4 rounded-full font-bold font-opensauce text-[11px] uppercase tracking-widest hover:bg-accent-hover transition-all flex items-center justify-center gap-2"
                  >
                    Finalizar no Instagram
                  </button>
                  <p className="text-[8px] text-center text-text-secondary uppercase">você será encaminhado ao nosso instagram para finalizarmos sua experiência Floravie.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="px-4 py-8 md:px-[60px] md:py-10 text-[10px] font-bold font-opensauce text-text-secondary border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <span>&copy; 2026 {brandName}. Todos os direitos reservados.</span>
          <Logo icon={brandIcon} className="text-accent w-5 h-5" />
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
          <a href="#" className="hover:text-accent transition-colors">Termos</a>
        </div>
      </footer>
    </div>
  );
}

interface RecommendationItemProps {
  item: { product: Product; explanation: string };
  onAddToCart: (product: Product) => void;
  key?: string | number;
}

function RecommendationItem({ item, onAddToCart }: RecommendationItemProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start group bg-white p-6 md:p-8 rounded-[32px] border border-border hover:border-accent transition-all">
      <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden border border-border bg-bg/30">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="flex-grow space-y-4 text-center md:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-bold font-opensauce text-accent uppercase tracking-wider">{item.product.category}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="text-[10px] font-bold font-opensauce text-text-secondary uppercase tracking-wider">{item.product.brand}</span>
          </div>
          <h4 className="text-2xl font-playful text-accent uppercase">{item.product.name}</h4>
        </div>
        
        <div className="space-y-3">
          <p className="text-base text-text-secondary leading-relaxed italic">
            {item.explanation}
          </p>
          
          <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 space-y-1">
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle2 className="w-3 h-3" />
              <h4 className="text-[9px] font-bold font-opensauce uppercase tracking-wider">Tratamento Recomendado</h4>
            </div>
            <p className="text-sm text-accent font-medium leading-relaxed">
              {item.product.treatment}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-bold font-opensauce text-accent">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
          </span>
          <button 
            onClick={() => onAddToCart(item.product)}
            className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-full text-[10px] font-bold font-opensauce hover:bg-accent-hover transition-all shadow-md shadow-accent/10 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => onSelect(product)}
      className="group bg-white border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col h-full cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-bg/30">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 px-3 py-1 rounded-full text-[9px] font-bold font-opensauce text-accent border border-accent/10">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold font-opensauce text-text-secondary">{product.brand}</span>
          <h3 className="text-xl font-playful leading-tight text-text-primary group-hover:text-accent transition-colors uppercase">{product.name}</h3>
        </div>
        
        <div className="space-y-2 flex-grow">
          <p className="text-sm text-text-secondary leading-relaxed">
            {product.purpose}.
          </p>
        </div>

        <div className="pt-6 border-t border-border flex items-center justify-between">
          <span className="text-lg font-bold text-accent">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="p-3 bg-accent/5 text-accent hover:bg-accent hover:text-white rounded-full transition-all"
            title="Adicionar ao Carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

