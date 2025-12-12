/*
  Warnings:

  - You are about to alter the column `jenis` on the `peserta` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `isCumlaude` BOOLEAN NULL,
    ADD COLUMN `rankingIPK` INTEGER NULL,
    ADD COLUMN `rankingIPKM` INTEGER NULL;

-- AlterTable
ALTER TABLE `peserta` MODIFY `jenis` ENUM('tamu', 'mahasiswa') NOT NULL;
