import React from 'react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-none transition-all">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-full mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tighter text-blue-800 dark:text-blue-300 font-headline">SUTil</span>
            <div className="hidden md:flex gap-6">
              <a href="#tutoriales" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium tracking-tight">Tutoriales</a>
              <a href="#contacto" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium tracking-tight">Soporte</a>
              <a href="#privacidad" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors font-medium tracking-tight">Privacidad</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onEnter}
              className="px-5 py-2 bg-primary/10 text-primary font-bold hover:bg-primary/20 rounded-lg transition-all active:scale-95 duration-150 ease-in-out">
              Abrir App
            </button>
          </div>
        </div>
        <div className="bg-slate-100/50 dark:bg-slate-800/50 h-[1px] w-full absolute bottom-0"></div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-semibold mb-6 tracking-wide uppercase">
                Sistema Unificado del Trabajo
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
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all active:scale-95 shadow-md hover:shadow-lg">
                  Ir a la App
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-surface-container-lowest rounded-xl p-4 shadow-2xl relative z-10 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-lg w-full object-cover border-4 border-white/50" 
                  src="/sutil_dashboard_mockup.png" 
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
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-all duration-300 border-b-4 border-transparent hover:border-primary shadow-sm hover:shadow-xl">
                <div className="bg-primary-fixed w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Carga Manual o Plantilla</h3>
                <p className="text-on-surface-variant leading-relaxed">Agregue colaboradores uno a uno usando la interfaz fluida, o descargue la plantilla universal de SUTil y escríbalos en Excel.</p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-all duration-300 border-b-4 border-transparent hover:border-primary shadow-sm hover:shadow-xl">
                <div className="bg-secondary-container w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary text-3xl">csv</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Importación Mágica</h3>
                <p className="text-on-surface-variant leading-relaxed">Cargue los XLS/CSV de su nómina antigua. Nuestra heurística reordena automáticamente los datos y reestructura los Nombres ecuatorianos.</p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-2xl flex flex-col items-start hover:-translate-y-1 transition-all duration-300 border-b-4 border-transparent hover:border-primary shadow-sm hover:shadow-xl">
                <div className="bg-tertiary-fixed w-14 h-14 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-tertiary text-3xl">picture_as_pdf</span>
                </div>
                <h3 className="font-headline text-xl font-bold mb-3 text-on-surface">Extracción NATIVA PDF</h3>
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
             <div className="lg:w-1/2 w-full">
                <div className="bg-surface-container-high p-4 rounded-3xl shadow-inner isolate aspect-video flex items-center justify-center cursor-pointer group hover:bg-surface-container-highest transition-colors">
                   <div className="bg-white/90 backdrop-blur w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-primary text-4xl ml-2">play_arrow</span>
                   </div>
                   <span className="absolute bottom-6 font-semibold text-slate-500">Tutorial Rápido (Próximamente)</span>
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
                  <a href="https://github.com" target="_blank" className="flex items-center gap-3 text-primary hover:text-primary-container transition-colors text-lg font-medium group">
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

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado de prueba (Local UI Solo).") }}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-on-surface block">Nombre del Contador</label>
                       <input type="text" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-semibold text-on-surface block">Correo de respuesta</label>
                       <input type="email" required className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="juan@contabilidad.ec" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface block">Sugerencia o Descripción del Problema</label>
                    <textarea required rows="4" className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" placeholder="El archivo CSV del SUT de la variante de Costa exporta el campo..."></textarea>
                 </div>
                 <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">send</span> Enviar Reporte
                 </button>
              </form>
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
      <footer className="bg-surface-container-lowest relative z-10 w-full border-t border-slate-200 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-extrabold text-slate-900 font-headline text-lg">SUTil</span>
            <span className="text-slate-500 text-sm font-medium">SUTil - Tu SUT ya. Open-source para Ecuador.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a href="https://github.com" target="_blank" className="text-slate-500 hover:text-primary transition-colors font-medium">GitHub</a>
            <a href="#privacidad" className="text-slate-500 hover:text-primary transition-colors font-medium">Política de Privacidad</a>
            <span className="text-slate-400 font-medium">Versión Local B2.0</span>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest px-4 py-2 bg-slate-100 rounded-full">
            Hecho en 🇪🇨 Ecuador
          </div>
        </div>
      </footer>
    </div>
  );
}
