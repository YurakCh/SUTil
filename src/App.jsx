import React, { useState, useEffect } from 'react';
import { initDB, saveEmployees, getEmployees, saveSetting, getSetting } from './services/idb-service';
import { getFiscalData } from './config/fiscal-years';
import { getPeriodRange, calculateLegalDays } from './logic/fiscal-utils';
import { calcularDecimoTercero, calcularDecimoCuarto, calcularCompensacionDigno } from './logic/calculators';
import * as XLSX from 'xlsx';

// Premium Components
import TopNavBar from './components/TopNavBar';
import MetricCards from './components/MetricCards';
import ControlToolbar from './components/ControlToolbar';
import EmployeeTable from './components/EmployeeTable';
import Sidebar from './components/Sidebar';
import FiscalConfigModal from './components/FiscalConfigModal';
import MappingModal from './components/MappingModal';
import UtilitiesModal from './components/UtilitiesModal';
import SupportModal from './components/SupportModal';
import { Check, X, Upload, LifeBuoy } from 'lucide-react';

import { detectMode, getSmartMappings, isConfidenceHigh, processRows, guessMappingsFromData, splitRow, findBestHeaderRow } from './logic/import-utils';
import { parseSutPdf } from './logic/pdf-parser';

const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState('decimo3');
  const [totalUtilidad, setTotalUtilidad] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fiscalYear, setFiscalYear] = useState(2025);
  const [customFiscalData, setCustomFiscalData] = useState({});
  const [showFiscalConfig, setShowFiscalConfig] = useState(false);
  const [showMapping, setShowMapping] = useState(false);
  const [showUtilitiesModal, setShowUtilitiesModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [utilitiesFormData, setUtilitiesFormData] = useState({});
  const [pdfRawRows, setPdfRawRows] = useState(null);
  const [initialMappings, setInitialMappings] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [region, setRegion] = useState('sierra');

  useEffect(() => {
    if (importStatus) {
      const timer = setTimeout(() => setImportStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [importStatus]);

  useEffect(() => {
    const load = async () => {
      await initDB();
      try {
        const saved = await getEmployees();
        const savedMode = await getSetting('mode');
        const savedYear = await getSetting('fiscalYear');
        const savedCustom = await getSetting('customFiscalData');
        const savedUtils = await getSetting('utilitiesFormData');
        const savedTotalUtil = await getSetting('totalUtilidad');
        const savedRegion = await getSetting('region');
        if (savedMode) setMode(savedMode);
        if (savedYear) setFiscalYear(savedYear);
        if (savedCustom) setCustomFiscalData(savedCustom);
        if (savedUtils) setUtilitiesFormData(savedUtils || {});
        if (savedTotalUtil) setTotalUtilidad(savedTotalUtil || 0);
        if (savedRegion) setRegion(savedRegion);
        setEmployees(saved.length > 0 ? saved : []);
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveEmployees(employees);
      saveSetting('mode', mode);
      saveSetting('fiscalYear', fiscalYear);
      saveSetting('customFiscalData', customFiscalData);
      saveSetting('utilitiesFormData', utilitiesFormData);
      saveSetting('totalUtilidad', totalUtilidad);
      saveSetting('region', region);
    }
  }, [employees, mode, loading, fiscalYear, customFiscalData, utilitiesFormData, totalUtilidad, region]);

  // Lógica de Reparto de Utilidades
  useEffect(() => {
    if (loading || mode !== 'utilidades') return;
    
    const totalDias = employees.reduce((sum, e) => sum + (parseInt(e.dias) || 0), 0);
    const totalCargas = employees.reduce((sum, e) => sum + (parseInt(e.cargas) || 0), 0);
    
    const updated = employees.map(emp => {
      const d = parseInt(emp.dias) || 0;
      const c = parseInt(emp.cargas) || 0;
      const parteDiez = totalDias > 0 ? ((totalUtilidad || 0) * 0.10 / totalDias) * d : 0;
      const parteCinco = totalCargas > 0 ? ((totalUtilidad || 0) * 0.05 / totalCargas) * c : 0;
      const util = (parteDiez || 0) + (parteCinco || 0);
      
      if (Math.abs((emp.utilidades || 0) - util) > 0.001) {
        return { ...emp, utilidades: util };
      }
      return emp;
    });

    const hasChanges = updated.some((emp, i) => emp.utilidades !== employees[i].utilidades);
    if (hasChanges) setEmployees(updated);
  }, [totalUtilidad, mode, loading, employees.length]);

  // Recalcular días de todos cuando cambia el periodo/región
  useEffect(() => {
    if (loading || employees.length === 0) return;
    const range = getPeriodRange(mode, fiscalYear, region);
    const updated = employees.map(emp => {
      // Solo sobreescribe si NO ha sido editado manualmente o si acaba de cambiar el contexto
      if (emp.fechaIngreso && !emp.isManualDays) {
        const calculated = calculateLegalDays(emp.fechaIngreso, range.start, range.end);
        if (emp.dias !== calculated) {
          return { ...emp, dias: calculated };
        }
      }
      return emp;
    });
    
    const hasChanges = updated.some((emp, i) => emp.dias !== employees[i].dias);
    if (hasChanges) setEmployees(updated);
  }, [mode, fiscalYear, region, loading]);

  const handleExport = () => {
    if (employees.length === 0) return;
    
    let header = "";
    if (mode === 'decimo3') {
      header = "Cédula;Nombres;Apellidos;Genero;Ocupación;Total_ganado;Días laborados;Tipo de Deposito;Solo si el trabajador posee JORNADA PARCIAL;DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO;Solo si su trabajador posee algun tipo de discapacidad ponga una X;Ingrese el valor retenido;SOLO SI SU TRABAJADOR SOLICITA EL PAGO DE LA DECIMOTERCERA REMUNERACIÓN MENSUALIZADA PONGA UNA X";
    } else if (mode === 'decimo4') {
      header = "Cédula;Nombres;Apellidos;Genero;Ocupación;Días laborados;Tipo de Pago;Solo si el trabajador posee JORNADA PARCIAL;DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO;Solo si su trabajador posee algun tipo de discapacidad ponga una X;Fecha de Jubilación;valor Retencion;SOLO SI SU TRABAJADOR MENSUALIZA EL PAGO DE LA DECIMOCUARTA REMUNERACIÓN PONGA UNA X";
    } else {
      header = "Cédula;Nombres;Apellidos;Genero;Ocupación;Días laborados;Número de Cargas;Ingrese el valor del Impuesto a la Renta Retenido individual;";
    }

    const rows = employees.map(e => {
      const base = [e.identificacion, e.nombre, e.apellido, e.genero, e.codigoIESS];
      if (mode === 'decimo3') {
        return [...base, e.sueldo, e.dias, e.tipoPago || 'A', e.jornadaParcial ? 'X' : '', e.horasParcial || '', e.discapacidad ? 'X' : '', e.valorRetencion || 0, e.mensualiza ? 'X' : ''].join(';');
      }
      if (mode === 'decimo4') {
        return [...base, e.dias, e.tipoPago || 'A', e.jornadaParcial ? 'X' : '', e.horasParcial || '', e.discapacidad ? 'X' : '', e.fechaJubilacion || '', e.valorRetencion || 0, e.mensualiza ? 'X' : ''].join(';');
      }
      return [...base, e.dias, e.cargas, e.valorRetencion || 0].join(';');
    });
    
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob(["\uFEFF", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SUT_${mode.toUpperCase()}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas limpiar todos los datos de la nómina?')) {
      setEmployees([]);
      setTotalUtilidad(0);
    }
  };

  const csvInputRef = React.useRef(null);

  /**
   * Main Document Routing Service (Zero-Friction Motor)
   * Receives standard browser file drops, fingerprints the internal structure,
   * buffers it properly, and routes to the appropriate parser path (CSV, XLS, or PDF).
   */
  const handleFileUpload = (e) => {
    const inputElement = e.target;
    const file = inputElement ? inputElement.files[0] : e;
    if (!file) return;

    // --- 1. Fingerprint File Extension ---
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isPdf = fileName.endsWith('.pdf');
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        let allRows = [];
        const result = event.target.result;

        // --- RUTA 1: NÓMINAS OFICIALES COMPILADAS (PDF SUT) ---
        if (isPdf) {
          try {
            // Uses Service Worker FSM to skip spatial UI dependency
            const { employees: parsedEmployees, mode: detectedMode } = await parseSutPdf(result);
            if (parsedEmployees && parsedEmployees.length > 0) {
              setMode(detectedMode);
              setEmployees(prev => [...parsedEmployees, ...prev]);
              setImportStatus({ message: `PDF sincronizado automáticamente (${detectedMode.toUpperCase()})`, type: 'success' });
              setShowMapping(false);
              return;
            } else {
              throw new Error("El PDF no contenía empleados válidos.");
            }
          } catch (pdfError) {
             console.error("[SUTil Engine] PDF Route Error:", pdfError);
             throw new Error(pdfError.message || "Error técnico al leer el archivo PDF.");
          }
        }

        // --- RUTA 2: FORMATOS ANÓMALOS U OFICIALES CRUDOS (EXCEL/CSV) ---
        if (isExcel) {
          try {
            // Using BinaryString for XLSX as the most robust cross-platform method for SheetJS
            const wb = XLSX.read(result, { type: 'binary', cellNF: true, cellText: true });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            allRows = XLSX.utils.sheet_to_json(ws, { header: 1 });
            if (!allRows || allRows.length === 0) throw new Error("Hojas vacías");
          } catch (excelError) {
            console.error("[SUTil Engine] Excel Route Error:", excelError);
            throw new Error(`El archivo de Excel tiene estructura dañada. Guárdalo como .xlsx estándar.`);
          }
        } else {
          // Regular Text/CSV Parse directly via string manipulation
          allRows = result.split('\n').filter(row => row.trim() !== '');
        }
        
        // --- 3. EVALUACIÓN Y DESPLIEGUE HEURÍSTICO ---
        if (allRows.length > 0) {
          const headerIdx = findBestHeaderRow(allRows);
          const firstRow = allRows[headerIdx];
          const parts = splitRow(firstRow);
          
          const cleanFirst = parts[0]?.toString().replace(/[^0-9]/g, '') || '';
          const isHeader = isNaN(parseInt(cleanFirst)) || cleanFirst.length < 9;
          
          if (!isExcel) {
             // --- SUB-RUTA A: FAST-PATH PARA CSVs ESTRUCTURADOS ---
             // Skips visual mapping and assumes perfect MDT format 
             let detectedMode = detectMode(isHeader ? parts : [], allRows.slice(isHeader ? 1 : 0), mode);
             setMode(detectedMode);
             
             let mappings = guessMappingsFromData(allRows[0], detectedMode);
             let dataRows = allRows.slice(isHeader ? 1 : 0);
             
             const processed = processRows(dataRows, mappings);
             setEmployees(prev => [...processed, ...prev]);
             setImportStatus({ message: `CSV sincronizado automáticamente (${detectedMode.toUpperCase()})`, type: 'success' });
             setShowMapping(false);
          } else {
             // --- SUB-RUTA B: MAPEO VISUAL PARA EXCEL ANÓMALO ---
             // Shows Smart Modal for Human Confirmation
             let detectedMode = detectMode(isHeader ? parts : [], allRows.slice(headerIdx), mode);
             let mappings = isHeader ? getSmartMappings(parts) : guessMappingsFromData(allRows[headerIdx], detectedMode);
             
             if (detectedMode) setMode(detectedMode);
             setInitialMappings({ mappings, headerRow: headerIdx });
             setPdfRawRows(allRows); 
             setShowMapping(true);
          }
        }
      } catch (error) {
        console.error("[SUTil Engine] General Import Flow Error:", error);
        setImportStatus({ message: error.message || "No se pudo interpretar el archivo.", type: 'error' });
      } finally {
        if (inputElement) inputElement.value = '';
      }
    };

    reader.onerror = () => {
      setImportStatus({ message: `Error crítico de lectura I/O en sistema operativo.`, type: 'error' });
      if (inputElement) inputElement.value = '';
    };

    // --- 4. BUFFER LAUNCHER RESILIENTE ---
    if (isExcel) {
      reader.readAsBinaryString(file);
    } else if (isPdf) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleDownloadTemplate = () => {
    let headers = "";
    if (mode === 'decimo3') {
      headers = "Cédula;Nombres;Apellidos;Genero;Ocupación;Total_ganado;Días laborados;Tipo de Deposito;Solo si el trabajador posee JORNADA PARCIAL;DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO;Solo si su trabajador posee algun tipo de discapacidad ponga una X;Ingrese el valor retenido;SOLO SI SU TRABAJADOR SOLICITA EL PAGO DE LA DECIMOTERCERA REMUNERACIÓN MENSUALIZADA PONGA UNA X";
    } else if (mode === 'decimo4') {
      headers = "Cédula;Nombres;Apellidos;Genero;Ocupación;Días laborados;Tipo de Pago;Solo si el trabajador posee JORNADA PARCIAL;DETERMINE EN HORAS LA JORNADA PARCIAL PERMANENTE SEMANAL ESTIPULADO EN EL CONTRATO;Solo si su trabajador posee algun tipo de discapacidad ponga una X;Fecha de Jubilación;valor Retencion;SOLO SI SU TRABAJADOR MENSUALIZA EL PAGO DE LA DECIMOCUARTA REMUNERACIÓN PONGA UNA X";
    } else {
      headers = "Cédula;Nombres;Apellidos;Genero;Ocupación;Días laborados;Número de Cargas;Ingrese el valor del Impuesto a la Renta Retenido individual;";
    }
    
    const blob = new Blob(["\uFEFF", headers], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SUTil_PLANTILLA_EXCEL_${mode.toUpperCase()}.csv`;
    link.click();
  };

  const currentFiscalData = getFiscalData(fiscalYear, customFiscalData);

  return (
    <div className="flex flex-col h-screen bg-surface overflow-hidden font-body">
      <TopNavBar 
        mode={mode} 
        setMode={setMode} 
        fiscalYear={fiscalYear} 
        setFiscalYear={setFiscalYear} 
        onShowFiscalConfig={() => setShowFiscalConfig(true)}
      />

      <main className="flex-1 max-w-full px-6 py-6 flex gap-6 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <MetricCards 
            fiscalData={currentFiscalData} 
            year={fiscalYear} 
            employees={employees} 
            totalUtilidad={totalUtilidad}
            mode={mode}
            fiscalYear={fiscalYear}
            setFiscalYear={setFiscalYear}
            region={region}
            setRegion={setRegion}
            onOpenUtilities={() => setShowUtilitiesModal(true)}
            onUpdateFiscalData={(newData) => {
              setCustomFiscalData({ 
                ...customFiscalData, 
                [fiscalYear]: { ...currentFiscalData, ...newData } 
              });
            }}
          />

          <section className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Toolbar outside the scroll container to keep it fixed */}
            <ControlToolbar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm}
              onImport={() => csvInputRef.current?.click()}
              onExport={handleExport}
              onAdd={() => setEmployees([{ id: generateId(), identificacion: '', nombre: '', apellido: '', genero: 'M', codigoIESS: '', dias: 360, sueldo: 0, cargas: 0, discapacidad: false, jornadaParcial: false, horasParcial: 0, tipoPago: 'A', valorRetencion: 0, mensualiza: false }, ...employees])}
              onClear={handleClear}
              onDownloadTemplate={handleDownloadTemplate}
            />
            
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <div className="min-h-0">
                <EmployeeTable 
                  employees={employees}
                  mode={mode}
                  fiscalData={currentFiscalData}
                  region={region}
                  fiscalYear={fiscalYear}
                  onUpdate={setEmployees}
                  onDelete={(idx) => setEmployees(employees.filter((_, i) => i !== idx))}
                  searchTerm={searchTerm}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <Sidebar employees={employees} mode={mode} />

        {/* Hidden Input for CSV/Excel/PDF Upload */}
        <input 
          type="file" 
          ref={csvInputRef} 
          className="hidden" 
          accept=".pdf,.csv,.txt,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain,application/pdf" 
          onChange={handleFileUpload}
        />
      </main>

      <footer className="bg-white border-t border-slate-200 shrink-0">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ''; }} className="font-extrabold text-primary headline-font text-sm hover:opacity-80 transition-opacity cursor-pointer">SUTil</a>
            <span className="text-slate-400 text-[10px] font-medium border-l border-slate-200 pl-4 uppercase tracking-wider">v2.5.5 • Ecuador 2025</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShowSupportModal(true)}
              className="text-[10px] text-slate-500 hover:text-blue-600 font-black uppercase tracking-[0.2em] transition-colors underline decoration-slate-200 underline-offset-4 hover:decoration-blue-400"
            >
              Reportar un problema
            </button>
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Entorno Local Seguro</span>
            </div>
          </div>
        </div>
      </footer>

      {showFiscalConfig && (
        <FiscalConfigModal 
          year={fiscalYear}
          currentData={currentFiscalData}
          onSave={(data) => {
            setCustomFiscalData({ ...customFiscalData, [fiscalYear]: data });
            setShowFiscalConfig(false);
          }}
          onCancel={() => setShowFiscalConfig(false)}
        />
      )}

      {showMapping && (
        <MappingModal 
          rawRows={pdfRawRows} 
          initialMappings={initialMappings}
          onConfirm={(mapped) => {
            setEmployees(prev => [...prev, ...mapped]);
            setShowMapping(false);
            setImportStatus({ 
              message: `${mapped.length} empleados sincronizados con éxito.`, 
              type: 'success' 
            });
          }}
          onCancel={() => setShowMapping(false)}
        />
      )}

      {showUtilitiesModal && (
        <UtilitiesModal 
          currentData={utilitiesFormData}
          onSave={(data) => {
            setUtilitiesFormData(data);
            setTotalUtilidad(data.participacion15 || 0);
            setShowUtilitiesModal(false);
          }}
          onCancel={() => setShowUtilitiesModal(false)}
        />
      )}

      {showSupportModal && (
        <SupportModal 
          onClose={() => setShowSupportModal(false)} 
          context={`${mode === 'decimo3' ? 'Décimo Tercero' : mode === 'decimo4' ? 'Décimo Cuarto' : 'Utilidades'}${mode === 'decimo4' ? ` - ${region.toUpperCase()}` : ''} - ${fiscalYear}`}
        />
      )}

      {importStatus && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${
            importStatus.type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400 text-white' 
              : 'bg-red-500/90 border-red-400 text-white'
          }`}>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {importStatus.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </div>
            <span className="font-bold text-sm tracking-tight">{importStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );
}

function StatCard({ title, value, active }) {
  return (
    <div className={`glass p-8 rounded-[2.5rem] border transition-all duration-300 ${
      active ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ring-4 ring-blue-50' : 'border-white/60 opacity-60'
    }`}>
      <h2 className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">{title}</h2>
      <p className={`text-4xl font-black tracking-tighter ${active ? 'text-blue-600' : 'text-slate-400'}`}>
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

function EmptyState({ onImportClick, onAddClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Upload className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Sin datos para procesar</h3>
      <p className="text-slate-400 mb-8 max-w-sm text-center font-medium leading-relaxed">Carga tus archivos SUT o usa la opción de añadir manualmente para comenzar.</p>
      <div className="flex gap-4">
        <button 
          onClick={onImportClick}
          className="bg-premium-900 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95"
        >
          Importar Datos
        </button>
        <button 
          onClick={onAddClick}
          className="bg-white text-slate-700 border border-slate-300 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-slate-50 transition-all active:scale-95"
        >
          Añadir a Mano
        </button>
      </div>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[200] bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
