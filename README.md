# Client File Delivery Portal

## Overview

Client File Delivery Portal is a production-oriented foundation for a calm, professional SaaS that stores project files and delivers them securely to clients.

Milestone 1 established the application shell, authentication boundary, database model, storage abstraction, theme system, accessibility-oriented UI primitives, security headers, seed data, and developer tooling. Milestone 2 extends that foundation with real customer, project, folder and file-management workflows. Milestone 3 turns those files into secure delivery packages with controlled public sharing.

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

### Milestone 3

- Delivery packages referencing existing project files without binary duplication.
- Server-side cross-project file validation and unique delivery-file membership.
- Secure 32-byte share tokens stored only as SHA-256 hashes.
- Optional Argon2id password protection and generated passwords.
- Server-side expiration and download limits.
- Atomic PostgreSQL download-limit enforcement for concurrent requests.
- Public responsive delivery page with password gate.
- Safe PDF/image previews; arbitrary HTML/SVG is not rendered inline.
- Secure public downloads with delivery-membership authorization.
- Share-link revoke and rotate endpoints.
- Delivery activity and download logging.
- Admin delivery creation, file selection and share-link management.

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

## Development

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Delivery System

Admin flow:

`Project → File Manager → Bàn giao → Chọn file → Tạo link → Sao chép`

Customer flow:

`/delivery/[token] → password (nếu có) → xem file → xem trước/tải xuống`

See `docs/delivery-system.md` for the lifecycle, token hashing, password protection, expiration, download limits, public authorization and privacy model.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Long random secret used by Auth.js and public delivery access cookies |
| `AUTH_URL` | Yes in production | Canonical application URL |
| `NEXT_PUBLIC_APP_NAME` | No | Replaceable product/brand name |
| `STORAGE_PROVIDER` | No | `local` for development |
| `LOCAL_STORAGE_PATH` | No | Local private storage root |
| `MAX_FILE_SIZE` | No | Maximum bytes per uploaded file; defaults to 50 MiB |
| `MAX_FILES_PER_UPLOAD` | No | Maximum files in one request; defaults to 20 |

## Security

The project uses Argon2id password hashing, server-side authentication, role-aware sessions, security headers, path traversal protection, private storage, stable object keys and server-side object authorization. Milestone 3 additionally hashes share tokens, signs password-access cookies, rate-limits password verification and atomically enforces download limits.

Raw share tokens, passwords, storage keys and file content must never be logged.

## Documentation

- `docs/architecture.md`
- `docs/authorization.md`
- `docs/file-management.md`
- `docs/delivery-system.md`

## Code Style

- TypeScript strict mode.
- ESLint + Prettier.
- Conventional Commits.
- English comments for source-code rationale.
- Vietnamese text for end-user UI.
- Avoid `any` unless a third-party boundary genuinely requires it.
