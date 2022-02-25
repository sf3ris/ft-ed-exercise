export interface IExercise {
    id: string;
    name: string;
    description: string;
    muscles: string[];
    category: number;
}

export type IExerciseData = Omit<IExercise, 'id'>