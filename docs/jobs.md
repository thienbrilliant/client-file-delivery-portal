# Background Jobs

Jobs are persisted in PostgreSQL so a process restart does not silently lose work.

## Job lifecycle

```text
PENDING -> RUNNING -> COMPLETED
             |
             +-> PENDING (retry)
             +-> FAILED (attempt limit reached)
```

Jobs have an idempotency key, attempt counter and retry delay. The worker claims work using PostgreSQL row locking with `SKIP LOCKED`, allowing multiple workers without processing the same job concurrently.

Run locally:

```bash
npm run worker
```

Run one pass:

```bash
npm run worker:once
```

Long-running tasks such as invitation email delivery, password reset email delivery and storage cleanup should run in the worker rather than inside an HTTP request.
