import {FastifyRedis} from "fastify-redis";

let instance: FastifyRedis|null = null;

export const registerInstance = (redisInstance: FastifyRedis): void => {
    instance = redisInstance;
}

export const getRedisInstance = (): FastifyRedis => {
    if (!instance) {
        throw Error("Redis instance not initialized")
    }

    return instance;
}