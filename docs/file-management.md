# File management

## Upload

The browser sends a multipart request to `/api/files`. The server authenticates the actor, validates project/folder scope, file count, size and filename, then writes the object through the storage abstraction. The storage key is stable and opaque: `projects/{projectId}/files/{fileId}`. Only after storage succeeds is the metadata row created. Failed metadata creation triggers storage cleanup.

## Download

Downloads go through `/api/files/{id}`. Authorization is checked against the project customer before the storage object is opened. The local provider does not expose public URLs; the protected endpoint streams the object and records a download/activity event.

## Rename

Renaming updates `originalName` only. The stable storage key is unchanged, avoiding an unnecessary physical object move.

## Move

Moving a file changes `folderId` only. The service validates that the destination folder belongs to the same project, preventing cross-project placement.

## Delete

Storage deletion happens before the metadata row is removed. If storage deletion fails, the database row is retained so an orphaned metadata record is not silently created.

## Authorization

Admins manage customers, projects, folders and files. Customers can view only projects whose `customerId` is their own user id, and consequently only files/folders within those projects. Every API endpoint performs server-side authorization; client UI state is never treated as a security boundary.

## Current storage

Development uses `LocalStorageProvider` behind the `StorageProvider` interface. The provider rejects path traversal and uses exclusive file creation. A remote provider can be added later without changing the business model.
