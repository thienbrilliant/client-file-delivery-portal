# Architecture

Milestone 2 extends the existing Next.js + Prisma architecture instead of introducing a parallel stack.

```text
App Router
  -> Route handlers
  -> requireActor / permission helpers
  -> repositories
  -> Prisma

File upload
  -> route validation
  -> StorageProvider
  -> File metadata
  -> ActivityLog
```

Repositories isolate Prisma queries. Route handlers are the transport boundary; business/security checks are centralized in `src/server/permissions.ts` and `src/server/require-auth.ts`. Storage is abstracted behind `StorageProvider`, with local filesystem storage used for development.

The existing identity model is preserved: `Project.customerId` references `User.id`, while customer-specific profile data remains in `CustomerProfile`.
