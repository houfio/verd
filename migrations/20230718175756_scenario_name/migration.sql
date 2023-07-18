/*
  Warnings:

  - Added the required column `name` to the `Scenario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Scenario" ADD COLUMN     "name" TEXT NOT NULL;
