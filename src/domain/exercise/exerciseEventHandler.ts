import { getConsumer } from '../../infrastructure/events/kafka';
import { IAggregateEvent } from '../../infrastructure/events/IAggregateEvent';
import { IExerciseData } from './IExercise';
import { exerciseRepository } from './repositories/exerciseRepository';
import { getLoggerInstance } from '../../infrastructure/logger';

export default async (): Promise<void> => {
  const consumer = getConsumer().consumer({ groupId: 'test-group' });

  await consumer.connect();
  await consumer.subscribe({ topic: 'exercise-events', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value;

      if (value) {
        const event: IAggregateEvent<IExerciseData> = JSON.parse(value.toString());

        switch (event.event_type) {
          case 'ExerciseCreated':
            if (await exerciseRepository.getExerciseByName(event.event_data.name)) {
              const logger = getLoggerInstance();
              logger.info(`Exercise duplicated with name ${event.event_data.name}`);
            } else {
              await exerciseRepository.storeExercise({
                id: event.aggregate_id,
                ...event.event_data,
              });
            }
            break;
          case 'ExerciseUpdated':
            await exerciseRepository.storeExercise({
              id: event.aggregate_id,
              ...event.event_data,
            });
            break;
          case 'ExerciseDeleted':
            await exerciseRepository.deleteExercise(event.aggregate_id);
            break;
        }
      }
    },
  });
};
