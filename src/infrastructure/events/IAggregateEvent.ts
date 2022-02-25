/* eslint-disable camelcase */
export interface IAggregateEvent<T> {
    event_type: "ExerciseCreated"|"ExerciseUpdated"|"ExerciseDeleted",
    aggregate: string,
    aggregate_id: string,
    event_data: T,
    version: number
}