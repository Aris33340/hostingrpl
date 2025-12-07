/*
  Warnings:

  - You are about to drop the column `erroMessage` on the `emailsendstatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `emailsendstatus` DROP COLUMN `erroMessage`,
    ADD COLUMN `errorMessage` VARCHAR(191) NULL;
