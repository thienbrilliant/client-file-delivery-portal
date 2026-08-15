import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'node:stream';
import type { StorageProvider } from './types';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required storage configuration: ${name}`);
  return value;
}

export class S3StorageProvider implements StorageProvider {
  private readonly bucket = required('S3_BUCKET');
  private readonly client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY
      ? { accessKeyId: process.env.S3_ACCESS_KEY, secretAccessKey: process.env.S3_SECRET_KEY }
      : undefined,
  });

  async upload(input: ReadableStream | Buffer, key: string, metadata?: Record<string, string>): Promise<void> {
    const body = Buffer.isBuffer(input) ? input : Buffer.from(await new Response(input).arrayBuffer());
    await this.client.send(new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, Metadata: metadata }));
  }

  async download(key: string): Promise<ReadableStream> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: this.bucket, Key: key }));
    if (!result.Body) throw new Error('Storage object has no response body.');
    if ('transformToWebStream' in result.Body && typeof result.Body.transformToWebStream === 'function') {
      return result.Body.transformToWebStream() as ReadableStream;
    }
    return Readable.toWeb(result.Body as Readable) as ReadableStream;
  }

  async delete(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
  }

  async exists(key: string): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket: this.bucket, Key: key }));
      return true;
    } catch {
      return false;
    }
  }

  async getSignedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: Math.max(1, Math.min(expiresInSeconds, 900)) });
  }
}
