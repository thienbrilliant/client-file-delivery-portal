# Client File Delivery Portal

## Overview

Client File Delivery Portal is a production-oriented foundation for a calm, professional SaaS that stores project files and delivers them securely to clients.

Milestone 1 established the application shell, authentication boundary, database model, storage abstraction, theme system, accessibility-oriented UI primitives, security headers, seed data, and developer tooling. Milestone 2 extends that foundation with real customer, project, folder and file-management workflows. Milestone 3 turns those files into secure delivery packages with controlled public sharing. Milestone 4 adds a customer-owned portal, event-based notifications, customer uploads and a restrained UI/UX refinement. Milestone 5 adds production storage, account lifecycle management, durable jobs, email infrastructure, distributed rate-limit/cache foundations, health checks, deployment hardening and a second UI refinement pass.

## Milestone 5

- Customer lifecycle: invited, active, suspended and disabled.
- Secure one-time invitation tokens and 48-hour activation flow.
- Password reset with hashed, short-lived tokens and enumeration-safe responses.
- Admin suspension, reactivation, disabling, session revocation and soft deletion.
- Customer account/security UI and refined admin customer detail UI.
- S3-compatible storage provider for S3, R2, MinIO and B2-style endpoints.
- Short-lived signed download URLs and direct upload session foundation.
- Durable PostgreSQL job queue with idempotency and retry semantics.
- Provider-agnostic email service with development and Resend providers.
- Redis-backed distributed rate-limit and cache foundations with in-memory fallback.
- Structured logging and vendor-neutral error reporting hook.
- Liveness, database and storage health endpoints.
- Production environment validation and hardened Docker image.
- Local PostgreSQL, Redis, MinIO and Mailpit development stack.
- Production, backup/restore, jobs, email, storage and account lifecycle documentation.

## Tech Stack

- Next.js 16 (Active LTS at the time of Milestone 5)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Auth.js / `next-auth`
- Prisma ORM 7
- PostgreSQL
- Redis
- S3-compatible object storage
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

For production-like local infrastructure:

```bash
docker compose up -d
```

Run the durable job worker separately:

```bash
npm run worker
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
```

## Delivery System

Admin flow:

`Project → File Manager → Bàn giao → Chọn file → Tạo link → Sao chép`

Customer flow:

`/portal → Dự án → Bàn giao → xem file → tải xuống`

Public flow:

`/delivery/[token] → password (nếu có) → xem file → xem trước/tải xuống`

See `docs/delivery-system.md` for the lifecycle, token hashing, password protection, expiration, download limits, public authorization and privacy model.

## Customer Accounts

`Admin → Khách hàng → Tạo khách hàng → Gửi lời mời → Customer đặt mật khẩu → ACTIVE`

Account state changes revoke the account session version. Customer deletion is soft by default; business data is retained until a separately designed hard-delete policy is approved and implemented.

See `docs/account-lifecycle.md` for the state diagram and security rules.

## Production

See `docs/production.md` and `docs/production-checklist.md` before deployment. Production uses `prisma migrate deploy`, private object storage, a separate worker process and tested backups/restores.

See `docs/storage.md`, `docs/jobs.md` and `docs/email.md` for infrastructure details.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Long random secret used by Auth.js and short-lived secret encryption |
| `AUTH_URL` | Yes in production | Canonical HTTPS application URL |
| `NEXT_PUBLIC_APP_NAME` | No | Replaceable product/brand name |
| `STORAGE_PROVIDER` | No | `local` for development; `s3`, `r2`, `minio` or `b2` for S3-compatible storage |
| `S3_ENDPOINT` | For S3-compatible storage | Endpoint URL for R2/MinIO/other providers |
| `S3_REGION` | For S3-compatible storage | Region or `auto` where supported |
| `S3_BUCKET` | For S3-compatible storage | Private bucket name |
| `S3_ACCESS_KEY` | For S3-compatible storage | Least-privilege access key |
| `S3_SECRET_KEY` | For S3-compatible storage | Least-privilege secret |
| `SIGNED_URL_EXPIRES_SECONDS` | No | Signed download TTL, capped at 15 minutes |
| `REDIS_URL` | Recommended in production | Distributed rate limiting and cache |
| `EMAIL_PROVIDER` | No | `console` or `resend` |
| `EMAIL_FROM` | Resend | Verified sender address |
| `RESEND_API_KEY` | Resend | Email provider secret |
| `INVITATION_TTL_HOURS` | No | Invitation lifetime; defaults to 48 hours |
| `PASSWORD_RESET_TTL_MINUTES` | No | Password reset lifetime; defaults to 60 minutes |

## Security

The project uses Argon2id password hashing, server-side authentication, security headers, path traversal protection, private storage, stable object keys and server-side object authorization. Milestone 3 additionally hashes share tokens, signs password-access cookies, rate-limits password verification and atomically enforces download limits. Milestone 4 keeps customer authorization on the server for portal queries and uploads and isolates notifications by authenticated user. Milestone 5 adds account state enforcement, invitation/reset token hashing, revocable account-version cookies, signed storage URLs, distributed rate limiting, durable job retries and structured error reporting.

Raw passwords, invitation/reset tokens, share tokens, signed URLs, storage credentials, session secrets and file contents must never be logged.

## Documentation

- `docs/architecture.md`
- `docs/authorization.md`
- `docs/file-management.md`
- `docs/delivery-system.md`
- `docs/design-system.md`
- `docs/customer-portal.md`
- `docs/account-lifecycle.md`
- `docs/storage.md`
- `docs/jobs.md`
- `docs/email.md`
- `docs/production.md`
- `docs/production-checklist.md`

## Code Style

- TypeScript strict mode.
- ESLint + Prettier.
- Conventional Commits.
- English comments for source-code rationale.
- Vietnamese text for end-user UI.
- Avoid `any` unless a third-party boundary genuinely requires it.
