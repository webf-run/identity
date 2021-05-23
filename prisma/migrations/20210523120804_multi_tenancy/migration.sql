/*
  Warnings:

  - You are about to drop the column `project_id` on the `app_user` table. All the data in the column will be lost.
  - Added the required column `publicationId` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "app_user" DROP CONSTRAINT "app_user_project_id_fkey";

-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "publicationId" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "staff" (
    "publication_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,

    PRIMARY KEY ("publication_id","user_id")
);

-- AddForeignKey
ALTER TABLE "staff" ADD FOREIGN KEY ("publication_id") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD FOREIGN KEY ("user_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("publicationId") REFERENCES "publication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
