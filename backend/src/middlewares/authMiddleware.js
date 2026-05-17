import { env } from '../config/env.js';
import { verifyToken } from '../utils/crypto.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'unauthorized' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = verifyToken(token, env.jwtSecret);
    req.user = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: 'unauthorized' });
  }
};
