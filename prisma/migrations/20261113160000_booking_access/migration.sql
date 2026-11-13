ALTER TABLE "ticketing"."User" ADD COLUMN "passwordHash" TEXT;
CREATE TABLE "ticketing"."StaffSession" (
  "tokenHash" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "ticketing"."User"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "StaffSession_userId_idx" ON "ticketing"."StaffSession"("userId");
CREATE INDEX "StaffSession_expiresAt_idx" ON "ticketing"."StaffSession"("expiresAt");
ALTER TABLE "ticketing"."VisitorAccount" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "ticketing"."VisitorAccount" ADD COLUMN "googleSubject" TEXT, ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "VisitorAccount_googleSubject_key" ON "ticketing"."VisitorAccount"("googleSubject");
CREATE TABLE "ticketing"."PasswordReset" (
  "tokenHash" TEXT PRIMARY KEY,
  "visitorId" TEXT NOT NULL REFERENCES "ticketing"."VisitorAccount"("id") ON DELETE CASCADE,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "PasswordReset_visitorId_idx" ON "ticketing"."PasswordReset"("visitorId");
CREATE INDEX "PasswordReset_expiresAt_idx" ON "ticketing"."PasswordReset"("expiresAt");
CREATE TABLE "ticketing"."OAuthAttempt" (
  "stateHash" TEXT PRIMARY KEY,
  "verifier" TEXT NOT NULL,
  "nonce" TEXT NOT NULL,
  "continueTo" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "OAuthAttempt_expiresAt_idx" ON "ticketing"."OAuthAttempt"("expiresAt");
ALTER TABLE "ticketing"."Ticket" ADD COLUMN "orderItemId" TEXT REFERENCES "ticketing"."OrderItem"("id") ON DELETE RESTRICT;
-- Historical tickets remain nullable: no arbitrary category attribution.
