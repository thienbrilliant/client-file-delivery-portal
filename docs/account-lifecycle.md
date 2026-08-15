# Customer Account Lifecycle

## States

```text
INVITED ──activate──> ACTIVE
ACTIVE ──suspend──> SUSPENDED ──reactivate──> ACTIVE
ACTIVE ──disable──> DISABLED ──reactivate──> ACTIVE
ACTIVE/SUSPENDED ──soft delete──> DISABLED + deletedAt
```

## Invitation

- 48-hour default TTL (`INVITATION_TTL_HOURS`).
- Token is generated with cryptographic randomness and stored only as SHA-256 hash.
- Previous unused invitations are invalidated before a new invitation is created.
- Activation is one-time and sets the password server-side.
- Raw tokens are never written to application logs. Email jobs store an encrypted token payload.

## Password reset

- Reset requests intentionally return the same response whether an email exists.
- Tokens are short-lived, one-time and hashed in the database.
- Reset increments `sessionVersion`, invalidating existing JWT sessions.

## Session revocation

Admin actions increment `sessionVersion` and remove database sessions. The proxy also checks the current account status before allowing protected routes.

## Account deletion

Milestone 5 defaults to soft deletion: account login is disabled, sessions are revoked, and business data is retained. A future hard-delete operation must be asynchronous because storage objects can be large. Hard deletion must first resolve `File.uploadedById` retention semantics and should not be implemented as a direct `DELETE FROM User` operation.
