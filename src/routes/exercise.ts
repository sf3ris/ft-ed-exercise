import {getProducer} from "../infrastructure/events/kafka";
import {IAggregateEvent} from "../infrastructure/events/IAggregateEvent";
import {randomUUID} from "crypto";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {IncomingMessage, Server, ServerResponse} from "http";
import {IExercise, IExerciseData} from "../domain/exercise/IExercise";
import {exerciseRepository} from "../domain/exercise/repositories/exerciseRepository";

export default (
    fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>,
    _: FastifyPluginOptions,
    next: (error?: Error) => void,
): void => {
    fastify.get('/exercises', async (req, res) => {
        const { name } = req.query as { name: string };
        const exercises = await exerciseRepository.getExercises(name);

        res.send(exercises.sort((a,b) => a.name > b.name ? 1 : -1));
    });

    fastify.get('/exercises/:exerciseId', async (req, res) => {
        const {exerciseId} = req.params as {exerciseId: string};

        const exercise = await exerciseRepository.getExerciseById(exerciseId);
        if (!exercise) {
            res.status(404).send({});
        }
        res.send({
            id: exerciseId,
            exercise
        });
    });

    fastify.post('/exercises', async (req, res) => {
        const exercise = req.body as IExercise;

        const producer = getProducer().producer();

        const event: IAggregateEvent<IExerciseData> = {
            event_type: 'ExerciseCreated',
            aggregate: 'Exercise',
            aggregate_id: randomUUID(),
            event_data: exercise,
            version: 1
        }

        await producer.connect();
        await producer.send({
            topic: 'exercise-events',
            messages: [
                { value: JSON.stringify(event), key: 'event', timestamp: new Date().valueOf().toString() },
            ],
        });

        res.status(201).send({});
    });

    fastify.put('/exercises/:exerciseId', async (req, res) => {
        const exercise = req.body as IExercise;
        const {exerciseId} = req.params as {exerciseId: string};

        const producer = getProducer().producer();

        const event: IAggregateEvent<IExerciseData> = {
            event_type: 'ExerciseCreated',
            aggregate: 'Exercise',
            aggregate_id: exerciseId,
            event_data: exercise,
            version: 1
        }

        await producer.connect();
        await producer.send({
            topic: 'exercise-events',
            messages: [
                { value: JSON.stringify(event), key: 'event', timestamp: new Date().valueOf().toString() },
            ],
        });

        res.status(204).send({});
    });

    fastify.delete('/exercises/:exerciseId', async (req, res) => {
        const {exerciseId} = req.params as {exerciseId: string};

        const producer = getProducer().producer();
        await producer.connect();

        const event: IAggregateEvent<null> = {
            event_type: "ExerciseDeleted",
            aggregate: 'Exercise',
            aggregate_id: exerciseId,
            event_data: null,
            version: 1
        }

        await producer.send({
            topic: 'exercise-events',
            messages: [
                {value: JSON.stringify(event), key: 'event', timestamp: new Date().valueOf().toString()}
            ]
        })

        res.status(204).send({});
    })

    next();
}