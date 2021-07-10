/*
  Warnings:

  - You are about to drop the `PostVersion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostVersion" DROP CONSTRAINT "PostVersion_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_image" DROP CONSTRAINT "post_image_revision_id_fkey";

-- DropTable
DROP TABLE "PostVersion";

-- CreateTable
CREATE TABLE "post_version" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_version.post_id_version_unique" ON "post_version"("post_id", "version");

-- AddForeignKey
ALTER TABLE "post_version" ADD FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("revision_id") REFERENCES "post_version"("id") ON DELETE CASCADE ON UPDATE CASCADE;
