import t from 'tap';
import { getLoggerInstance, registerLogger } from './logger';
import { FastifyLoggerInstance } from 'fastify';

t.test('should throw if not initialized', (t) => {
  t.plan(1);

  t.throws(getLoggerInstance, Error('Logger not initialized'));
});

t.test('should return logger as expected', (t) => {
  t.plan(1);

  registerLogger({} as FastifyLoggerInstance);

  t.doesNotThrow(getLoggerInstance);
});
