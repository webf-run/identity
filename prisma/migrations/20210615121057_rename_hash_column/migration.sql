/*
  Warnings:

  - You are about to drop the column `password_hash` on the `app_user` table. All the data in the column will be lost.
  - Added the required column `password_hash_fn` to the `app_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "password_hash",
ADD COLUMN     "password_hash_fn" TEXT NOT NULL;
