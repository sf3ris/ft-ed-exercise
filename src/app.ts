import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import fastifyRedis from "fastify-redis";
import {registerInstance} from "./infrastructure/storage/redis";
import {registerKafkaBrokers} from "./infrastructure/events/kafka";
import exercise from "./routes/exercise";
import {registerLogger} from "./infrastructure/logger";

export default (
    fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    _: FastifyPluginOptions,
    next: (error?: Error) => void,
): void => {
    fastify.setErrorHandler((error, _, reply) => {
        reply.status(500).send(error);
    })

    fastify.register(fastifyRedis, {
        host: '0.0.0.0',
        port: 6379
    }).then( () => {
        fastify.log.info("redis registered successfully")
        registerInstance(fastify.redis);
    }, err => fastify.log.info(err));

    registerKafkaBrokers();
    registerLogger(fastify.log);

    // register routes
    fastify.register(exercise)

    next();
}
