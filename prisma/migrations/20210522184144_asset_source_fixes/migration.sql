/*
  Warnings:

  - You are about to drop the column `root` on the `asset_source` table. All the data in the column will be lost.
  - Added the required column `region` to the `asset_source` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "asset_source" DROP COLUMN "root",
ADD COLUMN     "region" TEXT NOT NULL;
