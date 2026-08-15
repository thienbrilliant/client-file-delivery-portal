-- Milestone 4: customer portal settings
ALTER TABLE "Project"
  ADD COLUMN "customerUploadEnabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Notification"
  ADD COLUMN "href" TEXT;
