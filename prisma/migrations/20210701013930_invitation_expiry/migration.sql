/*
  Warnings:

  - Added the required column `expiry_at` to the `invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitation" ADD COLUMN     "expiry_at" TIMESTAMPTZ NOT NULL;
