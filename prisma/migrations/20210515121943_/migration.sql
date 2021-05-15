/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tag.slug_unique" ON "tag"("slug");
