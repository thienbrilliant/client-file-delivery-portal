import { createReadStream } from 'node:fs';
import { access, mkdir, unlink, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { StorageProvider } from './types';
export class LocalStorageProvider implements StorageProvider {
  constructor(private readonly rootPath: string) {}
  private resolveKey(key: string) { const normalized = key.replaceAll('\\', '/').replace(/^\/+/, ''); if (normalized.split('/').includes('..')) throw new Error('Invalid storage key.'); return path.resolve(this.rootPath, normalized); }
  async upload(input: ReadableStream | Buffer, key: string): Promise<void> { const destination = this.resolveKey(key); await mkdir(path.dirname(destination), { recursive: true }); const buffer = Buffer.isBuffer(input) ? input : Buffer.from(await new Response(input).arrayBuffer()); await writeFile(destination, buffer, { flag: 'wx' }); }
  async download(key: string): Promise<ReadableStream> { return Readable.toWeb(createReadStream(this.resolveKey(key))) as ReadableStream; }
  async delete(key: string): Promise<void> { await unlink(this.resolveKey(key)); }
  async exists(key: string): Promise<boolean> { try { await access(this.resolveKey(key), constants.F_OK); return true; } catch { return false; } }
  async getSignedUrl(): Promise<string> { throw new Error('Local storage does not expose public signed URLs. Use the protected download endpoint.'); }
}
