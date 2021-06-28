/*
  Warnings:

  - A unique constraint covering the columns `[email,project_id]` on the table `invitation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "invitation.email_project_id_unique1" ON "invitation"("email") WHERE project_id IS NULL;
CREATE UNIQUE INDEX "invitation.email_project_id_unique2" ON "invitation"("email", "project_id") where project_id IS NOT NULL;
