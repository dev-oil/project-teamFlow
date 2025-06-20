import { createClient } from 'redis';

export const redisClient = createClient();

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connRedis = async () => {
  try {
    await redisClient.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection failed:', err);
  }
};
