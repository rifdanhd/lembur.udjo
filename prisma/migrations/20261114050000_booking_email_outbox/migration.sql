CREATE TABLE "ticketing"."EmailDelivery" (
 "id" TEXT PRIMARY KEY,
 "eventKey" TEXT NOT NULL UNIQUE,
 "orderId" TEXT NOT NULL REFERENCES "ticketing"."Order"("id") ON DELETE RESTRICT,
 "kind" TEXT NOT NULL CHECK ("kind" IN ('RESERVATION','PAYMENT','TICKETS')),
 "recipient" TEXT NOT NULL,
 "subject" TEXT NOT NULL,
 "text" TEXT NOT NULL,
 "state" TEXT NOT NULL DEFAULT 'PENDING' CHECK ("state" IN ('PENDING','SENDING','SENT','FAILED','CANCELLED')),
 "attempts" INTEGER NOT NULL DEFAULT 0 CHECK ("attempts" >= 0),
 "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "lockedUntil" TIMESTAMP(3),
 "claimId" TEXT,
 "providerMessageId" TEXT,
 "lastError" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "EmailDelivery_state_nextAttemptAt_idx" ON "ticketing"."EmailDelivery"("state","nextAttemptAt");
CREATE INDEX "EmailDelivery_orderId_idx" ON "ticketing"."EmailDelivery"("orderId");
