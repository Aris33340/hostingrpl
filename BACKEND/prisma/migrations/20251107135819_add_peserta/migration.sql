-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_pesertaId_peserta_fkey`;

-- DropIndex
DROP INDEX `file_pesertaId_peserta_fkey` ON `file`;

-- AlterTable
ALTER TABLE `file` MODIFY `pesertaId_peserta` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_pesertaId_peserta_fkey` FOREIGN KEY (`pesertaId_peserta`) REFERENCES `peserta`(`id_peserta`) ON DELETE SET NULL ON UPDATE CASCADE;
