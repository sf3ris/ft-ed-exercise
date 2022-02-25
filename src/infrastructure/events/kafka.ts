import {Kafka, logLevel} from "kafkajs";

let producer: Kafka|null = null;
let consumer: Kafka|null = null;

export const registerKafkaBrokers = (): void => {
    producer = new Kafka({
        logLevel: logLevel.ERROR,
        brokers: ['localhost:9092'],
        clientId: 'example-producer',
    });

    consumer = new Kafka({
        logLevel: logLevel.ERROR,
        brokers: ['localhost:9092'],
        clientId: 'example-consumer',
    });
}

export const getProducer = (): Kafka => {
    if(producer === null) {
        throw new Error("Kafka broker not initialized");
    }

    return producer;
}

export const getConsumer = (): Kafka => {
    if(consumer === null) {
        throw new Error("Kafka broker not initialized");
    }

    return consumer;
}

