# Production

## Deployment

1. Provision PostgreSQL, private S3-compatible storage, Redis, and email provider.
2. Set production environment variables and a strong `AUTH_SECRET`.
3. Build the Docker image.
4. Run `npx prisma migrate deploy` against the production database before serving the new application version.
5. Start the web process and the background worker as separate processes.
6. Verify `/api/health`, `/api/health/db`, and `/api/health/storage`.

Do not use `prisma db push` in production.

## Backup

- Take daily PostgreSQL backups with infrastructure tooling.
- Enable object storage versioning where supported.
- Define retention separately for database backups and object storage.
- Keep staging storage and production storage in separate buckets.

## Restore order

1. Restore PostgreSQL backup.
2. Restore/recover the corresponding object storage version or backup.
3. Deploy an application version compatible with the restored schema.
4. Run health checks.
5. Test an authenticated file download and an admin customer lookup.

A backup is not considered reliable until a restore has been tested.

## Rollback

Application rollback should use the previous immutable image. Database migrations must be forward-compatible where possible. Destructive migrations require a backup and an explicit rollback/restore plan; production should not rely on `db push`.

## Secrets

Never commit production secrets. Never expose storage credentials, signed URLs, session tokens, invitation tokens, reset tokens or passwords in logs.
