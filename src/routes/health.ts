import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export default (
  fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
  _: FastifyPluginOptions,
  next: (error?: Error) => void,
): void => {
  fastify.get('/health', (req, res) => {
    res.send({
      status: 'UP',
    });
  });

  next();
};
