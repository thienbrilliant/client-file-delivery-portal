# Client File Delivery Portal

## Overview

Client File Delivery Portal is a production-oriented foundation for a calm, professional SaaS that stores project files and delivers them securely to clients.

Milestone 1 established the application shell, authentication boundary, database model, storage abstraction, theme system, accessibility-oriented UI primitives, security headers, seed data, and developer tooling. Milestone 2 extends that foundation with real customer, project, folder and file-management workflows.

## Features

### Milestone 1

- Next.js App Router with TypeScript strict mode.
- Vietnamese UI with a replaceable product/brand name.
- Calm light/dark visual system with system preference support.
- Auth.js credentials authentication with JWT sessions.
- Argon2id password hashing.
- PostgreSQL + Prisma ORM v7 schema.
- Customer/project/file/delivery/share-link/activity/notification data model.
- Local storage provider abstraction prepared for S3-compatible providers.
- Server-side dashboard access boundary and object-scoped query patterns.
- Baseline security headers.
- ESLint, Prettier, Vitest, Playwright dependency baseline.
- Dockerfile and local PostgreSQL docker compose file.

### Milestone 2

- Admin customer listing, search, create and detail views.
- Project listing, search, create and detail views.
- Nested project folders with safe names.
- Multi-file upload through the storage abstraction.
- Stable storage keys independent of original filenames.
- Server-side file size/count/name/type validation.
- Protected file download with Unicode-safe `Content-Disposition`.
- File rename, move and delete.
- Empty/loading states and responsive file explorer UI.
- Project-scoped file search.
- Activity records for project, folder and file mutations/downloads.
- Centralized authorization helpers for customer/project/folder/file scope.
- Documentation for architecture, authorization and file lifecycle.

Delivery/share-link functionality remains intentionally outside Milestone 2.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Auth.js / `next-auth`
- Prisma ORM 7
- PostgreSQL
- Zod
- Argon2id
- Vitest
- Playwright

## Architecture

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── security/
│   ├── storage/
│   ├── utils/
│   └── validation/
├── server/
│   ├── repositories/
│   ├── services/
│   ├── permissions.ts
│   └── require-auth.ts
├── types/
└── config/
```

Business rules should live in server services/authorization helpers, repositories own Prisma query composition, and React components are presentation and interaction boundaries.

## Requirements

- Node.js 22.x recommended.
- PostgreSQL 17 for local development.
- npm 10+.

## Installation

```bash
npm install
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Generate Prisma Client and create the database migration:

```bash
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
```

Start the application:

```bash
npm run dev
```

## Seed Credentials

Development seed credentials:

- Admin: `admin@example.com`
- Customer: `customer@example.com`
- Password: `ChangeMe123!`

These credentials are development-only.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Long random secret used by Auth.js |
| `AUTH_URL` | Yes in production | Canonical application URL |
| `NEXT_PUBLIC_APP_NAME` | No | Replaceable product/brand name |
| `STORAGE_PROVIDER` | No | `local` for development |
| `LOCAL_STORAGE_PATH` | No | Local private storage root |
| `MAX_FILE_SIZE` | No | Maximum bytes per uploaded file; defaults to 50 MiB |
| `MAX_FILES_PER_UPLOAD` | No | Maximum files in one request; defaults to 20 |

## Development

Useful commands:

```bash
npm run dev
npm run typecheck
npm run lint
npm run test
npm run format:check
npm run build
```

## Storage

Business logic depends on the `StorageProvider` interface rather than a vendor SDK. Milestone 2 uses `LocalStorageProvider` for development. Object keys are stable (`projects/{projectId}/files/{fileId}`), while the original filename remains metadata.

Local storage is private and rejects path traversal. Downloads go through an authenticated server endpoint.

## Authorization

Milestone 2 uses one identity model: `User` plus optional `CustomerProfile`. `Project.customerId` references the customer `User.id`.

- `ADMIN`: manage customers, projects, folders and files.
- `CUSTOMER`: view only projects owned by that customer and the files/folders inside them.
- Cross-project access is rejected server-side.

See `docs/authorization.md` and `docs/file-management.md` for the detailed model.

## Testing

The CI pipeline runs Prisma generation, migrations, typecheck, lint, tests and production build. Milestone 2 should add object-level authorization and end-to-end upload/download coverage before the milestone is considered production-ready.

## Security

The project starts with Argon2id password hashing, server-side authentication, role-aware sessions, security headers, path traversal protection, private storage, stable object keys and server-side object authorization.

## Documentation

- `docs/architecture.md`
- `docs/authorization.md`
- `docs/file-management.md`

## Code Style

- TypeScript strict mode.
- ESLint + Prettier.
- Conventional Commits.
- English comments for source-code rationale.
- Vietnamese text for end-user UI.
- Avoid `any` unless a third-party boundary genuinely requires it.

## License

License to be selected by the product owner before public distribution.
