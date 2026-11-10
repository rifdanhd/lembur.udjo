BEGIN;

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PAYMENT_REVIEW';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "requestHash" TEXT,
ADD COLUMN     "requestKeyHash" TEXT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "checkoutStartedAt" TIMESTAMP(3),
ADD COLUMN     "checkoutUrl" TEXT;

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Order_requestKeyHash_key" ON "Order"("requestKeyHash");

-- Keep quota and monetary invariants enforced even for future staff tools.
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_quota_check"
CHECK (capacity >= 0 AND reserved >= 0 AND sold >= 0 AND reserved + sold <= capacity);
ALTER TABLE "Product" ADD CONSTRAINT "Product_price_check" CHECK (price >= 0);
ALTER TABLE "Order" ADD CONSTRAINT "Order_amount_check" CHECK ("totalAmount" >= 0);
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_amount_check"
CHECK (quantity > 0 AND "unitPrice" >= 0 AND "lineTotal" = "unitPrice" * quantity);
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_amount_check" CHECK (amount >= 0);

COMMIT;

