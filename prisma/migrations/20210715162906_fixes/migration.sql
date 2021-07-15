/*
  Warnings:

  - You are about to drop the `post_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_tags" DROP CONSTRAINT "post_tags_tag_id_fkey";

-- DropTable
DROP TABLE "post_tags";

-- CreateTable
CREATE TABLE "post_tag" (
    "post_id" BIGINT NOT NULL,
    "tag_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL,

    PRIMARY KEY ("post_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "post_tag" ADD FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
