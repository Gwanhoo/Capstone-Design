import mongoose from 'mongoose';

export const connectDatabase = async (mongodbUri) => {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongodbUri);
    console.log('[DB] MongoDB connected');
  } catch (error) {
    console.error('[DB] MongoDB connection failed:', error.message);
    throw error;
  }
};
