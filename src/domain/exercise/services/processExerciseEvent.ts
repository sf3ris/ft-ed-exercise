import { IAggregateEvent } from '../../../infrastructure/events/IAggregateEvent';
import { IExerciseData } from '../IExercise';
import { exerciseRepository } from '../repositories/exerciseRepository';
import { getLoggerInstance } from '../../../infrastructure/logger';
import { KafkaMessage } from 'kafkajs';

export default async (message: KafkaMessage) => {
  const value = message.value;

  if (value) {
    const event: IAggregateEvent<IExerciseData> = JSON.parse(value.toString());

    switch (event.event_type) {
      case 'ExerciseCreated':
        if (await exerciseRepository.getExerciseByName(event.event_data.name)) {
          const logger = getLoggerInstance();
          logger.info(`Exercise duplicated with name '${event.event_data.name}'`);
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
};
