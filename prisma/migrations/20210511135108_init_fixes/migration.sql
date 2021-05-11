/*
  Warnings:

  - You are about to drop the column `publishedAt` on the `post` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `project_user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `project_user` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `project_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `project_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "publishedAt",
ADD COLUMN     "published_at" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "project_user" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL;
