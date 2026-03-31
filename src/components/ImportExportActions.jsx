import React, { useRef } from 'react';
import { Upload, Download, FileSpreadsheet, FileText } from 'lucide-react';

export default function ImportExportActions({ onCsvUpload, onPdfUpload, onExport }) {
  const csvInput = useRef(null);
  const pdfInput = useRef(null);

  const handleCsvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        // Parsear punto y coma SUT
        const rows = text.split('\n').filter(row => row.trim() !== '');
        const data = rows.map(row => row.split(';'));
        onCsvUpload(data);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <button
          onClick={() => csvInput.current.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          Importar Nómina (Excel/CSV)
        </button>
        <button
          onClick={() => pdfInput.current.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border-l border-slate-100 hover:bg-slate-50 rounded-lg transition-all"
        >
          <FileText className="w-4 h-4 text-red-500" />
          Parser PDF
        </button>
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-6 py-2.5 bg-premium-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-md shadow-slate-200 transition-all active:scale-95"
      >
        <Download className="w-4 h-4" />
        Exportar para SUT
      </button>

      <input 
        type="file" 
        hidden 
        ref={csvInput} 
        accept=".csv,.txt,.xlsx,.xls" 
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && onCsvUpload) onCsvUpload(file);
        }} 
      />
      <input 
        type="file" 
        hidden 
        ref={pdfInput} 
        accept=".pdf" 
        onChange={(e) => onPdfUpload(e.target.files[0])} 
      />
    </div>
  );
}
