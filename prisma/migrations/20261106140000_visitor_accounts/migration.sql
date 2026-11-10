BEGIN;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "visitorId" TEXT;

-- CreateTable
CREATE TABLE "VisitorAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorAccount_email_key" ON "VisitorAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_tokenHash_key" ON "VisitorSession"("tokenHash");

-- CreateIndex
CREATE INDEX "VisitorSession_expiresAt_idx" ON "VisitorSession"("expiresAt");

-- CreateIndex
CREATE INDEX "VisitorSession_visitorId_idx" ON "VisitorSession"("visitorId");

-- CreateIndex
CREATE INDEX "Order_visitorId_createdAt_idx" ON "Order"("visitorId", "createdAt");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "VisitorAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
