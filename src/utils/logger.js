/**
 * SUTil Diagnostic Logger
 * Intercepts console output to provide technical context for support tickets.
 */

const MAX_LOG_ENTRIES = 100;
let logBuffer = [];

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error
};

const formatLog = (level, args) => {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0]; // HH:mm:ss
  const message = args
    .map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg))
    .join(' ');
  return `[${timestamp}] [${level}] ${message}`;
};

const addLog = (level, args) => {
  const formatted = formatLog(level, args);
  logBuffer.push(formatted);
  if (logBuffer.length > MAX_LOG_ENTRIES) {
    logBuffer.shift();
  }
};

export const initLogger = () => {
  console.log = (...args) => {
    addLog('LOG', args);
    originalConsole.log.apply(console, args);
  };

  console.warn = (...args) => {
    addLog('WARN', args);
    originalConsole.warn.apply(console, args);
  };

  console.error = (...args) => {
    addLog('ERROR', args);
    originalConsole.error.apply(console, args);
  };
  
  console.log('SUTil Diagnostic Logger Initialized.');
};

export const getSystemLogs = () => {
  return logBuffer.join('\n');
};

export const clearLogs = () => {
  logBuffer = [];
};
