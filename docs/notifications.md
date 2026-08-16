# Notifications

Notifications are persisted records scoped to an authenticated user. The UI can display unread state, timestamps, and the relevant destination without exposing another user's notification records.

## Flow

```text
Domain event
   ↓
Notification service
   ↓
Persist notification
   ↓
Customer/admin UI
```

When a notification also requires email or another asynchronous side effect, the durable job system should own that work rather than blocking the request unnecessarily.

## Rules

- Scope queries by authenticated user ID.
- Do not place secrets or private file contents in notification bodies.
- Mark read/unread state server-side.
- Keep notification creation idempotent where duplicate domain events are possible.
