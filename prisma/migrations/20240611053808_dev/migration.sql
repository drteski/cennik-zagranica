/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductTitle` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryName" DROP CONSTRAINT "CategoryName_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTitle" DROP CONSTRAINT "ProductTitle_productId_fkey";

-- AlterTable
CREATE SEQUENCE product_id_seq;
ALTER TABLE "Product" ADD COLUMN     "productId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('product_id_seq'),
ALTER COLUMN "brandId" DROP NOT NULL,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION;
ALTER SEQUENCE product_id_seq OWNED BY "Product"."id";

-- AlterTable
ALTER TABLE "ProductTitle" DROP COLUMN "productId",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "newPrice" SET DEFAULT 0,
ALTER COLUMN "oldPrice" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "ProductOnTitles" (
    "productId" INTEGER NOT NULL,
    "productTitleId" INTEGER NOT NULL,

    CONSTRAINT "ProductOnTitles_pkey" PRIMARY KEY ("productId","productTitleId")
);

-- AddForeignKey
ALTER TABLE "CategoryName" ADD CONSTRAINT "CategoryName_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnTitles" ADD CONSTRAINT "ProductOnTitles_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnTitles" ADD CONSTRAINT "ProductOnTitles_productTitleId_fkey" FOREIGN KEY ("productTitleId") REFERENCES "ProductTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
