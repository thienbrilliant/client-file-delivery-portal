# Backup and Restore

## What to Back Up

At minimum, back up:

- PostgreSQL database
- production configuration/secrets through the deployment's secret-management process
- object storage according to the chosen storage provider's durability and retention policy

Application source is recoverable from version control and should not be treated as the only backup of customer data.

## Database

Use PostgreSQL-native backup tooling appropriate to the deployment. Test restores into an isolated environment regularly.

A backup is not considered verified until a restore has been performed successfully.

## Object Storage

Private objects should have a retention and recovery strategy appropriate to the files being stored. If the provider supports versioning or lifecycle controls, evaluate them as part of the production policy.

## Recovery Principles

1. Restore database infrastructure.
2. Restore or reconnect object storage.
3. Deploy the matching application version.
4. Apply reviewed migrations when required.
5. Start the worker.
6. Run health checks and a read-only smoke test.
7. Confirm authentication, file metadata, delivery links, and downloads.

Do not use destructive development reset commands as a recovery strategy.
