# Delivery System

## Lifecycle

A `Delivery` is a metadata package that references existing project `File` records through `DeliveryFile`. Binary data is never duplicated.

Normal lifecycle:

`PREPARING → READY → VIEWED → DOWNLOADED`

A delivery may become `EXPIRED` by policy and `REVOKED` when an administrator removes access. Runtime access is always decided by the share link's active state, expiry, and download limit.

## Share links

A share link contains a cryptographically random 32-byte URL-safe token. The database stores only a SHA-256 hash of that token. Public requests hash the presented token and look up the hash.

The raw token is returned only during link creation so it can be copied into the customer's message. It is never returned by the management list endpoint.

## Password protection

Passwords use the existing Argon2id password helper. Plain-text passwords are never persisted or logged. Generated passwords are returned only in the creation response and should be copied by the administrator at that time.

Password verification is rate-limited in development with an in-memory limiter. Production deployments should replace this implementation with a distributed limiter when multiple application instances are used.

Successful password verification creates an HttpOnly, SameSite cookie signed with `AUTH_SECRET` (or `NEXTAUTH_SECRET`). The cookie contains only the share-link ID, expiry, and a signature; it is not the raw share token.

## Expiration and limits

Expiration is checked server-side for page access, password verification, preview, and download.

Download limits are enforced with an atomic PostgreSQL `UPDATE` condition. This avoids a read-then-write race where concurrent requests could exceed `maxDownloads`.

A download is registered only after the storage object has been confirmed to exist and a readable stream has been obtained. The registration transaction increments the counter and creates the download log together.

## Public access

Public routes are based on `/delivery/[token]`. Internal project/customer IDs are not used as the authorization credential. A file can be downloaded or previewed only when its `File` record is a member of the delivery resolved from the share token.

Safe previews are limited to PDF, JPEG, PNG, GIF, and WebP. HTML and SVG are deliberately excluded from inline rendering.

## Revocation and rotation

Revocation sets `isActive=false` and keeps the database record for auditability. Rotation revokes the old link and creates a new token in one database transaction.

## Activity and privacy

Delivery view/download and share-link lifecycle events are written to `ActivityLog`. Download details are stored in `DownloadLog`. Raw tokens, passwords, storage keys, and file content are never written to activity metadata.
