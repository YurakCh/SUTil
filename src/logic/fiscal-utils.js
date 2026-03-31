/**
 * Utilidades para el manejo de periodos legales ecuatorianos (MDT)
 */

export const getPeriodRange = (mode, year, region = 'sierra') => {
  const prevYear = year - 1;
  
  if (mode === 'decimo3') {
    return {
      start: `${prevYear}-12-01`,
      end: `${year}-11-30`,
      label: 'Cálculo del Décimo Tercer Sueldo'
    };
  }
  
  if (mode === 'decimo4') {
    if (region === 'costa') {
      // Costa e Insular: 1 Mar al 28 Feb
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      return {
        start: `${prevYear}-03-01`,
        end: `${year}-02-${isLeap ? '29' : '28'}`,
        label: 'D14 Costa / Galápagos'
      };
    } else {
      // Sierra y Amazonía: 1 Ago al 31 Jul
      return {
        start: `${prevYear}-08-01`,
        end: `${year}-07-31`,
        label: 'D14 Sierra / Amazonía'
      };
    }
  }
  
  if (mode === 'utilidades') {
    return {
      start: `${prevYear}-01-01`,
      end: `${prevYear}-12-31`,
      label: `Ejercicio Fiscal ${prevYear}`
    };
  }
  
  return { start: '', end: '', label: '' };
};

export const parseDate = (str) => {
  if (!str) return null;
  // Parse DD/MM/YYYY or YYYY-MM-DD
  const parts = str.split(/[-/]/);
  if (parts.length !== 3) return null;
  
  if (parts[0].length === 4) {
    // YYYY-MM-DD
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  } else {
    // DD/MM/YYYY
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
};

/**
 * Calcula días trabajados bajo estándar ecuatoriano (Art. 30 días/mes)
 */
export const calculateLegalDays = (joinDateStr, startDateStr, endDateStr) => {
  const join = parseDate(joinDateStr);
  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);
  
  if (!join || !start || !end) return 360; // Fallback
  
  // Si entró antes del inicio del periodo, tiene 360 días
  if (join <= start) return 360;
  
  // Si entró después del fin del periodo, tiene 0 días
  if (join > end) return 0;
  
  // Lógica 30 días por mes
  let d1 = join.getDate();
  let m1 = join.getMonth() + 1;
  let y1 = join.getFullYear();
  
  let d2 = end.getDate();
  let m2 = end.getMonth() + 1;
  let y2 = end.getFullYear();
  
  // Regla del 31: se convierte en 30
  if (d1 === 31) d1 = 30;
  if (d2 === 31) d2 = 30;
  
  // Caso especial Febrero: si es fin de mes, se cuenta como 30 para el cálculo de beneficio proporcional
  const isLastFeb1 = m1 === 2 && d1 >= 28;
  const isLastFeb2 = m2 === 2 && d2 >= 28;
  // if (isLastFeb1) d1 = 30; // (Opcional, depende de interpretación, pero 360 días base lo usa)
  if (isLastFeb2) d2 = 30;

  const totalDays = ((y2 - y1) * 360) + ((m2 - m1) * 30) + (d2 - d1) + 1;
  
  return Math.min(360, Math.max(0, totalDays));
};
