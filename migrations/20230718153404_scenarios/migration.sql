/*
  Warnings:

  - You are about to drop the column `scenario` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "scenario",
ADD COLUMN     "scenarioId" TEXT;

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
