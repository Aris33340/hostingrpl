-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_pesertaId_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_pesertaId_peserta_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_userId_user_fkey`;

-- DropForeignKey
ALTER TABLE `peserta` DROP FOREIGN KEY `peserta_id_tamu_fkey`;

-- DropForeignKey
ALTER TABLE `peserta` DROP FOREIGN KEY `peserta_nim_fkey`;

-- DropForeignKey
ALTER TABLE `presensi` DROP FOREIGN KEY `presensi_id_peserta_fkey`;

-- DropIndex
DROP INDEX `emailSendStatus_pesertaId_peserta_fkey` ON `emailsendstatus`;

-- DropIndex
DROP INDEX `file_pesertaId_peserta_fkey` ON `file`;

-- DropIndex
DROP INDEX `file_userId_user_fkey` ON `file`;

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_userId_user_fkey` FOREIGN KEY (`userId_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta` ADD CONSTRAINT `peserta_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta` ADD CONSTRAINT `peserta_id_tamu_fkey` FOREIGN KEY (`id_tamu`) REFERENCES `tamu`(`id_tamu`) ON DELETE CASCADE ON UPDATE CASCADE;
