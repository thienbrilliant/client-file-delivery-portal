export interface StorageProvider {
  upload(input: ReadableStream | Buffer, key: string, metadata?: Record<string, string>): Promise<void>;
  download(key: string): Promise<ReadableStream>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}
