# Testing

## Layers

### Unit tests

Use Vitest for pure utilities, validation, service logic, and other deterministic behavior.

### Integration tests

Exercise database-backed services and authorization boundaries where mocking would hide important behavior.

### End-to-end tests

Playwright covers browser workflows when the required application/test environment is available.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run build
```

## Security Scenarios

The regression suite should cover at least:

- customer A cannot access customer B's project
- customer cannot access admin-only routes
- suspended accounts cannot authenticate
- revoked sessions stop working
- expired invitations cannot be reused
- expired/revoked share links cannot download
- wrong delivery passwords are rate limited
- filenames cannot escape their storage namespace
- user-controlled strings render as text
- download limits are enforced atomically

## UI Scenarios

For meaningful UI changes, test desktop and mobile layouts, keyboard navigation, focus states, dark mode, reduced motion, and loading/empty/error/success states.
