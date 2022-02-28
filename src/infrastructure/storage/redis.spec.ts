import t from 'tap';
import { getRedisInstance, registerRedisInstance } from './redis';
import { FastifyInstance, FastifyPluginCallback, FastifyPluginOptions } from 'fastify';
import { FastifyRedis } from 'fastify-redis';

t.test('should throw if not initialized', (t) => {
  t.plan(1);

  t.throws(getRedisInstance, Error('Redis instance not initialized'));
});

t.test('should return redis instance as expected', async (t) => {
  t.plan(3);

  const mockedRedisInstance = {} as FastifyRedis;
  await registerRedisInstance({
    register: (plugin: FastifyPluginCallback, opts: FastifyPluginOptions): PromiseLike<void> => {
      return Promise.resolve();
    },
    redis: mockedRedisInstance,
    log: {
      info: (message) => {
        t.equal(message, 'redis registered successfully');
      },
    },
  } as FastifyInstance);

  t.doesNotThrow(getRedisInstance);
  t.same(getRedisInstance(), mockedRedisInstance);
});

t.test('should not throw and log error during registration', async (t) => {
  t.plan(2);

  await registerRedisInstance({
    register: (plugin: FastifyPluginCallback, opts: FastifyPluginOptions): PromiseLike<void> => {
      return Promise.reject(Error('error during redis registration'));
    },
    log: {
      error: (err: Error) => {
        t.equal(err.message, 'error during redis registration');
      },
    },
  } as FastifyInstance);

  t.doesNotThrow(getRedisInstance);
});
