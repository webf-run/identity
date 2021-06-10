/*
  Warnings:

  - You are about to drop the `EmailConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quota` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quota" DROP CONSTRAINT "Quota_id_fkey";

-- DropTable
DROP TABLE "EmailConfig";

-- DropTable
DROP TABLE "Quota";

-- CreateTable
CREATE TABLE "email_config" (
    "id" BIGSERIAL NOT NULL,
    "from_email" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "service" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quota" (
    "id" BIGINT NOT NULL,
    "size_in_byte" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quota" ADD FOREIGN KEY ("id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
