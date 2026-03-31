import React from 'react';

export default function ControlToolbar({ searchTerm, setSearchTerm, onImport, onExport, onAdd, onClear, onDownloadTemplate }) {
  return (
    <div className="px-6 py-3 flex flex-wrap items-center justify-between bg-white border-b border-slate-100 gap-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
            placeholder="Filtrar por nombre, cédula..." 
          />
        </div>
        
        <button 
          onClick={onImport}
          className="px-4 py-2 border border-primary/10 text-primary bg-primary/5 rounded-xl text-[11px] font-black flex items-center gap-2 hover:bg-primary/10 transition-all active:scale-95 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-black">cloud_upload</span>
          Importar MDT
        </button>
        
        <button 
          onClick={onDownloadTemplate}
          className="px-4 py-2 text-slate-400 rounded-xl text-[10px] font-black tracking-widest hover:bg-slate-50 transition-all uppercase"
        >
          Plantilla CSV
        </button>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <button 
          onClick={onAdd}
          className="px-5 py-2 bg-primary text-white text-[11px] font-black rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-black">person_add</span>
          Nuevo Empleado
        </button>
        
        <button 
          onClick={onExport}
          className="px-5 py-2 border border-slate-200 text-slate-600 text-[11px] font-black rounded-xl flex items-center gap-2 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-black">file_download</span>
          Exportar
        </button>
        
        <button 
          onClick={onClear}
          className="px-4 py-2 text-red-500 text-[11px] font-black rounded-xl flex items-center gap-2 hover:bg-red-50 transition-all active:scale-95 uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-sm font-black">delete_sweep</span>
          Limpiar
        </button>
      </div>
    </div>
  );
}
