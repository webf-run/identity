/*
  Warnings:

  - You are about to drop the column `publicationId` on the `post` table. All the data in the column will be lost.
  - Added the required column `publication_id` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_publicationId_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "publicationId",
ADD COLUMN     "publication_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
