# Release Checklist

Use this checklist before tagging a public release.

## Repository

- [ ] README reflects the current implementation
- [ ] LICENSE is present and correct
- [ ] SECURITY.md is current
- [ ] CONTRIBUTING.md is current
- [ ] CODE_OF_CONDUCT.md is current
- [ ] CHANGELOG.md is updated
- [ ] No secrets, credentials, debug dumps, or private customer data are committed

## Code Quality

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run format:check`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] Relevant Playwright/E2E flows pass

## Security

- [ ] Authentication and session revocation reviewed
- [ ] Object-level authorization reviewed
- [ ] Share links and delivery expiration reviewed
- [ ] Upload filename/MIME/size/path handling reviewed
- [ ] XSS and open-redirect inputs reviewed
- [ ] Rate limits reviewed
- [ ] Logs contain no secrets or raw security tokens
- [ ] Dependency audit reviewed
- [ ] License audit reviewed

## Operations

- [ ] Production environment variables documented
- [ ] Database migrations reviewed
- [ ] Backup and restore procedure verified
- [ ] Private object storage verified
- [ ] Worker process verified if jobs are enabled
- [ ] Email provider verified if enabled
- [ ] Health checks verified

## UI

- [ ] Desktop smoke test
- [ ] Tablet smoke test
- [ ] Mobile smoke test
- [ ] Dark mode review
- [ ] Keyboard/focus review
- [ ] Reduced-motion review
- [ ] Loading, empty, error, and success states reviewed

## Release

- [ ] Version updated only when acceptance criteria pass
- [ ] Changelog finalized
- [ ] Final smoke test completed
- [ ] Release tag created
