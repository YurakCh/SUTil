/**
 * @fileoverview SUTil PDF Official MDT Parser
 * 
 * Extracts employee records from compiled government PDF documents without relying
 * on spatial constraints (XY coordinates) that often break over long tables.
 * Employs an Iterator Finite State Machine (FSM) via an Anchor Algorithm.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for browser environment using Vite's URL import
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Generates a unique ID based on Math.random and Date.now for internal React keys and DB indexing.
 * @returns {string} Unique ID.
 */
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

/**
 * Extracts payroll data from an official SUT PDF buffer.
 * @param {ArrayBuffer} arrayBuffer - The binary PDF buffer loaded from the filesystem.
 * @returns {Promise<{employees: Array<Object>, mode: string}>} Extraction result with inferred mode.
 * @throws {Error} If the structure is unreadable or no anchor points are found.
 */
export async function parseSutPdf(arrayBuffer) {
  try {
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // --- FASE 1: DESCOMPRESIÓN Y LINEALIZACIÓN ---
    // Extract everything into a flat array of valid text tokens.
    let allTokens = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const tokens = textContent.items
        .map(item => item.str.trim())
        .filter(str => str.length > 0);
      allTokens.push(...tokens);
    }
    
    // --- FASE 2: MOTOR HEURÍSTICO (DETECCIÓN DE MODO) ---
    // Read the first 50 tokens to fingerprint the report type.
    const headerText = allTokens.slice(0, 50).join(' ').toLowerCase();
    let mode = 'decimo4'; // default fallback
    
    if (headerText.includes('décimotercera') || headerText.includes('decimotercera')) {
      mode = 'decimo3';
    } else if (headerText.includes('utilidades') || headerText.includes('participación')) {
      mode = 'utilidades';
    }

    // --- FASE 3: LOCALIZACIÓN DE TABLA ---
    // The table payload always starts after the final column header "FIRMA" or "FIRMA_O_HUELLA_DIG"
    let tableStartIndex = -1;
    for (let i = 0; i < allTokens.length; i++) {
      const t = allTokens[i].toUpperCase();
      if (t === 'FIRMA_O_HUELLA_DIG' || t === 'FIRMA') {
        tableStartIndex = i + 1;
        break;
      }
    }
    
    // Fallback Localization: Look for the first standalone "1" directly followed by a 10-digit Cedula
    if (tableStartIndex === -1) {
      for (let i = 0; i < allTokens.length - 1; i++) {
        if (allTokens[i] === '1' && /^[0-9]{10}$/.test(allTokens[i+1])) {
          tableStartIndex = i;
          break;
        }
      }
    }

    if (tableStartIndex === -1) {
      throw new Error("No se pudo detectar una tabla de empleados del SUT válida en este PDF.");
    }

    // --- FASE 4: MÁQUINA DE ESTADOS ITERADORA (ALGORITMO ANCLA) ---
    const employees = [];
    let currentEmployeeNum = 1;
    let index = tableStartIndex;

    while (index < allTokens.length) {
      // ANCLA PRINCIPAL: Seek the current correlative numeral AND verify the next token is a Cedula format.
      if (allTokens[index] === currentEmployeeNum.toString() && /^[A-Z0-9-]{10,13}$/.test(allTokens[index + 1])) {
        
        // --- Extracción Básica (Core Mappings Identical Across MDT Formats) ---
        const emp = {
          id: generateId(),
          identificacion: allTokens[index + 1],
          apellido: allTokens[index + 2] || '',
          nombre: allTokens[index + 3] || '',
          codigoIESS: allTokens[index + 4] || '',
          genero: (allTokens[index + 5] || 'M').toUpperCase(),
          dias: parseInt(allTokens[index + 6]) || 0,
        };

        // --- Extracción Específica por Capa (Modo) ---
        const asNum = (val) => parseFloat(val?.replace(',', '.') || 0);
        
        if (mode === 'decimo3') {
          // D13: [7 = Total Ganado], [8 = Retención]
          emp.sueldo = asNum(allTokens[index + 7]);
          emp.valorRetencion = asNum(allTokens[index + 8]);
        } else if (mode === 'decimo4') {
          // D14: Sueldo not extracted contextually. [8 = Retención]
          emp.valorRetencion = asNum(allTokens[index + 8]);
        } else if (mode === 'utilidades') {
          // Utilidades: [7 = Cargas], [10 = Retención]. Offsets adjusted for 10% and 5% columns.
          emp.cargas = parseInt(allTokens[index + 7]) || 0;
          emp.valorRetencion = asNum(allTokens[index + 10]);
        }

        employees.push(emp);
        currentEmployeeNum++;
        
        // Optimización FSM: Saltar iteraciones estáticas para ahorrar ciclos, dejando margen de seguridad
        index += 6; 
      } else {
        // --- GATILLO DE CIERRE ---
        // If we hit known report footers ("TOTAL", "DESCRIPCIÓN"), kill the FSM loop early.
        const t = allTokens[index].toUpperCase();
        if (t === 'DESCRIPCIÓN' || t === 'TOTAL PAGOS' || t === 'MUJERES' || t === 'TOTAL GENERAL') {
          break;
        }
        index++;
      }
    }

    return { employees, mode };
  } catch (error) {
    // Keep internal stack trace for maintainers, user sees clean UI error
    console.error("PDF Parsing Internal Error:", error);
    throw new Error("El archivo no es un PDF de nómina oficial reconocible del SUT.");
  }
}
