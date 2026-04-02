import React, { useState, useEffect } from 'react';

const SUTIL_TIPS = [
  {
     text: "Para el cálculo 2025, confirme las cargas familiares. Los datos exportados de SUTil deben coincidir con su declaración en el MDT.",
     event: "Cierre de Cargas",
     date: "31 de Marzo"
  },
  {
     text: "Si utiliza la 'Extracción PDF', asegúrese de que en el sistema anterior no hubieran horas extras retrospectivas no registradas.",
     event: "Verificación Cruzada",
     date: "Revisión Recomendada"
  },
  {
     text: "El reporte de Utilidades usa la carga familiar ponderada. SUTil distribuye la base y las cargas automáticamente según sus columnas.",
     event: "Aviso de Utilidades",
     date: "Cálculo Automático"
  },
  {
     text: "Si posee un ERP externo, descargue nuestra plantilla nativa en XLSX. Así SUTil ni siquiera tendrá que adivinar los mapeos.",
     event: "Tips de Productividad",
     date: "Plantilla Oficial"
  }
];

function SummaryRow({ label, value, primary }) {
  return (
    <div className="flex justify-between text-[11px] transition-all hover:bg-slate-50 p-1 rounded">
      <span className="text-slate-600">{label}</span>
      <span className={`font-bold ${primary ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
    </div>
  );
}

export default function Sidebar({ employees, mode }) {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % SUTIL_TIPS.length);
    }, 40000);
    return () => clearInterval(timer);
  }, []);

  const totalCargas = employees.reduce((sum, e) => sum + (parseInt(e.cargas) || 0), 0);
  const sinCargas = employees.filter(e => (parseInt(e.cargas) || 0) === 0).length;
  
  return (
    <aside className="w-80 h-full max-h-full flex flex-col space-y-4 hidden xl:flex shrink-0 overflow-y-auto custom-scrollbar pr-1 pb-10">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h3 className="headline-font text-[10px] font-bold text-primary uppercase tracking-widest">Asistente SUTil</h3>
        </div>
        <div className="p-4 space-y-4">
          <div key={currentTip} className="animate-in fade-in duration-700">
             <p className="text-[11px] text-on-surface-variant leading-relaxed min-h-[60px]">
               {SUTIL_TIPS[currentTip].text}
             </p>
             <div className="p-3 bg-slate-50 border border-slate-100 rounded mt-4">
               <div className="flex items-center gap-2 mb-1">
                 <span className="material-symbols-outlined text-primary text-xs">event_note</span>
                 <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{SUTIL_TIPS[currentTip].event}</span>
               </div>
               <p className="text-[11px] font-bold text-on-surface">{SUTIL_TIPS[currentTip].date}</p>
             </div>
          </div>
          <a href="https://salarios.trabajo.gob.ec/" target="_blank" rel="noopener noreferrer" className="w-full py-2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-black transition-colors active:scale-95 shadow-lg flex justify-center items-center gap-2">
            Ingresar al SUT Oficial <span className="material-symbols-outlined text-[14px]">open_in_new</span>
          </a>
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
            Este servicio es OpenSource y tu o tu equipo de IT puede revisar y descargar el repositorio de GitHub <a href="https://github.com/YurakCh/SUTil" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-primary-container transition-colors">aquí</a>
          </p>
        </div>
      </div>
    </aside>
  );
}
