/*
  Warnings:

  - A unique constraint covering the columns `[cloud_type,region,bucket]` on the table `asset_source` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "asset_source.cloud_type_region_bucket_unique" ON "asset_source"("cloud_type", "region", "bucket");
