import { FastifyLoggerInstance } from 'fastify';

let loggerInstance: FastifyLoggerInstance | null = null;

export const registerLogger = (logger: FastifyLoggerInstance): void => {
  loggerInstance = logger;
};

export const getLoggerInstance = (): FastifyLoggerInstance => {
  if (!loggerInstance) {
    throw new Error('Logger not initialized');
  }

  return loggerInstance;
};
