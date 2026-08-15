import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType> | null = null;

async function getClient() {
  if (!process.env.REDIS_URL) return null;
  if (!client) client = createClient({ url: process.env.REDIS_URL }) as RedisClientType;
  if (!client.isOpen) {
    connectPromise ??= client.connect().then(() => client!).finally(() => { connectPromise = null; });
    await connectPromise;
  }
  return client;
}

export async function checkDistributedRateLimit(key: string, limit = 10, windowSeconds = 60) {
  const redis = await getClient();
  if (!redis) return true;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count <= limit;
  } catch (error) {
    if (process.env.NODE_ENV === 'production' && process.env.RATE_LIMIT_FAIL_OPEN !== 'true') return false;
    console.error(JSON.stringify({ event: 'rate_limit.redis_error', error: error instanceof Error ? error.message : 'unknown' }));
    return true;
  }
}
