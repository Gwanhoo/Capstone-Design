import http from 'http';
import app from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

const bootstrap = async () => {
  if (!env.skipDb) {
    await connectDatabase(env.mongodbUri);
  } else {
    console.log('[DB] SKIP_DB=true, skipping MongoDB connection');
  }

  const server = http.createServer(app);

  // TODO: Socket.io 연결 시 아래 server 인스턴스를 사용
  // const io = new Server(server, { cors: { origin: env.clientUrl } });

  server.listen(env.port, () => {
    console.log(`[Server] listening on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('[Server] failed to start:', error.message);
  process.exit(1);
});
