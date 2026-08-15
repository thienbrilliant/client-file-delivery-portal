-- Prevent duplicate notifications when business events are retried.
ALTER TABLE "Notification"
  ADD COLUMN "dedupeKey" TEXT;

CREATE UNIQUE INDEX "Notification_dedupeKey_key" ON "Notification"("dedupeKey");
