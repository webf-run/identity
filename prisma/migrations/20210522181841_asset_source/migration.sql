/*
  Warnings:

  - Added the required column `source_id` to the `asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "asset" ADD COLUMN     "source_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "asset_source" (
    "id" SERIAL NOT NULL,
    "cloud_type" TEXT NOT NULL,
    "root" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "upload_url" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secret" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "asset.source_id_index" ON "asset"("source_id");

-- AddForeignKey
ALTER TABLE "asset" ADD FOREIGN KEY ("source_id") REFERENCES "asset_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
