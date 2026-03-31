# SUTil - Tu SUT ya. 🇪🇨

Herramienta Web open-source potente y confidencial para contadores ecuatorianos. Simplifica, valida y autocompleta cálculos de Utilidades, Décimo Tercero y Décimo Cuarto sueldo para subirlos masivamente al Ministerio de Trabajo (SUT).

Acepta plantillas Universales de Excel (XLSX), documentos CSV y lee directamente datos de las actas de legalización PDF pasadas del MDT.

## 🚀 Beneficios Estelares
- **Privacidad Local al 100%:** SUTil se ejecuta íntegramente en el navegador usando tecnologías Web. **Ningún** dato contable, cédula o archivo salarial viaja a la nube. Podrías desconectar el internet y el programa seguirá operando perfectamente.
- **Importación Mágica:** Succiona archivos crudos de años anteriores y reestructura tanto los datos numéricos como los Nombres/Apellidos confusos ecuatorianos.
- **Motor Parseador PDF:** Extrae inteligentemente información tabular de los actas oficiales del Ministerio y asimila los montos sin necesidad de tipeo manual.

## 🛠️ Cómo Levantar SUTil en tu Computadora (Local Server)

Para ejecutar tu propia instancia aislada del Software de forma local y segura, sigue estos sencillos tres pasos:

### 1. Requisitos Previos
- Debes tener instalado en tu computadora **[Node.js](https://nodejs.org/)** (Versión 18 o superior).
- Conexión a internet solo para descargar los paquetes iniciales.

### 2. Copia y Descarga
Abre la consola de comandos de tu sistema y clona el proyecto, o dale al botón "Code -> Download ZIP" de este repositorio, extrae la carpeta y ábrela en consola.

```bash
git clone https://github.com/YurakCh/SUTil.git
cd SUTil
```

### 3. Instalación de Dependencias
Descarga las librerías necesarias de procesamiento de hojas de cálculo e interfaz (Como Tailwind CSS y React) ejecutando:

```bash
npm install
```

### 4. Lanzar Aplicación 
Levanta el servidor local con un comando simple:

```bash
npm run dev
```
La terminal arrojara un enlace (Usualmente `http://localhost:5173/`). Dale clic o cópialo en tu explorador (Edge, Chrome, Safari) para empezar a usar SUTil en tu máquina por completo.

## 🤝 Soporte y Feedback
Si encuentras que una variante particular de un PDF del SUT no es detectada, o algún cálculo necesita ser actualizado al nuevo rubro legal ecuatoriano, siéntete libre de abrir un **Issue** publicando detalles del problema.

---
*Hecho en Ecuador para alivianar la carga burocrática del contador.*
