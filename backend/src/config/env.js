import dotenv from 'dotenv';

dotenv.config();

const skipDb = process.env.SKIP_DB === 'true';
const requiredEnv = ['PORT'];

if (!skipDb) {
  requiredEnv.push('MONGODB_URI');
}

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT),
  mongodbUri: process.env.MONGODB_URI || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  skipDb,
};
