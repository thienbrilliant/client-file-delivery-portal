import path from 'node:path';
import { LocalStorageProvider } from './storage/local';
import { S3StorageProvider } from './storage/s3';
import type { StorageProvider } from './storage/types';

export function createStorageProvider(): StorageProvider {
  const provider = (process.env.STORAGE_PROVIDER ?? 'local').toLowerCase();
  if (provider === 'local') return new LocalStorageProvider(path.resolve(process.env.LOCAL_STORAGE_PATH ?? './storage'));
  if (provider === 's3' || provider === 'r2' || provider === 'minio' || provider === 'b2') return new S3StorageProvider();
  throw new Error(`Unsupported storage provider: ${provider}`);
}

export type { StorageProvider } from './storage/types';
