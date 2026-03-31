import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { DEFAULT_FISCAL_DATA } from '../config/fiscal-years';

export default function FiscalConfigModal({ year, currentData, onSave, onCancel }) {
  const [sbu, setSbu] = useState(currentData.sbu || 482);
  const [digno, setDigno] = useState(currentData.digno || 530);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900">Configuración {year}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Valores Legales</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Salario Básico Unificado (SBU)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                value={sbu || 0} 
                onChange={(e) => setSbu(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 border-0 rounded-2xl py-4 pl-8 pr-4 font-black text-lg focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Salario Digno Mensual</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                value={digno || 0} 
                onChange={(e) => setDigno(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 border-0 rounded-2xl py-4 pl-8 pr-4 font-black text-lg focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3">
             <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
             <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
               Estos valores se usarán para los cálculos de Décimo Cuarto y Compensación de Salario Digno. Se guardarán localmente para este ejercicio fiscal.
             </p>
          </div>
        </div>

        <div className="p-8 pt-0 flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave({ sbu, digno })}
            className="flex-1 bg-premium-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
