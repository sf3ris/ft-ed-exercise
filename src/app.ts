import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { registerRedisInstance } from './infrastructure/storage/redis';
import { registerKafkaBrokers } from './infrastructure/events/kafka';
import { registerLogger } from './infrastructure/logger';
import exercise from './routes/exercise';
import health from './routes/health';

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
): void => {
  fastify.setErrorHandler((error, _, reply) => {
    reply.status(500).send(error);
  });

  //registerRedisInstance(fastify);
  //registerKafkaBrokers();
  registerLogger(fastify.log);

  // register routes
  fastify.register(exercise);
  fastify.register(health);

  next();
};
