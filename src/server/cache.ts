import { createClient, type RedisClientType } from 'redis';

const memory = new Map<string, { value: string; expiresAt: number }>();
let redis: RedisClientType | null = null;
let connecting: Promise<RedisClientType> | null = null;

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (!redis) redis = createClient({ url: process.env.REDIS_URL }) as RedisClientType;
  if (!redis.isOpen) { connecting ??= redis.connect().then(() => redis!).finally(() => { connecting = null; }); await connecting; }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = await getRedis();
  if (client) { const value = await client.get(`cache:${key}`); return value ? JSON.parse(value) as T : null; }
  const item = memory.get(key); if (!item || item.expiresAt <= Date.now()) { memory.delete(key); return null; }
  return JSON.parse(item.value) as T;
}

export async function cacheSet(key: string, value: unknown, ttlSeconds: number) {
  const serialized = JSON.stringify(value); const client = await getRedis();
  if (client) { await client.set(`cache:${key}`, serialized, { EX: ttlSeconds }); return; }
  memory.set(key, { value: serialized, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheDelete(key: string) {
  const client = await getRedis(); if (client) { await client.del(`cache:${key}`); return; }
  memory.delete(key);
}
