UPDATE "User" SET "status" = CASE WHEN "role" = 'ADMIN' OR "passwordHash" IS NOT NULL THEN 'ACTIVE'::"UserStatus" ELSE 'INVITED'::"UserStatus" END;
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'INVITED';
