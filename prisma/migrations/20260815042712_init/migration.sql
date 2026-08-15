CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'READY', 'ARCHIVED');
CREATE TYPE "DeliveryStatus" AS ENUM ('PREPARING', 'READY', 'VIEWED', 'DOWNLOADED', 'EXPIRED', 'LOCKED', 'COMPLETED');
CREATE TYPE "NotificationType" AS ENUM ('DELIVERY_READY', 'FILE_DOWNLOADED', 'FILE_UPLOADED', 'PROJECT_UPDATED', 'SYSTEM');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "passwordHash" TEXT,
  "name" TEXT,
  "avatarUrl" TEXT,
  "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

CREATE TABLE "CustomerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "companyName" TEXT,
  "phone" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Project_customerId_idx" ON "Project"("customerId");
CREATE INDEX "Project_status_idx" ON "Project"("status");
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

CREATE TABLE "Folder" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "parentId" TEXT,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Folder_projectId_idx" ON "Folder"("projectId");
CREATE INDEX "Folder_parentId_idx" ON "Folder"("parentId");

CREATE TABLE "File" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "folderId" TEXT,
  "originalName" TEXT NOT NULL,
  "storedName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" BIGINT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "checksum" TEXT,
  "uploadedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "File_storageKey_key" ON "File"("storageKey");
CREATE INDEX "File_projectId_idx" ON "File"("projectId");
CREATE INDEX "File_folderId_idx" ON "File"("folderId");
CREATE INDEX "File_uploadedById_idx" ON "File"("uploadedById");
CREATE INDEX "File_createdAt_idx" ON "File"("createdAt");

CREATE TABLE "Delivery" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'PREPARING',
  "expiresAt" TIMESTAMP(3),
  "allowCustomerUpload" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Delivery_projectId_idx" ON "Delivery"("projectId");
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");
CREATE INDEX "Delivery_expiresAt_idx" ON "Delivery"("expiresAt");
CREATE INDEX "Delivery_createdAt_idx" ON "Delivery"("createdAt");

CREATE TABLE "DeliveryFile" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "fileId" TEXT NOT NULL,
  CONSTRAINT "DeliveryFile_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "DeliveryFile_deliveryId_fileId_key" ON "DeliveryFile"("deliveryId", "fileId");
CREATE INDEX "DeliveryFile_deliveryId_idx" ON "DeliveryFile"("deliveryId");
CREATE INDEX "DeliveryFile_fileId_idx" ON "DeliveryFile"("fileId");

CREATE TABLE "ShareLink" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "passwordHash" TEXT,
  "expiresAt" TIMESTAMP(3),
  "maxDownloads" INTEGER,
  "downloadCount" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ShareLink_tokenHash_key" ON "ShareLink"("tokenHash");
CREATE INDEX "ShareLink_deliveryId_idx" ON "ShareLink"("deliveryId");
CREATE INDEX "ShareLink_expiresAt_idx" ON "ShareLink"("expiresAt");
CREATE INDEX "ShareLink_isActive_idx" ON "ShareLink"("isActive");

CREATE TABLE "DownloadLog" (
  "id" TEXT NOT NULL,
  "fileId" TEXT NOT NULL,
  "userId" TEXT,
  "shareLinkId" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DownloadLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "DownloadLog_fileId_idx" ON "DownloadLog"("fileId");
CREATE INDEX "DownloadLog_userId_idx" ON "DownloadLog"("userId");
CREATE INDEX "DownloadLog_shareLinkId_idx" ON "DownloadLog"("shareLinkId");
CREATE INDEX "DownloadLog_createdAt_idx" ON "DownloadLog"("createdAt");

CREATE TABLE "ActivityLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "projectId" TEXT,
  "action" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");
CREATE INDEX "ActivityLog_projectId_idx" ON "ActivityLog"("projectId");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

CREATE TABLE "Account" (
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("provider", "providerAccountId")
);
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE TABLE "Session" (
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

CREATE TABLE "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Project" ADD CONSTRAINT "Project_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryFile" ADD CONSTRAINT "DeliveryFile_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DeliveryFile" ADD CONSTRAINT "DeliveryFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "ShareLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
