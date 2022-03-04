import fastifyRedis, { FastifyRedis } from 'fastify-redis';
import { FastifyInstance } from 'fastify';

let instance: FastifyRedis | null = null;

export const registerRedisInstance = async (fastify: FastifyInstance): Promise<FastifyInstance> => {
  const redisHost = process.env.REDIS_HOST ?? '0.0.0.0';
  const redisPort = parseInt(process.env.REDIS_PORT ?? '6379');

  await fastify
    .register(fastifyRedis, {
      host: redisHost,
      port: redisPort,
      lazyConnect: true,
    })
    .then(
      () => {
        instance = fastify.redis;
        fastify.log.info('redis registered successfully');
      },
      (err) => {
        fastify.log.error(err);
      },
    );

  return fastify;
};

export const getRedisInstance = (): FastifyRedis => {
  if (instance === null) {
    throw Error('Redis instance not initialized');
  }

  return instance;
};
