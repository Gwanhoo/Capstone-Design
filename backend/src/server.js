import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { registerSocketHandlers } from './sockets/index.js';

const bootstrap = async () => {
  if (!env.skipDb) {
    await connectDatabase(env.mongodbUri);
  } else {
    console.log('[DB] SKIP_DB=true, skipping MongoDB connection');
  }

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  registerSocketHandlers(io);
  app.set('io', io);

  server.listen(env.port, () => {
    console.log(`[Server] listening on port ${env.port}`);
    console.log(`[Server] http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('[Server] failed to start:', error.message);
  process.exit(1);
});
