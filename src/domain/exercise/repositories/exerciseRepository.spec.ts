import t from 'tap';
import { IExercise } from '../IExercise';

t.test('getExerciseByName should return undefined when not in storage', async (t) => {
  t.plan(2);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        keys: async (pattern: string): Promise<string[]> => {
          t.same(pattern, 'exercise:*');
          return ['exercise:1234', 'exercise:1235'];
        },
        get: async (): Promise<string> => {
          return JSON.stringify({ name: 'exercise 1234' } as IExercise);
        },
      }),
    },
  });

  const exercise = await exerciseRepository.getExerciseByName('exercise name');

  t.same(exercise, undefined);
});

t.test('getExerciseByName should return exercise when not storage', async (t) => {
  t.plan(2);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        keys: async (pattern: string): Promise<string[]> => {
          t.same(pattern, 'exercise:*');
          return ['exercise:1234', 'exercise:1235'];
        },
        get: async (): Promise<string> => {
          return JSON.stringify({ name: 'exercise 1234' } as IExercise);
        },
      }),
    },
  });

  const exercise = await exerciseRepository.getExerciseByName('exercise 1234');

  t.same(exercise, { name: 'exercise 1234', id: '1234' });
});

t.test('getExercises should return all exercises when filter is not provided', async (t) => {
  t.plan(4);

  const expectedKeys = ['exercise:1234', 'exercise:1235'];
  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        keys: async (pattern: string): Promise<string[]> => {
          t.same(pattern, 'exercise:*');
          return expectedKeys;
        },
        get: async (key: string): Promise<string> => {
          t.ok(expectedKeys.includes(key));
          return JSON.stringify({ name: key } as IExercise);
        },
      }),
    },
  });

  const exercises = await exerciseRepository.getExercises();

  t.same(exercises, [
    { name: 'exercise:1234', id: '1234' },
    { name: 'exercise:1235', id: '1235' },
  ]);
});

t.test('getExercises should throw if key has been deleted after being retrieved', async (t) => {
  t.plan(4);

  const expectedKeys = ['exercise:1234', 'exercise:1235'];
  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        keys: async (pattern: string): Promise<string[]> => {
          t.same(pattern, 'exercise:*');
          return expectedKeys;
        },
        get: async (key: string): Promise<string | null> => {
          t.ok(expectedKeys.includes(key));
          return null;
        },
      }),
    },
  });

  await t.rejects(exerciseRepository.getExercises());
});

t.test('getExercises should return filtered exercises', async (t) => {
  t.plan(4);

  const expectedKeys = ['exercise:1234', 'exercise:1235'];
  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        keys: async (pattern: string): Promise<string[]> => {
          t.same(pattern, 'exercise:*');
          return expectedKeys;
        },
        get: async (key: string): Promise<string> => {
          t.ok(expectedKeys.includes(key));
          return JSON.stringify({ name: key } as IExercise);
        },
      }),
    },
  });

  const exercises = await exerciseRepository.getExercises('1234');

  t.same(exercises, [{ name: 'exercise:1234', id: '1234' }]);
});

t.test('getExerciseById should return undefined when not in storage', async (t) => {
  t.plan(2);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        get: async (key: string): Promise<string | undefined> => {
          t.same(key, 'exercise:1234');
          return undefined;
        },
      }),
    },
  });

  const exercise = await exerciseRepository.getExerciseById('1234');

  t.same(exercise, undefined);
});

t.test('getExerciseById should return exercise when in storage', async (t) => {
  t.plan(2);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        get: async (key: string): Promise<string | undefined> => {
          t.same(key, 'exercise:1234');
          return JSON.stringify({ name: key } as IExercise);
        },
      }),
    },
  });

  const exercise = await exerciseRepository.getExerciseById('1234');

  t.same(exercise, { name: 'exercise:1234', id: '1234' });
});

t.test('storeExercise should store the exercise in storage', async (t) => {
  t.plan(2);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        set: async (key: string, value: string): Promise<string> => {
          const expectedValue = JSON.stringify({ name: 'exercise 1234', id: '1234' } as IExercise);
          t.same(key, 'exercise:1234');
          t.same(value, expectedValue);

          return expectedValue;
        },
      }),
    },
  });

  await exerciseRepository.storeExercise({ name: 'exercise 1234', id: '1234' });
});

t.test('deleteExercise should delete the exercise in storage', async (t) => {
  t.plan(1);

  const { exerciseRepository } = t.mock('./exerciseRepository', {
    '../../../infrastructure/storage/redis': {
      getRedisInstance: () => ({
        del: async (key: string): Promise<void> => {
          t.same(key, 'exercise:1234');
        },
      }),
    },
  });

  await exerciseRepository.deleteExercise('1234');
});
