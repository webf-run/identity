/*
  Warnings:

  - A unique constraint covering the columns `[email,project_id]` on the table `invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "duration" INTEGER NOT NULL;
