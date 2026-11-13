CREATE TABLE "ticketing"."BookingCategory" (
 "id" TEXT PRIMARY KEY,
 "slug" TEXT NOT NULL UNIQUE,
 "name" TEXT NOT NULL,
 "description" TEXT NOT NULL,
 "image" TEXT NOT NULL,
 "active" BOOLEAN NOT NULL DEFAULT false,
 "sortOrder" INTEGER NOT NULL DEFAULT 0
);
ALTER TABLE "ticketing"."Product" ADD COLUMN "imagePath" TEXT, ADD COLUMN "policy" TEXT, ADD COLUMN "categoryId" TEXT REFERENCES "ticketing"."BookingCategory"("id") ON DELETE RESTRICT;
CREATE INDEX "Product_categoryId_idx" ON "ticketing"."Product"("categoryId");
