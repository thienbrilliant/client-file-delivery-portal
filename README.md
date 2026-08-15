# Client File Delivery Portal

## Overview

Client File Delivery Portal is a production-oriented foundation for a calm, professional SaaS that stores project files and delivers them securely to clients.

Milestone 1 establishes the application shell, authentication boundary, database model, storage abstraction, theme system, accessibility-oriented UI primitives, security headers, seed data, and developer tooling. Feature milestones build on this foundation without moving business logic into React components.

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
├── features/
├── lib/
│   ├── auth/
│   ├── db/
│   ├── security/
│   ├── storage/
│   ├── utils/
│   └── validation/
├── server/
│   ├── repositories/
│   └── services/
├── types/
└── config/
```

Business rules should live in `server/services` and authorization helpers, while repositories own Prisma query composition. React components are presentation and interaction boundaries.

## Requirements

- Node.js 22.x recommended.
- PostgreSQL 17 for local development.
- npm 10+.

Prisma ORM v7 requires Node.js 20.19+ and recommends Node.js 22.x. The project uses the Prisma Config file because Prisma v7 moved datasource configuration there.

## Installation

```bash
npm install
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Generate Prisma Client and create the initial database migration:

```bash
npm run db:generate
npx prisma migrate dev --name init
npm run db:seed
```

Start the application:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Seed Credentials

Development seed credentials:

- Admin: `admin@example.com`
- Customer: `customer@example.com`
- Password: `ChangeMe123!`

These credentials are development-only. Change or remove them before using any shared environment.

## Environment Variables

Copy `.env.example` to `.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Long random secret used by Auth.js |
| `AUTH_URL` | Yes in production | Canonical application URL |
| `NEXT_PUBLIC_APP_NAME` | No | Replaceable product/brand name |
| `STORAGE_PROVIDER` | No | `local` for Milestone 1 |
| `LOCAL_STORAGE_PATH` | No | Local private storage root |
| `MAX_FILE_SIZE_BYTES` | No | Upload limit configuration |
| `MAX_FILES_PER_UPLOAD` | No | Multi-file upload limit |

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

## Database

The Prisma schema includes the full MVP domain model, including Auth.js-compatible account/session tables.

Prisma v7 uses `prisma.config.ts` for the datasource connection. The generated client is placed in `src/generated/prisma` and is not committed.

## Storage

Business logic depends on the `StorageProvider` interface rather than a vendor SDK.

Milestone 1 provides `LocalStorageProvider` for development. Later milestones can add S3, Cloudflare R2, MinIO, or another S3-compatible implementation without changing file business logic.

Private storage should remain non-public. Secure download endpoints or short-lived signed URLs should sit between a user and the object store.

## Authentication

Auth.js protects the dashboard route boundary. Credentials are validated on the server using Zod and passwords are verified with Argon2id.

The session contains only a user ID and role needed by the application boundary. Raw passwords and share tokens are never stored.

## Production Deployment

A production deployment should use:

- Managed PostgreSQL.
- S3-compatible private object storage.
- Strong `AUTH_SECRET`.
- HTTPS only.
- Secure cookies and a trusted canonical `AUTH_URL`.
- Application-level rate limiting for credential and public-link endpoints.
- Centralized structured logging.
- Automated migrations during deployment.

The Dockerfile uses the Next.js standalone output.

## Testing

The first security tests cover share-token entropy and constant-time hash comparison helpers. Milestone 2 and later milestones must add authorization and object-level access tests before those features are accepted.

## Code Style

- TypeScript strict mode.
- ESLint + Prettier.
- Conventional Commits.
- English comments for source-code rationale.
- Vietnamese text for end-user UI.
- Avoid `any` unless a third-party boundary genuinely requires it.

## Security

The project starts with:

- Argon2id password hashing.
- Server-side authentication.
- Server-side role data in the session.
- Baseline security response headers.
- Path traversal protection in local storage.
- SHA-256 hashing for share tokens.
- No raw share token persistence.
- Private local storage by design.

The remaining security controls are milestone-specific and are not represented as completed before their implementation exists.

## Project Structure

The project favors narrow files and feature-oriented boundaries. New delivery features should normally be introduced under `features/`, their domain services under `server/services/`, repository queries under `server/repositories/`, validation under `lib/validation/`, and reusable UI under `components/`.

## Contributing

Use Conventional Commits, keep changes scoped, run typecheck/lint/tests before opening a pull request, and update the README when developer-facing behavior changes.

## License

License to be selected by the product owner before public distribution.
