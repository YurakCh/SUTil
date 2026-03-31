/**
 * Valida una cédula ecuatoriana usando el algoritmo del Módulo 10.
 * @param {string} cedula 
 * @returns {boolean}
 */
export const validateCedula = (cedula) => {
  if (!cedula || cedula.length !== 10) return false;
  if (!/^\d+$/.test(cedula)) return false;

  const province = parseInt(cedula.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;

  const digits = cedula.split('').map(Number);
  const checkDigit = digits.pop();
  
  const sum = digits.reduce((acc, curr, idx) => {
    let val = (idx % 2 === 0) ? curr * 2 : curr;
    if (val > 9) val -= 9;
    return acc + val;
  }, 0);

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return calculatedCheckDigit === checkDigit;
};

/**
 * Valida un pasaporte con un Regex alfanumérico flexible.
 * @param {string} passport 
 * @returns {boolean}
 */
export const validatePassport = (passport) => {
  if (!passport) return false;
  // Regex flexible para pasaportes extranjeros (alfanumérico, 6-15 caracteres)
  return /^[A-Z0-9]{6,15}$/i.test(passport);
};

export const isValidIdentity = (id) => {
  return validateCedula(id) || validatePassport(id);
};
