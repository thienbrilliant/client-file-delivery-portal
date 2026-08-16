# Deployment

## Recommended Topology

```text
Internet
   ↓ HTTPS / reverse proxy
Next.js application
   ├── PostgreSQL
   ├── Private S3-compatible storage
   ├── Redis (optional/recommended)
   └── Worker
          └── Email provider
```

Keep the database and object storage private. Only the application and worker should receive the credentials needed to access them.

## Reverse Proxy

Terminate HTTPS at the deployment's reverse proxy or platform edge and forward requests to the Next.js application. Configure the canonical application URL and forwarded headers consistently.

## Worker

Run `npm run worker` as a separate long-lived process when durable jobs are enabled. The worker should share the same database and environment configuration as the application.

## Secrets

Inject secrets through the hosting environment or a dedicated secret manager. Never put production secrets into Docker images, Git, screenshots, logs, or issue reports.

## Upgrades

Deploy application code and reviewed database migrations together. Run `npm run db:deploy` before starting code that requires a new schema, following the migration compatibility rules of the change.
