# Security Policy

## Supported Versions

Security fixes are expected to target the default branch and the latest documented release. Older releases may not receive backports.

## Reporting a Vulnerability

Please do not open a public GitHub issue for a suspected vulnerability.

Use a private security report through GitHub's **Report a vulnerability** flow when private vulnerability reporting is enabled for the repository. If that channel is unavailable, contact the repository maintainer privately through the contact method published in the repository profile.

Include:

- affected version or commit
- affected route, component, or subsystem
- reproduction steps
- expected and observed behavior
- impact assessment
- relevant logs or screenshots with secrets and personal data removed

Do not include passwords, API keys, session cookies, raw tokens, storage credentials, or private customer files.

## Disclosure

Please allow reasonable time for investigation, remediation, and release preparation before public disclosure. Coordinated disclosure helps protect self-hosted installations that may be running the affected version.

## Security Expectations

The application is designed around server-side authorization, private object storage, short-lived signed downloads, hashed security tokens, password hashing, account/session revocation, and rate limiting. These controls should be reviewed again when adapting the project for a specific production environment.
