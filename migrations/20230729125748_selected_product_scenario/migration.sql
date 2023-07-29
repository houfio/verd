/*
  Warnings:

  - You are about to drop the `_ProductToResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToResult" DROP CONSTRAINT "_ProductToResult_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToResult" DROP CONSTRAINT "_ProductToResult_B_fkey";

-- DropTable
DROP TABLE "_ProductToResult";

-- CreateTable
CREATE TABLE "SelectedProduct" (
    "resultId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "SelectedProduct_pkey" PRIMARY KEY ("resultId","scenarioId","productId")
);

-- AddForeignKey
ALTER TABLE "SelectedProduct" ADD CONSTRAINT "SelectedProduct_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedProduct" ADD CONSTRAINT "SelectedProduct_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectedProduct" ADD CONSTRAINT "SelectedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
