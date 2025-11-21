/*
  Warnings:

  - A unique constraint covering the columns `[nim]` on the table `peserta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_tamu]` on the table `peserta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `peserta_nim_key` ON `peserta`(`nim`);

-- CreateIndex
CREATE UNIQUE INDEX `peserta_id_tamu_key` ON `peserta`(`id_tamu`);
