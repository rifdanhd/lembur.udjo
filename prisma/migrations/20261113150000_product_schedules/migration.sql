CREATE TABLE "ticketing"."ProductSchedule" (
  "productId" TEXT NOT NULL,
  "scheduleId" TEXT NOT NULL,
  "price" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductSchedule_pkey" PRIMARY KEY ("productId", "scheduleId"),
  CONSTRAINT "ProductSchedule_price_check" CHECK ("price" > 0 AND "price" <= 1000000000),
  CONSTRAINT "ProductSchedule_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ticketing"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ProductSchedule_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "ticketing"."Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "ProductSchedule_scheduleId_active_idx" ON "ticketing"."ProductSchedule"("scheduleId", "active");
