/*
  Warnings:

  - You are about to drop the column `size_in_byte` on the `quota` table. All the data in the column will be lost.
  - Added the required column `size_in_bytes` to the `quota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_capacity` to the `quota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quota" DROP COLUMN "size_in_byte",
ADD COLUMN     "size_in_bytes" INTEGER NOT NULL,
ADD COLUMN     "staff_capacity" INTEGER NOT NULL;
