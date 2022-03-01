import t from 'tap';
import { KafkaMessage } from 'kafkajs';
import { IAggregateEvent } from '../../../infrastructure/events/IAggregateEvent';
import { IExercise, IExerciseData } from '../IExercise';

t.test('should create the exercise when not already present', async (t) => {
  const exerciseData: IExerciseData = {
    name: 'exercise-1',
    description: 'Exercise one',
    muscles: ['7', '9'],
    category: 9,
  };
  const event: IAggregateEvent<IExerciseData> = {
    event_type: 'ExerciseCreated',
    event_data: exerciseData,
    aggregate: 'Exercise',
    aggregate_id: '12345',
    version: 1,
  };

  const processExerciseEventModule = t.mock('./processExerciseEvent', {
    '../repositories/exerciseRepository': {
      exerciseRepository: {
        getExerciseByName: async (name: string): Promise<IExercise | null> => {
          return null;
        },
        storeExercise: async (exercise: IExercise): Promise<IExercise> => {
          t.same(exercise, {
            id: '12345',
            ...exerciseData,
          });

          return {
            id: '12345',
            ...exerciseData,
          };
        },
      },
    },
  });

  const kafkaMessage = {
    value: Buffer.from(JSON.stringify(event), 'utf-8'),
  } as KafkaMessage;

  processExerciseEventModule.default(kafkaMessage);
});

t.test('should not create the exercise when already present', async (t) => {
  const exerciseData: IExerciseData = {
    name: 'exercise-1',
    description: 'Exercise one',
    muscles: ['7', '9'],
    category: 9,
  };
  const event: IAggregateEvent<IExerciseData> = {
    event_type: 'ExerciseCreated',
    event_data: exerciseData,
    aggregate: 'Exercise',
    aggregate_id: '12345',
    version: 1,
  };

  const processExerciseEventModule = t.mock('./processExerciseEvent', {
    '../repositories/exerciseRepository': {
      exerciseRepository: {
        getExerciseByName: async (name: string): Promise<IExercise | null> => {
          t.same(name, 'exercise-1');
          return { name: 'exercise-1' } as IExercise;
        },
      },
    },
    '../../../infrastructure/logger': {
      getLoggerInstance: () => ({
        info: (message: string) => {
          t.same(message, "Exercise duplicated with name 'exercise-1'");
        },
      }),
    },
  });

  const kafkaMessage = {
    value: Buffer.from(JSON.stringify(event), 'utf-8'),
  } as KafkaMessage;

  processExerciseEventModule.default(kafkaMessage);
});

t.test('should update the exercise', async (t) => {
  const exerciseData: IExerciseData = {
    name: 'exercise-1',
    description: 'Exercise one',
    muscles: ['7', '9'],
    category: 9,
  };
  const event: IAggregateEvent<IExerciseData> = {
    event_type: 'ExerciseUpdated',
    event_data: exerciseData,
    aggregate: 'Exercise',
    aggregate_id: '12345',
    version: 1,
  };

  const processExerciseEventModule = t.mock('./processExerciseEvent', {
    '../repositories/exerciseRepository': {
      exerciseRepository: {
        storeExercise: async (exercise: IExercise): Promise<IExercise> => {
          t.same(exercise, {
            id: '12345',
            ...exerciseData,
          });

          return {
            id: '12345',
            ...exerciseData,
          };
        },
      },
    },
  });

  const kafkaMessage = {
    value: Buffer.from(JSON.stringify(event), 'utf-8'),
  } as KafkaMessage;

  processExerciseEventModule.default(kafkaMessage);
});

t.test('should delete the exercise', async (t) => {
  const exerciseData: IExerciseData = {
    name: 'exercise-1',
    description: 'Exercise one',
    muscles: ['7', '9'],
    category: 9,
  };
  const event: IAggregateEvent<IExerciseData> = {
    event_type: 'ExerciseDeleted',
    event_data: exerciseData,
    aggregate: 'Exercise',
    aggregate_id: '12345',
    version: 1,
  };

  const processExerciseEventModule = t.mock('./processExerciseEvent', {
    '../repositories/exerciseRepository': {
      exerciseRepository: {
        deleteExercise: async (exerciseId: string): Promise<void> => {
          t.same(exerciseId, '12345');
        },
      },
    },
  });

  const kafkaMessage = {
    value: Buffer.from(JSON.stringify(event), 'utf-8'),
  } as KafkaMessage;

  processExerciseEventModule.default(kafkaMessage);
});

t.test('should not do anything is event is missing', async (t) => {
  const processExerciseEventModule = t.mock('./processExerciseEvent', {});

  const kafkaMessage = {} as KafkaMessage;

  processExerciseEventModule.default(kafkaMessage);
});
