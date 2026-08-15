import path from 'node:path';
import { LocalStorageProvider } from './local';
import type { StorageProvider } from './types';
export function createStorageProvider(): StorageProvider { const provider = process.env.STORAGE_PROVIDER ?? 'local'; if (provider === 'local') return new LocalStorageProvider(path.resolve(process.env.LOCAL_STORAGE_PATH ?? './storage')); throw new Error(`Unsupported storage provider: ${provider}`); }
