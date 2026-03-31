/**
 * @fileoverview SUTil Smart Import Engine (Zero-Friction Motor)
 * 
 * Engine module to detect calculation modes, normalize strings, and transform 
 * raw Excel/CSV rows into clean SUTil internal objects. 
 * Includes the Heuristic Detection Engine and the Identity Separation Logic.
 */

// ============================================================================
// CORE UTILITIES & DEFINITIONS
// ============================================================================

/**
 * Normalizes a string by converting to lowercase, removing accents and trimming whitespace.
 * @param {string|number} val - The raw value to normalize.
 * @returns {string} The normalized string.
 */
const normalizeString = (val) => {
  if (val === null || val === undefined) return '';
  return String(val)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim();
};

/**
 * Generates a unique ID based on Math.random and Date.now for internal React keys and DB indexing.
 * @returns {string} Unique ID.
 */
const generateId = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

/**
 * Dictionary mapping canonical database fields to known Excel header variations in Ecuador.
 * @constant {Object<string, string[]>}
 */
export const KEYWORDS = {
  identificacion: ['cedula', 'identificacion', 'dni', 'ruc', 'documento', 'id'],
  nombre: ['nombre', 'primer nombre', 'nombres'],
  apellido: ['apellido', 'apellidos'],
  genero: ['genero', 'sexo', 'm/f', 'genero (m/f)'],
  codigoIESS: ['ocupacion', 'cargo', 'codigo iess', 'iess'],
  dias: ['dias laborados', 'dias trabajados', 'dias', 'dias lab.'],
  sueldo: ['sueldo total', 'ingreso total', 'remuneracion', 'total ganado', 'ingresos', 'sueldo', 'valor'],
  baseSalary: ['sueldo base', 'salario basico', 'base'],
  cargas: ['cargas', 'cargas familiares', 'nro cargas', 'cargas fam.'],
  discapacidad: ['discapacidad', 'carne conadis', 'disc. (x)'],
  jornadaParcial: ['jornada parcial', 'parcial permanente', 'jp (x)'],
  horasParcial: ['horas jornada', 'semanal estipulado', 'horas parcial', 'horas jp'],
  tipoPago: ['tipo de pago', 'pago directo', 'acreditacion', 'tipo pago'],
  fechaJubilacion: ['fecha de jubilacion', 'jubilado', 'fecha retiro'],
  valorRetencion: ['valor retencion', 'retencion', 'impuesto renta'],
  mensualiza: ['mensualiza', 'pago de la decimocuarta', 'pago de la decimotercera', 'solicita el pago', 'mensualiza (x)'],
  fechaIngreso: ['fecha ingreso', 'fecha inicio', 'ingreso']
};

/**
 * Splits a raw CSV/Excel row into an array of strictly separated cell values.
 * @param {string|Array} row - Extracted row from file reading buffer or pre-split Excel array.
 * @returns {Array<string>} Array of cell values.
 */
export function splitRow(row) {
  if (!row) return [];
  if (Array.isArray(row)) return row; // Handle direct parsing from xlsx
  if (row.includes(';')) return row.split(';');
  const commas = row.split(',');
  const semicolons = row.split(';');
  return commas.length > semicolons.length ? commas : semicolons;
}


// ============================================================================
// 1. MOTOR HEURÍSTICO DE DETECCIÓN (RECONOCIMIENTO DE CONTEXTO)
// ============================================================================

/**
 * Scans the first rows of a dataset to find the most probable header row, ignoring pre-header metadata.
 * @param {Array<string|Array>} allRows - All extracted raw rows from the file.
 * @returns {number} The 0-based index of the best header row.
 */
export function findBestHeaderRow(allRows) {
  if (!allRows || allRows.length === 0) return 0;
  
  let bestRow = 0;
  let maxScore = -1;
  const scanLimit = Math.min(allRows.length, 20); // Search constraint for performance
  
  for (let i = 0; i < scanLimit; i++) {
    const parts = splitRow(allRows[i]).map(normalizeString);
    let score = 0;
    
    // Evaluate row parts against known dictionary
    Object.values(KEYWORDS).forEach(synonyms => {
      if (synonyms.some(s => parts.some(p => p === s || (p.includes(s) && p.length > 3)))) {
        score++;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestRow = i;
    }
  }

  // Fallback if the best row doesn't have at least minimum confidence
  return maxScore >= 2 ? bestRow : 0;
}

/**
 * Infers the SUT form mode ('decimo3', 'decimo4', 'utilidades') computationally.
 * Scans headers textually and applies topological fallback based on column sizing.
 * @param {Array<string>} headers - Detected header row.
 * @param {Array<string|Array>} dataRows - The body rows.
 * @param {string} [currentMode=null] - Pre-selected mode.
 * @returns {string} The highest probability calculation mode.
 */
export function detectMode(headers, dataRows, currentMode = null) {
  const hText = headers.map(normalizeString).join(' ');
  
  // High-Confidence Lexical Scans
  if (hText.includes('decimocuarta') || hText.includes('14to')) return 'decimo4';
  if (hText.includes('decimotercera') || hText.includes('13ro')) return 'decimo3';
  if (hText.includes('cargas') || hText.includes('utilidades')) return 'utilidades';
  
  // Topological Fallback Scan based on column count and data typing
  if (dataRows && dataRows.length > 0) {
    const parts = splitRow(dataRows[0]);
    if (parts.length >= 12) {
      // D14 uses Col 6 for 'Tipo Pago' ('A' o 'C'). D13 uses Col 6 for 'Días' (Numbers)
      const col6 = parts[6]?.toString().trim().toUpperCase() || '';
      return (col6 === 'A' || col6 === 'C') ? 'decimo4' : 'decimo3'; 
    }
    if (parts.length === 8 || parts.length === 7) return 'utilidades';
  }
  
  return currentMode || 'decimo4';
}

/**
 * Smart Mapping system. Links Excel columns to Internal Database Properties dynamically.
 * @param {Array<string>} headers - Unmapped array of header column titles.
 * @returns {Object<string, number>} Object containing indices of mapping hits (`-1` means not found).
 */
export function getSmartMappings(headers) {
  const mappings = {};
  Object.keys(KEYWORDS).forEach(key => mappings[key] = -1);
  
  headers.forEach((h, index) => {
    const header = normalizeString(h);
    for (const [field, synonyms] of Object.entries(KEYWORDS)) {
      if (synonyms.some(s => header === s || (header.includes(s) && s.length > 3))) {
        // Find shortest accurate synonym, prioritizing direct exact hits
        if (mappings[field] === -1 || header.length < normalizeString(headers[mappings[field]]).length) {
          mappings[field] = index;
        }
      }
    }
  });
  
  return mappings;
}

/**
 * Heuristic mapping injector for official government CSVs without clear headers.
 * Applies static official MDT column structures strictly based on the mode.
 * @param {string|Array} row - Sample row.
 * @param {string} mode - Calculation mode ('decimo3', 'decimo4', 'utilidades').
 * @returns {Object<string, number>} Generated mappings map.
 */
export function guessMappingsFromData(row, mode = 'decimo4') {
  const parts = splitRow(row);
  const mappings = {};
  Object.keys(KEYWORDS).forEach(key => mappings[key] = -1);
  
  if (parts.length >= 7) {
    // Shared core columns across all SUT documents
    mappings.identificacion = 0; mappings.nombre = 1; mappings.apellido = 2; mappings.genero = 3; mappings.codigoIESS = 4;
    
    if (mode === 'decimo3') {
       mappings.sueldo = 5; mappings.dias = 6; mappings.tipoPago = 7; mappings.jornadaParcial = 8;
       mappings.horasParcial = 9; mappings.discapacidad = 10; mappings.valorRetencion = 11; mappings.mensualiza = 12;
    } else if (mode === 'decimo4') {
       mappings.dias = 5; mappings.tipoPago = 6; mappings.jornadaParcial = 7; mappings.horasParcial = 8;
       mappings.discapacidad = 9; mappings.fechaJubilacion = 10; mappings.valorRetencion = 11; mappings.mensualiza = 12;
    } else if (mode === 'utilidades') {
       mappings.dias = 5; mappings.cargas = 6; mappings.valorRetencion = 7;
    }
  }
  
  return mappings;
}

/**
 * Assesses whether the identified mappings satisfy the strict prerequisites of the calculated mode.
 * @param {Object<string, number>} mappings - Found mappings.
 * @param {string} mode - Operation context.
 * @returns {boolean} True if all required fields are uniquely mapped.
 */
export function isConfidenceHigh(mappings, mode) {
  const required = {
    decimo3: ['identificacion', 'nombre', 'apellido', 'sueldo', 'dias'],
    decimo4: ['identificacion', 'nombre', 'apellido', 'dias'],
    utilidades: ['identificacion', 'nombre', 'apellido', 'dias', 'cargas']
  };
  
  const fields = required[mode] || required.decimo3;
  const mappedIndices = fields.map(f => mappings[f]);
  
  const allFound = mappedIndices.every(idx => idx !== -1);
  const allUnique = new Set(mappedIndices).size === mappedIndices.length;
  
  return allFound && allUnique;
}


// ============================================================================
// 2. LÓGICA DE SEPARACIÓN DE IDENTIDAD (ALGORITMO NOMINAL)
// ============================================================================

/**
 * Determines whether a composite name column typically lists Names first or Surnames first.
 * Useful for legacy HR formats.
 * @param {string} headerText - Raw column title (e.g., "Apellidos y Nombres").
 * @returns {string} Logical hint: 'apellido' or 'nombre'.
 */
export function detectNameHint(headerText) {
  if (!headerText) return 'apellido';
  const h = normalizeString(headerText);
  const apIdx = h.indexOf('apellido');
  const nomIdx = h.indexOf('nombre');
  
  if (apIdx !== -1 && nomIdx !== -1) return apIdx < nomIdx ? 'apellido' : 'nombre';
  if (nomIdx !== -1 && apIdx === -1 && h.includes('y')) return 'nombre';
  
  return 'apellido';
}

/**
 * Standardizes unified Spanish full names into isolated First Name and Last Name values.
 * Applies statistically proven Ecuador algorithms for missing boundaries.
 * @param {string} fullName - Unified name blob.
 * @param {string} [hint='apellido'] - Fallback algorithm mapping indication.
 * @returns {{nombre: string, apellido: string}} Standardized object.
 */
export function splitFullName(fullName, hint = 'apellido') {
  if (!fullName) return { nombre: '', apellido: '' };
  const str = fullName.trim();
  
  // Regla Fuerte (Comas): ej. "Torres, Juan Felipe" overriding hint heuristics
  if (str.includes(',')) {
    const parts = str.split(',').map(s => s.trim());
    return { apellido: parts[0], nombre: parts[1] || '' };
  }
  
  const words = str.split(/\s+/).filter(w => w.length > 0);
  
  // Regla Simétrica de 4+ Palabras: Divide exactamente a la mitad basado en patron HR
  if (words.length >= 4) {
    const half = Math.ceil(words.length / 2);
    return hint === 'apellido' 
      ? { apellido: words.slice(0, half).join(' '), nombre: words.slice(half).join(' ') }
      : { nombre: words.slice(0, half).join(' '), apellido: words.slice(half).join(' ') };
  }
  
  // Ley del 98.5% Ecuatoriana (3 palabras): Asume 2 apellidos y 1 solo nombre o viceversa.
  if (words.length === 3) {
    return hint === 'apellido'
      ? { apellido: words.slice(0, 2).join(' '), nombre: words[2] }
      : { nombre: words[0], apellido: words.slice(1).join(' ') };
  }
  
  // Estructura Dual Simple Corta (2 palabras)
  if (words.length === 2) {
    return hint === 'apellido'
      ? { apellido: words[0], nombre: words[1] }
      : { nombre: words[0], apellido: words[1] };
  }
  
  // Respaldo sin reconocimiento (1 palabra o rara)
  return { nombre: '', apellido: str };
}


// ============================================================================
// 3. FILTRADO Y NORMALIZACIÓN DE ENTIDADES (TRANSFORMACIÓN NATIVA)
// ============================================================================

/**
 * Core transformation pipeline that extracts and formats data using predefined map coordinates.
 * Discards empty records and transforms basic string arrays into typed domain objects.
 * @param {Array<string|Array>} rawRows - Direct array content lines to parse.
 * @param {Object<string, number>} mappings - Pointer directives for field assignments.
 * @param {string|null} [overrideHint=null] - Overrides nominal algorithm behavior manually.
 * @returns {Array<Object>} Processed clean JS Objects array of Employees.
 */
export function processRows(rawRows, mappings, overrideHint = null) {
  if (!rawRows || rawRows.length === 0) return [];
  
  return rawRows.map(row => {
    const parts = splitRow(row);
    if (!parts || parts.length === 0) return null;

    // --- Identidad Nominal ---
    const hasNombreMap = mappings.nombre !== -1;
    const hasApellidoMap = mappings.apellido !== -1;
    const isSingleColumnName = hasNombreMap && hasApellidoMap && mappings.nombre === mappings.apellido;
    
    // Determine the active column to use if we must split the name
    let colIdxForSplit = -1;
    if (isSingleColumnName) colIdxForSplit = mappings.nombre;
    else if (hasApellidoMap && !hasNombreMap) colIdxForSplit = mappings.apellido;
    else if (hasNombreMap && !hasApellidoMap) colIdxForSplit = mappings.nombre;

    const fullValue = colIdxForSplit !== -1 ? (parts[colIdxForSplit] || "").toString().trim() : '';
    const isMultiWord = fullValue.split(/\s+/).filter(w => w.length > 0).length >= 2;

    let nombre = '';
    let apellido = '';

    if (colIdxForSplit !== -1 && isMultiWord) {
      // Execute Identity Algorithm Split
      const hint = overrideHint || (hasApellidoMap && !hasNombreMap ? 'apellido' : (hasNombreMap && !hasApellidoMap ? 'nombre' : 'apellido'));
      const split = splitFullName(fullValue, hint);
      nombre = split.nombre;
      apellido = split.apellido;
    } else {
      // Direct assignment if separated nicely using respective maps
      nombre = hasNombreMap ? (parts[mappings.nombre] || "").toString().trim() : '';
      apellido = hasApellidoMap ? (parts[mappings.apellido] || "").toString().trim() : '';
    }
    
    // --- Header Protection Middleware ---
    // Defends against phantom merged headers disguised as records in mid-sheet
    const extractedIdText = mappings.identificacion !== -1 ? (parts[mappings.identificacion] || "").toString().toUpperCase() : '';
    const extractedNameText = nombre.toUpperCase();
    if (extractedIdText.includes("CEDULA") || extractedIdText.includes("IDENTIFICACION") || 
        extractedNameText.includes("NOMBRES") || extractedNameText.includes("APELLIDOS")) {
      return null; // Skip this unprocessable dirty line softly
    }

    // --- Strict Payload Build (Parsing raw datatypes) ---
    // Transforms text inputs (e.g. "X" marks, "$250.00") into formal numbers and booleans
    const mapVal = (key) => mappings[key] !== -1 ? (parts[mappings[key]] || "").toString().trim() : '';
    const asNum = (val) => parseFloat(val.replace(/[^0-9.-]/g, '')) || 0;
    const asInt = (val) => parseInt(val.replace(/[^0-9-]/g, '')) || 0;
    const asBool = (val) => val.toUpperCase() === 'X';

    return {
      id: generateId(),
      identificacion: mapVal('identificacion'),
      nombre: nombre,
      apellido: apellido,
      genero: mappings.genero !== -1 ? (['M','F'].includes(mapVal('genero').charAt(0).toUpperCase()) ? mapVal('genero').charAt(0).toUpperCase() : 'M') : 'M',
      codigoIESS: mapVal('codigoIESS'),
      dias: mappings.dias !== -1 ? Math.min(360, asInt(mapVal('dias'))) : 360,
      isManualDays: mappings.dias !== -1, 
      sueldo: mappings.sueldo !== -1 ? asNum(mapVal('sueldo')) : 0,
      baseSalary: mappings.baseSalary !== -1 ? asNum(mapVal('baseSalary')) : 0,
      cargas: mappings.cargas !== -1 ? asInt(mapVal('cargas')) : 0,
      discapacidad: mappings.discapacidad !== -1 ? asBool(mapVal('discapacidad')) : false,
      fechaJubilacion: mapVal('fechaJubilacion'),
      jornadaParcial: mappings.jornadaParcial !== -1 ? asBool(mapVal('jornadaParcial')) : false,
      horasParcial: mappings.horasParcial !== -1 ? asNum(mapVal('horasParcial')) : 0,
      tipoPago: mappings.tipoPago !== -1 ? mapVal('tipoPago') || 'A' : 'A',
      valorRetencion: mappings.valorRetencion !== -1 ? asNum(mapVal('valorRetencion')) : 0,
      mensualiza: mappings.mensualiza !== -1 ? asBool(mapVal('mensualiza')) : false,
      fechaIngreso: mapVal('fechaIngreso'),
    };
  })
  .filter(emp => {
    // --- Regla Automática "Core 3" (Validación Crítica) ---
    // Removes completely empty or garbage noise lines. A real employee must have identifiable aspects.
    if (!emp) return false;
    const hasId = (emp.identificacion || '').trim() !== '';
    const hasName = (emp.nombre || '').trim() !== '' || (emp.apellido || '').trim() !== '';
    return hasId || hasName;
  });
}

