/*
  Warnings:

  - A unique constraint covering the columns `[repository]` on the table `Wiki` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wiki_repository_key" ON "Wiki"("repository");
