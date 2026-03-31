import * as pdfjsLib from 'pdfjs-dist';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Extrae texto de un archivo PDF y devuelve una estructura de "celdas" o "líneas"
 * para ser mapeadas por el usuario.
 * @param {File} file 
 * @returns {Promise<Array>}
 */
export const extractPdfContent = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const content = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Agrupar items por posición Y para intentar reconstruir filas
    const items = textContent.items.map(item => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height
    }));

    content.push({ page: i, items });
  }

  return content;
};

/**
 * Intenta normalizar el contenido extraído en una tabla simple
 * basándose en la proximidad vertical y horizontal.
 */
export const normalizePdfText = (pdfPages) => {
  const rows = [];
  pdfPages.forEach(page => {
    // Ordenar por Y desc (arriba a abajo) y luego por X
    const sortedItems = [...page.items].sort((a, b) => b.y - a.y || a.x - b.x);
    
    let currentRow = [];
    let lastY = -1;

    sortedItems.forEach(item => {
      // Ajuste de umbral: SUT PDFs tienen variaciones sutiles en Y
      const Y_THRESHOLD = 8; 
      
      if (lastY === -1 || Math.abs(item.y - lastY) < Y_THRESHOLD) {
        currentRow.push(item);
      } else {
        if (currentRow.length > 0) {
          // Ordenar siempre por X para asegurar el orden de las columnas
          rows.push(currentRow.sort((a,b) => a.x - b.x));
        }
        currentRow = [item];
      }
      lastY = item.y;
    });
    if (currentRow.length > 0) rows.push(currentRow.sort((a,b) => a.x - b.x));
  });

  return rows.map(row => row.map(cell => cell.str).join(' '));
};
