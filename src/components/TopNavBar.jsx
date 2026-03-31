import React from 'react';
import { Settings } from 'lucide-react';

export default function TopNavBar({ mode, setMode, fiscalYear, setFiscalYear, onShowFiscalConfig }) {
  return (
    <>
      <div className="bg-slate-100/50 border-b border-slate-200 text-slate-500 py-2 px-6 text-center text-xs font-bold tracking-tight">
        🚀 Modo Beta: SUTil aprende de tu uso para refinar la herramienta. Tu información personal sigue 100% segura y privada.
      </div>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-full mx-auto">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="text-xl font-extrabold tracking-tighter text-primary headline-font hover:opacity-80 transition-opacity cursor-pointer">SUTil</a>
            <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">Beta</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <NavItem 
              active={mode === 'decimo3'} 
              onClick={() => setMode('decimo3')} 
              label="Décimo Tercero" 
            />
            <NavItem 
              active={mode === 'decimo4'} 
              onClick={() => setMode('decimo4')} 
              label="Décimo Cuarto" 
            />
            <NavItem 
              active={mode === 'utilidades'} 
              onClick={() => setMode('utilidades')} 
              label="Utilidades" 
            />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
    </>
  );
}

function NavItem({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`headline-font text-sm transition-all pb-1 border-b-2 ${
        active 
          ? 'text-primary border-primary font-bold' 
          : 'text-on-surface-variant border-transparent hover:text-primary font-semibold'
      }`}
    >
      {label}
    </button>
  );
}
