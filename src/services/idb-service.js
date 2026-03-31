import { openDB } from 'idb';

const DB_NAME = 'SUTil_DB_2026';
const DB_VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
};

export const saveEmployees = async (employees) => {
  const db = await initDB();
  const tx = db.transaction('employees', 'readwrite');
  const store = tx.objectStore('employees');
  await store.clear();
  for (const emp of employees) {
    // Asegurarse de que todos los campos requeridos existan antes de guardar
    const sanitized = {
      ...emp,
      id: emp.id || crypto.randomUUID(),
      identificacion: emp.identificacion || '',
      nombre: emp.nombre || '',
      apellido: emp.apellido || '',
      genero: emp.genero || 'M',
      codigoIESS: emp.codigoIESS || '',
      tipoPago: emp.tipoPago || 'A',
      jornadaParcial: !!emp.jornadaParcial,
      horasParcial: emp.horasParcial || 0,
      discapacidad: !!emp.discapacidad,
      fechaJubilacion: emp.fechaJubilacion || '',
      valorRetencion: emp.valorRetencion || 0,
      baseSalary: emp.baseSalary || 0,
      commissions: emp.commissions || 0,
      bonuses: emp.bonuses || 0,
      overtime: emp.overtime || 0,
      sueldo: emp.sueldo || 0,
      dias: emp.dias || 360,
      cargas: emp.cargas || 0,
      mensualiza: !!emp.mensualiza,
      tipo: emp.tipo || 'A'
    };
    await store.put(sanitized);
  }
  await tx.done;
};

export const getEmployees = async () => {
  const db = await initDB();
  return db.getAll('employees');
};

export const saveSetting = async (key, value) => {
  const db = await initDB();
  await db.put('settings', value, key);
};

export const getSetting = async (key) => {
  const db = await initDB();
  return db.get('settings', key);
};
