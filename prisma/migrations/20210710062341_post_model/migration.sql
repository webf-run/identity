/*
  Warnings:

  - You are about to drop the column `base_id` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `post` table. All the data in the column will be lost.
  - The primary key for the `post_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `project_id` on the `post_image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publication_id,slug]` on the table `post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `revision_id` to the `post_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_id` to the `post_meta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_base_id_fkey";

-- DropForeignKey
ALTER TABLE "post_image" DROP CONSTRAINT "post_image_project_id_fkey";

-- DropIndex
DROP INDEX "post.base_id_unique";

-- DropIndex
DROP INDEX "post.slug_base_id_unique";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "base_id",
DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "canonical_url" TEXT;

-- AlterTable
ALTER TABLE "post_image" DROP CONSTRAINT "post_image_pkey",
DROP COLUMN "project_id",
ADD COLUMN     "revision_id" BIGINT NOT NULL,
ADD PRIMARY KEY ("image_id", "revision_id");

-- AlterTable
ALTER TABLE "post_meta" ADD COLUMN     "image_id" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "PostVersion" (
    "id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostVersion.post_id_version_unique" ON "PostVersion"("post_id", "version");

-- CreateIndex
CREATE UNIQUE INDEX "post.publication_id_slug_unique" ON "post"("publication_id", "slug");

-- AddForeignKey
ALTER TABLE "PostVersion" ADD FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_image" ADD FOREIGN KEY ("revision_id") REFERENCES "PostVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
