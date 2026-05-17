import crypto from 'crypto';

const toBase64Url = (input) => Buffer.from(input).toString('base64url');
const fromBase64Url = (input) => Buffer.from(input, 'base64url').toString('utf8');

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
};

export const comparePassword = (password, passwordHash) => {
  const [salt, storedHash] = String(passwordHash).split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const hashBuffer = crypto.scryptSync(password, salt, 64);
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (hashBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, storedBuffer);
};

export const signToken = ({ userId, email, role }, secret) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: userId,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token, secret) => {
  const [encodedHeader, encodedPayload, signature] = String(token).split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('invalid token');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    throw new Error('invalid token');
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (!payload.sub) {
    throw new Error('invalid token');
  }

  return payload;
};
