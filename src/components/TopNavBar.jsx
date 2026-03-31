import React from 'react';
import { Settings } from 'lucide-react';

export default function TopNavBar({ mode, setMode, fiscalYear, setFiscalYear, onShowFiscalConfig }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-full mx-auto">
        <div className="flex items-center gap-10">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-xl font-extrabold tracking-tighter text-primary headline-font hover:opacity-80 transition-opacity cursor-pointer">SUTil</a>
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
