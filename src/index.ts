import fastify from 'fastify';
import app from './app';
import exerciseEventHandler from './domain/exercise/exerciseEventHandler';

const server = fastify({ logger: true });
server.register(app);

const port = process.env.APP_PORT ?? '8081';
server.listen({ host: '0.0.0.0', port: parseInt(port) }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // Start read model handlers
  // exerciseEventHandler();

  console.log(`Server listening at ${address}`);
});
