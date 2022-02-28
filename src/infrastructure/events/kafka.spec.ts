import t from 'tap';
import { getConsumer, getProducer } from './kafka';

t.test('should register brokers correctly', async (t) => {
  t.plan(7);

  const kafkaModule = t.mock('./kafka', {
    kafkajs: {
      Kafka: class Kafka {
        constructor(opts: any) {
          t.same(opts.logLevel, 1);
          t.same(opts.brokers, ['localhost:9092']);
          t.ok(['example-producer', 'example-consumer'].includes(opts.clientId));
        }
      },
      logLevel: {
        ERROR: 1,
      },
    },
  });

  t.doesNotThrow(kafkaModule.registerKafkaBrokers);
});

t.test('getProducer should throw if not initialized', async (t) => {
  t.plan(1);

  t.throws(getProducer, 'Kafka broker not initialized');
});

t.test('getProducer should not throw if correctly initialized', async (t) => {
  t.plan(1);

  const kafkaModule = t.mock('./kafka', {
    kafkajs: {
      Kafka: class Kafka {},
      logLevel: {
        ERROR: 1,
      },
    },
  });

  kafkaModule.registerKafkaBrokers();

  t.doesNotThrow(kafkaModule.getProducer);
});

t.test('getConsumer should throw if not initialized', async (t) => {
  t.plan(1);

  t.throws(getConsumer, 'Kafka broker not initialized');
});

t.test('getConsumer should not throw if correctly initialized', async (t) => {
  t.plan(1);

  const kafkaModule = t.mock('./kafka', {
    kafkajs: {
      Kafka: class Kafka {},
      logLevel: {
        ERROR: 1,
      },
    },
  });

  kafkaModule.registerKafkaBrokers();

  t.doesNotThrow(kafkaModule.getConsumer);
});
