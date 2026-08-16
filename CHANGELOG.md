# Changelog

All notable changes to this project are documented here.

## [1.0.0] — 2026-08-16

First public-ready release of the self-hosted Client File Delivery Portal.

### Added

- Customer account lifecycle with invitations and activation.
- Password reset and session revocation flows.
- Optional Google authentication configuration.
- Project, folder, file, delivery, and share-link workflows.
- Private storage abstraction with signed download URLs.
- PostgreSQL-backed background jobs with retry and idempotency support.
- Provider-agnostic email infrastructure.
- Notifications, activity, health checks, rate-limit/cache foundations, and environment validation.
- Production Docker and self-hosting documentation.
- Open-source contribution, security, licensing, testing, and release documentation.

### Changed

- Redesigned the admin workspace and customer portal with a responsive, light-first visual system.
- Refined authentication, account, settings, delivery, file-management, and navigation experiences.
- Improved responsive behavior across desktop, tablet, and mobile layouts.
- Refined visual hierarchy, spacing, typography, status treatments, and interaction feedback.
- Improved session routing so authenticated users return to the appropriate workspace instead of being unnecessarily sent through the public lobby.

### Security

- Strengthened account-state enforcement and session revocation behavior.
- Hardened invitation and password-reset flows.
- Kept private objects behind server-side authorization and signed URLs.
- Added validation and access-control safeguards around file and delivery workflows.

### Documentation

- Finalized architecture, authentication, authorization, storage, jobs, deployment, backup, security, testing, licensing, troubleshooting, and design-system documentation.
- Added repository contribution, security policy, code of conduct, and release guidance.

## [Unreleased]

Future changes will be documented here after the 1.0.0 release.
