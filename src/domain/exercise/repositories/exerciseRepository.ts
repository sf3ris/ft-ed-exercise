import { getRedisInstance } from '../../../infrastructure/storage/redis';
import { IExercise } from '../IExercise';

const getExerciseByName = async (name: string): Promise<IExercise | undefined> => {
  const exercises = await getExercises();

  return exercises.find((exercise: IExercise) => exercise.name === name);
};

const getExercises = async (nameFilter = ''): Promise<IExercise[]> => {
  const redis = getRedisInstance();

  const exerciseKeys: string[] = await redis.keys('exercise:*');

  const exercises = await Promise.all(
    exerciseKeys.map(async (key: string) => {
      return {
        id: key.replace('exercise:', ''),
        ...JSON.parse((await redis.get(key)) ?? '{}'),
      };
    }),
  );

  if (nameFilter) {
    return exercises.filter((exercise: IExercise) => exercise.name.toLowerCase().includes(nameFilter.toLowerCase()));
  }

  return exercises;
};

const getExerciseById = async (id: string): Promise<IExercise | undefined> => {
  const redis = getRedisInstance();

  const exercise = await redis.get(`exercise:${id}`);

  if (!exercise) {
    return undefined;
  }

  return {
    id,
    ...JSON.parse(exercise),
  };
};

const storeExercise = async (exercise: IExercise): Promise<void> => {
  const redis = getRedisInstance();

  const key = `exercise:${exercise.id}`;
  await redis.set(key, JSON.stringify(exercise));
};

const deleteExercise = async (exerciseId: string): Promise<void> => {
  const redis = getRedisInstance();

  const key = `exercise:${exerciseId}`;
  await redis.del(key);
};

export const exerciseRepository = {
  getExerciseByName,
  getExercises,
  getExerciseById,
  storeExercise,
  deleteExercise,
};
