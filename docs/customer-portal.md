# Customer Portal — Milestone 4

## Routes

- `/portal` — customer dashboard
- `/portal/projects` — customer projects
- `/portal/projects/[id]` — project files, deliveries and optional upload
- `/portal/deliveries/[id]` — delivery detail
- `/portal/notifications` — notification center
- `/portal/account` — profile and password

## Isolation

Portal pages query projects through `customerId = session.user.id`. File downloads reuse the existing server-side file authorization. Customer routes reject non-customer sessions at the portal layout.

## Customer upload

Project-level `customerUploadEnabled` is the server-side switch. Hiding the control is not the security boundary; the upload endpoint checks the authenticated customer and the project setting before writing storage/database records.

## Notifications

`NotificationService` owns creation/list/read operations. Delivery creation creates a customer notification with a portal href. Customer uploads can notify admins. `dedupeKey` prevents duplicate notifications when the same business event is retried.

## Activity

Customer-visible delivery opening and upload events are recorded through the existing activity logger. Internal admin-only data is not returned by portal queries.

## Account security

Password changes verify the current password and hash the new password with the existing Argon2id helper. Passwords are never logged or returned by the API.
