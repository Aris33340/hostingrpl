-- AlterTable
ALTER TABLE `file` ADD COLUMN `id_parent` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_id_parent_fkey` FOREIGN KEY (`id_parent`) REFERENCES `file`(`id_file`) ON DELETE SET NULL ON UPDATE CASCADE;
