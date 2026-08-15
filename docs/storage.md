# Storage

The application uses a `StorageProvider` abstraction. Local filesystem storage remains useful for development; production can use S3, Cloudflare R2, MinIO or another S3-compatible service.

## Environment

- `STORAGE_PROVIDER=s3|r2|minio|b2`
- `S3_ENDPOINT`
- `S3_REGION`
- `S3_BUCKET`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`
- `S3_FORCE_PATH_STYLE`
- `SIGNED_URL_EXPIRES_SECONDS`

Production buckets must be private. Use least-privilege credentials, server-side encryption where available, and versioning/lifecycle policies where supported.

## Downloads

Authorized requests are checked at the application layer first. S3-compatible production storage then receives a short-lived GET presigned URL. The URL is generated on demand and is never persisted.

## Upload foundation

`UploadSession` prepares direct-to-storage uploads. The current implementation issues a short-lived signed PUT URL and records a pending session. Completion verifies that the object exists before committing file metadata. The data model is intentionally designed to evolve into multipart/resumable uploads without routing large binaries through the application server.

## Cleanup

Storage deletion is asynchronous for large datasets. Never delete an object solely because it is not immediately referenced during a concurrent upload transaction; cleanup must consider object age and database state.
