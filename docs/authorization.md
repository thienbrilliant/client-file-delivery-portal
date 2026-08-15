# Authorization

Milestone 2 keeps one identity model: `User` plus the optional `CustomerProfile`. `Project.customerId` points to the customer user.

- `ADMIN`: full management scope.
- `CUSTOMER`: read-only access to projects owned by that customer, including folders and files in those projects.
- Cross-project access is rejected server-side.
- Folder and file mutations are admin-only in Milestone 2.

Permission helpers live in `src/server/permissions.ts`. Route handlers call `requireActor`/`requireAdmin` and resource-specific helpers before returning data or touching storage.
