/*
  Warnings:

  - Added the required column `occupied` to the `quota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quota" ADD COLUMN     "occupied" INTEGER NOT NULL;
