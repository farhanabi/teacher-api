import env from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
  debug: (message: string, data?: unknown) => {
    if (env.nodeEnv !== 'production') {
      log('debug', message, data);
    }
  },
};

function log(level: LogLevel, message: string, data?: unknown) {
  const logMessage: LogMessage = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (data) {
    logMessage.data = data;
  }

  // In production, we might want to use a proper logging service
  // For now, we'll just use console
  switch (level) {
    case 'info':
      console.log(JSON.stringify(logMessage));
      break;
    case 'warn':
      console.warn(JSON.stringify(logMessage));
      break;
    case 'error':
      console.error(JSON.stringify(logMessage));
      break;
    case 'debug':
      console.debug(JSON.stringify(logMessage));
      break;
  }
}