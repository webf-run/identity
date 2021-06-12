/*
  Warnings:

  - Added the required column `from_name` to the `email_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_config" ADD COLUMN     "from_name" TEXT NOT NULL;
