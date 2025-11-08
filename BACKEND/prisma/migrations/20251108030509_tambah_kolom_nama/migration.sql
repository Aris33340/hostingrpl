/*
  Warnings:

  - A unique constraint covering the columns `[id_peserta]` on the table `presensi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `emailSendStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `peserta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `presensi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `tamu` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `emailsendstatus` DROP FOREIGN KEY `emailSendStatus_pesertaId_peserta_fkey`;

-- DropIndex
DROP INDEX `emailSendStatus_pesertaId_peserta_fkey` ON `emailsendstatus`;

-- AlterTable
ALTER TABLE `emailsendstatus` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `pesertaId_peserta` INTEGER NULL;

-- AlterTable
ALTER TABLE `file` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `peserta` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `presensi` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `tamu` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `presensi_id_peserta_key` ON `presensi`(`id_peserta`);

-- AddForeignKey
ALTER TABLE `emailSendStatus` ADD CONSTRAINT `emailSendStatus_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE SET NULL ON UPDATE CASCADE;
