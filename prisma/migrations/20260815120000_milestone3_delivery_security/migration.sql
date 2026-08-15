-- Milestone 3: secure delivery lifecycle
ALTER TYPE "DeliveryStatus" RENAME VALUE 'LOCKED' TO 'REVOKED';

ALTER TABLE "DeliveryFile"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "ShareLink"
  ADD COLUMN "lastAccessedAt" TIMESTAMP(3);
