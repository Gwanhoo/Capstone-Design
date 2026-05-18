import { verifyToken } from '../utils/crypto.js';
import { env } from '../config/env.js';
import Project from '../models/Project.js';
import { canAccessProject } from '../utils/projectAccess.js';

const roomName = (projectId) => `project:${projectId}`;

const getTokenFromHandshake = (socket) => {
  const authToken = socket.handshake.auth?.token;
  if (authToken) return authToken;

  const header = socket.handshake.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice('Bearer '.length);
  return null;
};

export const registerSocketHandlers = (io) => {
  io.use((socket, next) => {
    try {
      const token = getTokenFromHandshake(socket);
      if (!token) return next(new Error('unauthorized'));
      const payload = verifyToken(token, env.jwtSecret);
      socket.user = { userId: payload.sub, email: payload.email, role: payload.role };
      return next();
    } catch (_error) {
      return next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-project', async ({ projectId }, ack) => {
      try {
        const project = await Project.findById(projectId);
        if (!project) {
          ack?.({ ok: false, code: 404, message: 'project not found' });
          return;
        }
        if (!canAccessProject(project, socket.user?.userId)) {
          ack?.({ ok: false, code: 403, message: 'forbidden' });
          return;
        }

        await socket.join(roomName(projectId));
        ack?.({ ok: true });
      } catch (_error) {
        ack?.({ ok: false, code: 500, message: 'join failed' });
      }
    });

    socket.on('leave-project', async ({ projectId }) => {
      await socket.leave(roomName(projectId));
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] disconnected: ${socket.id}`);
    });
  });
};

export const getProjectRoomName = roomName;
