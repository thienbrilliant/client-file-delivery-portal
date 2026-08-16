# Authentication

## Purpose

Describe how users authenticate, activate accounts, reset passwords, and lose access when account state changes.

## Login

Credential login is handled by Auth.js. Credentials are verified server-side and successful authentication creates the application session.

Google sign-in is optional and depends on the deployment's provider configuration. Do not advertise Google sign-in when the provider is not configured.

## Invitation

Customer invitations use short-lived one-time tokens. The persistent token representation is hashed so a database read does not expose a usable invitation credential.

## Passwords

Passwords are hashed with Argon2. Raw passwords must never be logged, persisted, or returned in API responses.

## Password Reset

Password reset requests are designed to be enumeration-safe. Reset tokens are short-lived and invalid after successful use or expiration.

## Session Revocation

Account-state changes can invalidate existing customer sessions through the account/session version mechanism. Suspension and disabling therefore affect existing access instead of relying only on the next login attempt.

## Operational Rules

- Keep `AUTH_SECRET` outside source control.
- Use HTTPS in production.
- Configure a canonical `AUTH_URL` in production.
- Never place raw authentication tokens in logs or analytics.
- Review provider callback URLs when enabling Google authentication.
