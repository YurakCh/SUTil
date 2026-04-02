import React, { useState, useRef } from 'react';
import { X, Loader2, Send, CheckCircle, Camera, Paperclip, Trash2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { getSystemLogs } from '../utils/logger';

export default function SupportModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problem: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error, invalid_email
  const [ticketNumber, setTicketNumber] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef(null);

  const generateTicket = () => {
    return `#ST-${Math.floor(100000 + Math.random() * 900000)}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande (máx 5MB)");
        return;
      }
      setAttachment(file);
      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const takeScreenshot = async () => {
    setIsCapturing(true);
    // Wait for the modal to be hidden from the DOM view if needed, 
    // but we'll use ignoreElements for a cleaner result.
    try {
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => element.classList.contains('support-modal-container'),
        backgroundColor: '#f8fafc' // Matches SUTil surface
      });
      
      canvas.toBlob((blob) => {
        const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
        setAttachment(file);
        setAttachmentPreview(canvas.toDataURL('image/png'));
      }, 'image/png');
    } catch (err) {
      console.error("Screenshot failed:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus('invalid_email');
      return;
    }

    setStatus('sending');
    const newTicket = generateTicket();
    setTicketNumber(newTicket);

    try {
      const data = new FormData();
      
      // 1. Campos de Configuración (Deben ir primero)
      data.append('_subject', `[SUTil Support] Nuevo Ticket: ${newTicket}`);
      data.append('_captcha', 'false');
      data.append('_template', 'table');
      
      // 2. Datos del Formulario
      data.append('ticket_id', newTicket);
      data.append('nombre', formData.name);
      data.append('email', formData.email);
      data.append('mensaje', formData.problem);
      
      // 3. Adjuntos (Deben ir al final para mejor compatibilidad con FormSubmit)
      const logs = getSystemLogs();
      if (logs) {
        const logsBlob = new Blob([logs], { type: 'text/plain' });
        const logsFile = new File([logsBlob], `diagnostico_${newTicket.replace('#', '')}.txt`, { type: 'text/plain' });
        data.append('attachment_logs', logsFile);
      }

      if (attachment) {
        // El campo principal se llama 'attachment' según docs de FormSubmit
        data.append('attachment', attachment);
      }

      const response = await fetch('https://formsubmit.co/soporte-sutil@yurakchalen.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      console.error("Support submission error:", error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed bottom-24 right-8 z-[110] w-96 bg-white/90 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-[2.5rem] p-12 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Reporte Enviado</h2>
        <p className="text-slate-500 mb-10 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
          TU NÚMERO DE TICKET ES:
        </p>
        <div className="bg-slate-50 rounded-3xl py-6 mb-10 border border-slate-100">
          <span className="text-3xl font-black text-slate-900 tracking-widest">{ticketNumber}</span>
        </div>
        <button onClick={onClose} className="w-full bg-black text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95">
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-24 right-8 z-[110] w-80 bg-white/80 backdrop-blur-2xl border border-white/30 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden animate-in slide-in-from-right-10 duration-500 text-slate-900 support-modal-container ${isCapturing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all`}>
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/20">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
             <Send className="w-4 h-4 text-white" />
           </div>
           <div>
             <h2 className="text-base font-black tracking-tight">Soporte SUTil</h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ayuda Directa</p>
           </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
          <X className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">Nombre</label>
          <input 
            required
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-100/50 border-none rounded-xl py-3 px-5 font-bold text-slate-900 focus:ring-4 focus:ring-slate-200 outline-none transition-all placeholder:text-slate-400 text-sm"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">Correo Electrónico</label>
          <input 
            required
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-slate-100/50 border-none rounded-xl py-3 px-5 font-bold text-slate-900 focus:ring-4 focus:ring-slate-200 outline-none transition-all placeholder:text-slate-400 text-sm"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">¿Qué sucedió?</label>
          <textarea 
            required
            rows="2"
            value={formData.problem}
            onChange={(e) => setFormData({...formData, problem: e.target.value})}
            className="w-full bg-slate-100/50 border-none rounded-xl py-3 px-5 font-bold text-slate-900 focus:ring-4 focus:ring-slate-200 outline-none transition-all resize-none placeholder:text-slate-400 text-sm"
          />
        </div>

        {/* Attachment Section */}
        <div className="pt-2">
          {!attachmentPreview ? (
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 text-slate-600 transition-colors"
                title="Adjuntar Imagen"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Adjuntar</span>
              </button>
              <button 
                type="button"
                onClick={takeScreenshot}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 text-slate-600 transition-colors"
                title="Capturar Pantalla"
              >
                <Camera className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-widest">Capturar</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          ) : (
            <div className="relative group bg-slate-50 p-2 rounded-2xl border border-slate-100 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img src={attachmentPreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-slate-900 uppercase truncate">Imagen Lista</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">PNG / Screenshot</p>
                </div>
                <button 
                  onClick={removeAttachment}
                  className="p-2 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          {status === 'invalid_email' && (
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-widest text-center animate-bounce mb-2">Correo no válido.</p>
          )}

          <button 
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {status === 'sending' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Enviar Ticket"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
