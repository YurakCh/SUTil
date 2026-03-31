import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent({ onAccept }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sutil-maze-opt-in');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === 'true') {
      onAccept();
    }
  }, [onAccept]);

  const handleChoice = (choice) => {
    localStorage.setItem('sutil-maze-opt-in', choice.toString());
    setIsVisible(false);
    if (choice) onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-10 left-10 z-[1000] w-[calc(100%-5rem)] md:w-[340px] animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-12 relative flex flex-col items-center text-center">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-8 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
          <Cookie className="w-7 h-7 text-blue-500" />
        </div>

        <div className="space-y-4 mb-10">
          <h3 className="text-[15px] font-black tracking-[0.2em] text-slate-400 uppercase">
            ¿Nos ayudas a mejorar?
          </h3>
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
            SUTil está aprendiendo para ser mejor. Si aceptas participar habilita las cookies. <span className="text-slate-400">Tu privacidad sigue siendo total y offline.</span>
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => handleChoice(true)}
            className="w-full py-4 bg-blue-500/10 text-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500/20 transition-all active:scale-95"
          >
            Aceptar Cookies
          </button>
          <button 
            onClick={() => handleChoice(false)}
            className="w-full py-2 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  );
}
