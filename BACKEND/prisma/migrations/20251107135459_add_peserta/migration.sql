/*
  Warnings:

  - You are about to drop the column `id_tamu` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `emailsendstatus` table. All the data in the column will be lost.
  - You are about to drop the column `id_user` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `penempatan` on the `mahasiswa` table. All the data in the column will be lost.
  - You are about to drop the column `id_tamu` on the `presensi` table. All the data in the column will be lost.
  - You are about to drop the column `nim` on the `presensi` table. All the data in the column will be lost.
  - Added the required column `pesertaId_peserta` to the `emailSendStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pesertaId_peserta` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId_user` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_peserta` to the `presensi` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_id_tamu_fkey`;

-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_nim_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_nim_fkey`;

-- DropForeignKey
ALTER TABLE `presensi` DROP FOREIGN KEY `presensi_id_tamu_fkey`;

-- DropForeignKey
ALTER TABLE `presensi` DROP FOREIGN KEY `presensi_nim_fkey`;

-- DropIndex
DROP INDEX `emailSendStatus_id_tamu_fkey` ON `emailsendstatus`;

-- DropIndex
DROP INDEX `emailSendStatus_nim_fkey` ON `emailsendstatus`;

-- DropIndex
DROP INDEX `file_id_user_fkey` ON `file`;

-- DropIndex
DROP INDEX `file_nim_fkey` ON `file`;

-- DropIndex
DROP INDEX `presensi_id_tamu_fkey` ON `presensi`;

-- DropIndex
DROP INDEX `presensi_nim_fkey` ON `presensi`;

-- AlterTable
ALTER TABLE `emailsendstatus` DROP COLUMN `id_tamu`,
    DROP COLUMN `nim`,
    ADD COLUMN `pesertaId_peserta` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `file` DROP COLUMN `id_user`,
    DROP COLUMN `nim`,
    ADD COLUMN `pesertaId_peserta` INTEGER NOT NULL,
    ADD COLUMN `userId_user` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `penempatan`,
    MODIFY `prodi` VARCHAR(191) NULL,
    MODIFY `no_telp` VARCHAR(191) NULL,
    MODIFY `nama_orang_tua` VARCHAR(191) NULL,
    MODIFY `judul_skripsi` VARCHAR(191) NULL,
    MODIFY `dosen_pembimbing` VARCHAR(191) NULL,
    MODIFY `daerah_asal` VARCHAR(191) NULL,
    MODIFY `daerah_penempatan` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `presensi` DROP COLUMN `id_tamu`,
    DROP COLUMN `nim`,
    ADD COLUMN `id_peserta` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `peserta` (
    `id_peserta` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(191) NOT NULL,
    `nim` INTEGER NULL,
    `id_tamu` INTEGER NULL,

    PRIMARY KEY (`id_peserta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_id_peserta_fkey` FOREIGN KEY (`id_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_userId_user_fkey` FOREIGN KEY (`userId_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta` ADD CONSTRAINT `peserta_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peserta` ADD CONSTRAINT `peserta_id_tamu_fkey` FOREIGN KEY (`id_tamu`) REFERENCES `tamu`(`id_tamu`) ON DELETE SET NULL ON UPDATE CASCADE;
