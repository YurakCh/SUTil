import React, { useState, useEffect } from 'react';
import { X, Save, Calculator } from 'lucide-react';

export default function UtilitiesModal({ currentData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    tipoEmpresa: 'general',
    unificacion: 'No',
    complementarias: 'No',
    participacion15: 0,
    utilidadesSRI: 0,
    impuestoRenta: 0,
    anticipoImpuesto: 0,
    reservaLegal: 0,
    ...currentData
  });

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Automatic calculation of 15% if other fields are changed? 
      // User says: "valor se transforma en un editable" but also shows formulas.
      // Usually participating 15% = (Utilidades SRI - Impuesto Renta - Reserva Legal) * 0.15 ? No, it's simpler in Ecuador.
      // It's usually based on the Income statement.
      return updated;
    });
  };

  const calculateAuto = () => {
    // 15% of net profit before tax/reserve usually? No, it's 15% of liquid earnings.
    // For this tool, we'll allow manual entry as requested, but maybe add a helper.
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Calculadora de Utilidades</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Participación 15% de los Trabajadores</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full transition-all">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* Tipo de Empresa */}
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Seleccione la casilla si su empresa realiza actividades siguientes
            </label>
            <div className="grid gap-3 pl-4">
              {[
                { id: 'general', label: 'Empresas en General o persona natural obligada a llevar Contabilidad' },
                { id: 'hidrocarburos', label: 'Empresas relacionadas con la ejecución de proyectos de exploración y/o explotación de hidrocarburos' },
                { id: 'pequena_mineria', label: 'Pequeña minería' },
                { id: 'mineria_general', label: 'Minería en General e Hidroeléctricas' },
              ].map(opt => (
                <label key={opt.id} className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="radio" 
                      name="tipoEmpresa" 
                      checked={formData.tipoEmpresa === opt.id}
                      onChange={() => handleChange('tipoEmpresa', opt.id)}
                      className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-offset-0"
                    />
                  </div>
                  <span className="text-[13px] text-slate-600 font-medium group-hover:text-primary transition-colors">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Preguntas Si/No */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <YesNoGroup 
              label="¿Su empresa tiene unificación de utilidades mediante Oficio de Autorización o Acuerdo Ministerial?" 
              value={formData.unificacion}
              onChange={(val) => handleChange('unificacion', val)}
            />
            <YesNoGroup 
              label="¿Su empresa tiene empresas complementarias o usuarias?" 
              value={formData.complementarias}
              onChange={(val) => handleChange('complementarias', val)}
            />
          </div>

          <hr className="border-slate-100" />

          {/* Valores SRI */}
          <div className="space-y-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
              <label className="text-[12px] font-black text-primary uppercase tracking-widest mb-3 block">Valor del 15% de participación:</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-bold">$</span>
                <input 
                  type="number" 
                  step="0.001"
                  value={formData.participacion15 || ''} 
                  onChange={(e) => handleChange('participacion15', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-white border-2 border-primary/20 rounded-xl py-3 pl-8 pr-4 font-black text-xl text-primary focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 italic">(Llene con la mayor cantidad de decimales) (formulario 101 y 102 de la declaración del impuesto a la renta del SRI)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SRIInput 
                label="Utilidades SRI" 
                value={formData.utilidadesSRI} 
                onChange={(v) => handleChange('utilidadesSRI', v)} 
                desc="(Formulario 101 y 102 de Declaración de Impuesto a la Renta)"
              />
              <SRIInput 
                label="Impuesto a la Renta" 
                value={formData.impuestoRenta} 
                onChange={(v) => handleChange('impuestoRenta', v)} 
                desc="(Verificar el Formulario 101 y 102 de la Declaración de Impuesto a la Renta)"
              />
              <SRIInput 
                label="Anticipo Impuesto a la Renta" 
                value={formData.anticipoImpuesto} 
                onChange={(v) => handleChange('anticipoImpuesto', v)} 
                desc="(Verificar el Formulario 101 y 102 de la Declaración de Impuesto a la Renta)"
              />
              <SRIInput 
                label="Reserva Legal" 
                value={formData.reservaLegal} 
                onChange={(v) => handleChange('reservaLegal', v)} 
                desc="(ejemplo: 1000.555)"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-slate-900 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            Aplicar Cálculos
          </button>
        </div>
      </div>
    </div>
  );
}

function YesNoGroup({ label, value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-[11px] font-bold text-slate-600 leading-tight block">{label}</label>
      <div className="flex gap-6">
        {['Si', 'No'].map(opt => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="w-4 h-4 text-primary border-slate-300 focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-xs font-bold text-slate-500 group-hover:text-primary transition-colors">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function SRIInput({ label, value, onChange, desc }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight block">{label}:</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
        <input 
          type="number" 
          step="0.001"
          value={value || ''} 
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 font-bold text-sm text-slate-700 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-300"
        />
      </div>
      <p className="text-[9px] text-slate-400 leading-tight italic">{desc}</p>
    </div>
  );
}
