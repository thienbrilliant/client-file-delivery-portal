# Email

Email delivery is abstracted behind `EmailProvider`.

Supported providers:

- `console` for development; it logs only recipient and subject, never the message body or token.
- `resend` for production via `RESEND_API_KEY` and `EMAIL_FROM`.

Templates currently cover customer invitations and password resets. The worker decrypts short-lived job secrets only while constructing the outgoing message. Raw invitation/reset tokens are not stored in plaintext in the database or written to logs.

Production email links must use HTTPS and a production `AUTH_URL`.
