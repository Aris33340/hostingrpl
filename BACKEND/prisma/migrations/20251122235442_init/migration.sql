/*
  Warnings:

  - You are about to drop the column `pesertaId_peserta` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `pesertaId_peserta` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `userId_user` on the `file` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_pesertaId_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_pesertaId_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_userId_user_fkey`;

-- DropIndex
DROP INDEX `emailSendStatus_pesertaId_peserta_fkey` ON `emailsendstatus`;

-- DropIndex
DROP INDEX `file_pesertaId_peserta_fkey` ON `file`;

-- DropIndex
DROP INDEX `file_userId_user_fkey` ON `file`;

-- AlterTable
ALTER TABLE `emailsendstatus` DROP COLUMN `pesertaId_peserta`,
    ADD COLUMN `id_peserta` INTEGER NULL;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `pesertaId_peserta`,
    DROP COLUMN `userId_user`,
    ADD COLUMN `id_peserta` INTEGER NULL,
    ADD COLUMN `id_user` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;
