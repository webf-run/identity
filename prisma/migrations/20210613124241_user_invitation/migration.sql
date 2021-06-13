/*
  Warnings:

  - You are about to drop the column `password_harsh` on the `app_user` table. All the data in the column will be lost.
  - Added the required column `password_hash` to the `app_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "app_user" DROP COLUMN "password_harsh",
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "invitation" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "project_id" BIGINT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation.code_unique" ON "invitation"("code");

-- AddForeignKey
ALTER TABLE "invitation" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
