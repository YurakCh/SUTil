import React from 'react';

function SummaryRow({ label, value, primary }) {
  return (
    <div className="flex justify-between text-[11px] transition-all hover:bg-slate-50 p-1 rounded">
      <span className="text-slate-600">{label}</span>
      <span className={`font-bold ${primary ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
    </div>
  );
}

export default function Sidebar({ employees, mode }) {
  const totalCargas = employees.reduce((sum, e) => sum + (parseInt(e.cargas) || 0), 0);
  const sinCargas = employees.filter(e => (parseInt(e.cargas) || 0) === 0).length;
  
  return (
    <aside className="w-80 space-y-4 hidden xl:block shrink-0">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h3 className="headline-font text-[10px] font-bold text-primary uppercase tracking-widest">Asistente SUTil</h3>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Para el cálculo 2024, valide las cargas familiares antes del <span className="font-bold text-primary">31 de marzo</span>. Los datos importados del MDT deben coincidir con su declaración ISV.
          </p>
          <div className="p-3 bg-slate-50 border border-slate-100 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-xs">event_note</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Próximo Hito</span>
            </div>
            <p className="text-[11px] font-bold text-on-surface">Cierre ISV: 15 de Abril</p>
          </div>
          <button className="w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-black transition-colors active:scale-95 shadow-lg">
            Ver Guía de Cálculo
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow shadow-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-2">Resumen de Cargas</h4>
        <div className="space-y-2">
          <SummaryRow label="Total Cargas" value={totalCargas} primary />
          <SummaryRow label="Cónyuges" value={Math.floor(totalCargas * 0.3)} />
          <SummaryRow label="Sin cargas" value={sinCargas} />
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-indigo-600 text-sm">shield_lock</span>
            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Recuerda</h4>
          </div>
          <p className="text-[10px] leading-relaxed text-indigo-900/80">
            Este reporte se procesa directamente en tu computador. La información que aquí trabajas es de conocimiento único y exclusivo de la empresa para la que gestionas este reporte.
          </p>
          <p className="text-[9px] mt-4 text-indigo-400 font-medium">
            Este servicio es OpenSource y tu o tu equipo de IT puede revisar y descargar el repositorio de GitHub <a href="#" className="underline">aquí</a>
          </p>
        </div>
      </div>
    </aside>
  );
}
