/*
  Warnings:

  - A unique constraint covering the columns `[id_user]` on the table `presensi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_user` to the `presensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `presensi` ADD COLUMN `id_user` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `presensi_id_user_key` ON `presensi`(`id_user`);

-- AddForeignKey
ALTER TABLE `presensi` ADD CONSTRAINT `presensi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;
