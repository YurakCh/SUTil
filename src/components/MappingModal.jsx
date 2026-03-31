import React, { useState, useEffect } from 'react';
import { Settings2, X, ChevronDown, Sparkles, Check, ArrowRight, Eye, Info } from 'lucide-react';
import { splitRow, processRows, getSmartMappings, detectNameHint } from '../logic/import-utils';

export default function MappingModal({ rawRows, onConfirm, onCancel, initialMappings }) {
  const safeRawRows = rawRows || [];
  
  const initMaps = initialMappings?.mappings || initialMappings || {
    identificacion: -1, nombre: -1, apellido: -1, genero: -1, codigoIESS: -1,
    dias: -1, sueldo: -1, baseSalary: -1, cargas: -1, discapacidad: -1,
    fechaJubilacion: -1, jornadaParcial: -1, horasParcial: -1, tipoPago: -1,
    valorRetencion: -1, mensualiza: -1, fechaIngreso: -1
  };
  
  const initHeaderRow = typeof initialMappings?.headerRow === 'number' ? initialMappings.headerRow : 0;

  const [mappings, setMappings] = useState(initMaps);
  const [headerRow, setHeaderRow] = useState(initHeaderRow);
  const [autoMappedKeys, setAutoMappedKeys] = useState([]);
  const [nameHint, setNameHint] = useState('apellido');

  useEffect(() => {
    if (safeRawRows && safeRawRows[headerRow]) {
      const parts = splitRow(safeRawRows[headerRow]);
      const newMappings = getSmartMappings(parts);
      setMappings(prev => ({ ...prev, ...newMappings }));
      const detected = Object.keys(newMappings).filter(k => newMappings[k] !== -1);
      setAutoMappedKeys(detected);
      
      const nameCol = newMappings.nombre !== -1 ? newMappings.nombre : (newMappings.apellido !== -1 ? newMappings.apellido : -1);
      if (nameCol !== -1) {
        const hText = parts[nameCol] || "";
        setNameHint(detectNameHint(hText));
      }
    }
  }, [headerRow]);

  const handleMapFieldToColumn = (fieldKey, colIndex) => {
    setMappings(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === colIndex) next[k] = -1; });
      next[fieldKey] = colIndex;
      return next;
    });
    setAutoMappedKeys(prev => prev.filter(k => k !== fieldKey));
  };

  const clearColumnMapping = (colIndex) => {
    setMappings(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k] === colIndex) next[k] = -1; });
      return next;
    });
  };

  const handleProceed = () => {
    try {
      if (safeRawRows.length === 0) return;
      const dataRows = safeRawRows.slice(headerRow + 1);
      const processed = processRows(dataRows, mappings, nameHint);
      onConfirm(processed);
    } catch (err) {
      console.error(err);
      alert("Error al procesar. Verifica el formato de los campos.");
    }
  };

  const fields = [
    { key: 'identificacion', label: 'Cédula' },
    { key: 'apellido', label: 'Apellidos' },
    { key: 'nombre', label: 'Nombres' },
    { key: 'genero', label: 'Género' },
    { key: 'fechaIngreso', label: 'Fecha Ingreso' },
    { key: 'codigoIESS', label: 'Cód. IESS' },
    { key: 'dias', label: 'Días Lab.' },
    { key: 'sueldo', label: 'Sueldo Total' },
    { key: 'baseSalary', label: 'Sueldo Base' },
    { key: 'cargas', label: 'Cargas Fam.' },
    { key: 'discapacidad', label: 'Disc. (X)' },
    { key: 'jornadaParcial', label: 'Jornada Parcial' },
    { key: 'horasParcial', label: 'Horas Parcial' },
    { key: 'tipoPago', label: 'Tipo Pago' },
    { key: 'valorRetencion', label: 'Retención' },
    { key: 'mensualiza', label: 'Mensualiza' },
  ];

  const previewRows = safeRawRows.slice(0, 15);
  const maxCols = Math.max(...previewRows.map(r => splitRow(r).length), 0);
  const columns = Array.from({ length: maxCols }, (_, i) => i);

  const getFieldForColumn = (colIdx) => fields.find(f => mappings[f.key] === colIdx);
  const isFieldMapped = (fieldKey) => mappings[fieldKey] !== -1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/45 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-600/20">
              <Settings2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold headline-font tracking-tight text-slate-900">Organizador Contable</h1>
              <p className="text-slate-500 text-sm font-medium">Asigna cada columna de tu Excel a los campos de SUTil.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-6">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">Archivo Detectado</span>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-slate-700 font-bold text-xs">{maxCols} Columnas Disponibles</span>
              </div>
            </div>
            <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {/* Step Indicator Section */}
          <div className="px-8 pt-8 shrink-0">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-4">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded shadow-sm shrink-0">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">PASO 1</span>
                <span className="text-sm font-bold text-slate-800">Cabeceras</span>
              </div>
              <div className="flex-1 flex gap-3 overflow-x-auto py-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {previewRows.slice(0, 8).map((row, i) => {
                  const isSelected = headerRow === i;
                  const content = splitRow(row).slice(0, 2).map((s) => s?.toString().substring(0, 10)).join(' | ');
                  if (isSelected) {
                    return (
                      <button key={i} onClick={() => setHeaderRow(i)} className="bg-white border-2 border-blue-600/40 px-5 py-3 rounded shadow-sm shrink-0 flex items-center gap-3">
                        <span className="text-[10px] font-bold text-blue-600">Fila {i + 1}</span>
                        <span className="text-xs text-slate-900 font-bold italic">{content}...</span>
                      </button>
                    );
                  }
                  return (
                    <button key={i} onClick={() => setHeaderRow(i)} className="bg-white/50 px-4 py-3 rounded border border-slate-200/60 shrink-0 flex items-center gap-2 hover:bg-white/80 transition-all">
                      <span className="text-[10px] font-bold text-slate-400">Fila {i + 1}</span>
                      <span className="text-xs text-slate-400 font-medium italic truncate max-w-[100px]">{content || '...'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 px-1">
              <Info className="text-blue-600 w-4 h-4" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sutil mapea automáticamente columnas con nombres similares.</span>
            </div>
          </div>

          {/* Mapping Grid */}
          <div className="px-8 mt-8 shrink-0">
            <div className="flex border border-slate-200 rounded-lg overflow-x-auto bg-slate-50/30" style={{ scrollbarWidth: 'none' }}>
              {columns.map(colIdx => {
                const mappedField = getFieldForColumn(colIdx);
                const isAuto = mappedField && autoMappedKeys.includes(mappedField.key);
                const excelHeader = splitRow(safeRawRows[headerRow] || "")[colIdx] || "vacio";
                const isMapped = !!mappedField;

                return (
                  <div key={colIdx} className={`p-5 flex flex-col min-w-[200px] min-h-[160px] relative shrink-0 border-r border-slate-200 ${isMapped ? 'bg-white' : ''} last:border-r-0`}>
                    
                    {isAuto && (
                      <div className="absolute top-0 right-0 p-2">
                        <div className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> INTELIGENTE
                        </div>
                      </div>
                    )}

                    <div className="mb-auto">
                      <div className="relative group w-full">
                        <select 
                          value={mappedField?.key || ""}
                          onChange={(e) => {
                            if (e.target.value === "") clearColumnMapping(colIdx);
                            else handleMapFieldToColumn(e.target.value, colIdx);
                          }}
                          className={`appearance-none px-3 py-2 text-xs font-bold outline-none cursor-pointer truncate pr-8 w-full ${
                            isMapped 
                              ? 'bg-blue-600 text-white rounded flex items-center justify-between shadow-md shadow-blue-600/20' 
                              : 'bg-white border border-slate-200 rounded text-slate-400 flex items-center justify-between shadow-sm hover:border-slate-300'
                          }`}
                        >
                          <option className="text-slate-900 bg-white" value="">Ignorar columna</option>
                          {fields.map(f => (
                            <option className="text-slate-900 bg-white" key={f.key} value={f.key} disabled={isFieldMapped(f.key) && mappings[f.key] !== colIdx}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isMapped ? 'text-white/80' : 'text-slate-400'}`} />
                      </div>

                      {isMapped && (mappedField.key === 'apellido' || mappedField.key === 'nombre') && (
                        <button 
                          onClick={() => setNameHint(prev => prev === 'apellido' ? 'nombre' : 'apellido')}
                          className="mt-2 flex items-center gap-1 px-1 group"
                        >
                           <div className="w-1 h-1 rounded-full bg-blue-600/60" />
                           <span className="text-[9px] font-bold text-blue-600 uppercase">
                             {nameHint === 'apellido' ? 'Apellido Primero' : 'Nombre Primero'}
                           </span>
                        </button>
                      )}
                    </div>

                    <div className="pt-6">
                      <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase block mb-1">EXCEL</span>
                      <span className={`text-xs font-bold truncate block ${isMapped ? 'text-slate-900' : 'text-slate-700'}`}>
                        {excelHeader}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview Table Section */}
          <div className="px-8 mt-10 pb-16 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="text-blue-600 w-5 h-5" />
              <h3 className="headline-font font-bold text-slate-900 text-sm">Vista previa de datos</h3>
            </div>
            
            <div className="border border-slate-100 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <tbody className="text-[11px]">
                  {previewRows.map((row, rowIdx) => {
                    const isHeader = rowIdx === headerRow;
                    const isSkipped = rowIdx < headerRow;
                    const parts = splitRow(row);

                    return (
                      <tr key={rowIdx} className={`border-b border-slate-50 last:border-0 ${isHeader ? 'bg-blue-600/5' : isSkipped ? 'bg-slate-50/30' : ''}`}>
                        <td className="px-6 py-3.5 text-slate-300 font-bold uppercase tracking-tighter w-20">
                          {isHeader ? <span className="text-blue-600">HEADER</span> : isSkipped ? 'SKIP' : rowIdx + 1}
                        </td>
                        {columns.map(colIdx => {
                          const content = parts[colIdx] || "";
                          const mappedField = getFieldForColumn(colIdx);
                          
                          if (isSkipped) {
                            return (
                              <td key={colIdx} className="px-4 py-3.5 text-slate-300 italic truncate max-w-[150px]">
                                {content || 'vacio'}
                              </td>
                            );
                          }
                          
                          if (isHeader) {
                            return (
                              <td key={colIdx} className="px-4 py-3.5 text-slate-500 font-semibold truncate max-w-[150px]">
                                {content || 'vacio'}
                              </td>
                            );
                          }
                          
                          // Data row
                          return (
                            <td key={colIdx} className={`px-4 py-3.5 truncate max-w-[150px] ${mappedField ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                              {content || <span className="text-slate-300 italic">vacio</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="bg-white border-t border-slate-100 p-6 flex items-center justify-between sticky bottom-0 z-20 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold headline-font text-slate-900 text-base leading-tight">Finalizar Sincronización</h4>
              <p className="text-xs text-slate-500 mt-0.5">SUTil importará todas las columnas seleccionadas según el mapeo.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onCancel} className="text-slate-400 font-bold text-[11px] tracking-widest hover:text-slate-600 transition-colors uppercase">
              CANCELAR
            </button>
            <button 
              onClick={handleProceed}
              className="bg-blue-600 text-white px-8 py-3.5 rounded font-bold headline-font text-sm flex items-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              COMPLETAR SINCRONIZACIÓN
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
}
