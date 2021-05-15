/*
  Warnings:

  - You are about to drop the column `project_id` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the `blog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `post_tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blog" DROP CONSTRAINT "blog_id_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_project_id_fkey";

-- DropIndex
DROP INDEX "tag.project_id_slug_unique";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "post_tags" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "project_id",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "blog";

-- CreateTable
CREATE TABLE "publication" (
    "id" BIGINT NOT NULL,
    "public_url" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_meta" (
    "id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "publication.public_url_unique" ON "publication"("public_url");

-- CreateIndex
CREATE UNIQUE INDEX "post.slug_unique" ON "post"("slug");

-- AddForeignKey
ALTER TABLE "publication" ADD FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_meta" ADD FOREIGN KEY ("id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
