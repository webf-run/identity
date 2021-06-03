/*
  Warnings:

  - A unique constraint covering the columns `[base_id]` on the table `post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,base_id]` on the table `post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "post.slug_unique";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "base_id" BIGINT;

-- CreateIndex
CREATE UNIQUE INDEX "post.base_id_unique" ON "post"("base_id");

-- CreateIndex
CREATE UNIQUE INDEX "post.slug_base_id_unique" ON "post"("slug", "base_id");

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("base_id") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
