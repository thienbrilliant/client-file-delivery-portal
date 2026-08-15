CREATE TABLE "UploadPart" (
  "id" TEXT NOT NULL,
  "uploadSessionId" TEXT NOT NULL,
  "partNumber" INTEGER NOT NULL,
  "etag" TEXT,
  "size" BIGINT NOT NULL,
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UploadPart_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "UploadPart_uploadSessionId_partNumber_key" ON "UploadPart"("uploadSessionId", "partNumber");
CREATE INDEX "UploadPart_uploadSessionId_idx" ON "UploadPart"("uploadSessionId");
ALTER TABLE "UploadPart" ADD CONSTRAINT "UploadPart_uploadSessionId_fkey" FOREIGN KEY ("uploadSessionId") REFERENCES "UploadSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
