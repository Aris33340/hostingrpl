/*
  Warnings:

  - You are about to drop the column `email` on the `emailsendstatus` table. All the data in the column will be lost.
  - Added the required column `recipient_email` to the `emailSendStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `emailsendstatus` DROP COLUMN `email`,
    ADD COLUMN `error_message` TEXT NULL,
    ADD COLUMN `fileId` INTEGER NULL,
    ADD COLUMN `recipient_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `subject` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SenderAccount` (
    `id_sender` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `port` INTEGER NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SenderAccount_email_key`(`email`),
    PRIMARY KEY (`id_sender`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SystemConfig` (
    `id_config` INTEGER NOT NULL AUTO_INCREMENT,
    `key_name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SystemConfig_key_name_key`(`key_name`),
    PRIMARY KEY (`id_config`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_fileId_fkey` FOREIGN KEY (`fileId`) REFERENCES `file`(`id_file`) ON DELETE SET NULL ON UPDATE CASCADE;
