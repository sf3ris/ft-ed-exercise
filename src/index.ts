import fastify from 'fastify';
import app from './app';
import exerciseEventHandler from './domain/exercise/exerciseEventHandler';

const server = fastify({ logger: true });
server.register(app);

server.listen({ host: '0.0.0.0', port: 8081 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Start read model handlers
  exerciseEventHandler();

  console.log(`Server listening at ${address}`);
});
