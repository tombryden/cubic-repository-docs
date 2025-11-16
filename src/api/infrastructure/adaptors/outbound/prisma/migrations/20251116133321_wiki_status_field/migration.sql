/*
  Warnings:

  - Added the required column `status` to the `Wiki` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WikiStatus" AS ENUM ('GENERATING', 'GENERATED', 'FAILED');

-- AlterTable
ALTER TABLE "Wiki" ADD COLUMN     "status" "WikiStatus" NOT NULL;
