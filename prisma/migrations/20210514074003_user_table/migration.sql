/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `project_user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "project_user.email_project_id_unique";

-- CreateIndex
CREATE UNIQUE INDEX "project_user.email_unique" ON "project_user"("email");
