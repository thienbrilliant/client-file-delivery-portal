# Licensing

## Project License

Client File Delivery Portal is released under the MIT License. See the repository root `LICENSE` file.

## Dependency Licensing

The runtime and development dependency set should be reviewed before each release. The repository currently uses packages from the npm ecosystem, including Next.js, React, Prisma, Auth.js, AWS SDK packages, Redis, Zod, Lucide, Tailwind CSS, Vitest, and Playwright.

Do not infer a package license solely from its package name. Review the package metadata and the package's own license/notice files for the exact version used by the lockfile.

## Third-party Assets

Any font, icon, image, illustration, copied snippet, or other bundled asset must have a known source and license compatible with this repository's distribution model. Prefer repository-owned assets and permissively licensed dependencies.

## Release Audit

Before a public release:

1. Inspect `package.json` and the lockfile for direct and transitive dependencies.
2. Flag GPL/AGPL/SSPL, source-available, non-commercial, or otherwise restrictive licenses for manual review.
3. Review bundled assets and fonts for attribution requirements.
4. Keep required notices and attribution files in the repository.
5. Never commit assets whose license or provenance is unknown.
