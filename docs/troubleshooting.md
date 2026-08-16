# Troubleshooting

## Database connection failed

Check `DATABASE_URL`, database reachability, credentials, and whether migrations have been applied.

```bash
npm run db:generate
npm run db:deploy
```

## Storage upload/download failed

Check the storage provider, endpoint, region, bucket, credentials, and private-bucket policy. Do not make a private bucket public to work around signed URL failures.

## Email was not received

Check the configured provider, sender identity, provider logs, and application job status. Development email configuration may intentionally print messages instead of sending them.

## Invitation expired

Create a new invitation rather than reusing an expired token. Invitation tokens are intentionally short-lived.

## Customer cannot log in

Check account state, credentials, session cookies, and whether the account's session version was recently revoked. Suspended or disabled accounts should not be treated as credential failures alone.

## File preview does not work

Verify that the file type is supported by the browser and that the download/signing path is authorized. Do not expose the storage bucket directly as a workaround.

## Job appears stuck

Check the worker process, database job state, retry count, and recent application logs. Run `npm run worker:once` when debugging a single local job.

## Migration failed

Stop before running destructive reset commands. Inspect the migration error, database state, and the migration SQL. Restore from a verified backup when a production migration requires recovery.
