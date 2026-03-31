import React, { useState } from 'react';

export default function LandingPage({ onEnter }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/formsutil@yurakchalen.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      });
      
      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        alert("Ocurrió un error al enviar el mensaje. Intente de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Verifique su internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* Beta Notice Banner */}
      <div className="bg-slate-100/50 border-b border-slate-200 text-slate-500 py-2 px-6 text-center text-xs font-bold tracking-tight">
        🚀 Modo Beta: SUTil aprende de tu uso para refinar la herramienta. Tu información personal sigue 100% segura y privada.
      </div>

      {/* TopNavBar */}
      <nav className="bg-slate-800 sticky top-0 z-50 shadow-lg transition-all">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-full mx-auto">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }} className="text-2xl font-black tracking-tighter text-white font-headline hover:opacity-80 transition-opacity flex items-center gap-2">SUTil <span className="text-blue-500 text-[10px] bg-blue-500/10 px-1 py-0.5 rounded uppercase tracking-widest">Beta</span></a>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#tutoriales" className="text-slate-400 hover:text-white transition-colors font-semibold tracking-tight text-sm">Tutoriales</a>
              <a href="#soporte" className="text-slate-400 hover:text-white transition-colors font-semibold tracking-tight text-sm">Soporte</a>
              <a href="#privacidad" className="text-slate-400 hover:text-white transition-colors font-semibold tracking-tight text-sm">Privacidad</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onEnter}
              className="px-6 py-2.5 bg-blue-500/10 text-blue-400 font-black text-xs uppercase tracking-widest hover:bg-blue-500/20 rounded-lg transition-all active:scale-95 duration-150 ease-in-out">
              Abrir App
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="text-on-surface text-sm font-bold mb-6 tracking-wide uppercase">
                SISTEMA UNIFICADO DEL TRABAJO
              </div>
              <h1 className="font-headline font-extrabold text-6xl md:text-7xl lg:text-8xl tracking-tighter text-on-surface mb-6 leading-none">
                Tu SUT ya.
              </h1>
              <p className="text-on-surface-variant text-xl md:text-2xl max-w-xl mb-10 leading-relaxed">
                La herramienta web definitiva para contadores ecuatorianos. Reporta décimos y utilidades sin complicaciones, con total privacidad.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onEnter}
                  className="bg-gradient-to-r from-primary to-surface-container-lowest border-none outline-none text-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all active:scale-95 shadow-sm text-center">
                  Ir a la App
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xl relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-lg w-full object-cover border-4 border-white/50" 
                  src="./sutil_dashboard_mockup.png" 
                />
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Explanation Section */}
        <section className="bg-surface-container-low py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4">¿Cómo funciona?</h2>
              <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">SUTil simplifica el proceso de carga de datos al SUT en tres pasos intuitivos.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl flex flex-col items-start hover:-translate-y-2 transition-all duration-300 border-b-4 border-transparent hover:border-primary shadow-sm hover:shadow-xl">
                <div className="mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface text-3xl font-bold">person_add</span>
                </div>
                <h3 className="font-headline text-xl font-extrabold mb-3 text-on-surface">Carga Manual o Plantilla</h3>
                <p className="text-on-surface-variant leading-relaxed">Agregue colaboradores uno a uno usando la interfaz fluida, o descargue la plantilla universal de SUTil y escríbalos en Excel.</p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl flex flex-col items-start hover:-translate-y-2 transition-all duration-300 border-b-4 border-transparent hover:border-secondary shadow-sm hover:shadow-xl">
                <div className="mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface text-3xl font-bold">csv</span>
                </div>
                <h3 className="font-headline text-xl font-extrabold mb-3 text-on-surface">Importación Mágica</h3>
                <p className="text-on-surface-variant leading-relaxed">Cargue los XLS/CSV de su nómina antigua. Nuestra heurística reordena automáticamente los datos y reestructura los Nombres ecuatorianos.</p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-3xl flex flex-col items-start hover:-translate-y-2 transition-all duration-300 border-b-4 border-transparent hover:border-tertiary shadow-sm hover:shadow-xl">
                <div className="mb-6 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface text-3xl font-bold">picture_as_pdf</span>
                </div>
                <h3 className="font-headline text-xl font-extrabold mb-3 text-on-surface">Extracción NATIVA PDF</h3>
                <p className="text-on-surface-variant leading-relaxed">Lea e interprete instantáneamente constancias gubernamentales en PDF. El motor deduce los montos automáticamente para generar validaciones cruzadas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tutoriales e Instrucciones Section */}
        <section id="tutoriales" className="py-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
             <div className="lg:w-1/2">
                <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-6">
                   Curva de aprendizaje <span className="text-primary italic">plana.</span>
                </h2>
                <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
                   No necesita capacitaciones. Ingrese, arrastre su archivo crudo y los algoritmos organizarán las celdas al instante.
                </p>
                
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="bg-primary-fixed text-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                      <div>
                         <h4 className="font-bold text-on-surface text-lg">Suelta tu Archivo</h4>
                         <p className="text-on-surface-variant">Arrastra un CSV, Excel o PDF sobre el dashboard y espera un segundo.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="bg-primary-fixed text-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                      <div>
                         <h4 className="font-bold text-on-surface text-lg">Verifica Mapeo</h4>
                         <p className="text-on-surface-variant">SUTil adivinará dónde están los Nombres y Sueldos. Confírmalo con un click.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="bg-primary-fixed text-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
                      <div>
                         <h4 className="font-bold text-on-surface text-lg">Verifica la Información</h4>
                         <p className="text-on-surface-variant">Comprueba los montos y días laborados. Como los PDFs del MDT son reportes de años anteriores, asegúrate de actualizar las métricas a las actuales dando un click a la celda.</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="bg-primary-fixed text-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold">4</div>
                      <div>
                         <h4 className="font-bold text-on-surface text-lg">Descarga Oficial</h4>
                         <p className="text-on-surface-variant">Click en "Exportar". SUTil escupirá un CSV validado con la estructura exacta que exige el sistema del Ministerio de Trabajo.</p>
                      </div>
                   </div>
                </div>
             </div>
             <div className="lg:w-1/2 w-full flex items-center justify-center p-8">
                 <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center bg-surface-container-lowest/30 shadow-none hover:bg-surface-container-low/50 transition-colors">
                    <span className="material-symbols-outlined text-outline-variant text-5xl mb-4">smart_display</span>
                    <p className="text-outline-variant font-medium text-sm">Videotutorial Próximamente</p>
                 </div>
              </div>
           </div>
         </section>

        {/* Open-Source & Privacy Section */}
        <section id="privacidad" className="py-20 px-6 overflow-hidden bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="bg-transparent rounded-[2rem] py-8 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
              <div className="lg:w-1/2 relative z-10">
                <div className="inline-flex items-center gap-2 text-on-surface mb-6">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <span className="font-bold tracking-widest uppercase text-xs">Privacidad por Diseño</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-8 leading-tight">
                    Sus datos contables jamás salen del navegador.
                </h2>
                <p className="text-on-surface-variant text-lg md:text-xl mb-10 leading-relaxed">
                    SUTil procesa tu información salarial directamente en tu computadora. No almacenamos, copiamos, ni enviamos a la nube las bases de datos o las cédulas de los trabajadores. Podrías desconectar el internet, y SUTil seguiría funcionando.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <a href="https://github.com/YurakCh/SUTil" target="_blank" className="flex items-center gap-3 text-primary hover:text-primary-container transition-colors text-lg font-medium group">
                    <span className="material-symbols-outlined text-3xl">code</span>
                    <span>Inspeccionar Código Fuente</span>
                  </a>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10 w-full">
                <div className="bg-surface-container-lowest/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-on-surface font-bold text-3xl mb-2">100%</h4>
                  <p className="text-on-surface-variant text-sm">Privado y confidencial</p>
                </div>
                <div className="bg-surface-container-lowest/80 rounded-2xl p-6 shadow-sm mt-8 hover:shadow-md transition-shadow">
                  <h4 className="text-on-surface font-bold text-3xl mb-2">Gratis</h4>
                  <p className="text-on-surface-variant text-sm">Sin licencias mensuales</p>
                </div>
                <div className="bg-surface-container-lowest/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-on-surface font-bold text-3xl mb-2">Limpio</h4>
                  <p className="text-on-surface-variant text-sm">Sin publicidad invasiva</p>
                </div>
                <div className="bg-surface-container-lowest/80 rounded-2xl p-6 shadow-sm mt-8 hover:shadow-md transition-shadow">
                  <h4 className="text-on-surface font-bold text-3xl mb-2">Rápido</h4>
                  <p className="text-on-surface-variant text-sm">Resultados en segundos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contacto" className="py-32 px-6">
           <div className="max-w-3xl mx-auto bg-white border border-outline-variant/30 rounded-3xl p-8 md:p-14 shadow-lg isolate overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
              
              <div className="text-center mb-12">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-4">Preguntas y Bugs</h2>
                 <p className="text-on-surface-variant max-w-xl mx-auto">
                   ¿Encontraste un problema con el parser de Excel o necesitas una característica contable nueva? Envíanos feedback.
                 </p>
              </div>

              {submitSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold text-emerald-800">¡Mensaje Recibido Encriptado!</h3>
                  <p className="text-emerald-700 font-medium">Gracias por contactarnos. Cerraremos el ticket a la brevedad posible.</p>
                  <button onClick={() => setSubmitSuccess(false)} className="mt-4 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">Enviar otro mensaje</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-sm font-semibold text-on-surface block">Nombre del Contador</label>
                         <input type="text" name="name" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Juan Pérez" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-sm font-semibold text-on-surface block">Correo de respuesta</label>
                         <input type="email" name="email" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="juan@contabilidad.ec" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface block">Sugerencia o Descripción del Problema</label>
                      <textarea name="message" required rows="4" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="El archivo CSV del SUT de la variante de Costa exporta el campo..."></textarea>
                   </div>
                   <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                      {isSubmitting ? <span className="material-symbols-outlined animate-spin shadow-none">refresh</span> : <span className="material-symbols-outlined">send</span>}
                      {isSubmitting ? "Enviando Seguro..." : "Enviar Reporte"}
                   </button>
                </form>
              )}
           </div>
        </section>

        {/* Trust / Visual Highlight Section */}
        <section className="pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <div className="w-full h-[1px] bg-outline-variant/20 mb-20"></div>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-duration-500">
              <div className="flex items-center gap-3 font-headline font-bold text-lg md:text-xl text-slate-800">
                <span className="material-symbols-outlined text-3xl text-blue-600">account_balance</span>
                SOPORTADO OFICIALMENTE SUT
              </div>
              <div className="flex items-center gap-3 font-headline font-bold text-lg md:text-xl text-slate-800">
                <span className="material-symbols-outlined text-3xl text-emerald-600">shield</span>
                SECURE BROWSER ENGINE
              </div>
              <div className="flex items-center gap-3 font-headline font-bold text-lg md:text-xl text-slate-800">
                <span className="material-symbols-outlined text-3xl text-orange-600">data_object</span>
                EXCEL & CSV COMPLIANT
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-6 relative z-10 w-full overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
               <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
               <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }} className="font-extrabold text-white font-headline text-2xl tracking-wide hover:opacity-80 transition-opacity cursor-pointer">SUTil</a>
            </div>
            <span className="text-slate-400 text-sm font-medium leading-relaxed">
               Automatización contable de nómina SUT.<br/>
               Desarrollado por <a href="https://yurakchalen.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-container">Yurak Chalen</a>.
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <a href="https://github.com/YurakCh/SUTil" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors font-semibold flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-700/50">
               <span className="material-symbols-outlined text-[18px]">code</span>
               GitHub
            </a>
            <a href="#privacidad" className="text-slate-300 hover:text-white transition-colors font-semibold flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 px-5 py-2.5 rounded-xl border border-slate-700/50">
               <span className="material-symbols-outlined text-[18px]">policy</span>
               Privacidad
            </a>
            <span className="text-slate-500 font-bold border-l border-slate-700 pl-6 md:pl-8 py-2 ml-2 md:ml-4">v2.5.0</span>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-slate-300 text-[10px] font-black uppercase tracking-widest px-6 py-4 bg-slate-950/50 rounded-2xl shadow-inner border border-slate-800 flex items-center gap-3">
               HECHO EN 
               <div className="relative flex flex-col overflow-hidden rounded-[2px] shadow-md shadow-black/20 opacity-90 grayscale-0 hover:grayscale-0 transition-all cursor-crosshair">
                 <div className="w-[16px] h-[6px] bg-[#FFD100]"></div>
                 <div className="w-[16px] h-[3px] bg-[#005CE6]"></div>
                 <div className="w-[16px] h-[3px] bg-[#EF3340]"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[4px] h-[5px] bg-[#89B9C7] border-[0.5px] border-[#8a681c] rounded-[1px] shadow-sm"></div>
               </div>
               ECUADOR
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
