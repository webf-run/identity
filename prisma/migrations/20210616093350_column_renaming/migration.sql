/*
  Warnings:

  - You are about to drop the column `password_hash_fn` on the `app_user` table. All the data in the column will be lost.
  - You are about to drop the column `size_in_bytes` on the `quota` table. All the data in the column will be lost.
  - Added the required column `hash_fn` to the `app_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size_in_mb` to the `quota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "password_hash_fn",
ADD COLUMN     "hash_fn" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "quota" DROP COLUMN "size_in_bytes",
ADD COLUMN     "size_in_mb" INTEGER NOT NULL;
