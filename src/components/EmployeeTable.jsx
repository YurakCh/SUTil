import React from 'react';
import { Trash2, Accessibility, Calendar, Briefcase, CreditCard, Receipt, Clock, BookmarkCheck, Link2, Edit3 } from 'lucide-react';
import { calcularCompensacionDigno } from '../logic/calculators';
import { getPeriodRange, calculateLegalDays } from '../logic/fiscal-utils';

export default function EmployeeTable({ 
  employees, mode, fiscalData, onUpdate, onDelete, searchTerm, 
  region, fiscalYear 
}) {
  const filtered = employees.filter(emp => 
    emp.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    emp.apellido?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    emp.identificacion?.includes(searchTerm || '')
  );

  const handleRowChange = (idx, field, value) => {
    const originalIdx = employees.findIndex(e => e.id === filtered[idx].id);
    const updated = [...employees];
    const emp = { ...updated[originalIdx], [field]: value };
    
    if (['baseSalary', 'commissions', 'bonuses', 'overtime'].includes(field)) {
      emp.sueldo = (parseFloat(emp.baseSalary) || 0) + 
                   (parseFloat(emp.commissions) || 0) + 
                   (parseFloat(emp.bonuses) || 0) + 
                   (parseFloat(emp.overtime) || 0);
    }

    if (field === 'dias') {
      emp.isManualDays = true;
    }

    if (field === 'fechaIngreso') {
      const range = getPeriodRange(mode, fiscalYear, region);
      emp.dias = calculateLegalDays(value, range.start, range.end);
      emp.isManualDays = false; // Al cambiar fecha de ingreso, volvemos a sincronizar
    }
    
    updated[originalIdx] = emp;
    onUpdate(updated);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse table-fixed min-w-[2000px]">
          <thead>
            <tr className="bg-slate-50/70 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em] border-b border-slate-100 sticky top-0 bg-white z-40">
              <th className="px-6 py-4 w-40 sticky left-0 bg-slate-50 z-50 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">Cédula</th>
              <th className="px-6 py-4 w-56">Apellidos</th>
              <th className="px-6 py-4 w-56">Nombres</th>
              <th className="px-3 py-4 w-12 text-center" title="Género">Gén.</th>
              <th className="px-3 py-4 w-12 text-center" title="¿Posee discapacidad?">Disc.</th>
              <th className="px-6 py-4 w-40 text-center">Jubilación</th>
              <th className="px-6 py-4 w-40 text-center">Ingreso</th>
              <th className="px-3 py-4 w-16 text-center" title="Solo si el trabajador posee JORNADA PARCIAL PERMANENTE">JP</th>
              <th className="px-4 py-4 w-28 text-center">Horas Sem.</th>
              <th className="px-4 py-4 w-20 text-center">Días</th>
              <th className="px-6 py-4 w-44">Tipo de Pago</th>
              
              {mode === 'utilidades' ? (
                <>
                  <th className="px-6 py-4 w-32 text-right">Sueldo Base</th>
                  <th className="px-6 py-4 w-32 text-right">Bonos/Com.</th>
                  <th className="px-6 py-4 w-36 text-right bg-primary/5 text-primary">Util. Prev.</th>
                  <th className="px-6 py-4 w-36 text-right font-bold text-slate-600">Total Ingresos</th>
                  <th className="px-4 py-4 w-20 text-center">Cargas</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 w-36 text-right">Sueldo Total</th>
                  <th className="px-6 py-4 w-44 text-center">Código Emp. (IESS)</th>
                  <th className="px-3 py-4 w-12 text-center" title="¿Mensualiza pago de décima remuneración?">Mens.</th>
                  <th className="px-6 py-4 w-36 text-right bg-primary/5 text-primary text-center">
                    {mode === 'decimo3' ? 'Provisión 13ro' : 'Provisión 14to'}
                  </th>
                </>
              )}
              
              <th className="px-6 py-4 w-32 text-right">Retención</th>
              <th className="px-4 py-4 w-16 text-center sticky right-0 bg-slate-50 z-50 shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">Elim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((emp, idx) => {
              const compensacionSD = mode === 'utilidades' ? calcularCompensacionDigno(emp, (fiscalData.digno || 0) * 12) : 0;
              
              return (
                <tr key={emp.id} className="data-table-row transition-all hover:bg-slate-50 group">
                  {/* Cédula - Sticky Left */}
                  <td className="px-6 py-2.5 text-xs font-mono text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50 z-30 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                    <input 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 font-mono text-primary font-bold"
                      value={emp.identificacion || ''}
                      onChange={(e) => handleRowChange(idx, 'identificacion', e.target.value)}
                    />
                  </td>
                  
                  {/* Apellidos */}
                  <td className="px-6 py-2.5 text-xs font-semibold text-on-surface uppercase truncate">
                    <input 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 uppercase headline-font"
                      value={emp.apellido || ''}
                      onChange={(e) => handleRowChange(idx, 'apellido', e.target.value)}
                    />
                  </td>

                  {/* Nombres */}
                  <td className="px-6 py-2.5 text-xs text-on-surface uppercase truncate">
                    <input 
                      className="w-full bg-transparent border-none p-0 focus:ring-0 uppercase headline-font"
                      value={emp.nombre || ''}
                      onChange={(e) => handleRowChange(idx, 'nombre', e.target.value)}
                    />
                  </td>

                  {/* Género */}
                  <td className="px-3 py-2.5 text-center">
                    <select 
                      value={emp.genero || 'M'}
                      onChange={(e) => handleRowChange(idx, 'genero', e.target.value)}
                      className="text-[10px] font-black px-1 py-0.5 rounded border border-slate-200 bg-white text-slate-600 focus:ring-0 cursor-pointer appearance-none"
                    >
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                  </td>

                  {/* Discapacidad */}
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox"
                        checked={!!emp.discapacidad}
                        onChange={(e) => handleRowChange(idx, 'discapacidad', e.target.checked)}
                        className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-offset-0"
                      />
                    </div>
                  </td>

                  {/* Fecha de Jubilación */}
                  <td className="px-6 py-2.5 text-xs text-center border-r border-slate-50">
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      value={emp.fechaJubilacion || ''}
                      onChange={(e) => handleRowChange(idx, 'fechaJubilacion', e.target.value)}
                    />
                  </td>

                  {/* Fecha de Ingreso */}
                  <td className="px-6 py-2.5 text-xs text-center">
                    <input 
                      type="date"
                      className="w-full bg-primary/5 border border-primary/20 rounded px-2 py-1 text-[10px] font-bold text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      value={emp.fechaIngreso || ''}
                      onChange={(e) => handleRowChange(idx, 'fechaIngreso', e.target.value)}
                    />
                  </td>

                  {/* Jornada Parcial Toggle */}
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex justify-center">
                      <input 
                        type="checkbox"
                        checked={!!emp.jornadaParcial}
                        onChange={(e) => handleRowChange(idx, 'jornadaParcial', e.target.checked)}
                        className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-offset-0"
                      />
                    </div>
                  </td>

                  {/* Horas Semanales */}
                  <td className="px-4 py-2.5 text-center">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border ${emp.jornadaParcial ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100 opacity-30 grayscale'}`}>
                      <Clock className={`w-3 h-3 ${emp.jornadaParcial ? 'text-primary' : 'text-slate-300'}`} />
                      <input 
                        type="number"
                        disabled={!emp.jornadaParcial}
                        className="w-8 bg-transparent border-none text-center p-0 focus:ring-0 font-black text-xs text-primary"
                        value={emp.horasParcial || 0}
                        onChange={(e) => handleRowChange(idx, 'horasParcial', parseInt(e.target.value) || 0)}
                      />
                      <span className="text-[8px] font-bold text-slate-400">HRS</span>
                    </div>
                  </td>

                  {/* Días */}
                  <td className="px-4 py-2.5 text-xs text-center font-medium">
                    <div className="flex items-center justify-center gap-1 group/days">
                      <input 
                        type="number"
                        className={`w-12 bg-transparent border-none text-center p-0 focus:ring-0 font-mono font-bold ${
                          emp.isManualDays ? 'text-amber-600' : 'text-slate-600'
                        }`}
                        value={emp.dias || 0}
                        onChange={(e) => handleRowChange(idx, 'dias', parseInt(e.target.value) || 0)}
                      />
                      <div title={emp.isManualDays ? "Editado manualmente" : "Sincronizado con Fecha Ingreso"}>
                        {emp.isManualDays ? (
                          <Edit3 className="w-2.5 h-2.5 text-amber-400 opacity-40 group-hover/days:opacity-100 transition-opacity" />
                        ) : (
                          <Link2 className="w-2.5 h-2.5 text-primary/30 group-hover/days:text-primary transition-colors" />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Tipo de Pago */}
                  <td className="px-6 py-2.5 flex justify-center">
                    <div className="relative w-full">
                      <select 
                        value={emp.tipoPago || 'A'}
                        onChange={(e) => handleRowChange(idx, 'tipoPago', e.target.value)}
                        className="w-full text-[9px] font-bold bg-slate-50 border border-slate-200 rounded px-2 py-1 pr-6 text-slate-600 appearance-none focus:ring-primary focus:border-primary"
                      >
                        <option value="P">Pago Directo</option>
                        <option value="A">Acreditación</option>
                        <option value="RP">Ret. Pago Directo</option>
                        <option value="RA">Ret. Acreditación</option>
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <CreditCard className="w-3 h-3" />
                      </div>
                    </div>
                  </td>

                  {mode === 'utilidades' ? (
                    <>
                      <td className="px-6 py-2.5 text-xs text-right font-mono">
                        <EditableMoney value={emp.baseSalary} onChange={(val) => handleRowChange(idx, 'baseSalary', val)} />
                      </td>
                      <td className="px-6 py-2.5 text-xs text-right font-mono text-slate-400">
                        <EditableMoney value={(emp.commissions || 0) + (emp.bonuses || 0) + (emp.overtime || 0)} onChange={(val) => handleRowChange(idx, 'commissions', val)} />
                      </td>
                      <td className="px-6 py-2.5 text-xs text-right font-mono bg-primary/5 font-bold text-primary">
                        ${(emp.utilidades || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        {compensacionSD > 0 && <div className="text-[8px] text-emerald-600 font-black">+ ${compensacionSD.toFixed(2)} SD</div>}
                      </td>
                      <td className="px-6 py-2.5 text-xs text-right font-bold font-mono text-slate-700">
                        ${(emp.sueldo || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <input 
                          type="number"
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold w-10 text-center border-none focus:ring-1 focus:ring-primary"
                          value={emp.cargas || 0}
                          onChange={(e) => handleRowChange(idx, 'cargas', parseInt(e.target.value) || 0)}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-2.5 text-xs text-right font-mono">
                        <EditableMoney value={emp.sueldo} onChange={(val) => handleRowChange(idx, 'sueldo', val)} />
                      </td>
                      <td className="px-6 py-2.5 text-xs text-center font-mono">
                        <input 
                          className="w-full bg-slate-100 border border-slate-200 text-center py-1 rounded focus:ring-1 focus:ring-primary font-mono text-[9px] text-slate-500"
                          value={emp.codigoIESS || ''}
                          onChange={(e) => handleRowChange(idx, 'codigoIESS', e.target.value)}
                        />
                      </td>
                      {/* Mensualiza Toggle */}
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex justify-center">
                          <input 
                            type="checkbox"
                            checked={!!emp.mensualiza}
                            onChange={(e) => handleRowChange(idx, 'mensualiza', e.target.checked)}
                            className="w-4 h-4 text-emerald-500 bg-emerald-50 border-emerald-300 rounded focus:ring-emerald-500 focus:ring-offset-0"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-2.5 text-xs text-right font-mono bg-primary/5 font-black text-primary text-center">
                        ${(mode === 'decimo3' ? (emp.sueldo / 12) : (emp.dias * (fiscalData.sbu || 0) / 360)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </>
                  )}
                  
                  {/* Valor Retención */}
                  <td className="px-6 py-2.5 text-xs text-right font-mono text-amber-600">
                    <EditableMoney 
                      value={emp.valorRetencion} 
                      onChange={(val) => handleRowChange(idx, 'valorRetencion', val)} 
                      color="text-amber-600"
                    />
                  </td>

                  {/* Acciones - Sticky Right */}
                  <td className="px-4 py-2.5 text-center sticky right-0 bg-white group-hover:bg-slate-50 z-30 shadow-[-1px_0_0_0_rgba(0,0,0,0.05)]">
                    <button 
                      onClick={() => onDelete(originalIdx)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Registros:</span>
          <div className="px-3 py-1 bg-white rounded-full border border-slate-200 text-[10px] font-black text-primary">
            {filtered.length} / {employees.length}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Simple Pagination Buttons */}
          {[1, 2, 3].map(p => (
            <button key={p} className={`w-8 h-8 rounded-xl font-black text-xs transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-slate-400 border border-slate-200 hover:border-primary hover:text-primary'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditableMoney({ value, onChange, color = "text-on-surface" }) {
  return (
    <div className="flex items-center justify-end font-mono">
      <span className="text-slate-300 mr-0.5 font-bold">$</span>
      <input 
        type="number"
        step="0.01"
        className={`bg-transparent border-none p-0 focus:ring-0 text-right w-20 font-black text-xs ${color}`}
        value={value || 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
