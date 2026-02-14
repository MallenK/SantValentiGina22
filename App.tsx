
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Stars, Music, Gift, Sparkles, Smile, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from '@google/genai';

// --- Types ---
enum AppState {
  QUESTION = 'QUESTION',
  LOADING = 'LOADING',
  CELEBRATION = 'CELEBRATION'
}

// --- Helper Components ---
const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; duration: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        left: `${Math.random() * 100}%`,
        size: Math.random() * (30 - 15) + 15,
        duration: Math.random() * (8 - 4) + 4,
      };
      setHearts(prev => [...prev.slice(-15), newHeart]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle text-red-400 opacity-40"
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            bottom: '-50px'
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const CelebrationView: React.FC<{ message: string }> = ({ message }) => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-1000">
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-[2.5rem] shadow-2xl border-4 border-pink-200 max-w-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-red-400 to-pink-400"></div>
        
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Heart className="w-16 h-16 md:w-20 md:h-20 text-red-500 fill-red-500 animate-bounce" />
            <PartyPopper className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 absolute -top-4 -right-4 animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-pacifico text-pink-600 mb-6 px-2">
          SÍÍÍ! HO SABIA! 💍❤️
        </h1>

        <div className="text-base md:text-xl text-gray-700 leading-relaxed mb-8 space-y-4">
          <p className="font-semibold italic text-pink-500">"Certificat oficial de la Gina com la millor Sant Valentí de l'univers."</p>
          <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 text-pink-800 italic text-sm md:text-base">
            {message || "Carregant paraules d'amor..."}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-xs md:text-sm font-bold border border-red-100">
            <Music size={14} /> Música per ballar
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs md:text-sm font-bold border border-pink-100">
            <Gift size={14} /> Molts petons
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs md:text-sm font-bold border border-yellow-100">
            <Stars size={14} /> Un futur brillant
          </div>
        </div>
        
        <img 
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnhrdXlydzl0cmY1Nnd2ZW1icGxtdmNyeHJhZHBqbmUxdzlyYmc5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lTQF0ODLLjhza/giphy.gif" 
          alt="Celebració feliç"
          className="rounded-2xl mx-auto shadow-lg w-48 md:w-64"
        />
        
        <p className="mt-8 text-pink-400 font-bold text-sm md:text-base animate-pulse px-4">Prepara't Gina, que aquest Sant Valentí serà llegendari...</p>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [state, setState] = useState<AppState>(AppState.QUESTION);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [noClickCount, setNoClickCount] = useState(0);
  const [aiMessage, setAiMessage] = useState("");
  const noBtnRef = useRef<HTMLButtonElement>(null);
  
  const noPhrases = [
    "No 🥺",
    "Segura? 🤨",
    "Pensa-t'ho bé... 😢",
    "De debò? 😭",
    "Ni ho somniïs! 😤",
    "Ets dolenta... 💔",
    "Soc massa petit! 🤏",
    "Adéu! 💨"
  ];

  const moveNoButton = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.preventDefault();
    
    // Fer el botó més petit cada vegada
    setNoScale(prev => Math.max(prev * 0.8, 0.1));
    setNoClickCount(prev => prev + 1);

    // Moure a una posició aleatòria
    const padding = 100;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    
    const randomX = Math.random() * (maxX - padding) + padding / 2;
    const randomY = Math.random() * (maxY - padding) + padding / 2;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    setNoButtonPos({ 
      x: randomX - centerX, 
      y: randomY - centerY 
    });
  };

  const handleYes = async () => {
    setState(AppState.LOADING);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Escriu un missatge molt curt (màxim 3 frases), graciós i romàntic en CATALÀ per a la meva xicota Gina que acaba d'acceptar ser el meu Sant Valentí. Esmenta que no tenia una altra opció perquè el botó 'No' s'anava fent petit i fugia d'ella perquè és irresistible. Utilitza un to juganer i ple d'amor.",
      });
      setAiMessage(response.text || "Ets la millor, Gina! Sabia que no podries resistir-te als meus encants (i al fet que el botó NO es tornés invisible). T'estimo!");
    } catch (error) {
      console.error("AI Error:", error);
      setAiMessage("Gina, em fas el noi més feliç del món! El destí ja ho tenia escrit (i jo havia encollit el botó No). T'estimo moltíssim!");
    } finally {
      setState(AppState.CELEBRATION);
    }
  };

  const currentNoPhrase = noPhrases[Math.min(noClickCount, noPhrases.length - 1)];

  if (state === AppState.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100 p-6 text-center">
        <FloatingHearts />
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
          <Heart className="absolute inset-0 m-auto text-red-500 fill-red-500 w-8 h-8 animate-pulse" />
        </div>
        <p className="font-pacifico text-pink-700 text-2xl animate-pulse px-4">Preparant una cosa màgica per a la Gina...</p>
      </div>
    );
  }

  if (state === AppState.CELEBRATION) {
    return (
      <>
        <FloatingHearts />
        <CelebrationView message={aiMessage} />
      </>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 bg-pink-50 overflow-hidden touch-none">
      <FloatingHearts />
      
      {/* Main Card */}
      <div className="z-10 bg-white/80 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-2 border-pink-200 text-center max-w-md w-full mx-auto transform transition-all duration-500">
        <div className="mb-6 flex justify-center gap-3">
          <Sparkles className="text-yellow-400 animate-pulse" />
          <Heart className="text-red-500 fill-red-500 animate-bounce" size={32} />
          <Smile className="text-pink-400 animate-pulse" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-pacifico text-gray-800 mb-8 leading-tight px-2">
          Gina, vols ser el meu <span className="text-pink-600">Sant Valentí</span>?
        </h2>
        
        <div className="mb-10 pointer-events-none">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpwaWF5c3RmdXRmNnV5cm9waGN1bWpxN2ZpeHR0dnY5eWJmeXN6NCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MeIucaj5qhHMBpXzM6/giphy.gif" 
            alt="Osset bufó" 
            className="w-40 h-40 md:w-56 md:h-56 mx-auto rounded-[2rem] shadow-inner border-4 border-white object-cover"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 relative min-h-[160px] sm:min-h-[100px]">
          {/* YES BUTTON - Creix una mica quan el no s'encongeix */}
          <button
            onClick={handleYes}
            style={{ transform: `scale(${1 + noClickCount * 0.05})` }}
            className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-pink-500 to-red-500 text-white font-black text-2xl rounded-3xl shadow-xl hover:shadow-pink-300 active:scale-90 transition-all z-20"
          >
            SÍ! ❤️
          </button>

          {/* NO BUTTON (Cada cop més petit i canvia de lloc) */}
          <button
            ref={noBtnRef}
            onTouchStart={moveNoButton}
            onMouseDown={moveNoButton}
            style={{
              transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px) scale(${noScale})`,
              position: noButtonPos.x === 0 ? 'relative' : 'fixed',
              left: noButtonPos.x === 0 ? 'auto' : '50%',
              top: noButtonPos.x === 0 ? 'auto' : '50%',
              zIndex: 30,
              opacity: noScale < 0.2 ? 0.3 : 1,
              pointerEvents: noScale < 0.15 ? 'none' : 'auto',
            }}
            className="w-full sm:w-auto px-10 py-4 bg-gray-100 text-gray-400 font-bold text-xl rounded-3xl shadow-md cursor-default transition-all duration-200 ease-out whitespace-nowrap"
          >
            {currentNoPhrase}
          </button>
        </div>
        
        <p className="mt-10 text-xs md:text-sm text-pink-300 font-medium italic opacity-80 px-4">
          * Atenció: El botó 'No' té por de la teva bellesa i s'està fent petit...
        </p>
      </div>

      {/* Decorative text bottom */}
      <div className="mt-12 text-pink-300 font-pacifico text-2xl md:text-3xl opacity-40 select-none text-center px-4">
        Per a la reina del meu cor
      </div>
    </div>
  );
}
