import { getConsumer } from '../../infrastructure/events/kafka';
import processExerciseEvent from './services/processExerciseEvent';

export default async (): Promise<void> => {
  const consumer = getConsumer().consumer({ groupId: 'test-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'exercise-events', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await processExerciseEvent(message);
    },
  });
};
