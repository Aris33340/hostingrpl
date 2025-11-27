/*
  Warnings:

  - You are about to drop the column `error_message` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `fileId` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `recipient_email` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the `senderaccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `systemconfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_fileId_fkey`;

-- DropIndex
DROP INDEX `emailSendStatus_fileId_fkey` ON `emailsendstatus`;

-- AlterTable
ALTER TABLE `emailsendstatus` DROP COLUMN `error_message`,
    DROP COLUMN `fileId`,
    DROP COLUMN `recipient_email`,
    DROP COLUMN `subject`;

-- DropTable
DROP TABLE `senderaccount`;

-- DropTable
DROP TABLE `systemconfig`;
