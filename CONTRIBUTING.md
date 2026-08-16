# Contributing

Thanks for taking the time to improve Client File Delivery Portal.

The project is intentionally kept as a focused, self-hostable application. Contributions should improve correctness, security, usability, accessibility, performance, or maintainability without introducing infrastructure that the product does not need.

## Development Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

For local infrastructure:

```bash
docker compose up -d
```

Run the worker separately when testing background jobs:

```bash
npm run worker
```

## Before Opening a Pull Request

Run the checks available in the repository:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
```

For UI changes, also verify keyboard navigation, responsive layouts, dark mode, reduced motion, loading/empty/error states, and the relevant Playwright flows when available.

## Code Guidelines

- Keep TypeScript strict and explicit.
- Prefer server-side authorization for protected resources.
- Validate external input at system boundaries.
- Keep components focused; avoid large monolithic files.
- Reuse the design system instead of inventing one-off controls.
- Use English for source-code comments and Vietnamese for user-facing UI.
- Do not log secrets, raw tokens, credentials, or customer file contents.
- Do not add dependencies for problems that can be solved clearly with existing tooling.

## Commits

Use concise Conventional Commit-style messages, for example:

```text
feat: add delivery expiration controls
fix: prevent cross-customer project access
refactor: simplify file list queries
docs: update self-hosting guide
```

## Pull Requests

A pull request should explain:

- what changed
- why it changed
- how it was tested
- UI screenshots for meaningful visual changes
- security considerations
- breaking changes or migration requirements

Keep unrelated refactors out of feature pull requests where possible.
