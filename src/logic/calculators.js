/**
 * Lógica de cálculo conforme normativa ecuatoriana 2026
 */

export const calcularDecimoTercero = (ingresosTotales) => {
  if (!ingresosTotales) return 0;
  return ingresosTotales / 12;
};

export const calcularDecimoCuarto = (diasTrabajados, sbu = 482) => {
  // Proporcional del SBU (Salario Básico Unificado)
  const baseSBU = sbu;
  return (baseSBU / 360) * diasTrabajados;
};

export const calcularUtilidades = (dias, cargas, totalDiasEmpresa, totalCargasEmpresa, utilidadAConfigurar) => {
  if (!utilidadAConfigurar) return 0;
  
  // 10% por días trabajados
  const diezPorcientoTotal = utilidadAConfigurar * 0.10;
  const parteDiez = (diezPorcientoTotal / totalDiasEmpresa) * dias;
  
  // 5% por cargas familiares
  const cincoPorcientoTotal = utilidadAConfigurar * 0.05;
  const parteCinco = totalCargasEmpresa > 0 ? (cincoPorcientoTotal / totalCargasEmpresa) * cargas : 0;
  
  return parteDiez + parteCinco;
};

/**
 * Calcula la compensación por Salario Digno
 * @param {Object} emp - Datos del empleado incluyendo todos sus ingresos anuales
 * @param {number} salarioDignoAnual - El valor del Salario Digno mensual multiplicado por 12
 * @returns {number} La diferencia a pagar (0 si es mayor o igual al Salario Digno)
 */
export const calcularCompensacionDigno = (emp, salarioDignoAnual) => {
  if (isNaN(salarioDignoAnual)) return 0;
  const anualTotal = (emp.sueldo || 0) + 
                     calcularDecimoTercero(emp.sueldo || 0) + 
                     calcularDecimoCuarto(emp.dias || 0) + 
                     (emp.utilidades || 0) + 
                     (emp.fondosReserva || 0);
                     
  const diff = salarioDignoAnual - anualTotal;
  return isNaN(diff) ? 0 : (diff > 0 ? diff : 0);
};
