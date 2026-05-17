import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { comparePassword, hashPassword, signToken } from '../utils/crypto.js';

const toSafeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
});

const handleError = (res, error) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  return res.status(500).json({ success: false, message: 'mongoose error' });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || String(password).length < 6) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists) {
      return res.status(409).json({ success: false, message: 'email already exists' });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: hashPassword(String(password)),
    });

    const safeUser = toSafeUser(user);
    const token = signToken({ userId: safeUser.id, email: safeUser.email, role: safeUser.role }, env.jwtSecret);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'invalid request' });
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (!user || !comparePassword(String(password), user.passwordHash)) {
      return res.status(401).json({ success: false, message: 'invalid credentials' });
    }

    const safeUser = toSafeUser(user);
    const token = signToken({ userId: safeUser.id, email: safeUser.email, role: safeUser.role }, env.jwtSecret);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: 'unauthorized' });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: toSafeUser(user),
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};
